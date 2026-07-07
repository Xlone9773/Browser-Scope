import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dgram from "dgram";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy headers for express-rate-limit behind reverse proxy
  app.set("trust proxy", 1);

  // Basic security: hide Express signature
  app.disable("x-powered-by");

  // Basic security, performance, and cross-origin setup
  const isProd = process.env.NODE_ENV === "production";
  app.use(helmet({
    contentSecurityPolicy: isProd ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://esm.sh",
          "https://cdn.tailwindcss.com",
          "https://unpkg.com",
          "https://cdn.jsdelivr.net"
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com"
        ],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:"
        ],
        connectSrc: [
          "'self'",
          "wss:",
          "ws:",
          "https://dynamodb.ca-central-1.amazonaws.com",
          "https://dynamodb.sa-east-1.amazonaws.com",
          "https://dynamodb.us-west-2.amazonaws.com",
          "https://dynamodb.eu-west-2.amazonaws.com",
          "https://dynamodb.eu-central-1.amazonaws.com",
          "https://dynamodb.eu-west-3.amazonaws.com",
          "https://dynamodb.eu-north-1.amazonaws.com",
          "https://dynamodb.ap-south-1.amazonaws.com",
          "https://dynamodb.ap-southeast-1.amazonaws.com",
          "https://dynamodb.ap-northeast-1.amazonaws.com",
          "https://dynamodb.ap-northeast-2.amazonaws.com",
          "https://dynamodb.ap-southeast-2.amazonaws.com",
          "https://dynamodb.ap-east-1.amazonaws.com",
          "https://dynamodb.af-south-1.amazonaws.com",
          "https://www.baidu.com",
          "https://www.google.com.tw",
          "https://www.google.com",
          "https://my.ippure.com",
          "https://ipwho.is",
          "https://ipapi.co",
          "https://www.cloudflare.com",
          "https://api.ipify.org",
          "https://api6.ipify.org",
          "https://ip6.seeip.org",
          "https://ipv6.icanhazip.com",
          "https://edns.ip-api.com",
          "https://speed.cloudflare.com",
          "https://cachefly.cachefly.net",
          "https://mirrors.ustc.edu.cn",
          "https://mirrors.nju.edu.cn",
          "https://speedtest.selectel.ru",
          "https://speedtest.tele2.kz",
          "https://fsn1-speed.hetzner.com",
          "https://hel1-speed.hetzner.com",
          "https://ping.online.net",
          "https://nj-us-ping.vultr.com",
          "https://lax-ca-us-ping.vultr.com",
          "https://sgp-ping.vultr.com",
          "https://hnd-jp-ping.vultr.com",
          "https://syd-au-ping.vultr.com",
          "https://registry.khronos.org"
        ],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["'self'", "blob:"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      }
    } : false,
    crossOriginEmbedderPolicy: false // Disabled to allow external resources
  }));
  app.use(compression());

  // Dynamic Whitelist CORS Configuration to avoid Wildcard credential errors
  const whitelist = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173"
  ];
  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, postman, curl)
      if (!origin) {
        return callback(null, true);
      }
      const isAllowedLocal = whitelist.indexOf(origin) !== -1 || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:");
      const isAllowedCloud = origin.includes("run.app") || origin.includes("google.com") || origin.includes("googleusercontent.com");
      if (isAllowedLocal || isAllowedCloud) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  };
  app.use(cors(corsOptions));

  // Parsers must be placed before any route definition
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  app.get("/api/udp-status", async (req, res) => {
    try {
      if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        return res.json({ supported: false });
      }
      const client = dgram.createSocket('udp4');
      await new Promise<void>((resolve, reject) => {
        client.send(Buffer.from('ping'), 53, '8.8.8.8', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      client.close();
      res.json({ supported: true });
    } catch (_e) {
      res.json({ supported: false });
    }
  });

  // Generalized proxy route to bypass CORS (TCP fetch or UDP DNS/Ping mapping)
  const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1500, // Limit each IP to 1500 requests per `window` (here, per 1 minute)
    message: { error: 'Too many /* eslint-disable-line @typescript-eslint/no-explicit-any */ requests, please try again later.' },
    standardHeaders: true, 
    legacyHeaders: false, 
  });
  
  app.post("/api/proxy", apiLimiter, async (req, res) => {
    const { url, method = "GET", headers = {}, body, useUdp, timeout = 15000 } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const proxyHeaders = { ...headers };
      // Prevent browser forbidden headers issues if forwarded directly
      delete proxyHeaders['host'];
      delete proxyHeaders['origin'];
      delete proxyHeaders['referer'];

      // Extract client's real IP address
      let clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').split(',')[0].trim();
      if (clientIp.startsWith('::ffff:')) {
        clientIp = clientIp.substring(7);
      }
      const isLocalIp = !clientIp || clientIp === '::1' || clientIp === '127.0.0.1';
      const targetIpForLookup = isLocalIp ? '' : clientIp;

      // Handle special IP geolocation queries to prevent always returning Server's IP (Taiwan Taipei)
      if (typeof url === 'string') {
        const lowerUrl = url.toLowerCase();
        
        // 1. my.ippure.com/v1/info
        if (lowerUrl.includes("my.ippure.com/v1/info") || lowerUrl.includes("my.ippure.com")) {
          try {
            const geoResponse = await fetch(`https://ipwho.is/${targetIpForLookup}`, { signal: controller.signal });
            const geoData = await geoResponse.json();
            if (geoData && geoData.success) {
              const ippureResult = {
                ip: geoData.ip,
                asn: geoData.connection?.asn || null,
                asOrganization: geoData.connection?.org || geoData.connection?.isp || "",
                country: geoData.country || "",
                countryCode: geoData.country_code || "",
                region: geoData.region || "",
                regionCode: geoData.region_code || "",
                city: geoData.city || "",
                timezone: geoData.timezone?.id || "",
                longitude: String(geoData.longitude || ""),
                latitude: String(geoData.latitude || ""),
                userAgent: req.headers['user-agent'] || ""
              };
              clearTimeout(timeoutId);
              return res.json({
                status: 200,
                data: JSON.stringify(ippureResult)
              });
            }
          } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
            console.error("Special ippure proxy mapping failed:", err.message);
          }
        }

        // 2. ipwho.is
        if (lowerUrl === "https://ipwho.is/" || lowerUrl === "https://ipwho.is") {
          try {
            const geoResponse = await fetch(`https://ipwho.is/${targetIpForLookup}`, { signal: controller.signal });
            const geoData = await geoResponse.json();
            clearTimeout(timeoutId);
            return res.json({
              status: 200,
              data: JSON.stringify(geoData)
            });
          } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
            console.error("Special ipwho.is proxy mapping failed:", err.message);
          }
        }

        // 3. ipapi.co/json
        if (lowerUrl.includes("ipapi.co/json") || lowerUrl.includes("ipapi.co/json/")) {
          try {
            const urlWithIp = targetIpForLookup ? `https://ipapi.co/${targetIpForLookup}/json/` : `https://ipapi.co/json/`;
            const geoResponse = await fetch(urlWithIp, { signal: controller.signal });
            const geoData = await geoResponse.json();
            clearTimeout(timeoutId);
            return res.json({
              status: 200,
              data: JSON.stringify(geoData)
            });
          } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
            console.error("Special ipapi.co proxy mapping failed:", err.message);
          }
        }

        // 4. api.ipify.org
        if (lowerUrl.includes("api.ipify.org")) {
          // No outbound request needed! We already have the client's IP!
          clearTimeout(timeoutId);
          const ipAddress = isLocalIp ? "127.0.0.1" : clientIp;
          const resultData = lowerUrl.includes("format=json") ? JSON.stringify({ ip: ipAddress }) : ipAddress;
          return res.json({
            status: 200,
            data: resultData
          });
        }

        // 5. cloudflare trace
        if (lowerUrl.includes("cloudflare.com/cdn-cgi/trace")) {
          try {
            // Fetch cloudflare trace
            const traceResponse = await fetch(url, { signal: controller.signal });
            const traceText = await traceResponse.text();
            
            // Replace the IP with the real client IP, and LOC with country code from ipwhois
            const lines = traceText.split('\n');
            const ipAddress = isLocalIp ? "127.0.0.1" : clientIp;
            
            let clientLoc = "XX";
            try {
              const geoResponse = await fetch(`https://ipwho.is/${targetIpForLookup}`, { signal: controller.signal });
              const geoData = await geoResponse.json();
              if (geoData && geoData.success && geoData.country_code) {
                clientLoc = geoData.country_code;
              }
            } catch (_e) { /* ignore */ }

            const mappedLines = lines.map(line => {
              if (line.startsWith('ip=')) {
                return `ip=${ipAddress}`;
              }
              if (line.startsWith('loc=')) {
                return `loc=${clientLoc}`;
              }
              return line;
            });

            clearTimeout(timeoutId);
            return res.json({
              status: 200,
              data: mappedLines.join('\n')
            });
          } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
            console.error("Special cloudflare trace proxy mapping failed:", err.message);
          }
        }
      }

      if (useUdp) {
         try {
           const parsedUrl = new URL(url);
           const hostname = parsedUrl.hostname;
           
           const client = dgram.createSocket('udp4');
           client.on('error', () => {
               try { client.close(); } catch (_e) { /* ignore */ }
           });
           client.send(Buffer.from('PING'), 80, hostname, (_err) => {
               try { client.close(); } catch (_e) { /* ignore */ }
           });
           
           const response = await fetch(url, {
              method,
              headers: proxyHeaders,
              body: ["GET", "HEAD"].includes(method.toUpperCase()) ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
              signal: controller.signal
           });
           
           const data = await response.text();
           clearTimeout(timeoutId);
           return res.json({
             status: response.status,
             data: data,
             udpPingSent: true,
             message: "UDP packet sent. Data fetched completely bypassing CORS."
           });
         } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
           clearTimeout(timeoutId);
           return res.status(500).json({ error: e.message || "UDP proxy failed" });
         }
      }

      // Standard CORS-bypassing proxy logic
      const response = await fetch(url, {
          method,
          headers: proxyHeaders,
          body: ["GET", "HEAD"].includes(method.toUpperCase()) ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
          signal: controller.signal
      });
      
      const text = await response.text();
      clearTimeout(timeoutId);
      
      res.json({
         status: response.status,
         data: text
      });
    } catch (e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      clearTimeout(timeoutId);
      console.error("Proxy error:", e.name, e.message);
      res.status(500).json({ error: e.name === 'AbortError' ? 'Request Timeout' : e.message || "Proxy error" });
    }
  });

  // Global Error Handler for stability
  app.use((err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

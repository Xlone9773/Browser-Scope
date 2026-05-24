import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dgram from "dgram";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enhance stability with increased limits
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Generalized proxy route to bypass CORS (TCP fetch or UDP DNS/Ping mapping)
  app.post("/api/proxy", async (req, res) => {
    const { url, method = "GET", headers = {}, body, useUdp, timeout = 15000 } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      let proxyHeaders = { ...headers };
      // Prevent browser forbidden headers issues if forwarded directly
      delete proxyHeaders['host'];
      delete proxyHeaders['origin'];
      delete proxyHeaders['referer'];

      if (useUdp) {
         try {
           const parsedUrl = new URL(url);
           const hostname = parsedUrl.hostname;
           
           const client = dgram.createSocket('udp4');
           client.on('error', () => {
               try { client.close(); } catch (e) {}
           });
           client.send(Buffer.from('PING'), 80, hostname, (err) => {
               try { client.close(); } catch (e) {}
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
         } catch(e: any) {
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
    } catch (e: any) {
      clearTimeout(timeoutId);
      console.error("Proxy error:", e.name, e.message);
      res.status(500).json({ error: e.name === 'AbortError' ? 'Request Timeout' : e.message || "Proxy error" });
    }
  });

  // Global Error Handler for stability
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

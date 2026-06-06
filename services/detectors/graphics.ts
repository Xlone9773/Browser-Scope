
import { ExtendedNavigator } from '../../types';

const _nav = navigator as ExtendedNavigator;

// Helper to hash string
export const simpleHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return '00000000';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

export const getGPUInfo = (): { renderer: string; vendor: string; maxTextureSize: string } => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { renderer: 'Unknown', vendor: 'Unknown', maxTextureSize: 'Unknown' };

    const ctx = gl as WebGLRenderingContext;
    const debugInfo = ctx.getExtension('WEBGL_debug_renderer_info');
    const maxTexSize = ctx.getParameter(ctx.MAX_TEXTURE_SIZE);

    if (!debugInfo) return { renderer: 'Unknown', vendor: 'Unknown', maxTextureSize: maxTexSize ? `${maxTexSize}px` : 'Unknown' };

    const renderer = ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const vendor = ctx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

    return { renderer, vendor, maxTextureSize: `${maxTexSize}px` };
  } catch {
    return { renderer: 'Unavailable', vendor: 'Unavailable', maxTextureSize: 'Unavailable' };
  }
};

export const getWebGLExtensions = (): string[] => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return [];
    
    // @ts-expect-error auto-fixed
    const extensions = gl.getSupportedExtensions();
    return extensions ? extensions.sort() : [];
  } catch { return []; }
};

export const getShaderPrecisionFormat = (): { vertexHigh: string, fragmentHigh: string } | undefined => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return undefined;
        
        const ctx = gl as WebGLRenderingContext;
        
        // Helper
        const getFormat = (shaderType: number, precisionType: number) => {
            const format = ctx.getShaderPrecisionFormat(shaderType, precisionType);
            if (!format) return 'N/A';
            return `${format.precision}-bit (range ${format.rangeMin}-${format.rangeMax})`;
        };

        const _vHigh = getFormat(ctx.VERTEX_SHADER, ctx.HIGH_FLOAT);
        const _fHigh = getFormat(ctx.FRAGMENT_SHADER, ctx.HIGH_FLOAT);
        
        // Simpler string rep
        const simple = (f: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
            if (!f) return 'Low';
            if (f.precision >= 23) return 'High (23-bit+)';
            if (f.precision >= 16) return 'Medium (16-bit+)';
            return 'Low';
        };

        const vHighRaw = ctx.getShaderPrecisionFormat(ctx.VERTEX_SHADER, ctx.HIGH_FLOAT);
        const fHighRaw = ctx.getShaderPrecisionFormat(ctx.FRAGMENT_SHADER, ctx.HIGH_FLOAT);

        return {
            vertexHigh: simple(vHighRaw),
            fragmentHigh: simple(fHighRaw)
        };

    } catch(_e) {
        return undefined;
    }
}

export const getCanvasFingerprint = (): { hash: string; dataUri: string } => {
  try {
    const canvas = document.createElement('canvas');
    // Optimization: willReadFrequently hints browser to optimize for frequent readbacks (software rasterization usually)
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return { hash: 'Not Supported', dataUri: '' };
    canvas.width = 280; canvas.height = 60;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = "alphabetic"; ctx.font = "16px 'Arial'";
    ctx.fillStyle = "#f60"; ctx.fillRect(100, 5, 60, 20);
    ctx.fillStyle = "#069"; ctx.fillText("BrowserScope v1.0", 2, 20);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)"; ctx.font = "18px 'Times New Roman'";
    ctx.fillText("Fingerprint", 5, 45);
    ctx.beginPath(); ctx.arc(200, 30, 20, 0, Math.PI * 2, true);
    ctx.arc(200, 30, 10, 0, Math.PI * 2, true);
    ctx.fillStyle = "rgba(200, 0, 200, 0.5)"; ctx.fill("evenodd");
    ctx.beginPath(); ctx.moveTo(240, 10); ctx.lineTo(260, 50); ctx.lineTo(220, 50);
    ctx.closePath(); ctx.strokeStyle = "#f0f"; ctx.lineWidth = 3; ctx.stroke();
    const dataUri = canvas.toDataURL();
    const b64 = dataUri.replace("data:image/png;base64,", "");
    return { hash: simpleHash(b64), dataUri: dataUri };
  } catch { return { hash: 'Error', dataUri: '' }; }
};

export const getWebGLFingerprint = (): string => {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (!gl) return 'Not Supported';
        const vShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vShader, 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}');
        gl.compileShader(vShader);
        const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fShader, 'void main(){gl_FragColor=vec4(0.5,0.2,0.8,1.0);}');
        gl.compileShader(fShader);
        const program = gl.createProgram()!;
        gl.attachShader(program, vShader); gl.attachShader(program, fShader);
        gl.linkProgram(program); gl.useProgram(program);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,1,-1,1,-1,-1,1,-1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, "p");
        gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
        gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        return simpleHash(pixels.join(''));
    } catch(_e) { return 'Error'; }
};

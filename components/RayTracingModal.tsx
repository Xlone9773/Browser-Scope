
import React, { useEffect, useRef, useState } from 'react';
import { Box, Play, Square, RefreshCw, Sliders, AlertTriangle, Maximize, Minimize } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';
import { Slider } from './ui/Slider';

// Fix for missing WebGPU types
type GPUCanvasContext = any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
type GPUDevice = any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
type GPUComputePipeline = any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
type GPUBuffer = any /* eslint-disable-line @typescript-eslint/no-explicit-any */;
type _GPUBindGroup = any /* eslint-disable-line @typescript-eslint/no-explicit-any */;

interface RayTracingModalProps {
  onClose: () => void;
  t: Translation['rayTracing'];
}

// WGSL Shader Code
const SHADER_CODE = `
struct Ray {
    origin: vec3<f32>,
    direction: vec3<f32>,
}

struct Sphere {
    center: vec3<f32>,
    radius: f32,
    color: vec3<f32>,
    materialType: u32, // 0: Lambertian, 1: Metal, 2: Dielectric
    fuzz: f32, // For metal
}

struct Uniforms {
    resolution: vec2<f32>,
    time: f32,
    frame: u32,
    cameraPos: vec3<f32>,
    cameraTarget: vec3<f32>,
    roughness: f32,
    metalness: f32,
    baseColor: vec3<f32>,
}

@group(0) @binding(0) var outputTex: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(1) var<uniform> u: Uniforms;

// PCG Random Number Generator
fn rand(state: ptr<function, u32>) -> f32 {
    let oldState = *state;
    *state = oldState * 747796405u + 2891336453u;
    let word = ((*state >> ((*state >> 28u) + 4u)) ^ *state) * 277803737u;
    return f32((word >> 22u) ^ word) / 4294967296.0;
}

fn random_in_unit_sphere(state: ptr<function, u32>) -> vec3<f32> {
    var p: vec3<f32>;
    for (var i = 0; i < 10; i++) {
        p = 2.0 * vec3<f32>(rand(state), rand(state), rand(state)) - 1.0;
        if (length(p) < 1.0) { return p; }
    }
    return normalize(p); // Fallback
}

fn hit_sphere(center: vec3<f32>, radius: f32, r: Ray) -> f32 {
    let oc = r.origin - center;
    let a = dot(r.direction, r.direction);
    let b = 2.0 * dot(oc, r.direction);
    let c = dot(oc, oc) - radius * radius;
    let discriminant = b*b - 4.0*a*c;
    if (discriminant < 0.0) { return -1.0; }
    return (-b - sqrt(discriminant)) / (2.0*a);
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
    let width = u32(u.resolution.x);
    let height = u32(u.resolution.y);
    
    if (id.x >= width || id.y >= height) { return; }

    // Initialize RNG state based on pixel coord and frame
    var rngState = id.x + id.y * width + u.frame * 719393u;

    // Camera setup
    let uv = (vec2<f32>(id.xy) + vec2<f32>(rand(&rngState), rand(&rngState))) / u.resolution;
    let clip = uv * 2.0 - 1.0;
    // Fix aspect ratio
    let aspect = u.resolution.x / u.resolution.y;
    
    // LookAt Matrix construction (simplified)
    let w = normalize(u.cameraPos - u.cameraTarget);
    let up = vec3<f32>(0.0, 1.0, 0.0);
    let u_vec = normalize(cross(up, w));
    let v_vec = cross(w, u_vec);
    
    let viewportHeight = 2.0;
    let viewportWidth = aspect * viewportHeight;
    let horizontal = viewportWidth * u_vec;
    let vertical = viewportHeight * v_vec;
    let lowerLeftCorner = u.cameraPos - horizontal/2.0 - vertical/2.0 - w;
    
    let rayDir = normalize(lowerLeftCorner + uv.x * horizontal + (1.0 - uv.y) * vertical - u.cameraPos);
    
    var r = Ray(u.cameraPos, rayDir);
    var col = vec3<f32>(1.0);
    var accumulatedLight = vec3<f32>(0.0);

    // Dynamic Spheres
    var spheres = array<Sphere, 4>(
        Sphere(vec3<f32>(0.0, 0.0, -1.0), 0.5, u.baseColor, 1u, u.roughness), // Center (User controlled)
        Sphere(vec3<f32>(0.0, -100.5, -1.0), 100.0, vec3<f32>(0.2, 0.2, 0.2), 0u, 0.0), // Ground
        Sphere(vec3<f32>(1.0, 0.0, -1.0), 0.5, vec3<f32>(0.8, 0.6, 0.2), 1u, 0.0), // Right Metal
        Sphere(vec3<f32>(-1.0, 0.0, -1.0), 0.5, vec3<f32>(0.9, 0.9, 0.9), 2u, 0.0) // Left Glass
    );

    // Modify the center sphere based on metalness param (if > 0.5 switch to metal)
    if (u.metalness > 0.5) {
        spheres[0].materialType = 1u;
    } else {
        spheres[0].materialType = 0u;
    }

    // Bounce Loop
    for (var bounce = 0; bounce < 4; bounce++) {
        var hitT = 10000.0;
        var hitIndex = -1;

        for (var i = 0; i < 4; i++) {
            let t = hit_sphere(spheres[i].center, spheres[i].radius, r);
            if (t > 0.001 && t < hitT) {
                hitT = t;
                hitIndex = i;
            }
        }

        if (hitIndex != -1) {
            let p = r.origin + hitT * r.direction;
            let normal = normalize(p - spheres[hitIndex].center);
            let material = spheres[hitIndex].materialType;
            let attenuation = spheres[hitIndex].color;

            if (material == 0u) { // Lambertian
                let target = p + normal + random_in_unit_sphere(&rngState);
                r.origin = p;
                r.direction = normalize(target - p);
                col = col * attenuation;
            } else if (material == 1u) { // Metal
                let reflected = reflect(r.direction, normal);
                r.origin = p;
                r.direction = normalize(reflected + spheres[hitIndex].fuzz * random_in_unit_sphere(&rngState));
                col = col * attenuation;
            } else { // Dielectric
                let refraction_ratio = 1.5;
                // Simple refraction logic (always refract for demo speed)
                r.origin = p;
                r.direction = refract(r.direction, normal, 1.0/refraction_ratio);
                col = col * vec3<f32>(1.0); // No attenuation for glass usually
            }
        } else {
            // Sky color
            let unit_direction = normalize(r.direction);
            let t = 0.5 * (unit_direction.y + 1.0);
            let sky = (1.0 - t) * vec3<f32>(1.0, 1.0, 1.0) + t * vec3<f32>(0.5, 0.7, 1.0);
            accumulatedLight = col * sky;
            break; 
        }
    }

    // Writing to texture (no accumulation buffer in this simple version, just per-frame noise)
    // To implement true accumulation we need read-write textures or ping-pong buffers which adds complexity.
    // For a benchmark, raw rendering speed is enough, visual noise is expected in path tracing.
    textureStore(outputTex, id.xy, vec4<f32>(accumulatedLight, 1.0));
}
`;

export const RayTracingModal: React.FC<RayTracingModalProps> = ({ onClose, t }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [spp, setSpp] = useState(0); // Actually Frame Count here since we don't accumulate
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
         console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Scene Params
  const [roughness, setRoughness] = useState(0.5);
  const [metalness, setMetalness] = useState(0.0);
  const [color, setColor] = useState({ r: 0.8, g: 0.3, b: 0.3 });

  // WebGPU Refs
  const contextRef = useRef<GPUCanvasContext | null>(null);
  const deviceRef = useRef<GPUDevice | null>(null);
  const pipelineRef = useRef<GPUComputePipeline | null>(null);
  const uniformBufferRef = useRef<GPUBuffer | null>(null);
  const computeTextureRef = useRef<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const rafRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isRunningRef = useRef(false);
  const isUnmountedRef = useRef(false);
  
  // Camera State
  const cameraAngleRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  const initWebGPU = async () => {
    try {
      if (!navigator.gpu) throw new Error("WebGPU not supported");
      const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
      if (!adapter) throw new Error("No adapter found");
      const device = await adapter.requestDevice();
      deviceRef.current = device;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('webgpu' as any /* eslint-disable-line @typescript-eslint/no-explicit-any */);
      if (!context) throw new Error("WebGPU context creation failed");
      contextRef.current = context;

      // GPUTextureUsage logic with fallback
      const TEXTURE_USAGE_STORAGE = window.GPUTextureUsage?.STORAGE_BINDING || 0x08;
      const TEXTURE_USAGE_COPY_SRC = window.GPUTextureUsage?.COPY_SRC || 0x01;
      const TEXTURE_USAGE_COPY_DST = window.GPUTextureUsage?.COPY_DST || 0x02;
      const TEXTURE_USAGE_RENDER_ATTACHMENT = window.GPUTextureUsage?.RENDER_ATTACHMENT || 0x10;

      // Force 'rgba8unorm' to match the storage texture and avoid bgra8unorm_storage requirement
      const format = 'rgba8unorm';
      (context as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).configure({
        device,
        format,
        alphaMode: 'premultiplied',
        usage: TEXTURE_USAGE_COPY_DST | TEXTURE_USAGE_RENDER_ATTACHMENT 
      });

      const computeTexture = device.createTexture({
        size: [canvas.width, canvas.height, 1],
        format: format,
        usage: TEXTURE_USAGE_STORAGE | TEXTURE_USAGE_COPY_SRC
      });
      computeTextureRef.current = computeTexture;

      const shaderModule = device.createShaderModule({ code: SHADER_CODE });
      
      const pipeline = device.createComputePipeline({
        layout: 'auto',
        compute: { module: shaderModule, entryPoint: 'main' }
      });
      pipelineRef.current = pipeline;

      // Uniform Buffer (size needs to be aligned to 16 bytes)
      // vec2 resolution (8) + time (4) + frame (4) + vec3 camPos (12+4pad) + vec3 camTarget (12+4pad) + rough (4) + metal (4) + vec3 color (12+4pad)
      // Total size: ~64 bytes is safe.
      const uniformBufferSize = 128; 
      // GPUBufferUsage logic with fallback
      const BUFFER_USAGE_UNIFORM = window.GPUBufferUsage?.UNIFORM || 0x0040;
      const BUFFER_USAGE_COPY_DST = window.GPUBufferUsage?.COPY_DST || 0x0008;

      const uniformBuffer = device.createBuffer({
        size: uniformBufferSize,
        usage: BUFFER_USAGE_UNIFORM | BUFFER_USAGE_COPY_DST
      });
      uniformBufferRef.current = uniformBuffer;

      if (isUnmountedRef.current) {
         device.destroy();
         return;
      }

      startLoop();
    } catch (e: unknown) {
      console.error(e);
      setError(t.error_webgpu);
    }
  };

  const startLoop = () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setIsRunning(true);
    frameCountRef.current = 0;
    
    const render = (time: number) => {
      if (!isRunningRef.current) return;
      if (!deviceRef.current || !pipelineRef.current || !contextRef.current || !uniformBufferRef.current || !computeTextureRef.current) return;

      // Stats
      if (time - lastTimeRef.current >= 1000) {
        setFps(Math.round(1000 / (time - lastTimeRef.current)));
        lastTimeRef.current = time;
      }
      frameCountRef.current++;
      setSpp(frameCountRef.current);

      // Camera Orbit
      const radius = 3.0;
      const camX = Math.sin(cameraAngleRef.current) * radius;
      const camZ = Math.cos(cameraAngleRef.current) * radius;

      // Update Uniforms
      const uniforms = new ArrayBuffer(128);
      const view = new DataView(uniforms);
      const canvas = canvasRef.current!;
      
      view.setFloat32(0, canvas.width, true);
      view.setFloat32(4, canvas.height, true);
      view.setFloat32(8, time / 1000, true);
      view.setUint32(12, frameCountRef.current, true);
      
      // Cam Pos
      view.setFloat32(16, camX, true);
      view.setFloat32(20, 1.0, true); // Height
      view.setFloat32(24, camZ, true);
      
      // Cam Target
      view.setFloat32(32, 0, true);
      view.setFloat32(36, 0, true);
      view.setFloat32(40, -1.0, true); // Look at center sphere

      // Material
      view.setFloat32(48, roughness, true);
      view.setFloat32(52, metalness, true);
      view.setFloat32(64, color.r, true);
      view.setFloat32(68, color.g, true);
      view.setFloat32(72, color.b, true);
      deviceRef.current.queue.writeBuffer(uniformBufferRef.current, 0, uniforms);

      // Create Bind Group (must be done per frame if texture view changes, which happens with canvas resize or swap chain)
      // We read from computeTexture which is static sizes, but conceptually neat to map it
      const bindGroup = deviceRef.current.createBindGroup({
        layout: pipelineRef.current.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: computeTextureRef.current.createView() },
          { binding: 1, resource: { buffer: uniformBufferRef.current } }
        ]
      });
      const commandEncoder = deviceRef.current.createCommandEncoder();
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(pipelineRef.current);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.dispatchWorkgroups(Math.ceil(canvas.width / 8), Math.ceil(canvas.height / 8));
      passEncoder.end();
      
      commandEncoder.copyTextureToTexture(
          { texture: computeTextureRef.current },
          { texture: contextRef.current.getCurrentTexture() },
          [canvas.width, canvas.height, 1]
      );
      deviceRef.current.queue.submit([commandEncoder.finish()]);

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
  };

  const stopLoop = () => {
    if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    }
    isRunningRef.current = false;
    setIsRunning(false);
  };

  useEffect(() => {
    isUnmountedRef.current = false;
    let localIsUnmounted = false;
    
    const init = async () => {
        await initWebGPU();
        if (localIsUnmounted) {
            stopLoop();
        }
    };
    init();
    
    return () => {
        isUnmountedRef.current = true;
        localIsUnmounted = true;
        stopLoop();
    };
  }, []);

  // Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseXRef.current = e.clientX;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - lastMouseXRef.current;
      cameraAngleRef.current += delta * 0.01;
      lastMouseXRef.current = e.clientX;
  };
  const handleMouseUp = () => {
      isDraggingRef.current = false;
  };

  const resetCamera = () => {
      cameraAngleRef.current = 0;
  };

  return (
    <Modal
        title={t.title}
        icon={<Box size={24} />}
        onClose={onClose}
        size="full"
        noPadding
    >
        <div ref={containerRef} className="flex flex-col h-full bg-black relative overflow-hidden group">
            
            {/* Fullscreen Toggle */}
            <button 
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
            >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>

            {/* Main Canvas */}
            <canvas 
                ref={canvasRef}
                width={1280} 
                height={720}
                className="w-full h-full object-contain cursor-move touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-50">
                    <div className="p-6 bg-red-900/20 border border-red-500/50 rounded-xl text-center max-w-md">
                        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">WebGPU Error</h3>
                        <p className="text-red-200">{error}</p>
                    </div>
                </div>
            )}

            {/* Stats Overlay (Top Left) */}
            <div className="absolute top-4 left-4 z-20 flex gap-4 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 text-xs font-mono">
                    <div className="text-slate-400 uppercase tracking-wider mb-1">{t.fps}</div>
                    <div className="text-2xl font-bold text-green-400">{fps}</div>
                </div>
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 text-xs font-mono">
                    <div className="text-slate-400 uppercase tracking-wider mb-1">{t.resolution}</div>
                    <div className="text-xl font-bold text-white">1280x720</div>
                </div>
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 text-xs font-mono">
                    <div className="text-slate-400 uppercase tracking-wider mb-1">Frame</div>
                    <div className="text-xl font-bold text-indigo-400">{spp}</div>
                </div>
            </div>

            {/* Controls Overlay (Bottom Center) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4 transition-transform duration-300 translate-y-0 opacity-100">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-center">
                    
                    {/* Material Controls */}
                    <div className="flex-1 w-full space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                            <span>{t.controls}</span>
                            <Sliders size={14} />
                        </div>
                        
                        <div className="space-y-4">
                            <Slider
                                value={roughness}
                                onChange={setRoughness}
                                min={0}
                                max={1}
                                step={0.01}
                                label={t.roughness}
                                color="indigo"
                                formatValue={(val) => val.toFixed(2)}
                            />
                            <Slider
                                value={metalness}
                                onChange={setMetalness}
                                min={0}
                                max={1}
                                step={0.01}
                                label={t.metalness}
                                color="emerald"
                                formatValue={(val) => val.toFixed(2)}
                            />
                        </div>
                    </div>

                    <div className="w-px h-24 bg-white/10 hidden md:block" />

                    {/* Color & Actions */}
                    <div className="flex flex-col gap-4 items-center">
                        <div className="flex gap-2">
                            <button onClick={() => setColor({ r: 0.8, g: 0.3, b: 0.3 })} className="w-8 h-8 rounded-full bg-red-500 border-2 border-transparent hover:border-white transition-all ring-1 ring-black/50" />
                            <button onClick={() => setColor({ r: 0.3, g: 0.8, b: 0.3 })} className="w-8 h-8 rounded-full bg-green-500 border-2 border-transparent hover:border-white transition-all ring-1 ring-black/50" />
                            <button onClick={() => setColor({ r: 0.3, g: 0.3, b: 0.8 })} className="w-8 h-8 rounded-full bg-blue-500 border-2 border-transparent hover:border-white transition-all ring-1 ring-black/50" />
                            <button onClick={() => setColor({ r: 0.9, g: 0.9, b: 0.9 })} className="w-8 h-8 rounded-full bg-white border-2 border-transparent hover:border-white transition-all ring-1 ring-black/50" />
                        </div>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={resetCamera}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                            >
                                <RefreshCw size={14} /> {t.reset}
                            </button>
                            <button 
                                onClick={isRunning ? stopLoop : startLoop}
                                className={`px-6 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${isRunning ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}`}
                            >
                                {isRunning ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                {isRunning ? t.stop : t.start}
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </Modal>
  );
};
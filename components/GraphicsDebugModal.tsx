
import React, { useState, useEffect } from 'react';
import { Layers, Box, Cpu, Search, Copy, Check } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface GraphicsDebugModalProps {
  onClose: () => void;
  t: Translation['graphicsModal'];
}

type ParameterCategory = 'WebGL' | 'WebGPU' | 'Features';

export const GraphicsDebugModal: React.FC<GraphicsDebugModalProps> = ({ onClose, t }) => {
  const [activeTab, setActiveTab] = useState<ParameterCategory>('WebGL');
  const [webglInfo, setWebglInfo] = useState<Record<string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */>>({});
  const [webgpuInfo, setWebgpuInfo] = useState<Record<string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. WebGL Limits
      const glData: Record<string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */> = {};
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl) {
            const ctx = gl as WebGLRenderingContext;
            
            const params = [
                'MAX_TEXTURE_SIZE',
                'MAX_VIEWPORT_DIMS',
                'MAX_VERTEX_ATTRIBS',
                'MAX_VERTEX_UNIFORM_VECTORS',
                'MAX_VARYING_VECTORS',
                'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
                'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
                'MAX_TEXTURE_IMAGE_UNITS',
                'MAX_FRAGMENT_UNIFORM_VECTORS',
                'MAX_CUBE_MAP_TEXTURE_SIZE',
                'MAX_RENDERBUFFER_SIZE',
                'ALIASED_LINE_WIDTH_RANGE',
                'ALIASED_POINT_SIZE_RANGE',
                'VERSION',
                'SHADING_LANGUAGE_VERSION',
                'VENDOR',
                'RENDERER'
            ];

            // WebGL 2 specific
            if (gl instanceof WebGL2RenderingContext) {
                params.push(
                    'MAX_3D_TEXTURE_SIZE',
                    'MAX_ARRAY_TEXTURE_LAYERS',
                    'MAX_COLOR_ATTACHMENTS',
                    'MAX_DRAW_BUFFERS',
                    'MAX_ELEMENTS_INDICES',
                    'MAX_ELEMENTS_VERTICES',
                    'MAX_UNIFORM_BUFFER_BINDINGS',
                    'MAX_UNIFORM_BLOCK_SIZE'
                );
            }

            params.forEach(p => {
                try {
                    
                    // @ts-expect-error auto-fixed
                    const val = ctx.getParameter(ctx[p]);
                    // Format arrays
                    glData[p] = (val && val.length !== undefined && typeof val !== 'string') ? `[${val[0]}, ${val[1]}]` : String(val);
                } catch(_e) {
                    glData[p] = 'Error';
                }
            });
            
            // Anisotropy check
            const ext = ctx.getExtension('EXT_texture_filter_anisotropic');
            if (ext) {
                glData['MAX_TEXTURE_MAX_ANISOTROPY'] = ctx.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            }
            
            // SECURITY: Explicitly lose context and wipe from memory
            const loseCtx = ctx.getExtension('WEBGL_lose_context');
            if (loseCtx) loseCtx.loseContext();
            
        }
      } catch(e) { console.error(e); }
      setWebglInfo(glData);

      // 2. WebGPU Limits
      const gpuData: Record<string, any /* eslint-disable-line @typescript-eslint/no-explicit-any */> = {};
      try {
          if ((navigator as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).gpu) {
              const adapter = await (navigator as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).gpu.requestAdapter();
              if (adapter) {
                  const limits = adapter.limits;
                  // Enumerate limits object
                  for (const key in limits) {
                      gpuData[key] = limits[key];
                  }
                  
                  // Features
                  const features: string[] = [];
                  
                  for (const f of adapter.features) {
                      features.push(f);
                  }
                  gpuData['__features__'] = features; // Special key for features
                  gpuData['__info__'] = { name: adapter.name, driver: 'WebGPU' };
              } else {
                  gpuData['error'] = t.not_supported;
              }
          } else {
              gpuData['error'] = t.not_supported;
          }
      } catch(_e) {
          gpuData['error'] = 'WebGPU Access Denied or Error';
      }
      setWebgpuInfo(gpuData);
      
      setLoading(false);
    };

    fetchData();
  }, [t.not_supported]);

  const getCurrentData = () => {
      if (activeTab === 'WebGL') return webglInfo;
      if (activeTab === 'WebGPU') return webgpuInfo;
      return {};
  };

  const formatKey = (key: string) => {
      if (key.startsWith('__')) return key;
      return key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
  };

  const filteredData = Object.entries(getCurrentData())
    .filter(([key]) => !key.startsWith('__') && key.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCopy = () => {
      const report = {
          webgl: webglInfo,
          webgpu: webgpuInfo
      };
      navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
        title={t.title}
        icon={<Layers size={24} />}
        onClose={onClose}
        size="4xl"
        fullHeight
        noPadding
    >
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            {/* Tabs */}
            <div className="flex bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
                <button 
                    onClick={() => setActiveTab('WebGL')} 
                    className={`flex-1 py-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 border-b-2 ${activeTab === 'WebGL' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                    <Box size={16} />
                    {t.tab_webgl}
                </button>
                <button 
                    onClick={() => setActiveTab('WebGPU')} 
                    className={`flex-1 py-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 border-b-2 ${activeTab === 'WebGPU' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                    <Cpu size={16} />
                    {t.tab_webgpu}
                </button>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t.search}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                </div>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    <span className="hidden sm:inline">{t.copy}</span>
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
                        <p>{t.loading}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredData.map(([key, value]) => (
                            <div key={key} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 break-all">{formatKey(key)}</span>
                                <span className="text-sm font-mono font-medium text-slate-700 dark:text-slate-200 break-all">{String(value)}</span>
                            </div>
                        ))}
                        {/* Special Features Section for WebGPU */}
                        {activeTab === 'WebGPU' && webgpuInfo.__features__ && webgpuInfo.__features__.length > 0 && (
                            <div className="md:col-span-2 mt-4">
                                <h3 className="text-sm font-bold text-slate-500 mb-3 px-1">{(t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).supported_features || 'Supported Features'}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {webgpuInfo.__features__.map((feat: string) => (
                                        <span key={feat} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-mono rounded border border-indigo-100 dark:border-indigo-800">
                                            {feat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {filteredData.length === 0 && (
                            <div className="md:col-span-2 text-center py-10 text-slate-400">
                                {(t as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).no_params_found || 'No parameters found matching'} "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Search, Layers, ExternalLink, Info, Check, Box } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface WebGLExtensionsModalProps {
  extensions: string[];
  onClose: () => void;
  t: Translation['webglTool'];
}

// Map common extensions to friendly descriptions
const EXTENSION_DESCRIPTIONS: Record<string, string> = {
  'EXT_texture_filter_anisotropic': 'Improves quality of textures on surfaces viewed at oblique angles.',
  'WEBGL_debug_renderer_info': 'Exposes the underlying graphics hardware and driver information.',
  'OES_vertex_array_object': 'Encapsulates vertex array state into objects for faster switching.',
  'WEBGL_compressed_texture_s3tc': 'Exposes S3TC (DXT) compressed texture formats.',
  'WEBGL_compressed_texture_etc': 'Exposes ETC2 and EAC compressed texture formats.',
  'WEBGL_compressed_texture_astc': 'Exposes ASTC compressed texture formats.',
  'ANGLE_instanced_arrays': 'Allows drawing the same object multiple times with different data.',
  'OES_texture_float': 'Allows using floating point numbers for texture data.',
  'OES_texture_half_float': 'Allows using half-floating point numbers for texture data.',
  'WEBGL_depth_texture': 'Allows using depth buffers as textures.',
  'EXT_shader_texture_lod': 'Adds texture lookup functions with explicit LOD control in shaders.',
  'OES_standard_derivatives': 'Adds standard derivative functions (dFdx, dFdy, fwidth) to shaders.',
  'WEBGL_draw_buffers': 'Allows drawing to multiple color buffers at once (MRT).',
  'EXT_frag_depth': 'Allows the fragment shader to set the depth value.',
  'WEBGL_lose_context': 'Simulates losing and restoring the WebGL context for testing.',
  'EXT_blend_minmax': 'Adds MIN and MAX blend equations.',
  'OES_element_index_uint': 'Allows using unsigned int (32-bit) indices for drawing.',
  'EXT_color_buffer_float': 'Allows rendering to 32-bit floating-point color buffers.',
  'EXT_float_blend': 'Allows blending with 32-bit floating-point color buffers.',
};

export const WebGLExtensionsModal: React.FC<WebGLExtensionsModalProps> = ({ extensions, onClose, t }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExtensions = extensions.filter(ext => 
    ext.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPrefix = (ext: string) => {
      if (ext.startsWith('WEBGL_')) return 'WEBGL';
      if (ext.startsWith('EXT_')) return 'EXT';
      if (ext.startsWith('OES_')) return 'OES';
      if (ext.startsWith('KHR_')) return 'KHR';
      if (ext.startsWith('ANGLE_')) return 'ANGLE';
      if (ext.startsWith('MOZ_')) return 'MOZ';
      if (ext.startsWith('WEBKIT_')) return 'WEBKIT';
      return 'OTHER';
  };

  const getBadgeColor = (prefix: string) => {
      switch(prefix) {
          case 'WEBGL': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
          case 'KHR': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
          case 'OES': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
          case 'EXT': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
          case 'ANGLE': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
          default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
      }
  };

  const getDocsLink = (name: string) => {
      return `https://registry.khronos.org/webgl/extensions/${name}/`;
  };

  return (
    <Modal
        title={`${t.title} (${extensions.length})`}
        icon={<Layers size={24} />}
        onClose={onClose}
        size="5xl"
        fullHeight
        noPadding
    >
        {({ close }) => (
            <div className="flex flex-col h-full">
                {/* Search */}
                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder={t.search_placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-900/30 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {filteredExtensions.map((ext, index) => {
                            const prefix = getPrefix(ext);
                            const desc = (t as any).descriptions?.[ext] || EXTENSION_DESCRIPTIONS[ext];
                            return (
                                <div 
                                    key={ext} 
                                    className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-all duration-200 flex flex-col gap-2 relative overflow-hidden h-full"
                                >
                                    {/* Header Line */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBadgeColor(prefix)}`}>
                                                {prefix}
                                            </span>
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono break-all leading-tight">
                                                {ext}
                                            </h3>
                                        </div>
                                        <a 
                                            href={getDocsLink(ext)} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                                            title={t.spec_link}
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>

                                    {/* Description if available */}
                                    {desc && (
                                        <div className="flex gap-2 mt-auto pt-2">
                                            <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                                                {desc}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {/* Generic footer for supported items */}
                                    {!desc && (
                                        <div className="flex items-center gap-1.5 mt-auto pt-2">
                                            <Check size={12} className="text-emerald-500" />
                                            <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium uppercase tracking-wide">Supported</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {filteredExtensions.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                                <Box size={48} className="opacity-20" />
                                <p className="text-sm">{(t as any).no_results || 'No extensions match'} "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 flex justify-end">
                    <button 
                        onClick={close}
                        className="px-5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        )}
    </Modal>
  );
};
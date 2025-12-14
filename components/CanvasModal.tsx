import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, FileText } from 'lucide-react';
import { Translation } from '../utils/i18n/types';

interface CanvasModalProps {
  imageSrc: string;
  onClose: () => void;
  t?: Translation['imageDetails']; // Optional since we pass partial translation
}

export const CanvasModal: React.FC<CanvasModalProps> = ({ imageSrc, onClose, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);
  const [fileSize, setFileSize] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
      // Calculate file size from base64 string
      // Formula: (length * 3) / 4 - padding
      const sizeInBytes = Math.ceil((imageSrc.length - 'data:image/png;base64,'.length) * 3 / 4);
      if (sizeInBytes > 1024) {
          setFileSize(`${(sizeInBytes / 1024).toFixed(2)} KB`);
      } else {
          setFileSize(`${sizeInBytes} B`);
      }

      // Get dimensions
      const img = new Image();
      img.onload = () => {
          setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = imageSrc;
  }, [imageSrc]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative max-w-4xl w-full flex flex-col items-center transition-all duration-300 ease-out transform ${
            isVisible && !isClosing 
            ? 'opacity-100 scale-100 blur-0 translate-y-0' 
            : 'opacity-0 scale-95 blur-sm translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={handleClose}
            className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
            <X size={24} />
        </button>
        
        <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-2xl overflow-hidden w-full flex flex-col items-center">
             <img src={imageSrc} alt="Canvas Fingerprint Enlarged" className="w-full h-auto object-contain max-h-[70vh] bg-[url('https://transparenttextures.com/patterns/cubes.png')] bg-slate-100 dark:bg-slate-900 rounded-lg" />
             
             {/* Details Footer */}
             <div className="w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-center gap-6 text-sm text-slate-600 dark:text-slate-300">
                 {dimensions && (
                     <div className="flex items-center gap-2">
                         <ImageIcon size={16} className="text-indigo-500" />
                         <span className="font-medium">{t?.dimensions || 'Dimensions'}:</span>
                         <span className="font-mono">{dimensions.width} x {dimensions.height}</span>
                     </div>
                 )}
                 {fileSize && (
                     <div className="flex items-center gap-2">
                         <FileText size={16} className="text-emerald-500" />
                         <span className="font-medium">{t?.size || 'Size'}:</span>
                         <span className="font-mono">{fileSize}</span>
                     </div>
                 )}
             </div>
        </div>
      </div>
    </div>
  );
};
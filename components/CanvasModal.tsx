
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, FileText } from 'lucide-react';
import { Translation } from '../utils/i18n/types';
import { Modal } from './ui/Modal';

interface CanvasModalProps {
  imageSrc: string;
  onClose: () => void;
  t?: Translation['imageDetails']; // Optional since we pass partial translation
}

export const CanvasModal: React.FC<CanvasModalProps> = ({ imageSrc, onClose, t }) => {
  const [dimensions, setDimensions] = useState<{width: number, height: number} | null>(null);
  const [fileSize, setFileSize] = useState<string>('');

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

  return (
    <Modal
        title="Canvas Fingerprint"
        icon={<ImageIcon size={24} />}
        onClose={onClose}
        size="4xl"
    >
        {({ close }) => (
            <>
                <div className="flex flex-col items-center">
                    {/* Replaced confusing texture with a clean, neutral background */}
                    <div className="w-full bg-slate-100 dark:bg-black/40 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center p-8">
                        <img src={imageSrc} alt="Canvas Fingerprint Enlarged" className="max-w-full h-auto object-contain shadow-lg rounded bg-white" />
                    </div>
                    
                    {/* Details Footer */}
                    <div className="w-full mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-center gap-8 text-sm text-slate-600 dark:text-slate-300">
                        {dimensions && (
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                <ImageIcon size={16} className="text-indigo-500" />
                                <span className="font-medium">{t?.dimensions || 'Dimensions'}:</span>
                                <span className="font-mono font-bold">{dimensions.width} x {dimensions.height}</span>
                            </div>
                        )}
                        {fileSize && (
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                <FileText size={16} className="text-emerald-500" />
                                <span className="font-medium">{t?.size || 'Size'}:</span>
                                <span className="font-mono font-bold">{fileSize}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button 
                        onClick={close}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </>
        )}
    </Modal>
  );
};

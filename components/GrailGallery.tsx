
import React, { useState, useEffect, useRef } from 'react';
import { GrailCard } from '../types';
import * as Storage from '../services/storage';
import { Plus, Trash2, Loader, Sparkles, Crown, XCircle } from 'lucide-react';

const GrailGallery: React.FC = () => {
  const [grails, setGrails] = useState<GrailCard[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGrails(Storage.loadGrails());
  }, []);

  useEffect(() => {
    Storage.saveGrails(grails);
  }, [grails]);

  // Fallback ID generator if crypto is not available
  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
          const height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const base64 = await compressImage(file);
      const newGrail: GrailCard = {
        id: generateId(),
        caption: file.name.split('.')[0], // Default caption is filename
        imageBase64: base64,
        dateAdded: new Date().toISOString(),
      };
      setGrails(prev => [newGrail, ...prev]);
    } catch (error) {
      console.error("Error processing image", error);
      alert("Failed to process image.");
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCaptionChange = (id: string, newCaption: string) => {
    setGrails(prev => prev.map(g => g.id === id ? { ...g, caption: newCaption } : g));
  };

  const performDelete = (id: string) => {
    setGrails(prev => prev.filter(g => g.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <div className="pb-24 space-y-6" onClick={() => setConfirmDeleteId(null)}>
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-amber-500/30 p-8 text-center shadow-2xl shadow-amber-900/10">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-slate-900/50 to-slate-950"></div>
         <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg shadow-amber-500/20 text-slate-900 mb-1 ring-4 ring-slate-900/50">
                <Crown size={24} fill="currentColor" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 tracking-tight">
                The Vault
            </h2>
            <p className="text-amber-200/60 text-xs font-medium tracking-[0.2em] uppercase">
                Hall of Fame
            </p>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 px-2">
        {grails.map(grail => (
          <div key={grail.id} className="group relative z-0 hover:z-10 transition-all duration-500 hover:-translate-y-2">
            {/* Gold Glow Effect behind card */}
            <div className="absolute -inset-[3px] bg-gradient-to-b from-amber-300 via-yellow-500 to-amber-800 rounded-2xl opacity-40 blur-sm group-hover:opacity-100 group-hover:blur-md transition duration-500"></div>
            
            {/* Card Container */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl ring-1 ring-white/10">
                {/* Image */}
                <img 
                  src={grail.imageBase64} 
                  alt={grail.caption}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                />
                
                {/* Glossy Overlay/Sheen - Always present but transparent until hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Dark Gradient Overlay for text readability - Controls visibility of tools */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
                        <div className="flex items-center gap-1 mb-2">
                            <Sparkles size={12} className="text-amber-400" />
                            <span className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                                Grail
                            </span>
                        </div>
                        <input 
                            type="text" 
                            value={grail.caption}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleCaptionChange(grail.id, e.target.value)}
                            className="w-full bg-transparent text-white font-bold text-lg leading-tight border-b border-white/20 pb-2 mb-3 placeholder-white/30 transition-colors duration-200 focus:outline-none focus:border-amber-400 focus:bg-slate-900/50 focus:backdrop-blur-md rounded-lg px-2"
                            placeholder="Name..."
                        />
                        
                        {confirmDeleteId === grail.id ? (
                           <div className="flex gap-2">
                              <button 
                                  type="button"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      performDelete(grail.id);
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1 text-xs text-white bg-red-600 hover:bg-red-700 transition-colors py-2 rounded-lg font-bold shadow-lg animate-in fade-in zoom-in duration-200"
                              >
                                  Confirm?
                              </button>
                              <button 
                                  type="button"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmDeleteId(null);
                                  }}
                                  className="flex-shrink-0 px-3 text-xs text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors py-2 rounded-lg"
                              >
                                  <XCircle size={16} />
                              </button>
                           </div>
                        ) : (
                          <button 
                              type="button"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteId(grail.id);
                              }}
                              className="flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors w-full py-2 rounded-lg"
                          >
                              <Trash2 size={12} />
                              <span>Remove</span>
                          </button>
                        )}
                    </div>
                </div>
            </div>
          </div>
        ))}
        
        {grails.length === 0 && (
          <div className="col-span-2 py-12 text-center border-2 border-dashed border-slate-800/50 rounded-xl bg-slate-900/30">
             <p className="text-slate-500 text-sm">Your vault is empty.</p>
             <p className="text-slate-600 text-xs mt-1">Add your most prized cards here.</p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* FAB - Gold Theme */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={(e) => {
             e.stopPropagation();
             fileInputRef.current?.click();
          }}
          disabled={isUploading}
          className="bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 p-4 rounded-full shadow-lg shadow-amber-500/30 ring-2 ring-amber-300/50 transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-amber-500/50 hover:scale-105"
        >
          {isUploading ? <Loader className="animate-spin" size={24} /> : <Plus size={24} strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
};

export default GrailGallery;

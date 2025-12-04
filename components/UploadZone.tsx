import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        border-4 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
        flex flex-col items-center justify-center min-h-[300px]
        ${disabled ? 'border-slate-300 bg-slate-100 opacity-50 cursor-not-allowed' : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 bg-white shadow-sm'}
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept="image/*" 
        className="hidden" 
        disabled={disabled}
      />
      
      <div className="bg-indigo-100 p-6 rounded-full mb-6">
        <Upload className="w-12 h-12 text-indigo-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-700 mb-2">
        Sube o arrastra tu dibujo aquí
      </h3>
      <p className="text-slate-500 max-w-md">
        Analizaré patrones, técnica y composición. Formatos: JPG, PNG, WEBP.
      </p>
      
      <div className="mt-8 flex gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-1"><ImageIcon size={16}/> Bocetos</span>
        <span className="flex items-center gap-1"><ImageIcon size={16}/> Pinturas</span>
        <span className="flex items-center gap-1"><ImageIcon size={16}/> Digital</span>
      </div>
    </div>
  );
};

export default UploadZone;
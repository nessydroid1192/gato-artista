import React from 'react';
import { AnalysisStatus } from '../types';
import { Sparkles, PenTool, Glasses, Frown, Smile } from 'lucide-react';

interface CatAssistantProps {
  status: AnalysisStatus;
  comment?: string;
  averageScore?: number;
}

const CatAssistant: React.FC<CatAssistantProps> = ({ status, comment, averageScore = 0 }) => {
  
  // Image URLs based on emotions
  const defaultCatUrl = "https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=400&auto=format&fit=crop"; // Neutral/Studying
  const happyCatUrl = "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=400&auto=format&fit=crop"; // Cool/Satisfied (Sunglasses)
  const angryCatUrl = "https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?q=80&w=400&auto=format&fit=crop"; // Grumpy/Serious

  // Logic to determine appearance
  const isComplete = status === AnalysisStatus.COMPLETE;
  const isBad = isComplete && averageScore < 60;
  
  const getCatImage = () => {
    if (!isComplete) return defaultCatUrl;
    return isBad ? angryCatUrl : happyCatUrl;
  };

  const getStatusMessage = () => {
    switch (status) {
      case AnalysisStatus.IDLE:
        return "¡Miau! Sube tu obra. Estoy listo para criticar... digo, analizar tus trazos técnicos.";
      case AnalysisStatus.ANALYZING:
        return "Mmm... observando la composición... olfateando los pigmentos... dame un momento.";
      case AnalysisStatus.ERROR:
        return "¡Sssss! Algo salió mal con la imagen. Intenta con otra, humano.";
      case AnalysisStatus.COMPLETE:
        return comment || "Aquí está mi veredicto.";
      default:
        return "Esperando arte...";
    }
  };

  return (
    <div className={`w-full text-white p-6 shadow-lg relative overflow-hidden transition-colors duration-500 ${isBad ? 'bg-red-900' : 'bg-slate-800'}`}>
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <PenTool size={200} />
      </div>
      
      <div className="max-w-5xl mx-auto flex items-center gap-6 relative z-10">
        {/* Cat Avatar Container */}
        <div className="relative shrink-0 group">
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 overflow-hidden shadow-xl transition-all duration-300 ${isBad ? 'border-red-500' : 'border-yellow-400'}`}>
            <img 
              src={getCatImage()} 
              alt="Gato Artista" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Accessories Overlay for Angry Cat (Pencil & Glasses) */}
          {isBad && (
            <>
              {/* Glasses Overlay */}
              <div className="absolute top-[30%] left-[10%] w-[80%] text-black opacity-80 rotate-[-5deg]">
                <Glasses size={80} strokeWidth={2.5} />
              </div>
              {/* Pencil Overlay (tucked behind ear/head) */}
              <div className="absolute -top-2 -right-4 text-yellow-600 rotate-[15deg] drop-shadow-md">
                <PenTool size={40} fill="orange" />
              </div>
            </>
          )}

          {/* Badge */}
          <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold font-hand shadow-sm flex items-center gap-1 ${isBad ? 'bg-red-500 text-white' : 'bg-yellow-400 text-slate-900'}`}>
            {isBad ? <Frown size={12} /> : <Sparkles size={12} />} 
            {isBad ? "Maestro Enojado" : "Maestro Michi"}
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="flex-1">
          <div className={`text-slate-800 p-4 md:p-6 rounded-2xl rounded-tl-none shadow-lg relative max-w-2xl transition-colors duration-300 ${isBad ? 'bg-red-50' : 'bg-white'}`}>
            <p className="font-hand text-lg md:text-2xl leading-relaxed">
              {getStatusMessage()}
            </p>
            {isComplete && (
               <div className={`mt-2 text-sm font-bold ${isBad ? 'text-red-600' : 'text-green-600'}`}>
                 Nota Promedio: {averageScore}/100
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatAssistant;
import React, { useState, useEffect } from 'react';
import CatAssistant from './components/CatAssistant';
import UploadZone from './components/UploadZone';
import AnalysisDashboard from './components/AnalysisDashboard';
import { ArtAnalysis, AnalysisStatus } from './types';
import { analyzeArtwork } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysis, setAnalysis] = useState<ArtAnalysis | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Helper to calculate average score
  const calculateAverageScore = (analysisData: ArtAnalysis | null): number => {
    if (!analysisData || !analysisData.technicalScores.length) return 0;
    const total = analysisData.technicalScores.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(total / analysisData.technicalScores.length);
  };

  const averageScore = calculateAverageScore(analysis);

  // Reset function
  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setAnalysis(null);
    setImagePreview(null);
  };

  const handleFileSelect = async (file: File) => {
    try {
      setStatus(AnalysisStatus.ANALYZING);
      
      // Create local preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      // Convert to Base64 for API
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        
        try {
          const result = await analyzeArtwork(base64Data, file.type);
          setAnalysis(result);
          setStatus(AnalysisStatus.COMPLETE);
        } catch (error) {
          console.error(error);
          setStatus(AnalysisStatus.ERROR);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Assistant */}
      <header className="sticky top-0 z-50">
        <CatAssistant 
          status={status} 
          comment={analysis?.catCommentary} 
          averageScore={averageScore}
        />
      </header>

      <main className="flex-grow flex flex-col items-center p-4 md:p-8">
        
        {/* Main Content Area */}
        <div className="w-full max-w-7xl space-y-8">
          
          {/* Top Section: Upload & Preview */}
          <div className={`transition-all duration-500 ${status === AnalysisStatus.COMPLETE ? 'flex flex-col md:flex-row gap-8 items-start' : 'max-w-3xl mx-auto'}`}>
            
            {/* Image Preview / Upload Display */}
            <div className={`w-full ${status === AnalysisStatus.COMPLETE ? 'md:w-1/3 sticky top-32' : ''}`}>
              {imagePreview ? (
                <div className="relative group rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                  <img 
                    src={imagePreview} 
                    alt="Uploaded Artwork" 
                    className="w-full h-auto object-cover"
                  />
                  {status === AnalysisStatus.COMPLETE && (
                    <button 
                      onClick={handleReset}
                      className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-full shadow-lg font-bold text-sm transition-all backdrop-blur-sm"
                    >
                      Analizar otra
                    </button>
                  )}
                </div>
              ) : (
                <UploadZone onFileSelect={handleFileSelect} disabled={false} />
              )}
            </div>

            {/* Loading State */}
            {status === AnalysisStatus.ANALYZING && (
              <div className="flex flex-col items-center justify-center w-full py-12 animate-pulse">
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-slate-600">Procesando píxeles...</h3>
                <p className="text-slate-400">El Maestro Michi está ajustando sus gafas.</p>
              </div>
            )}

            {/* Error State */}
            {status === AnalysisStatus.ERROR && (
               <div className="w-full text-center p-8 bg-red-50 rounded-xl border border-red-200">
                 <h3 className="text-red-600 font-bold mb-2">Error en el análisis</h3>
                 <p className="text-red-500 mb-4">No pude procesar la imagen. Verifica tu conexión o intenta con otra imagen.</p>
                 <button onClick={handleReset} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Intentar de nuevo</button>
               </div>
            )}

            {/* Dashboard Results */}
            {status === AnalysisStatus.COMPLETE && analysis && (
              <div className="flex-1 w-full animate-fade-in-up">
                 <AnalysisDashboard analysis={analysis} />
              </div>
            )}

          </div>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>ArtCatz © {new Date().getFullYear()} - Tu asistente técnico de arte con IA.</p>
        <p className="mt-1 text-xs opacity-50">Impulsado por Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
};

export default App;
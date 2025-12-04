import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';
import { ArtAnalysis } from '../types';
import { Palette, Layers, Zap, TrendingUp, AlertCircle } from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: ArtAnalysis;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto p-4 animate-fade-in">
      
      {/* Left Column: Visual Metrics */}
      <div className="lg:col-span-1 space-y-8">
        
        {/* Radar Chart for Skills */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="text-yellow-500" /> Nivel Técnico
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysis.technicalScores}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar
                  name="Habilidad"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Palette className="text-pink-500" /> Paleta Detectada
          </h3>
          <div className="flex h-16 rounded-xl overflow-hidden shadow-inner">
            {analysis.colorPalette.map((color, idx) => (
              <div 
                key={idx} 
                className="flex-1 group relative transition-all hover:flex-[2]" 
                style={{ backgroundColor: color }}
                title={color}
              >
                <span className="absolute bottom-0 left-0 w-full text-center bg-black/50 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  {color}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
             {analysis.detectedPatterns.map((pattern, i) => (
               <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                 {pattern}
               </span>
             ))}
          </div>
        </div>
      </div>

      {/* Right Column: Detailed Feedback */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Strengths */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-500" /> Fortalezas Técnicas
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.feedback.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 bg-green-50 p-3 rounded-lg">
                <span className="text-green-500 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-indigo-500">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="text-indigo-500" /> Áreas de Mejora
          </h3>
          <ul className="space-y-3">
            {analysis.feedback.improvements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-700 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="min-w-[24px] h-[24px] bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Tips */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl shadow-md border border-orange-100">
          <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
            <AlertCircle className="text-orange-500" /> Tips del Maestro
          </h3>
          <div className="space-y-4">
             {analysis.feedback.tips.map((tip, idx) => (
               <div key={idx} className="flex gap-4">
                 <span className="font-hand text-4xl text-orange-300 leading-none">"</span>
                 <p className="text-slate-700 italic font-medium pt-1">{tip}</p>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisDashboard;
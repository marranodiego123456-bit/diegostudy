
import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';

interface QuickAddTaskWidgetProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const QuickAddTaskWidget: React.FC<QuickAddTaskWidgetProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      await onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-3xl border border-blue-100 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
          <Sparkles size={16} className={isLoading ? 'animate-spin' : 'animate-pulse'} />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-xs md:text-sm uppercase tracking-wider leading-none">Entrada Rápida IA</h3>
          <p className="text-[10px] text-slate-400 font-bold italic mt-1">Escribe tu tarea y yo la analizo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Tengo taller de motores el viernes..."
          disabled={isLoading}
          className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl p-4 pr-14 min-h-[80px] md:min-h-[100px] outline-none transition-all font-semibold text-sm text-slate-700 placeholder:text-slate-300 resize-none"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-2 bottom-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white p-3 rounded-xl shadow-lg transition-all active:scale-90 flex items-center justify-center"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
      
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {['Mañana tengo...', 'Taller de...', 'Examen de...'].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setPrompt(prev => prev + suggestion)}
            className="whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-500 text-[9px] font-black px-3 py-1.5 rounded-full transition-colors uppercase tracking-tighter shrink-0"
          >
            + {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAddTaskWidget;

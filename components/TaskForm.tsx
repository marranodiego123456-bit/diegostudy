
import React, { useState } from 'react';
import { X, Sparkles, Loader2, Send } from 'lucide-react';

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-bottom-8 duration-300">
        <div className="bg-slate-50/50 p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
              <Sparkles className="text-blue-600 animate-pulse" size={24} />
              Analizador IA
            </h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">SENA Electricidad Industrial</p>
          </div>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">¿Qué tarea tienes?</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Para el lunes tengo un taller de motores sobre arranque estrella-triángulo..."
              className="w-full h-40 md:h-48 bg-slate-50 border-2 border-slate-50 rounded-[2rem] p-6 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none font-semibold text-slate-700 placeholder:text-slate-300"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100/50 flex gap-4 animate-in fade-in duration-1000">
            <div className="bg-white p-2.5 rounded-xl shadow-sm self-start shrink-0">
              <Sparkles size={18} className="text-blue-600" />
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed font-bold italic">
              "Detectaré automáticamente la materia, la fecha y te enviaré un material de estudio especializado."
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-[0.95]"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                PROCESANDO...
              </>
            ) : (
              <>
                <Send size={20} />
                ANALIZAR Y GUARDAR
              </>
            )}
          </button>
          
          <div className="pb-6 md:pb-0 text-center">
            <button type="button" onClick={onClose} className="text-slate-400 text-xs font-bold uppercase tracking-tighter hover:text-slate-600">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

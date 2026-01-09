
import React from 'react';
import { X, Download, BookOpen, Clock, Tag, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '../types';
import { exportTaskToICS } from '../lib/calendarExport';

interface StudyMaterialModalProps {
  task: Task;
  onClose: () => void;
}

const StudyMaterialModal: React.FC<StudyMaterialModalProps> = ({ task, onClose }) => {
  const downloadMaterial = () => {
    const element = document.createElement("a");
    const file = new Blob([task.studyMaterial || ""], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Material_Estudio_${task.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">Material de Apoyo</span>
              <span className="text-xs font-bold text-slate-400">• Generado por ElectroStudy AI</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 truncate">{task.title}</h3>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Tag size={14} className="text-blue-500" />
                {task.subject}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <Clock size={14} className="text-rose-500" />
                Entrega: {task.dueDate}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => exportTaskToICS(task)}
              className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
              title="Añadir a Apple Calendar"
            >
              <CalendarIcon size={20} className="text-rose-500" />
              <span className="hidden sm:inline">Apple Calendar</span>
            </button>
            <button 
              onClick={downloadMaterial}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Descargar</span>
            </button>
            <button 
              onClick={onClose}
              className="p-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition-all shadow-sm"
            >
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-white">
          <div className="prose prose-slate max-w-none">
            {task.studyMaterial ? (
              <div className="space-y-6">
                {task.studyMaterial.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-black text-slate-900 border-b-4 border-blue-500 pb-4 mb-8">{line.substring(2)}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-800 mt-10 mb-4">{line.substring(3)}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-700 mt-8 mb-3">{line.substring(4)}</h3>;
                  if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-6 text-slate-600 font-medium mb-2">{line.substring(2)}</li>;
                  return <p key={i} className="text-slate-600 leading-relaxed font-medium mb-4 whitespace-pre-wrap">{line}</p>;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <FileText size={64} className="mb-4 opacity-20" />
                <p>No hay material disponible para esta tarea.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contenido exclusivo para estudiantes SENA</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-600">Sincronizado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialModal;

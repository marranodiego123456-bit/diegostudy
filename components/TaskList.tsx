
import React from 'react';
import { CheckCircle2, Circle, BookOpen, Trash2, Calendar, Tag, ChevronRight } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onViewMaterial: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onToggle, onViewMaterial }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
          <BookOpen size={40} />
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Sin actividades</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, idx) => (
        <div 
          key={task.id} 
          style={{ animationDelay: `${idx * 100}ms` }}
          className={`group bg-white p-4 md:p-6 rounded-[2rem] border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in slide-in-from-bottom-4 shadow-sm
            ${task.status === 'completed' 
              ? 'border-emerald-100 bg-emerald-50/20 opacity-90 animate-success-pulse' 
              : 'border-slate-100 hover:shadow-xl hover:border-blue-100'
            }`}
        >
          <button 
            onClick={() => onToggle(task.id)}
            className={`flex-shrink-0 p-1 transition-all active:scale-75 ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-200 hover:text-blue-500'}`}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 size={32} className="animate-reward" />
            ) : (
              <Circle size={32} strokeWidth={1.5} />
            )}
          </button>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onViewMaterial(task)}>
            <h4 className={`font-black text-lg transition-all line-clamp-1 relative inline-block
              ${task.status === 'completed' 
                ? 'text-slate-400 strike-line' 
                : 'text-slate-900 group-hover:text-blue-600'
              }`}>
              {task.title}
            </h4>
            <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 transition-opacity duration-300 ${task.status === 'completed' ? 'opacity-40' : 'opacity-100'}`}>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <Tag size={12} className="text-blue-500" />
                {task.subject}
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <Calendar size={12} className="text-rose-500" />
                {task.dueDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100/50">
            <button 
              onClick={() => onViewMaterial(task)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all active:scale-95 shadow-lg
                ${task.status === 'completed'
                  ? 'bg-slate-100 text-slate-400 shadow-none'
                  : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
                }`}
            >
              {task.status === 'completed' ? 'REVISAR' : 'ESTUDIAR'}
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;

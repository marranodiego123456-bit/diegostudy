
import React from 'react';
import { Clock, AlertCircle, CheckCircle2, Zap, Share2 } from 'lucide-react';
import { Task } from '../types';
import { exportAllTasksToICS } from '../lib/calendarExport';

interface TaskSummaryWidgetProps {
  tasks: Task[];
}

const TaskSummaryWidget: React.FC<TaskSummaryWidgetProps> = ({ tasks }) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  
  const today = new Date().toISOString().split('T')[0];
  const urgentTasks = pendingTasks.filter(t => t.dueDate <= today);

  const stats = [
    { label: 'Pendientes', value: pendingTasks.length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Urgentes', value: urgentTasks.length, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Completadas', value: completedTasks.length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-left-4" 
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 leading-none mt-1">{stat.value}</p>
          </div>
        </div>
      ))}
      
      <div 
        className="bg-slate-900 p-5 rounded-3xl shadow-lg shadow-slate-200 flex items-center justify-between group cursor-pointer active:scale-95 transition-all" 
        onClick={() => exportAllTasksToICS(tasks)}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/10 text-white p-3 rounded-2xl group-hover:bg-blue-600 transition-colors">
            <Share2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calendario</p>
            <p className="text-xs font-bold text-white leading-tight mt-1">Exportar Todo</p>
          </div>
        </div>
        <Zap size={20} className="text-yellow-400 animate-pulse" />
      </div>
    </div>
  );
};

export default TaskSummaryWidget;

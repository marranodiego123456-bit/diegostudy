
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Tag, Clock } from 'lucide-react';
import { Task } from '../types';

interface CalendarProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, onSelectTask }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthData = () => {
    const totalDays = daysInMonth(currentMonth);
    const startDay = firstDayOfMonth(currentMonth);
    const days = [];
    
    // Empty slots for start
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Days with task counts
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.dueDate === dateStr);
      days.push({ day: i, dateStr, tasks: dayTasks });
    }
    
    return days;
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  const monthName = currentMonth.toLocaleString('es-ES', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-2xl font-black text-slate-900 capitalize">
          {monthName} <span className="text-slate-300 ml-1">{year}</span>
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-3 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all active:scale-95">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <button onClick={nextMonth} className="p-3 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-all active:scale-95">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 border-b border-slate-50">
        {['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map(day => (
          <div key={day} className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {getMonthData().map((data, idx) => (
          <div 
            key={idx} 
            className={`min-h-[140px] p-3 border-r border-b border-slate-100 transition-colors ${!data ? 'bg-slate-50/20' : 'hover:bg-slate-50/50'}`}
          >
            {data && (
              <>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-lg ${new Date().toISOString().split('T')[0] === data.dateStr ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                    {data.day}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {data.tasks.map(task => (
                    <button 
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className={`w-full text-left p-2 rounded-xl text-[10px] font-bold border truncate transition-all active:scale-95 ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 opacity-60' : 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm'}`}
                    >
                      {task.title}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;

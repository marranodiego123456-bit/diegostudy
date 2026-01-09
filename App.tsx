
import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle, 
  LayoutDashboard, 
  Menu, 
  X,
  ChevronLeft
} from 'lucide-react';
import { Task } from './types';
import { analyzeTask } from './geminiService';
import { CURRICULUM_SUBJECTS } from './constants';
import { requestNotificationPermission, checkAndNotifyTasks } from './lib/notificationService';
import TaskList from './components/TaskList';
import Calendar from './components/Calendar';
import TaskForm from './components/TaskForm';
import StudyMaterialModal from './components/StudyMaterialModal';
import TaskSummaryWidget from './components/TaskSummaryWidget';
import QuickAddTaskWidget from './components/QuickAddTaskWidget';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'dashboard' | 'calendar' | 'subjects'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('electrostudy_tasks');
    if (saved) {
      const parsedTasks = JSON.parse(saved);
      setTasks(parsedTasks);
      initNotifications(parsedTasks);
    } else {
      initNotifications([]);
    }
  }, []);

  const initNotifications = async (currentTasks: Task[]) => {
    const granted = await requestNotificationPermission();
    if (granted) {
      checkAndNotifyTasks(currentTasks);
    }
  };

  useEffect(() => {
    localStorage.setItem('electrostudy_tasks', JSON.stringify(tasks));
    checkAndNotifyTasks(tasks);
  }, [tasks]);

  const handleAddTask = async (prompt: string) => {
    setIsLoading(true);
    try {
      const analysis = await analyzeTask(prompt);
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: analysis.summary,
        description: prompt,
        subject: analysis.subject,
        dueDate: analysis.dueDate,
        createdAt: new Date().toISOString(),
        studyMaterial: analysis.studyMaterial,
        status: 'pending'
      };
      setTasks(prev => [...prev, newTask]);
      setIsFormOpen(false);
      showNotification('Tarea analizada y guardada', 'success');
    } catch (error) {
      showNotification('Error al procesar la tarea', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const navItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
    { id: 'subjects', label: 'Materias', icon: BookOpen },
  ];

  const pendingTasks = tasks.filter(t => t.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 h-full bg-slate-900 text-white transition-all duration-300 ease-in-out shadow-2xl
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isSidebarCollapsed ? 'md:w-20' : 'md:w-72 w-64'}
      `}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-8 px-2 mt-2">
            <div className={`flex items-center gap-3 overflow-hidden transition-all ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
              <div className="bg-blue-600 p-2 rounded-xl">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-black tracking-tighter whitespace-nowrap">ElectroStudy</h1>
            </div>
            <button 
              onClick={() => {
                if (window.innerWidth < 768) setIsSidebarOpen(false);
                else setIsSidebarCollapsed(!isSidebarCollapsed);
              }}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"
            >
              {isSidebarCollapsed ? <ChevronRight size={20} /> : <X size={20} className="md:hidden" /> || <ChevronLeft size={20} className="hidden md:block" />}
            </button>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setView(item.id as any);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group
                  ${view === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon size={20} className={`shrink-0 transition-transform group-hover:scale-110`} />
                {!isSidebarCollapsed && <span className="font-bold text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>

          {!isSidebarCollapsed && (
            <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 hidden sm:block">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-2">Progreso</p>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xl font-black text-blue-400">{Math.round((tasks.filter(t => t.status === 'completed').length / (tasks.length || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-1000" 
                  style={{ width: `${(tasks.filter(t => t.status === 'completed').length / (tasks.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative scroll-smooth bg-slate-50">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Clock size={16} className="text-white" />
            </div>
            <span className="font-black text-slate-900 tracking-tight">ElectroStudy</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-slate-100 rounded-lg text-slate-600"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {view === 'dashboard' ? 'Mi Panel' : view === 'calendar' ? 'Mi Calendario' : 'Mis Materias'}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-0.5">SENA Electricidad</p>
            </div>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <Plus size={18} />
              NUEVA TAREA
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {view === 'dashboard' && (
              <div className="space-y-6">
                <TaskSummaryWidget tasks={tasks} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <QuickAddTaskWidget onSubmit={handleAddTask} isLoading={isLoading} />

                    <section>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span>Pendientes</span>
                        {pendingTasks.length > 0 && (
                          <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-md">
                            {pendingTasks.length}
                          </span>
                        )}
                      </h3>
                      <TaskList 
                        tasks={pendingTasks} 
                        onDelete={(id) => setTasks(tasks.filter(t => t.id !== id))}
                        onToggle={(id) => setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t))}
                        onViewMaterial={setSelectedTask}
                      />
                    </section>

                    {tasks.some(t => t.status === 'completed') && (
                      <section>
                        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-4">Completadas</h3>
                        <TaskList 
                          tasks={tasks.filter(t => t.status === 'completed')} 
                          onDelete={(id) => setTasks(tasks.filter(t => t.id !== id))}
                          onToggle={(id) => setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t))}
                          onViewMaterial={setSelectedTask}
                        />
                      </section>
                    )}
                  </div>

                  <aside className="space-y-6">
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                        <AlertCircle size={16} className="text-orange-500" />
                        Próximos Vencimientos
                      </h4>
                      <div className="space-y-3">
                        {pendingTasks.sort((a,b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 3).map(task => (
                          <div key={task.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedTask(task)}>
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{task.title}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px] font-black text-orange-600 uppercase">Vence: {task.dueDate}</span>
                              <ChevronRight size={12} className="text-slate-300" />
                            </div>
                          </div>
                        ))}
                        {pendingTasks.length === 0 && (
                          <p className="text-[10px] text-slate-400 font-bold text-center py-4 italic">No hay entregas pendientes</p>
                        )}
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            )}

            {view === 'calendar' && <Calendar tasks={tasks} onSelectTask={setSelectedTask} />}

            {view === 'subjects' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CURRICULUM_SUBJECTS.map(subject => (
                  <div key={subject.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-50 p-2.5 rounded-xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <BookOpen size={20} />
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{subject.code}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1.5 text-base leading-tight">{subject.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{subject.competence}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Overlays */}
      {isFormOpen && <TaskForm onClose={() => setIsFormOpen(false)} onSubmit={handleAddTask} isLoading={isLoading} />}
      {selectedTask && <StudyMaterialModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      
      {notification && (
        <div className={`fixed bottom-6 left-4 right-4 md:left-auto md:right-8 z-[100] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-8 ${notification.type === 'success' ? 'bg-slate-900 text-white' : 'bg-rose-600 text-white'}`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} />}
          <span className="font-bold text-xs">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;

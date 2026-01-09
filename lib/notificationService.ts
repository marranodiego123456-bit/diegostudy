
import { Task } from '../types';

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("Este navegador no soporta notificaciones de escritorio");
    return false;
  }

  if (Notification.permission === "granted") return true;

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const checkAndNotifyTasks = (tasks: Task[]) => {
  if (Notification.permission !== "granted") return;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];

  // Obtener registro de notificaciones enviadas para no repetir
  const notifiedTasks = JSON.parse(localStorage.getItem('electrostudy_notified_ids') || '[]');

  tasks.forEach(task => {
    if (task.status === 'completed') return;
    if (notifiedTasks.includes(task.id)) return;

    let title = "";
    let body = "";

    if (task.dueDate === tomorrowStr) {
      title = "¡Tarea para MAÑANA!";
      body = `Recuerda: "${task.title}" vence mañana. Revisa el material de apoyo de ${task.subject}.`;
    } else if (task.dueDate === todayStr) {
      title = "¡Tarea para HOY!";
      body = `Atención: "${task.title}" vence hoy. ¡No olvides entregarla!`;
    }

    if (title) {
      new Notification(title, {
        body: body,
        icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Icono genérico de educación/alerta
        tag: task.id // Evita múltiples notificaciones de la misma tarea
      });
      
      // Registrar como notificada
      notifiedTasks.push(task.id);
    }
  });

  localStorage.setItem('electrostudy_notified_ids', JSON.stringify(notifiedTasks));
};

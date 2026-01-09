
import { Task } from '../types';

/**
 * Genera un archivo .ics compatible con Apple Calendar / iOS / macOS
 * Incluye alarmas automáticas 1 día antes.
 */
export const exportTaskToICS = (task: Task) => {
  const date = new Date(task.dueDate);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  
  // Formato YYYYMMDD
  const dateStr = `${year}${month}${day}`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ElectroStudy AI//SENA//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${task.id}@electrostudy.ai`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${dateStr}`,
    `SUMMARY:⚡️ ${task.subject}: ${task.title}`,
    `DESCRIPTION:Materia: ${task.subject}\\n\\n${task.description.replace(/\n/g, '\\n')}\\n\\nMaterial de apoyo generado por IA: ${task.studyMaterial ? 'Adjunto en la App' : 'N/A'}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D', // Alerta 1 día antes
    'ACTION:DISPLAY',
    `DESCRIPTION:Recordatorio: Mañana vence ${task.title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Tarea_${task.title.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAllTasksToICS = (tasks: Task[]) => {
  if (tasks.length === 0) return;

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ElectroStudy AI//SENA//ES',
    'CALSCALE:GREGORIAN'
  ];

  tasks.forEach(task => {
    const date = new Date(task.dueDate);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    icsContent = icsContent.concat([
      'BEGIN:VEVENT',
      `UID:${task.id}@electrostudy.ai`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:⚡️ ${task.subject}: ${task.title}`,
      `DESCRIPTION:Materia: ${task.subject}\\n\\n${task.description.replace(/\n/g, '\\n')}`,
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Recordatorio: Mañana vence ${task.title}`,
      'END:VALARM',
      'END:VEVENT'
    ]);
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'ElectroStudy_Calendario_SENA.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

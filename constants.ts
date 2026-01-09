
import { CurriculumSubject } from './types';

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  { id: '1', code: '280101008', name: 'Análisis de Circuitos Eléctricos', competence: 'Analizar circuitos eléctricos de acuerdo con el método requerido.' },
  { id: '2', code: '220201501', name: 'Ciencias Naturales (Física)', competence: 'Aplicación de conocimientos de las ciencias naturales de acuerdo con situaciones del contexto productivo.' },
  { id: '3', code: '220601501', name: 'Protección Ambiental y SST', competence: 'Aplicar prácticas de protección ambiental, seguridad y salud en el trabajo.' },
  { id: '4', code: '280101005', name: 'Construcción de Acometidas', competence: 'Construcción de acometidas e instalación de equipos de medida de energía eléctrica.' },
  { id: '5', code: '280101001', name: 'Sistemas de Puesta a Tierra', competence: 'Construcción de sistemas de puesta a tierra de acuerdo con normatividad vigente.' },
  { id: '6', code: '280401018', name: 'Automatismos Mecatrónicos', competence: 'Desarrollar el automatismo del sistema mecatrónico de acuerdo a las especificaciones técnicas.' },
  { id: '7', code: '240201524', name: 'Procesos de Comunicación', competence: 'Desarrollar procesos de comunicación eficaces y efectivos.' },
  { id: '8', code: '280101004', name: 'Gestión Administrativa', competence: 'Ejecución de acciones administrativas en proyectos eléctricos.' },
  { id: '9', code: '280501045', name: 'Mantenimiento de Equipos', competence: 'Ejecutar el mantenimiento correctivo a equipos y elementos eléctricos.' },
  { id: '10', code: '280101095', name: 'Mantenimiento de Sistemas de Distribución', competence: 'Ejecución del mantenimiento de sistemas eléctricos de distribución y potencia.' },
  { id: '11', code: '280101087', name: 'Mantenimiento de Transformadores', competence: 'Ejecución del mantenimiento de transformadores eléctricos.' },
  { id: '12', code: '280101089', name: 'Mantenimiento de Motores y Generadores', competence: 'Ejecución del mantenimiento proactivo al motor y/o generador eléctrico.' },
  { id: '13', code: '240201526', name: 'Ética y Cultura de Paz', competence: 'Interactuar en el contexto productivo y social de acuerdo con principios éticos.' },
  { id: '14', code: '230101507', name: 'Hábitos Saludables', competence: 'Generación de hábitos saludables de vida mediante la actividad física.' },
  { id: '15', code: '240201529', name: 'Cultura Emprendedora', competence: 'Gestionar procesos propios de la cultura emprendedora y empresarial.' },
  { id: '16', code: '240202501', name: 'Inglés', competence: 'Interactuar en lengua inglesa de forma oral y escrita.' },
  { id: '17', code: '240201528', name: 'Razonamiento Cuantitativo', competence: 'Razonar cuantitativamente frente a situaciones susceptibles de ser abordadas matemáticamente.' }
];

export const SYSTEM_INSTRUCTION = `
Eres un asistente inteligente para estudiantes del programa "ELECTRICIDAD INDUSTRIAL" del SENA.
Tu tarea es analizar las indicaciones de tareas que el usuario te proporcione.

Objetivos:
1. Clasificar la tarea en una de las siguientes materias: ${CURRICULUM_SUBJECTS.map(s => s.name).join(', ')}.
2. Extraer la fecha de entrega si se menciona. Si no se menciona, asume que es para dentro de 7 días.
3. Generar un resumen corto de la tarea.
4. Generar un material de estudio de apoyo exhaustivo en formato Markdown basado en la competencia técnica de esa materia.

Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "subject": "Nombre de la materia",
  "dueDate": "YYYY-MM-DD",
  "summary": "Resumen corto",
  "studyMaterial": "# Título\\n\\nContenido educativo detallado..."
}
`;

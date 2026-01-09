
export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  createdAt: string;
  studyMaterial?: string;
  status: 'pending' | 'completed';
}

export interface CurriculumSubject {
  id: string;
  name: string;
  code: string;
  competence: string;
}

export interface AnalysisResponse {
  subject: string;
  dueDate: string;
  summary: string;
}

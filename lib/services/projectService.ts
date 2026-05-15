import { Project } from '../../types';

export const isProjectActive = (project: Project): boolean => {
  const today = new Date();
  const start = new Date(project.vigenciaInicio);
  const end = new Date(project.vigenciaFim);

  today.setHours(0, 0, 0, 0);
  
  return today >= start && today <= end;
};

export const validateProjectPeriod = (project: Project) => {
  const errors: string[] = [];
  const start = new Date(project.vigenciaInicio);
  const end = new Date(project.vigenciaFim);

  if (start > end) {
    errors.push("A data de início da vigência não pode ser posterior ao término.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
import { Project } from '../../types';

export const isProjectActive = (project: Project): boolean => {
  const today = new Date();
  const start = new Date(project.vigenciaInicio);
  const end = new Date(project.vigenciaFim);

  today.setHours(0, 0, 0, 0);
  
  return today >= start && today <= end;
};

export function validateProjectPeriod(data: any) {
  const errors: string[] = [];

  if (!data.vigenciaInicio || !data.vigenciaFim) {
    errors.push('As datas de início e fim são obrigatórias.');
  } else if (new Date(data.vigenciaInicio) > new Date(data.vigenciaFim)) {
    errors.push('A data de início da vigência não pode ser posterior ao término.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
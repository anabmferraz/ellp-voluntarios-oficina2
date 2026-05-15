import { Activity } from '../../types';

export const validateActivityPeriod = (activity: Activity) => {
  const errors: string[] = [];
  const start = new Date(activity.dataInicio);
  const end = new Date(activity.dataFim);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    errors.push("As datas de início e fim devem ser válidas.");
  }

  if (start > end) {
    errors.push("A data de início não pode ser posterior à data de fim.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateTotalHours = (activities: Activity[]): number => {
  return activities.reduce((total, activity) => {
    return total + (activity.horas || 0);
  }, 0);
};
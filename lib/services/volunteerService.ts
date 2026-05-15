import { Volunteer } from '../../types';

export const validateVolunteer = (data: Volunteer) => {
  const errors: string[] = [];

  if (!data.nomeCompleto) errors.push("O nome completo é obrigatório.");
  if (!data.cpf) errors.push("O CPF é obrigatório.");
  
  if (data.isEstudanteUTFPR) {
    if (!data.curso) errors.push("O curso é obrigatório para estudantes da UTFPR.");
    if (!data.ra) errors.push("O RA é obrigatório para estudantes da UTFPR.");
    if (!data.periodo) errors.push("O período é obrigatório para estudantes da UTFPR.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const shouldInactivateVolunteer = (dataSaida?: string): boolean => {
  if (!dataSaida) return false;

  const today = new Date();
  const exitDate = new Date(dataSaida);

  today.setHours(0, 0, 0, 0);
  exitDate.setHours(0, 0, 0, 0);

  return today >= exitDate;
};
import { Volunteer } from '../../types';

function trim(value?: string): string {
  return (value ?? '').trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const validateVolunteer = (data: Volunteer) => {
  const errors: string[] = [];

  if (!trim(data.nomeCompleto)) {
    errors.push('O nome completo é obrigatório.');
  }

  if (!trim(data.dataNascimento)) {
    errors.push('A data de nascimento é obrigatória.');
  }

  if (!trim(data.cpf)) {
    errors.push('O CPF é obrigatório.');
  } else if (data.cpf.replace(/\D/g, '').length !== 11) {
    errors.push('O CPF deve estar completo com 11 dígitos.');
  }

  if (!trim(data.nacionalidade)) {
    errors.push('A nacionalidade é obrigatória.');
  }

  if (!trim(data.endereco)) {
    errors.push('O endereço é obrigatório.');
  }

  if (!trim(data.cidade)) {
    errors.push('A cidade é obrigatória.');
  }

  if (!trim(data.estado)) {
    errors.push('O estado/UF é obrigatório.');
  } else if (trim(data.estado).length !== 2) {
    errors.push('O estado/UF deve conter 2 caracteres (ex.: PR).');
  }

  if (!trim(data.telefone)) {
    errors.push('O telefone é obrigatório.');
  }

  if (!trim(data.email)) {
    errors.push('O e-mail é obrigatório.');
  } else if (!isValidEmail(trim(data.email))) {
    errors.push('O e-mail informado é inválido.');
  }

  if (data.isEstudanteUTFPR) {
    if (!trim(data.curso)) {
      errors.push('O curso é obrigatório para estudantes da UTFPR.');
    }
    if (!trim(data.periodo)) {
      errors.push('O período é obrigatório para estudantes da UTFPR.');
    }
    if (!trim(data.ra)) {
      errors.push('O RA é obrigatório para estudantes da UTFPR.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export function validatePdfUpload(file: File): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!file) {
    errors.push('Nenhum arquivo selecionado.');
    return { isValid: false, errors };
  }

  if (file.type !== 'application/pdf') {
    errors.push('O arquivo deve ser um PDF.');
  }

  const maxSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push('O arquivo não pode exceder 10 MB.');
  }

  if (file.size === 0) {
    errors.push('O arquivo está vazio.');
  }

  return {
    isValid: errors.length === 0,
    errors,
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

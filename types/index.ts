export interface Volunteer {
  id?: string;
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string; // Deve ser único 
  nacionalidade: string;
  endereco: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string; // Deve ser único 
  isEstudanteUTFPR: boolean;
  // Campos obrigatórios apenas se for estudante 
  curso?: string;
  periodo?: string;
  ra?: string;
  status: 'ativo' | 'inativo';
  dataEntrada: string; 
  dataSaida?: string;  
  dataAceiteTermo?: string;
}

export interface Activity {
  id?: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  horas: number;
}

export interface Coordinator {
  nome: string;
  cpf: string;
  departamento: string;
  fone: string;
  email: string;
}

export interface Project {
  titulo: string;
  modalidade: 'programa' | 'projeto' | 'evento' | 'curso';
  vigenciaInicio: string;
  vigenciaFim: string;
}

export interface TermData {
  volunteer: Volunteer;
  coordinator: Coordinator;
  project: Project;
  activities: Activity[];
}


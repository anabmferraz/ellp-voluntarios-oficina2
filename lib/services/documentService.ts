import { jsPDF } from 'jspdf';
import { TermData } from '../../types';

export const generateVolunteerTerm = (data: TermData) => {
  const doc = new jsPDF();
  const { volunteer, coordinator, project, activities } = data;

  const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TERMO DE ADESÃO PARA VOLUNTÁRIO(A)", 105, 20, { align: "center" });

  // --- Dados da Ação ---
  doc.setFontSize(10);
  doc.text("Dados da ação", 20, 35);
  doc.setFont("helvetica", "normal");
  doc.text(`Título da ação: ${project.titulo}`, 20, 42);
  doc.text(`Vigência: ${project.vigenciaInicio} a ${project.vigenciaFim}`, 20, 48);

  // --- Dados da Coordenação ---
  doc.setFont("helvetica", "bold");
  doc.text("Dados da coordenação", 20, 60);
  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${coordinator.nome}`, 20, 67);
  doc.text(`E-mail: ${coordinator.email}`, 20, 73);

  // --- Dados do Voluntário ---
  doc.setFont("helvetica", "bold");
  doc.text("Dados do(a) Voluntário(a)", 20, 85);
  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${volunteer.nomeCompleto}`, 20, 92);
  doc.text(`CPF: ${volunteer.cpf}`, 20, 98);
  doc.text(`E-mail: ${volunteer.email}`, 20, 104);
  
  if (volunteer.isEstudanteUTFPR) {
    doc.text(`Curso: ${volunteer.curso} | RA: ${volunteer.ra}`, 20, 110);
  }

  // --- Cronograma de Atividades ---
  doc.setFont("helvetica", "bold");
  doc.text("Cronograma das atividades", 20, 125);
  
  let currentY = 132;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  activities.forEach((activity, index) => {
    const text = `${index + 1}. ${activity.descricao} (${formatDate(activity.dataInicio)} - ${formatDate(activity.dataFim)}) - ${activity.horas}h`;
    doc.text(text, 25, currentY);
    currentY += 7; 
  });

  // --- Rodapé / Assinaturas ---
  const footerY = 260;
  doc.line(20, footerY, 90, footerY); 
  doc.line(120, footerY, 190, footerY); 
  doc.text("Assinatura Voluntário(a)", 55, footerY + 5, { align: "center" });
  doc.text("Coordenação da Ação", 155, footerY + 5, { align: "center" });

  return doc.output('blob');
};

export const validatePdfUpload = (file: File) => {
  const errors: string[] = [];
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  if (file.type !== 'application/pdf') {
    errors.push("O arquivo deve ser obrigatoriamente um PDF.");
  }

  if (file.size > MAX_SIZE_BYTES) {
    errors.push(`O arquivo é muito grande. O tamanho máximo permitido é ${MAX_SIZE_MB}MB.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
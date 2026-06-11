import { jsPDF } from 'jspdf';

export function generateVolunteerTerm(data: any): Blob {
  const doc = new jsPDF();
  let y = 20; 

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Ministério da Educação', 105, y, { align: 'center' });
  y += 5;
  doc.text('Universidade Tecnológica Federal do Paraná', 105, y, { align: 'center' });
  y += 5;
  doc.text('Diretoria de Relações Empresariais e Comunitárias', 105, y, { align: 'center' });
  y += 5;
  doc.text('Departamento de Extensão', 105, y, { align: 'center' });
  y += 15;

  doc.setFontSize(12);
  doc.text('TERMO DE ADESÃO PARA VOLUNTÁRIO(A)', 105, y, { align: 'center' });
  y += 15;

  doc.setFontSize(10);
  doc.text('Dados da Instituição', 20, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Instituição: Universidade Tecnológica Federal do Paraná – UTFPR', 20, y);
  y += 5;
  doc.text('Câmpus: Cornélio Procópio', 20, y);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Dados da ação', 20, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Título da ação: ${data.project?.titulo || ''}`, 20, y);
  y += 5;
  doc.text(`Vigência Início: ${data.project?.vigenciaInicio || ''}    Término: ${data.project?.vigenciaFim || ''}`, 20, y);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Dados da coordenação da ação', 20, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${data.coordinator?.nome || ''}`, 20, y);
  y += 5;
  doc.text(`E-mail: ${data.coordinator?.email || ''}`, 20, y);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Dados do(a) Voluntário(a)', 20, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${data.volunteer?.nomeCompleto || ''}`, 20, y);
  y += 5;
  doc.text(`CPF: ${data.volunteer?.cpf || ''}    Nacionalidade: Brasileira`, 20, y);
  y += 5;
  
  const isAluno = data.volunteer?.isEstudanteUTFPR ? '(X) sim   ( ) não' : '( ) sim   (X) não';
  doc.text(`É estudante da UTFPR: ${isAluno}`, 20, y);
  
  y += 5;
  doc.text(`Curso: ${data.volunteer?.curso || '-'}    RA: ${data.volunteer?.ra || '-'}`, 20, y);
  y += 5;
  doc.text(`E-mail: ${data.volunteer?.email || ''}`, 20, y);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Síntese das atividades a serem desenvolvidas pelo(a) voluntário(a)', 20, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  if (data.activities && data.activities.length > 0) {
    data.activities.forEach((act: any, index: number) => {
      doc.text(`${index + 1}. ${act.descricao} (${act.dataInicio} a ${act.dataFim}) - ${act.horas}h`, 20, y);
      y += 5;
    });
  }
  y += 5;

  doc.setFontSize(9);
  const clausulas = [
    "1. O(a) voluntário(a) não poderá ser substituído(a) no desempenho de suas atividades;",
    "2. O(a) voluntário(a) não poderá atuar como responsável pela coordenação da ação de extensão;",
    "3. O(a) voluntário(a) declara ser conhecedor da Lei Federal N. 9.608, de 18 de fevereiro de 1998, especialmente de que o serviço voluntário não gera vínculo empregatício, nem obrigação de natureza trabalhista, previdenciária ou afim.",
    "4. O(a) Voluntário(a), estudante da UTFPR, contará com o seguro contra acidentes pessoais pago pela UTFPR, conforme dispositivo legal pertinente.",
    "5. A UTFPR não se responsabiliza por qualquer dano físico ou mental causado ao(à) estudante voluntário(a) na execução da ação de extensão.",
    "6. À coordenação da ação de extensão cabe supervisionar as atividades desenvolvidas pelo(a) voluntário(a), nos dias e horários previstos, e informar à DIREC sobre o cancelamento deste Termo, quando ocorrer, em até 03 dias.",
    "7. A UTFPR poderá cancelar ou suspender o vínculo com a atividade quando constatado que foram infringidas quaisquer das condições constantes deste termo e das normas aplicáveis ao Edital respectivo.",
    "8. O(a) voluntário(a) e a coordenação da ação de Extensão comprometem-se a cumprir as condições expressas neste instrumento e as normas que lhe são aplicáveis."
  ];

  clausulas.forEach(clausula => {
    const textLines = doc.splitTextToSize(clausula, 170); 
    
    if (y + (textLines.length * 4) > 280) { 
      doc.addPage();
      y = 20;
    }
    
    doc.text(textLines, 20, y);
    y += (textLines.length * 4) + 2;
  });

  y += 10;
  
  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ACEITE E CONCORDÂNCIA', 105, y, { align: 'center' });
  
  y += 20; 
  
  doc.setLineWidth(0.5);
  doc.line(20, y, 90, y); 
  doc.line(120, y, 190, y); 
  
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('Voluntário(a)', 55, y, { align: 'center' });
  doc.text('Coordenação da Ação', 155, y, { align: 'center' });

  return doc.output('blob');
}
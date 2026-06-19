import { jsPDF } from 'jspdf';


const MARGIN_LEFT = 14;
const MARGIN_RIGHT = 14;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;


const PRIMARY = { r: 0, g: 113, b: 175 };
const SECONDARY = { r: 187, g: 75, b: 0 };
const LIGHT_BG = { r: 243, g: 243, b: 243 };
const TEXT_DARK = { r: 33, g: 37, b: 41 };
const TEXT_MUTED = { r: 90, g: 90, b: 90 };


const PAGE_BREAK_THRESHOLD = 270;
const PAGE_TOP_AFTER_BREAK = 20;

function checkPageBreak(doc: jsPDF, y: number, threshold = PAGE_BREAK_THRESHOLD): number {
  if (y > threshold) {
    doc.addPage();
    drawHeaderBand(doc);
    return PAGE_TOP_AFTER_BREAK;
  }
  return y;
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  y = checkPageBreak(doc, y);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function formatDateBR(dateStr: string): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatModalidade(modalidade: string): string {
  if (!modalidade) return '—';
  return modalidade.charAt(0).toUpperCase() + modalidade.slice(1);
}

function drawTwoColumns(
  doc: jsPDF,
  leftLabel: string,
  leftValue: string,
  rightLabel: string,
  rightValue: string,
  y: number,
): number {
  const colWidth = CONTENT_WIDTH / 2 - 2;
  const rightColX = MARGIN_LEFT + colWidth + 4;
  const leftY = drawField(doc, leftLabel, leftValue, MARGIN_LEFT, y, colWidth);
  const rightY = drawField(doc, rightLabel, rightValue, rightColX, y, colWidth);
  return Math.max(leftY, rightY);
}


function drawHeaderBand(doc: jsPDF): number {
  doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.rect(0, 0, PAGE_WIDTH, 32, 'F');


  doc.setFillColor(SECONDARY.r, SECONDARY.g, SECONDARY.b);
  doc.rect(0, 32, PAGE_WIDTH, 1.2, 'F');


  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Ministério da Educação', PAGE_WIDTH / 2, 9, { align: 'center' });


  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Universidade Tecnológica Federal do Paraná — UTFPR', PAGE_WIDTH / 2, 15, {
    align: 'center',
  });


  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Diretoria de Relações Empresariais e Comunitárias · Departamento de Extensão',
    PAGE_WIDTH / 2,
    21,
    { align: 'center' },
  );
  doc.text('Câmpus Cornélio Procópio', PAGE_WIDTH / 2, 26, { align: 'center' });


  doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);
  return 40;
}


function drawDocumentTitle(doc: jsPDF, y: number): number {
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.text('TERMO DE ADESÃO PARA VOLUNTÁRIO(A)', PAGE_WIDTH / 2, y, { align: 'center' });


  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
  doc.text('Projeto de Extensão — ELLP', PAGE_WIDTH / 2, y + 5, { align: 'center' });


  doc.setDrawColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT + 30, y + 8, PAGE_WIDTH - MARGIN_RIGHT - 30, y + 8);


  doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);
  return y + 12;
}


function drawIntroParagraph(doc: jsPDF, y: number): number {
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);


  const intro =
    'Pelo presente instrumento particular, a Universidade Tecnológica Federal do Paraná (UTFPR), ' +
    'Câmpus Cornélio Procópio, e o(a) voluntário(a) abaixo identificado(a) firmam o presente Termo de Adesão, ' +
    'nos termos da Lei Federal nº 9.608/1998 e das normas institucionais aplicáveis às ações de extensão, ' +
    'mediante as cláusulas e condições a seguir estipuladas.';


  return addWrappedText(doc, intro, MARGIN_LEFT, y, CONTENT_WIDTH, 3.2) + 2;
}


function drawSectionHeader(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(LIGHT_BG.r, LIGHT_BG.g, LIGHT_BG.b);
  doc.rect(MARGIN_LEFT, y - 2.5, CONTENT_WIDTH, 5.5, 'F');


  doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.rect(MARGIN_LEFT, y - 2.5, 1.5, 5.5, 'F');


  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.text(title, MARGIN_LEFT + 4, y + 0.5);


  doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);
  return y + 6;
}


function drawField(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
): number {
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
  doc.text(label, x, y);


  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);
  return addWrappedText(doc, value || '—', x, y + 3, width, 3.2);
}


function drawClausesBox(doc: jsPDF, y: number, clausulas: string[]): number {
  const boxTop = y;
  let innerY = y + 4;


  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);


  clausulas.forEach((clausula) => {
    innerY = addWrappedText(doc, clausula, MARGIN_LEFT + 4, innerY, CONTENT_WIDTH - 8, 3.1);
    innerY += 0.8;
  });


  const boxHeight = innerY - boxTop + 2;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.roundedRect(MARGIN_LEFT, boxTop, CONTENT_WIDTH, boxHeight, 1.5, 1.5, 'S');


  return innerY + 3;
}


function drawSignatureBlock(doc: jsPDF, y: number): number {
  y = checkPageBreak(doc, y, 250);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SECONDARY.r, SECONDARY.g, SECONDARY.b);
  doc.text('ACEITE E CONCORDÂNCIA', PAGE_WIDTH / 2, y, { align: 'center' });


  y += 5;
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
  doc.text(
    'Declaro ter lido e concordado com todas as cláusulas deste instrumento.',
    PAGE_WIDTH / 2,
    y,
    { align: 'center' },
  );


  y += 8;
  const sigWidth = 78;
  const leftX = MARGIN_LEFT + 2;
  const rightX = PAGE_WIDTH - MARGIN_RIGHT - sigWidth - 2;


  doc.setFillColor(LIGHT_BG.r, LIGHT_BG.g, LIGHT_BG.b);
  doc.roundedRect(leftX, y, sigWidth, 14, 1, 1, 'F');
  doc.roundedRect(rightX, y, sigWidth, 14, 1, 1, 'F');


  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.25);
  doc.line(leftX + 8, y + 9, leftX + sigWidth - 8, y + 9);
  doc.line(rightX + 8, y + 9, rightX + sigWidth - 8, y + 9);


  y += 16;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(TEXT_DARK.r, TEXT_DARK.g, TEXT_DARK.b);
  doc.text('Voluntário(a)', leftX + sigWidth / 2, y, { align: 'center' });
  doc.text('Coordenação da Ação', rightX + sigWidth / 2, y, { align: 'center' });


  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
  doc.text('Assinatura', leftX + sigWidth / 2, y + 3.5, { align: 'center' });
  doc.text('Assinatura', rightX + sigWidth / 2, y + 3.5, { align: 'center' });


  return y + 6;
}


function drawFooter(doc: jsPDF): void {
  doc.setDrawColor(LIGHT_BG.r, LIGHT_BG.g, LIGHT_BG.b);
  doc.setLineWidth(0.5);
  doc.line(MARGIN_LEFT, PAGE_HEIGHT - 10, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 10);


  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(TEXT_MUTED.r, TEXT_MUTED.g, TEXT_MUTED.b);
  doc.text(
    'Documento gerado eletronicamente pelo Sistema ELLP — UTFPR Câmpus Cornélio Procópio',
    PAGE_WIDTH / 2,
    PAGE_HEIGHT - 6,
    { align: 'center' },
  );
}


export function generateVolunteerTerm(data: any): Blob {
  const doc = new jsPDF();
  let y = drawHeaderBand(doc);
  y = drawDocumentTitle(doc, y);
  y = drawIntroParagraph(doc, y);


  y = drawSectionHeader(doc, 'I — DADOS DA INSTITUIÇÃO', y);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  y = addWrappedText(
    doc,
    'Instituição: Universidade Tecnológica Federal do Paraná (UTFPR)',
    MARGIN_LEFT,
    y,
    CONTENT_WIDTH,
    3.2,
  );
  y = addWrappedText(doc, 'Câmpus: Cornélio Procópio — Paraná', MARGIN_LEFT, y, CONTENT_WIDTH, 3.2);
  y += 1;


  y = drawSectionHeader(doc, 'II — DADOS DA AÇÃO DE EXTENSÃO', y);
  y = drawField(doc, 'Título da ação', data.project?.titulo || '', MARGIN_LEFT, y, CONTENT_WIDTH);
  y = drawTwoColumns(
    doc,
    'Modalidade',
    formatModalidade(data.project?.modalidade || ''),
    'Vigência',
    `${data.project?.vigenciaInicio || '—'} a ${data.project?.vigenciaFim || '—'}`,
    y,
  );
  y += 1;


  y = drawSectionHeader(doc, 'III — DADOS DA COORDENAÇÃO', y);
  y = drawField(doc, 'Coordenador(a)', data.coordinator?.nome || '', MARGIN_LEFT, y, CONTENT_WIDTH);
  y = drawTwoColumns(
    doc,
    'Departamento',
    data.coordinator?.departamento || '',
    'CPF',
    data.coordinator?.cpf || '',
    y,
  );
  y = drawTwoColumns(
    doc,
    'E-mail institucional',
    data.coordinator?.email || '',
    'Telefone',
    data.coordinator?.fone || '',
    y,
  );
  y += 1;


  y = drawSectionHeader(doc, 'IV — DADOS DO(A) VOLUNTÁRIO(A)', y);

  y = drawTwoColumns(
    doc,
    'Nome completo',
    data.volunteer?.nomeCompleto || '',
    'Data de nascimento',
    formatDateBR(data.volunteer?.dataNascimento || ''),
    y,
  );
  y = drawTwoColumns(
    doc,
    'CPF',
    data.volunteer?.cpf || '',
    'Nacionalidade',
    data.volunteer?.nacionalidade || '',
    y,
  );
  y = drawField(doc, 'Endereço', data.volunteer?.endereco || '', MARGIN_LEFT, y, CONTENT_WIDTH);
  y = drawTwoColumns(
    doc,
    'Cidade',
    data.volunteer?.cidade || '',
    'Estado / UF',
    data.volunteer?.estado || '',
    y,
  );
  y = drawTwoColumns(
    doc,
    'Telefone',
    data.volunteer?.telefone || '',
    'E-mail',
    data.volunteer?.email || '',
    y,
  );

  const isAluno = data.volunteer?.isEstudanteUTFPR ? 'Sim' : 'Não';
  y = drawField(doc, 'Estudante UTFPR', isAluno, MARGIN_LEFT, y, CONTENT_WIDTH);

  if (data.volunteer?.isEstudanteUTFPR) {
    y = drawField(doc, 'Curso', data.volunteer?.curso || '', MARGIN_LEFT, y, CONTENT_WIDTH);
    y = drawTwoColumns(
      doc,
      'Período',
      data.volunteer?.periodo || '',
      'RA',
      data.volunteer?.ra || '',
      y,
    );
  }
  y += 1;


  y = drawSectionHeader(doc, 'V — SÍNTESE DAS ATIVIDADES', y);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');


  if (data.activities?.length > 0) {
    data.activities.forEach((act: { descricao: string }, index: number) => {
      y = addWrappedText(
        doc,
        `${index + 1}. ${act.descricao}`,
        MARGIN_LEFT + 2,
        y,
        CONTENT_WIDTH - 4,
        3.1,
      );
    });
  }
  y += 1;


  y = drawSectionHeader(doc, 'VI — CLÁUSULAS E CONDIÇÕES', y);


  const clausulas = [
    '1. O(a) voluntário(a) não poderá ser substituído(a) no desempenho de suas atividades;',
    '2. O(a) voluntário(a) não poderá atuar como responsável pela coordenação da ação de extensão;',
    '3. O(a) voluntário(a) declara ser conhecedor da Lei Federal N. 9.608, de 18 de fevereiro de 1998, especialmente de que o serviço voluntário não gera vínculo empregatício, nem obrigação de natureza trabalhista, previdenciária ou afim.',
    '4. O(a) Voluntário(a), estudante da UTFPR, contará com o seguro contra acidentes pessoais pago pela UTFPR, conforme dispositivo legal pertinente.',
    '5. A UTFPR não se responsabiliza por qualquer dano físico ou mental causado ao(à) estudante voluntário(a) na execução da ação de extensão.',
    '6. À coordenação da ação de extensão cabe supervisionar as atividades desenvolvidas pelo(a) voluntário(a), nos dias e horários previstos, e informar à DIREC sobre o cancelamento deste Termo, quando ocorrer, em até 03 dias.',
    '7. A UTFPR poderá cancelar ou suspender o vínculo com a atividade quando constatado que foram infringidas quaisquer das condições constantes deste termo e das normas aplicáveis ao Edital respectivo.',
    '8. O(a) voluntário(a) e a coordenação da ação de Extensão comprometem-se a cumprir as condições expressas neste instrumento e as normas que lhe são aplicáveis.',
  ];


  y = drawClausesBox(doc, y, clausulas);
  y = drawSignatureBlock(doc, y);
  drawFooter(doc);


  return doc.output('blob');
}




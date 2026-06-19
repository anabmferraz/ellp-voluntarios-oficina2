import { generateVolunteerTerm } from '../../lib/services/documentService';

const mockAddPage = jest.fn();
let mockTextLines = ['linha 1'];

jest.mock('jspdf', () => {
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      setFontSize: jest.fn(),
      setFont: jest.fn(),
      text: jest.fn(),
      splitTextToSize: jest.fn(() => mockTextLines),
      addPage: mockAddPage,
      setLineWidth: jest.fn(),
      line: jest.fn(),
      output: jest.fn().mockReturnValue('mock-blob'),
      setFillColor: jest.fn(),
      setTextColor: jest.fn(),
      setDrawColor: jest.fn(),
      rect: jest.fn(),
      roundedRect: jest.fn(),
    })),
  };
});

describe('Serviço de Documentos (documentService)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTextLines = ['linha 1']; 
  });

  it('deve gerar o termo com dados vazios (cobre ramificações de fallback)', () => {
    const blob = generateVolunteerTerm({});
    expect(blob).toBe('mock-blob');
  });

  it('deve gerar o termo com todos os dados preenchidos e ser estudante (cobre ramificações reais)', () => {
    const dadosCompletos = {
      project: { titulo: 'Projeto ELLP', vigenciaInicio: '2026', vigenciaFim: '2027' },
      coordinator: { nome: 'Prof. Antonio', email: 'antonio@utfpr.edu.br' },
      volunteer: { 
        nomeCompleto: 'Anny Costa', cpf: '123.456', isEstudanteUTFPR: true, 
        curso: 'Engenharia de Software', ra: '123456', email: 'anny@teste.com' 
      },
      activities: [{ descricao: 'Desenvolvimento', dataInicio: '01/01', dataFim: '02/02', horas: 10 }]
    };

    const blob = generateVolunteerTerm(dadosCompletos);
    expect(blob).toBe('mock-blob');
  });

  it('deve acionar a quebra de página DENTRO do loop de cláusulas (Y > 280)', () => {
    mockTextLines = new Array(70).fill('Texto longo');
    generateVolunteerTerm({});
    expect(mockAddPage).toHaveBeenCalled(); 
  });

  it('deve acionar a quebra de página APENAS na assinatura final (Y > 250)', () => {
    mockTextLines = ['linha 1']; 
    const atividades = Array(20).fill({ descricao: 'Teste', dataInicio: '01', dataFim: '02', horas: 1 });
    
    generateVolunteerTerm({ activities: atividades });
    expect(mockAddPage).toHaveBeenCalled();
  });
});
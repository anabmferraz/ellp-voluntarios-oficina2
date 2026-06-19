import { GET, POST } from '../../app/api/voluntarios/route';
import { db } from '../../lib/firebase-admin';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({
      status: init?.status || 200,
      json: async () => body,
    }),
  },
}));

jest.mock('../../lib/firebase-admin', () => ({
  db: { collection: jest.fn() },
}));

describe('Rotas da API de Voluntários (/api/voluntarios)', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('GET: deve retornar a lista de voluntários com status 200', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      docs: [{ id: 'vol1', data: () => ({ nome: 'Anny Costa' }) }],
    });
    (db.collection as jest.Mock).mockReturnValue({ get: mockGet });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json[0].nome).toBe('Anny Costa');
  });

  it('GET: deve retornar status 500 se ocorrer um erro no banco', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Erro simulado'));
    (db.collection as jest.Mock).mockReturnValue({ get: mockGet });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBeDefined();
  });

  it('POST: deve criar um novo voluntário e retornar status 201', async () => {
    const mockAdd = jest.fn().mockResolvedValue({ id: 'novo_vol_123' });
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = {
      json: async () => ({ nome: 'João Teste', email: 'joao@teste.com' })
    } as any;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.id).toBe('novo_vol_123');
  });

  it('POST: deve retornar status 500 se ocorrer um erro ao gravar', async () => {
    const mockAdd = jest.fn().mockRejectedValue(new Error('Erro gravação'));
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = { json: async () => ({ nome: 'Erro' }) } as any;
    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBeDefined();
  });

  it('POST: deve retornar erro 400 se aluno_utfpr não enviar RA ou Curso (linhas 23-27)', async () => {
    const mockRequest = {
      json: async () => ({ 
        nome: 'Aluno Teste', 
        tipo: 'aluno_utfpr' 
      })
    } as any;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe('RA e Curso são obrigatórios para alunos.');
    expect(db.collection).not.toHaveBeenCalled(); 
  });

  it('POST: deve retornar erro 400 se aluno_utfpr enviar RA mas faltar Curso (linha 22)', async () => {
    const mockRequest = {
      json: async () => ({ 
        nome: 'Aluno Quase Certo', 
        tipo: 'aluno_utfpr',
        ra: '1234567' 
      })
    } as any;

    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
  });

  it('POST: deve ignorar a validação de RA/Curso se não for aluno_utfpr (linha 22)', async () => {
    const mockAdd = jest.fn().mockResolvedValue({ id: 'vol_comunidade_123' });
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = {
      json: async () => ({ 
        nome: 'Voluntário Externo', 
        tipo: 'comunidade' 
      })
    } as any;

    const response = await POST(mockRequest);
    expect(response.status).toBe(201);
  });
});
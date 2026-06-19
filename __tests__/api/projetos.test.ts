import { GET, POST } from '../../app/api/projetos/route';
import { db } from '../../lib/firebase-admin';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => {
      return {
        status: init?.status || 200,
        json: async () => body,
      };
    },
  },
}));

jest.mock('../../lib/firebase-admin', () => ({
  db: {
    collection: jest.fn(),
  },
}));

describe('Rotas da API de Projetos (/api/projetos)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET: deve retornar a lista de projetos com status 200', async () => {
    const mockProjetos = [{ id: 'proj1', titulo: 'ELLP Lógica' }];
    const mockGet = jest.fn().mockResolvedValue({
      docs: mockProjetos.map(proj => ({
        id: proj.id,
        data: () => proj,
      })),
    });
    (db.collection as jest.Mock).mockReturnValue({ get: mockGet });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toHaveLength(1);
    expect(json[0].titulo).toBe('ELLP Lógica');
  });

  it('POST: deve criar um novo projeto e retornar status 201', async () => {
    const mockAdd = jest.fn().mockResolvedValue({ id: 'novo_id_123' });
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = {
      json: async () => ({
        titulo: 'Oficina de Testes',
        vigenciaInicio: '2026-05-01',
        vigenciaFim: '2026-07-01'
      })
    } as any;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.id).toBe('novo_id_123');
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  it('POST: deve bloquear criação com datas inválidas (status 400)', async () => {
    const mockRequest = {
      json: async () => ({
        titulo: 'Projeto Falho',
        vigenciaInicio: '2026-10-01',
        vigenciaFim: '2026-01-01' 
      })
    } as any;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBeDefined();
    expect(db.collection).not.toHaveBeenCalled(); 
  });

  it('GET: deve retornar status 500 se ocorrer um erro no banco', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Erro simulado no banco'));
    (db.collection as jest.Mock).mockReturnValue({ get: mockGet });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBeDefined();
  });

  it('POST: deve retornar status 500 se ocorrer um erro ao gravar', async () => {
    const mockAdd = jest.fn().mockRejectedValue(new Error('Erro de gravação simulado'));
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = {
      json: async () => ({
        titulo: 'Projeto Falha 500',
        vigenciaInicio: '2026-05-01',
        vigenciaFim: '2026-07-01'
      })
    } as any;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBeDefined();
  });
});
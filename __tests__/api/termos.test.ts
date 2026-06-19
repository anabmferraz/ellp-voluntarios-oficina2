import { GET, POST } from '../../app/api/termos/route';
import { db } from '../../lib/firebase-admin';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({
      status: init?.status || 200,
      json: async () => body,
    }),
  },
}));

const mockCollection = jest.fn();
jest.mock('../../lib/firebase-admin', () => ({
  db: { collection: (...args: any[]) => mockCollection(...args) },
}));

describe('Rotas da API de Termos (/api/termos)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCollection.mockReturnValue({ get: jest.fn(), add: jest.fn() });
  });

  it('GET: deve retornar a lista de termos com status 200', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      docs: [{ id: 'termo1', data: () => ({ status: 'Gerado' }) }],
    });
    mockCollection.mockReturnValue({ get: mockGet });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json[0].status).toBe('Gerado');
  });

  it('GET: deve retornar 500 em caso de erro no banco', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Erro DB'));
    mockCollection.mockReturnValue({ get: mockGet });

    const response = await GET();
    expect(response.status).toBe(500);
  });

  it('POST: deve criar um termo com os atributos padrão e retornar 201', async () => {
    const mockAdd = jest.fn().mockResolvedValue({ id: 'novo_termo_123' });
    mockCollection.mockReturnValue({ add: mockAdd });

    const mockRequest = { json: async () => ({ voluntarioId: '123' }) } as any;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.status).toBe('Gerado');
    expect(json.dataAceite).toBeNull();
    expect(mockAdd).toHaveBeenCalled();
  });

  it('POST: deve retornar 500 em caso de erro na gravação', async () => {
    const mockAdd = jest.fn().mockRejectedValue(new Error('Falha'));
    mockCollection.mockReturnValue({ add: mockAdd });

    const mockRequest = { json: async () => ({}) } as any;
    const response = await POST(mockRequest);
    expect(response.status).toBe(500);
  });
});
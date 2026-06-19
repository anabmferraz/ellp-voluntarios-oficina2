import { GET, POST } from '../../app/api/vinculos/route';
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

jest.mock('../../lib/services/activityService', () => ({
  validateActivityPeriod: jest.fn((data) => {
    if (data.dataInicio === 'erro') return { isValid: false, errors: ['Data inválida'] };
    return { isValid: true, errors: [] };
  })
}));

describe('Rotas da API de Vínculos (/api/vinculos)', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('GET: deve retornar a lista de vínculos com status 200', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      docs: [{ id: 'vinc1', data: () => ({ voluntarioId: '123' }) }],
    });
    (db.collection as jest.Mock).mockReturnValue({ get: mockGet });

    const response = await GET();
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json[0].voluntarioId).toBe('123');
  });

  it('GET: deve retornar status 500 no erro', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Erro DB'));
    (db.collection as jest.Mock).mockReturnValue({ get: mockGet });

    const response = await GET();
    expect(response.status).toBe(500);
  });

  it('POST: deve criar um vínculo válido (201)', async () => {
    const mockAdd = jest.fn().mockResolvedValue({ id: 'vinc_123' });
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = {
      json: async () => ({ dataInicio: '2026-01-01' }) 
    } as any;

    const response = await POST(mockRequest);
    expect(response.status).toBe(201);
  });

  it('POST: deve bloquear vínculo com datas inválidas (400)', async () => {
    const mockRequest = {
      json: async () => ({ dataInicio: 'erro' }) 
    } as any;

    const response = await POST(mockRequest);
    expect(response.status).toBe(400);
    expect(db.collection).not.toHaveBeenCalled(); 
  });

  it('POST: deve retornar 500 se o banco falhar na gravação', async () => {
    const mockAdd = jest.fn().mockRejectedValue(new Error('Falha'));
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = { json: async () => ({ dataInicio: 'valido' }) } as any;
    const response = await POST(mockRequest);
    expect(response.status).toBe(500);
  });
});
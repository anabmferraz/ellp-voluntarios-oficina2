import { GET, PUT, DELETE } from '../../app/api/vinculos/[id]/route';
import { db } from '../../lib/firebase-admin';

jest.mock('next/server', () => ({
  NextResponse: { json: (body: any, init?: any) => ({ status: init?.status || 200, json: async () => body }) },
}));

const mockDoc = jest.fn();
jest.mock('../../lib/firebase-admin', () => ({
  db: { collection: jest.fn(() => ({ doc: mockDoc })) },
}));

jest.mock('../../lib/services/activityService', () => ({
  validateActivityPeriod: jest.fn((data) => {
    if (data.dataInicio === 'invalido') return { isValid: false, errors: ['Erro'] };
    return { isValid: true, errors: [] };
  })
}));

describe('Rotas Dinâmicas de Vínculos (/api/vinculos/[id])', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  const mockParams = { params: Promise.resolve({ id: 'vinc_123' }) };

  it('GET: 200', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true, id: '123', data: () => ({}) }) });
    expect((await GET({} as Request, mockParams as any)).status).toBe(200);
  });

  it('GET: 404', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    expect((await GET({} as Request, mockParams as any)).status).toBe(404);
  });

  it('GET: 500', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockRejectedValue(new Error('Erro')) });
    expect((await GET({} as Request, mockParams as any)).status).toBe(500);
  });

  it('PUT: deve retornar 200 com datas válidas', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), update: jest.fn() });
    expect((await PUT({ json: async () => ({ dataInicio: 'valido' }) } as Request, mockParams as any)).status).toBe(200);
  });

  it('PUT: deve retornar 400 se a validação falhar', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }) });
    expect((await PUT({ json: async () => ({ dataInicio: 'invalido' }) } as Request, mockParams as any)).status).toBe(400);
  });

  it('PUT: 404', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    expect((await PUT({ json: async () => ({ dataInicio: 'valido' }) } as Request, mockParams as any)).status).toBe(404);
  });

  it('PUT: 500', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), update: jest.fn().mockRejectedValue(new Error('Erro')) });
    expect((await PUT({ json: async () => ({ dataInicio: 'valido' }) } as Request, mockParams as any)).status).toBe(500);
  });

  it('DELETE: 200', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), delete: jest.fn() });
    expect((await DELETE({} as Request, mockParams as any)).status).toBe(200);
  });

  it('DELETE: 404', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    expect((await DELETE({} as Request, mockParams as any)).status).toBe(404);
  });

  it('DELETE: 500', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), delete: jest.fn().mockRejectedValue(new Error('Erro')) });
    expect((await DELETE({} as Request, mockParams as any)).status).toBe(500);
  });
});
import { GET, PUT, DELETE } from '../../app/api/projetos/[id]/route';
import { db } from '../../lib/firebase-admin';

jest.mock('next/server', () => ({
  NextResponse: { json: (body: any, init?: any) => ({ status: init?.status || 200, json: async () => body }) },
}));

const mockDoc = jest.fn();
jest.mock('../../lib/firebase-admin', () => ({
  db: { collection: jest.fn(() => ({ doc: mockDoc })) },
}));

jest.mock('../../lib/services/projectService', () => ({
  validateProjectPeriod: jest.fn((data) => {
    if (data.titulo === 'invalido') return { isValid: false, errors: ['Erro de data'] };
    return { isValid: true, errors: [] };
  })
}));

describe('Rotas Dinâmicas de Projetos (/api/projetos/[id])', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  const mockParams = { params: Promise.resolve({ id: 'proj_123' }) };

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
    expect((await PUT({ json: async () => ({ titulo: 'valido' }) } as Request, mockParams as any)).status).toBe(200);
  });

  it('PUT: deve retornar 400 se a validação falhar', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }) });
    expect((await PUT({ json: async () => ({ titulo: 'invalido' }) } as Request, mockParams as any)).status).toBe(400);
  });

  it('PUT: 404', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    expect((await PUT({ json: async () => ({ titulo: 'valido' }) } as Request, mockParams as any)).status).toBe(404);
  });

  it('PUT: 500', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), update: jest.fn().mockRejectedValue(new Error('Erro')) });
    expect((await PUT({ json: async () => ({ titulo: 'valido' }) } as Request, mockParams as any)).status).toBe(500);
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
import { GET, PUT, DELETE } from '../../app/api/voluntarios/[id]/routes'; 
import { db } from '../../lib/firebase-admin';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({ status: init?.status || 200, json: async () => body }),
  },
}));

const mockDoc = jest.fn();
jest.mock('../../lib/firebase-admin', () => ({
  db: { collection: jest.fn(() => ({ doc: mockDoc })) },
}));

describe('Rotas Dinâmicas de Voluntários (/api/voluntarios/[id])', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  const mockParams = { params: Promise.resolve({ id: 'vol_123' }) };

  it('GET: deve retornar 200 se o voluntário existir', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true, id: 'vol_123', data: () => ({ nome: 'Teste' }) }) });
    const response = await GET({} as Request, mockParams as any);
    expect(response.status).toBe(200);
  });

  it('GET: deve retornar 404 se não existir', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    const response = await GET({} as Request, mockParams as any);
    expect(response.status).toBe(404);
  });

  it('GET: deve retornar 500 em erro', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockRejectedValue(new Error('Erro')) });
    const response = await GET({} as Request, mockParams as any);
    expect(response.status).toBe(500);
  });

  it('PUT: deve retornar 200 ao atualizar', async () => {
    const mockUpdate = jest.fn();
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), update: mockUpdate });
    const response = await PUT({ json: async () => ({ nome: 'Novo' }) } as Request, mockParams as any);
    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('PUT: deve retornar 404 ao atualizar voluntário inexistente', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    const response = await PUT({ json: async () => ({}) } as Request, mockParams as any);
    expect(response.status).toBe(404);
  });

  it('PUT: deve retornar 500 em erro na atualização', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), update: jest.fn().mockRejectedValue(new Error('Erro')) });
    const response = await PUT({ json: async () => ({}) } as Request, mockParams as any);
    expect(response.status).toBe(500);
  });

  it('DELETE: deve retornar 200 ao eliminar', async () => {
    const mockDelete = jest.fn();
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), delete: mockDelete });
    const response = await DELETE({} as Request, mockParams as any);
    expect(response.status).toBe(200);
    expect(mockDelete).toHaveBeenCalled();
  });

  it('DELETE: deve retornar 404 ao eliminar voluntário inexistente', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    const response = await DELETE({} as Request, mockParams as any);
    expect(response.status).toBe(404);
  });

  it('DELETE: deve retornar 500 em erro', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), delete: jest.fn().mockRejectedValue(new Error('Erro')) });
    const response = await DELETE({} as Request, mockParams as any);
    expect(response.status).toBe(500);
  });
});
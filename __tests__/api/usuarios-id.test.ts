import { GET, PUT, DELETE } from '../../app/api/usuarios/[id]/route';
import { db } from '../../lib/firebase-admin';

jest.mock('next/server', () => ({
  NextResponse: { json: (body: any, init?: any) => ({ status: init?.status || 200, json: async () => body }) },
}));

const mockDoc = jest.fn();
jest.mock('../../lib/firebase-admin', () => ({
  db: { collection: jest.fn(() => ({ doc: mockDoc })) },
}));

describe('Rotas Dinâmicas de Usuários (/api/usuarios/[id])', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  const mockParams = { params: Promise.resolve({ id: 'usr_123' }) };

  it('GET: 200', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true, id: '123', data: () => ({}) }) });
    const response = await GET({} as Request, mockParams as any);
    expect(response.status).toBe(200);
  });

  it('GET: 404', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    const response = await GET({} as Request, mockParams as any);
    expect(response.status).toBe(404);
  });

  it('GET: 500', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockRejectedValue(new Error('Erro')) });
    const response = await GET({} as Request, mockParams as any);
    expect(response.status).toBe(500);
  });

  it('PUT: deve anular voluntarioId se o perfil for admin (200)', async () => {
    const mockUpdate = jest.fn();
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), update: mockUpdate });
    const response = await PUT({ json: async () => ({ perfil: 'admin', voluntarioId: 'id' }) } as Request, mockParams as any);
    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ voluntarioId: null }));
  });

  it('PUT: 404', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    const response = await PUT({ json: async () => ({}) } as Request, mockParams as any);
    expect(response.status).toBe(404);
  });

  it('PUT: 500', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), update: jest.fn().mockRejectedValue(new Error('Erro')) });
    const response = await PUT({ json: async () => ({}) } as Request, mockParams as any);
    expect(response.status).toBe(500);
  });

  it('DELETE: 200', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), delete: jest.fn() });
    const response = await DELETE({} as Request, mockParams as any);
    expect(response.status).toBe(200);
  });

  it('DELETE: 404', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    const response = await DELETE({} as Request, mockParams as any);
    expect(response.status).toBe(404);
  });

  it('DELETE: 500', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: true }), delete: jest.fn().mockRejectedValue(new Error('Erro')) });
    const response = await DELETE({} as Request, mockParams as any);
    expect(response.status).toBe(500);
  });
});
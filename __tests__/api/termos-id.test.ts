import { GET, PUT, DELETE } from '../../app/api/termos/[id]/route';
import { db } from '../../lib/firebase-admin';

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, init?: any) => ({
      status: init?.status || 200,
      json: async () => body,
    }),
  },
}));

const mockDoc = jest.fn();
jest.mock('../../lib/firebase-admin', () => ({
  db: { collection: jest.fn(() => ({ doc: mockDoc })) },
}));

describe('Rotas Dinâmicas de Termos (/api/termos/[id])', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  const mockParams = { params: Promise.resolve({ id: 'termo_123' }) };

  it('GET: deve retornar 200 se o termo existir', async () => {
    mockDoc.mockReturnValue({
      get: jest.fn().mockResolvedValue({ exists: true, id: 'termo_123', data: () => ({ status: 'Aceito' }) })
    });
    
    const response = await GET({} as Request, mockParams as any);
    const json = await response.json();
    expect(response.status).toBe(200);
    expect(json.status).toBe('Aceito');
  });

  it('GET: deve retornar 404 se o termo não existir', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    const response = await GET({} as Request, mockParams as any);
    expect(response.status).toBe(404);
  });

  it('GET: deve retornar 500 em caso de erro no banco', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockRejectedValue(new Error('Erro')) });
    const response = await GET({} as Request, mockParams as any);
    expect(response.status).toBe(500);
  });

  it('PUT: deve retornar 200 e atualizar se o termo existir', async () => {
    const mockUpdate = jest.fn();
    mockDoc.mockReturnValue({
      get: jest.fn().mockResolvedValue({ exists: true }),
      update: mockUpdate
    });
    
    const request = { json: async () => ({ status: 'Aceito' }) } as Request;
    const response = await PUT(request, mockParams as any);
    
    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('PUT: deve retornar 404 se tentar atualizar termo inexistente', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    const request = { json: async () => ({}) } as Request;
    const response = await PUT(request, mockParams as any);
    expect(response.status).toBe(404);
  });

  it('PUT: deve retornar 500 em caso de erro na atualização', async () => {
    mockDoc.mockReturnValue({
      get: jest.fn().mockResolvedValue({ exists: true }),
      update: jest.fn().mockRejectedValue(new Error('Erro'))
    });
    const request = { json: async () => ({}) } as Request;
    const response = await PUT(request, mockParams as any);
    expect(response.status).toBe(500);
  });

  it('DELETE: deve retornar 200 e eliminar se o termo existir', async () => {
    const mockDelete = jest.fn();
    mockDoc.mockReturnValue({
      get: jest.fn().mockResolvedValue({ exists: true }),
      delete: mockDelete
    });
    
    const response = await DELETE({} as Request, mockParams as any);
    expect(response.status).toBe(200);
    expect(mockDelete).toHaveBeenCalled();
  });

  it('DELETE: deve retornar 404 se tentar eliminar termo inexistente', async () => {
    mockDoc.mockReturnValue({ get: jest.fn().mockResolvedValue({ exists: false }) });
    const response = await DELETE({} as Request, mockParams as any);
    expect(response.status).toBe(404);
  });

  it('DELETE: deve retornar 500 em caso de erro na eliminação', async () => {
    mockDoc.mockReturnValue({
      get: jest.fn().mockResolvedValue({ exists: true }),
      delete: jest.fn().mockRejectedValue(new Error('Erro'))
    });
    const response = await DELETE({} as Request, mockParams as any);
    expect(response.status).toBe(500);
  });
});
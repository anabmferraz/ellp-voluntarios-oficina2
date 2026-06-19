import { GET, POST } from '../../app/api/usuarios/route';
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

describe('Rotas da API de Usuários (/api/usuarios)', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('GET: deve retornar a lista de usuários com status 200', async () => {
    const mockGet = jest.fn().mockResolvedValue({
      docs: [{ id: 'usr1', data: () => ({ email: 'admin@ellp.com', perfil: 'admin' }) }],
    });
    (db.collection as jest.Mock).mockReturnValue({ get: mockGet });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json[0].perfil).toBe('admin');
  });

  it('GET: deve retornar status 500 se ocorrer erro no banco', async () => {
    const mockGet = jest.fn().mockRejectedValue(new Error('Erro DB'));
    (db.collection as jest.Mock).mockReturnValue({ get: mockGet });

    const response = await GET();
    expect(response.status).toBe(500);
  });

  it('POST: deve criar um usuário e retornar status 201', async () => {
    const mockAdd = jest.fn().mockResolvedValue({ id: 'usr_123' });
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = {
      json: async () => ({ email: 'novo@ellp.com', perfil: 'voluntario' })
    } as any;

    const response = await POST(mockRequest);
    expect(response.status).toBe(201);
  });

  it('POST: deve retornar status 500 se a gravação falhar', async () => {
    const mockAdd = jest.fn().mockRejectedValue(new Error('Falha'));
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = { json: async () => ({}) } as any;
    const response = await POST(mockRequest);
    expect(response.status).toBe(500);
  });

  it('POST: deve anular voluntarioId se o perfil for admin (linhas 22-23)', async () => {
    const mockAdd = jest.fn().mockResolvedValue({ id: 'usr_admin_123' });
    (db.collection as jest.Mock).mockReturnValue({ add: mockAdd });

    const mockRequest = {
      json: async () => ({ email: 'admin2@ellp.com', perfil: 'admin', voluntarioId: 'id_qualquer' })
    } as any;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.voluntarioId).toBeNull(); 
  });

  it('POST: deve usar set() em vez de add() se o uid for fornecido (linhas 31-32)', async () => {
    const mockSet = jest.fn().mockResolvedValue(true);
    const mockDoc = jest.fn().mockReturnValue({ set: mockSet });
    (db.collection as jest.Mock).mockReturnValue({ doc: mockDoc });

    const mockRequest = {
      json: async () => ({ uid: 'uid_firebase_personalizado', email: 'user@ellp.com' })
    } as any;

    const response = await POST(mockRequest);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.id).toBe('uid_firebase_personalizado');
    expect(mockDoc).toHaveBeenCalledWith('uid_firebase_personalizado');
    expect(mockSet).toHaveBeenCalled();
  });
});
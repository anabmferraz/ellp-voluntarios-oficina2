import { canAccessVolunteerData } from '../../lib/services/authService';

describe('Serviço de Autenticação (authService)', () => {
  it('deve permitir acesso irrestrito se o perfil for admin', () => {
    expect(canAccessVolunteerData('admin', 'user123', 'qualquer_alvo')).toBe(true);
  });

  it('deve permitir acesso se o voluntário estiver a aceder aos seus próprios dados', () => {
    expect(canAccessVolunteerData('voluntario', 'meu_id_123', 'meu_id_123')).toBe(true);
  });

  it('deve negar acesso se um voluntário tentar aceder aos dados de outro', () => {
    expect(canAccessVolunteerData('voluntario', 'meu_id_123', 'id_de_outro')).toBe(false);
  });
});
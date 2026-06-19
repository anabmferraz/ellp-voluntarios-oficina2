import { validateVolunteer, shouldInactivateVolunteer } from '../../lib/services/volunteerService';

describe('Serviço de Voluntários (volunteerService)', () => {
  it('deve rejeitar voluntário sem nome ou CPF', () => {
    const resultado = validateVolunteer({} as any);
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContain('O nome completo é obrigatório.');
    expect(resultado.errors).toContain('O CPF é obrigatório.');
  });

  it('deve aprovar pessoa da comunidade (sem dados da UTFPR)', () => {
    const resultado = validateVolunteer({
      nomeCompleto: 'Teste Silva', cpf: '12345678901', dataNascimento: '1990-01-01',
      nacionalidade: 'Brasileira', endereco: 'Rua A, 1', cidade: 'Cornélio Procópio',
      estado: 'PR', telefone: '43999999999', email: 'teste@email.com', isEstudanteUTFPR: false,
    } as any);
    expect(resultado.isValid).toBe(true);
  });

  it('deve exigir curso, RA e período para estudantes da UTFPR', () => {
    const resultado = validateVolunteer({ nomeCompleto: 'Teste', cpf: '123', isEstudanteUTFPR: true } as any);
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContain('O curso é obrigatório para estudantes da UTFPR.');
    expect(resultado.errors).toContain('O RA é obrigatório para estudantes da UTFPR.');
    expect(resultado.errors).toContain('O período é obrigatório para estudantes da UTFPR.');
  });

  it('deve aprovar estudante da UTFPR com todos os dados preenchidos', () => {
    const resultado = validateVolunteer({
      nomeCompleto: 'Teste Silva', cpf: '12345678901', dataNascimento: '2000-05-10',
      nacionalidade: 'Brasileira', endereco: 'Rua B, 2', cidade: 'Cornélio Procópio',
      estado: 'PR', telefone: '43988888888', email: 'teste@utfpr.edu.br',
      isEstudanteUTFPR: true, curso: 'Eng. Software', ra: '1234567', periodo: '7º',
    } as any);
    expect(resultado.isValid).toBe(true);
  });

  describe('Verificação de Inativação (shouldInactivateVolunteer)', () => {
    it('deve retornar false se o voluntário não tiver data de saída', () => {
      expect(shouldInactivateVolunteer(undefined)).toBe(false);
    });

    it('deve retornar true se a data de saída for igual a hoje ou no passado', () => {
      const hoje = new Date();
      const mesPassado = new Date();
      mesPassado.setMonth(hoje.getMonth() - 1);

      expect(shouldInactivateVolunteer(hoje.toISOString())).toBe(true);
      expect(shouldInactivateVolunteer(mesPassado.toISOString())).toBe(true);
    });

    it('deve retornar false se a data de saída ainda estiver no futuro', () => {
      const mesQueVem = new Date();
      mesQueVem.setMonth(mesQueVem.getMonth() + 1);

      expect(shouldInactivateVolunteer(mesQueVem.toISOString())).toBe(false);
    });
  });
});
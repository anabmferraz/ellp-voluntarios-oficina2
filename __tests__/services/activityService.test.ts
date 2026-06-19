import { validateActivityPeriod, calculateTotalHours } from '../../lib/services/activityService';

describe('Serviço de Atividades (activityService)', () => {
  it('deve rejeitar se as datas forem inválidas (ex: texto em vez de data)', () => {
    const resultado = validateActivityPeriod({ dataInicio: 'invalido', dataFim: 'tambem-invalido' } as any);
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContain('As datas de início e fim devem ser válidas.');
  });

  it('deve rejeitar se a data de início for posterior à de fim', () => {
    const resultado = validateActivityPeriod({ dataInicio: '2026-12-01', dataFim: '2026-01-01' } as any);
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContain('A data de início não pode ser posterior à data de fim.');
  });

  it('deve aceitar datas válidas', () => {
    const resultado = validateActivityPeriod({ dataInicio: '2026-01-01', dataFim: '2026-12-31' } as any);
    expect(resultado.isValid).toBe(true);
    expect(resultado.errors.length).toBe(0);
  });

  it('deve calcular a soma total de horas com sucesso, mesmo se faltarem horas em alguma atividade', () => {
    const atividades = [
      { horas: 10 },
      { horas: undefined }, 
      { horas: 5 }
    ];
    const total = calculateTotalHours(atividades as any);
    expect(total).toBe(15);
  });
});
import { isProjectActive, validateProjectPeriod } from '../../lib/services/projectService';

describe('Serviço de Projetos (projectService)', () => {
  it('deve aceitar um projeto com datas de vigência válidas', () => {
    const dadosProjeto = { vigenciaInicio: '2026-01-01', vigenciaFim: '2026-12-31' };
    const resultado = validateProjectPeriod(dadosProjeto as any);
    
    expect(resultado.isValid).toBe(true);
    expect(resultado.errors.length).toBe(0);
  });

  it('deve rejeitar um projeto se a data de fim for anterior à data de início', () => {
    const dadosProjeto = { vigenciaInicio: '2026-12-31', vigenciaFim: '2026-01-01' };
    const resultado = validateProjectPeriod(dadosProjeto as any);
    
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContain('A data de início da vigência não pode ser posterior ao término.');
  });

  it('deve rejeitar se os campos de data estiverem vazios', () => {
    const dadosProjeto = { vigenciaInicio: '', vigenciaFim: '' };
    const resultado = validateProjectPeriod(dadosProjeto as any);
    
    expect(resultado.isValid).toBe(false);
    expect(resultado.errors).toContain('As datas de início e fim são obrigatórias.');
  });

  describe('Função isProjectActive', () => {
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    it('deve retornar true se o projeto estiver ativo hoje (entre inicio e fim)', () => {
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(hoje.getDate() - 1);
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);

        const projetoAtivo = {
        vigenciaInicio: formatDate(ontem),
        vigenciaFim: formatDate(amanha)
        };

        expect(isProjectActive(projetoAtivo as any)).toBe(true);
    });

    it('deve retornar true se o projeto começar exatamente hoje', () => {
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);

        const projetoComecaHoje = {
        vigenciaInicio: formatDate(hoje),
        vigenciaFim: formatDate(amanha)
        };

        expect(isProjectActive(projetoComecaHoje as any)).toBe(true);
    });

    it('deve retornar false se o projeto já terminou (data fim no passado)', () => {
        const hoje = new Date();
        const mesPassado = new Date(hoje);
        mesPassado.setMonth(hoje.getMonth() - 1);
        const ontem = new Date(hoje);
        ontem.setDate(hoje.getDate() - 1);

        const projetoEncerrado = {
        vigenciaInicio: formatDate(mesPassado),
        vigenciaFim: formatDate(ontem)
        };

        expect(isProjectActive(projetoEncerrado as any)).toBe(false);
    });

    it('deve retornar false se o projeto ainda não começou (data inicio no futuro)', () => {
        const hoje = new Date();
        const amanha = new Date(hoje);
        amanha.setDate(hoje.getDate() + 1);
        const mesQueVem = new Date(hoje);
        mesQueVem.setMonth(hoje.getMonth() + 1);

        const projetoFuturo = {
        vigenciaInicio: formatDate(amanha),
        vigenciaFim: formatDate(mesQueVem)
        };

        expect(isProjectActive(projetoFuturo as any)).toBe(false);
    });
  });
});
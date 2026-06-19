'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { TermData, Volunteer } from '../types';
import { validateVolunteer, validatePdfUpload } from '../lib/services/volunteerService';
import { generateVolunteerTerm } from '../lib/services/documentService';

const DEFAULT_ACTIVITIES: TermData['activities'] = [
  {
    descricao:
      'Preparação do conteúdo, definição de cronograma e organização dos materiais didáticos.',
    dataInicio: '2025-03-01',
    dataFim: '2025-12-15',
    horas: 40,
  },
  {
    descricao:
      'Realização de atividades voltadas ao desenvolvimento do raciocínio lógico com estudantes do ensino público.',
    dataInicio: '2025-03-01',
    dataFim: '2025-12-15',
    horas: 80,
  },
  {
    descricao:
      'Ensino de conceitos básicos de programação por meio de atividades práticas e lúdicas.',
    dataInicio: '2025-03-01',
    dataFim: '2025-12-15',
    horas: 80,
  },
  {
    descricao:
      'Criação e atualização de apresentações, exercícios, apostilas e recursos de apoio para as oficinas.',
    dataInicio: '2025-03-01',
    dataFim: '2025-12-15',
    horas: 40,
  },
  {
    descricao:
      'Atividades administrativas, reuniões de equipe, controle de documentação e acompanhamento dos voluntários.',
    dataInicio: '2025-03-01',
    dataFim: '2025-12-15',
    horas: 30,
  },
  {
    descricao:
      'Divulgação das atividades do projeto, contato com escolas e promoção da aproximação entre a universidade e a comunidade.',
    dataInicio: '2025-03-01',
    dataFim: '2025-12-15',
    horas: 20,
  },
];

const DEFAULT_TERM_DATA: TermData = {
  volunteer: {
    nomeCompleto: '',
    dataNascimento: '',
    cpf: '',
    nacionalidade: '',
    endereco: '',
    cidade: '',
    estado: '',
    telefone: '',
    email: '',
    isEstudanteUTFPR: false,
    status: 'ativo',
    dataEntrada: '',
  },
  project: {
    titulo: 'ELLP',
    modalidade: 'projeto',
    vigenciaInicio: '2025-03-01',
    vigenciaFim: '2025-12-15',
  },
  coordinator: {
    nome: 'Antonio Carlos Fernandes da Silva',
    departamento: 'DACOMP',
    cpf: '000.000.000-00',
    email: 'dacomp-cp@utfpr.edu.br',
    fone: '(43) 3322-8800',
  },
  activities: DEFAULT_ACTIVITIES,
};

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function updateVolunteerField<K extends keyof Volunteer>(
  volunteer: Volunteer,
  field: K,
  value: Volunteer[K],
): Volunteer {
  return { ...volunteer, [field]: value };
}

function normalizeVolunteer(volunteer: Volunteer): Volunteer {
  return {
    ...volunteer,
    nomeCompleto: volunteer.nomeCompleto.trim(),
    dataNascimento: volunteer.dataNascimento.trim(),
    cpf: volunteer.cpf.trim(),
    nacionalidade: volunteer.nacionalidade.trim(),
    endereco: volunteer.endereco.trim(),
    cidade: volunteer.cidade.trim(),
    estado: volunteer.estado.trim().toUpperCase(),
    telefone: volunteer.telefone.trim(),
    email: volunteer.email.trim(),
    curso: volunteer.curso?.trim() || undefined,
    periodo: volunteer.periodo?.trim() || undefined,
    ra: volunteer.ra?.trim() || undefined,
  };
}

function FieldLabel({
  id,
  children,
  required = true,
}: {
  id: string;
  children: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
      {children}
      {required && <span className="text-red-600"> *</span>}
    </label>
  );
}

export default function GeradorTermoVoluntario() {
  const [termData, setTermData] = useState<TermData>(DEFAULT_TERM_DATA);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadSent, setUploadSent] = useState(false);
  const [termoId, setTermoId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const volunteer = termData.volunteer;

  const handleVoltar = () => {
    window.location.href = '/membro';
  };

  const handleVolunteerChange = <K extends keyof Volunteer>(field: K, value: Volunteer[K]) => {
    setTermData((prev) => ({
      ...prev,
      volunteer: updateVolunteerField(prev.volunteer, field, value),
    }));
    setFormErrors([]);
  };

  const handleCpfChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleVolunteerChange('cpf', formatCPF(event.target.value));
  };

  const handleEstudanteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isEstudante = event.target.checked;
    setTermData((prev) => ({
      ...prev,
      volunteer: {
        ...prev.volunteer,
        isEstudanteUTFPR: isEstudante,
        curso: isEstudante ? prev.volunteer.curso ?? '' : undefined,
        periodo: isEstudante ? prev.volunteer.periodo ?? '' : undefined,
        ra: isEstudante ? prev.volunteer.ra ?? '' : undefined,
      },
    }));
    setFormErrors([]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadErrors([]);
    setUploadSuccess(false);
    setUploadSent(false);
    setSelectedFile(null);

    if (!file) return;

    const validation = validatePdfUpload(file);

    if (!validation.isValid) {
      setUploadErrors(validation.errors);
      return;
    }

    setSelectedFile(file);
    setUploadSuccess(true);
  };

  const handleUploadAssinado = async () => {
    if (!selectedFile || !termoId) return;

    setUploading(true);
    setUploadErrors([]);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch(`/api/termos/${termoId}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        setUploadErrors([err.error ?? 'Erro ao enviar o documento assinado.']);
        return;
      }

      setUploadSent(true);
    } catch {
      setUploadErrors(['Não foi possível enviar o documento. Tente novamente.']);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors([]);
    setApiError(null);

    const normalizedTermData: TermData = {
      ...termData,
      volunteer: normalizeVolunteer(termData.volunteer),
    };

    const validation = validateVolunteer(normalizedTermData.volunteer);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setTermData(normalizedTermData);
    setLoading(true);

    try {
      // 1. Salva voluntário no Firestore
      const volunteerRes = await fetch('/api/voluntarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...normalizedTermData.volunteer,
          dataEntrada: normalizedTermData.volunteer.dataEntrada || new Date().toISOString().split('T')[0],
          dataAceiteTermo: new Date().toISOString(),
        }),
      });

      if (!volunteerRes.ok) {
        const err = await volunteerRes.json();
        throw new Error(err.error ?? 'Erro ao salvar voluntário.');
      }

      const volunteerData = await volunteerRes.json();

      // 2. Salva registro do termo no Firestore
      const termoRes = await fetch('/api/termos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voluntarioId: volunteerData.id,
          nomeVoluntario: normalizedTermData.volunteer.nomeCompleto,
          projeto: normalizedTermData.project,
          coordenador: normalizedTermData.coordinator,
          atividades: normalizedTermData.activities,
        }),
      });

      if (!termoRes.ok) {
        const err = await termoRes.json();
        throw new Error(err.error ?? 'Erro ao registrar termo.');
      }

      const termoData = await termoRes.json();
      setTermoId(termoData.id);

      // 3. Gera o PDF localmente e faz download
      const blob = generateVolunteerTerm(normalizedTermData);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Termo_Voluntariado_${normalizedTermData.volunteer.nomeCompleto}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível gerar o termo. Tente novamente.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-[#0071AF] focus:outline-none focus:ring-1 focus:ring-[#0071AF]';

  return (
    <div className="min-h-screen bg-[#F3F3F3] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={handleVoltar}
          className="mb-4 text-sm font-medium text-[#0071AF] underline-offset-2 hover:underline"
        >
          Voltar ao Painel
        </button>

        <div className="rounded-lg bg-white shadow-md border-t-4 border-[#0071AF]">
          <div className="px-6 py-8 sm:px-10">
            <header className="mb-8 border-b border-gray-200 pb-6">
              <h1 className="text-2xl font-bold text-[#0071AF] sm:text-3xl">
                Termo de Adesão para Voluntário(a) — Projeto ELLP
              </h1>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Ambiente autenticado e seguro. Preencha seus dados cadastrais abaixo para
                conferência e, após validar, gere e baixe o documento oficial em PDF.
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate>
              <p className="mb-4 text-xs text-gray-500">Todos os campos marcados com * são obrigatórios.</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <FieldLabel id="nomeCompleto">Nome Completo</FieldLabel>
                  <input
                    id="nomeCompleto"
                    type="text"
                    className={inputClass}
                    value={volunteer.nomeCompleto}
                    onChange={(e) => handleVolunteerChange('nomeCompleto', e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel id="dataNascimento">Data de Nascimento</FieldLabel>
                  <input
                    id="dataNascimento"
                    type="date"
                    className={inputClass}
                    value={volunteer.dataNascimento}
                    onChange={(e) => handleVolunteerChange('dataNascimento', e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel id="cpf">CPF</FieldLabel>
                  <input
                    id="cpf"
                    type="text"
                    className={inputClass}
                    value={volunteer.cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel id="nacionalidade">Nacionalidade</FieldLabel>
                  <input
                    id="nacionalidade"
                    type="text"
                    className={inputClass}
                    value={volunteer.nacionalidade}
                    onChange={(e) => handleVolunteerChange('nacionalidade', e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-4">
                  <FieldLabel id="endereco">Endereço</FieldLabel>
                  <input
                    id="endereco"
                    type="text"
                    className={inputClass}
                    value={volunteer.endereco}
                    onChange={(e) => handleVolunteerChange('endereco', e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel id="cidade">Cidade</FieldLabel>
                  <input
                    id="cidade"
                    type="text"
                    className={inputClass}
                    value={volunteer.cidade}
                    onChange={(e) => handleVolunteerChange('cidade', e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel id="estado">Estado / UF</FieldLabel>
                  <input
                    id="estado"
                    type="text"
                    className={inputClass}
                    value={volunteer.estado}
                    onChange={(e) => handleVolunteerChange('estado', e.target.value.toUpperCase())}
                    maxLength={2}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel id="telefone">Telefone</FieldLabel>
                  <input
                    id="telefone"
                    type="text"
                    className={inputClass}
                    value={volunteer.telefone}
                    onChange={(e) => handleVolunteerChange('telefone', e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel id="email">E-mail</FieldLabel>
                  <input
                    id="email"
                    type="email"
                    className={inputClass}
                    value={volunteer.email}
                    onChange={(e) => handleVolunteerChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <section
                className="mt-8 rounded-lg border border-gray-200 bg-[#F3F3F3] p-5"
                aria-labelledby="utfpr-section-title"
              >
                <h2 id="utfpr-section-title" className="mb-4 text-base font-semibold text-gray-800">
                  Dados Universitários UTFPR
                </h2>

                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={volunteer.isEstudanteUTFPR}
                    onChange={handleEstudanteChange}
                    className="h-4 w-4 rounded border-gray-300 text-[#0071AF] focus:ring-[#0071AF]"
                  />
                  Sou estudante da UTFPR
                </label>

                {volunteer.isEstudanteUTFPR && (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <FieldLabel id="curso">Curso</FieldLabel>
                      <input
                        id="curso"
                        type="text"
                        className={inputClass}
                        value={volunteer.curso ?? ''}
                        onChange={(e) => handleVolunteerChange('curso', e.target.value)}
                        required
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <FieldLabel id="periodo">Período</FieldLabel>
                      <input
                        id="periodo"
                        type="text"
                        className={inputClass}
                        value={volunteer.periodo ?? ''}
                        onChange={(e) => handleVolunteerChange('periodo', e.target.value)}
                        required
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <FieldLabel id="ra">RA</FieldLabel>
                      <input
                        id="ra"
                        type="text"
                        className={inputClass}
                        value={volunteer.ra ?? ''}
                        onChange={(e) => handleVolunteerChange('ra', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
              </section>

              {formErrors.length > 0 && (
                <ul className="mt-6 space-y-1 text-sm text-red-600">
                  {formErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}

              {apiError && (
                <p className="mt-4 text-sm text-red-600">{apiError}</p>
              )}

              {termoId && (
                <section
                  className="mt-8 rounded-lg border border-[#BB4B00] border-dashed p-5"
                  aria-labelledby="upload-section-title"
                >
                  <h2
                    id="upload-section-title"
                    className="mb-2 text-base font-semibold text-[#BB4B00]"
                  >
                    Retorno do Documento Assinado
                  </h2>
                  <p className="mb-4 text-sm text-gray-600">
                    Após imprimir, assinar e digitalizar o termo, selecione o PDF assinado para
                    envio ao sistema.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="termoAssinado"
                      className="inline-block cursor-pointer rounded bg-[#BB4B00] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Selecionar PDF assinado
                    </label>
                    <input
                      id="termoAssinado"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {selectedFile && !uploadSent && (
                      <button
                        type="button"
                        onClick={handleUploadAssinado}
                        disabled={uploading}
                        className="rounded bg-[#0071AF] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {uploading ? 'Enviando...' : 'Enviar documento'}
                      </button>
                    )}
                  </div>

                  {selectedFile && !uploadSent && (
                    <p className="mt-2 text-xs text-gray-500">
                      Arquivo selecionado: {selectedFile.name}
                    </p>
                  )}

                  {uploadErrors.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-red-600">
                      {uploadErrors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  )}

                  {uploadSent && (
                    <p className="mt-3 text-sm font-medium text-green-600">
                      Documento assinado enviado com sucesso. O termo foi registrado no sistema.
                    </p>
                  )}

                  {uploadSuccess && !uploadSent && (
                    <p className="mt-3 text-sm text-green-600">
                      Arquivo PDF válido selecionado. Clique em &quot;Enviar documento&quot; para concluir.
                    </p>
                  )}
                </section>
              )}

              <footer className="mt-8 flex justify-end border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded bg-[#0071AF] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Salvando e gerando termo...' : 'Gerar Termo'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

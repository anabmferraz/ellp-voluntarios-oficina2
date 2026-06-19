'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Voluntario {
  id: string;
  nomeCompleto: string;
  ra?: string;
  email: string;
  curso?: string;
  telefone: string;
  cpf: string;
  cidade: string;
  endereco?: string;
  nacionalidade?: string;
  periodo?: string;
  dataEntrada?: string;
  dataSaida?: string;
  status: string;
}

export default function Admin() {
  const router = useRouter();
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState<Voluntario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { router.push('/'); return; }
    const parsed = JSON.parse(user);
    if (parsed.role !== 'admin') { router.push('/membro'); return; }

    fetch('/api/voluntarios')
      .then((r) => r.json())
      .then((data) => setVoluntarios(data))
      .catch(() => setErro('Erro ao carregar voluntários.'))
      .finally(() => setCarregando(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const filtrados = voluntarios.filter((v) => {
    const t = busca.toLowerCase();
    return (
      v.nomeCompleto?.toLowerCase().includes(t) ||
      v.ra?.toLowerCase().includes(t) ||
      v.email?.toLowerCase().includes(t)
    );
  });

  return (
    <div className="min-h-screen bg-sky-700 p-10">
      <div className="bg-zinc-200 text-zinc-700 rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Image src="/logo-navbar.png" alt="ELLP" width={80} height={40} />
            <h1 className="text-3xl font-bold">Administração de Voluntários</h1>
          </div>
          <button
            onClick={logout}
            className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition-colors"
          >
            Sair
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nome, RA ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700"
          />
        </div>

        {erro && <p className="text-red-600 mb-4">{erro}</p>}

        {carregando ? (
          <p className="text-center text-zinc-500 py-10">Carregando voluntários...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-center text-zinc-500 py-10">Nenhum voluntário encontrado.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-amber-700 text-white">
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">E-mail</th>
                <th className="p-3 text-left">Curso</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((v) => (
                <tr key={v.id} className="border-b hover:bg-zinc-50">
                  <td className="p-3">{v.nomeCompleto}</td>
                  <td className="p-3">{v.email}</td>
                  <td className="p-3">{v.curso ?? '—'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        v.status === 'Concluído'
                          ? 'bg-green-100 text-green-700'
                          : v.status === 'Pendente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelecionado(v)}
                      className="bg-sky-700 text-white px-4 py-2 rounded hover:bg-sky-800"
                    >
                      Visualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-200 text-zinc-700 rounded-lg shadow-xl w-4/5 max-w-3xl p-8 relative">
            <button
              onClick={() => setSelecionado(null)}
              className="absolute top-4 right-4 text-2xl font-bold text-zinc-500 hover:text-red-600"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6">Ficha do Voluntário</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Nome', selecionado.nomeCompleto],
                ['E-mail', selecionado.email],
                ['CPF', selecionado.cpf],
                ['Telefone', selecionado.telefone],
                ['Cidade', selecionado.cidade],
                ['Endereço', selecionado.endereco ?? '—'],
                ['Curso', selecionado.curso ?? '—'],
                ['RA', selecionado.ra ?? '—'],
                ['Período', selecionado.periodo ?? '—'],
                ['Nacionalidade', selecionado.nacionalidade ?? '—'],
                ['Data Entrada', selecionado.dataEntrada ?? '—'],
                ['Status', selecionado.status],
              ].map(([label, value]) => (
                <p key={label} className="border-b border-zinc-300 pb-1">
                  <strong>{label}:</strong> {value}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

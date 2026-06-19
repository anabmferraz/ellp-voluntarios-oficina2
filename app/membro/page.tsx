'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Membro() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) { router.push('/'); return; }
    const parsed = JSON.parse(user);
    setUsername(parsed.username);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 to-sky-900 flex flex-col items-center justify-center p-10">
      <div className="bg-zinc-200 rounded-lg p-8 shadow-lg w-full max-w-lg text-center">
        <div className="flex justify-center mb-4">
          <Image src="/logo-navbar.png" alt="ELLP" width={100} height={50} />
        </div>

        <h1 className="text-3xl font-bold text-zinc-700 mb-2">
          Bem-vindo, <span className="text-amber-700">{username}</span>!
        </h1>
        <p className="text-zinc-600 mb-8 text-sm">
          Acesse o formulário abaixo para gerar o seu Termo de Adesão como voluntário do Projeto ELLP.
        </p>

        <button
          onClick={() => router.push('/termo')}
          className="w-full bg-amber-700 text-white text-lg font-bold py-3 rounded hover:bg-sky-800 transition-colors mb-3"
        >
          Gerar Termo de Voluntariado
        </button>

        <button
          onClick={logout}
          className="w-full bg-zinc-500 text-white py-2 rounded hover:bg-zinc-600 transition-colors text-sm"
        >
          Sair
        </button>
      </div>
    </div>
  );
}

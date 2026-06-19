'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!usuario || !senha) {
      setErro('Preencha usuário e senha.');
      return;
    }

    if (usuario === 'admin' && senha === '123') {
      localStorage.setItem('user', JSON.stringify({ username: usuario, role: 'admin' }));
      router.push('/admin');
      return;
    }

    localStorage.setItem('user', JSON.stringify({ username: usuario, role: 'user' }));
    router.push('/membro');
  };

  const inputClass =
    'bg-zinc-200 placeholder:text-zinc-500 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-700 rounded-sm px-4 py-2 w-full';

  return (
    <div className="h-screen flex bg-gradient-to-br from-sky-600 to-sky-900 font-sans">
      <div className="w-1/3 h-full bg-[url('/bg.jpg')] bg-no-repeat bg-center bg-cover flex items-center justify-center shadow-lg">
        <Image src="/ellpinho_v2.png" alt="Logo ELLP" width={800} height={200} priority />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-zinc-200/80 p-8 px-12 rounded-lg shadow-lg w-[500px]">
          <h1 className="text-4xl font-extrabold text-zinc-700">LOGIN</h1>
          <p className="text-zinc-600 mt-1">Insira suas informações para acessar o sistema</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-8">
            <div>
              <label className="text-amber-700 font-bold block mb-1">USUÁRIO</label>
              <input
                type="text"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="text-amber-700 font-bold block mb-1">SENHA</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {erro && <p className="text-red-600 text-sm">{erro}</p>}

            <button
              type="submit"
              className="bg-amber-700 text-white text-2xl font-bold mt-4 py-3 rounded hover:bg-sky-800 transition-colors"
            >
              ENTRAR
            </button>
          </form>

          <p className="text-zinc-500 text-sm mt-4 text-center">
            Caso esqueça a senha ou login,
            <br />
            entre em contato com um administrador.
          </p>
        </div>
      </div>
    </div>
  );
}

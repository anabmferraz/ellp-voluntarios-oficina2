import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection('usuarios').get();
    const usuarios = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(usuarios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao procurar os utilizadores.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (data.perfil === 'admin') {
      data.voluntarioId = null;
    }

    const novoUsuario = {
      ...data,
      dataCriacao: new Date().toISOString(),
    };

    if (data.uid) {
      await db.collection('usuarios').doc(data.uid).set(novoUsuario);
      return NextResponse.json({ id: data.uid, ...novoUsuario }, { status: 201 });
    } else {
      const docRef = await db.collection('usuarios').add(novoUsuario);
      return NextResponse.json({ id: docRef.id, ...novoUsuario }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registar o utilizador.' }, { status: 500 });
  }
}
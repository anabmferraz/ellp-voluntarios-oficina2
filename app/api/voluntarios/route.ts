import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection('voluntarios').get();
    const voluntarios = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(voluntarios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao procurar os voluntários.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (data.tipo === 'aluno_utfpr' && (!data.ra || !data.curso)) {
      return NextResponse.json(
        { error: 'RA e Curso são obrigatórios para alunos.' },
        { status: 400 }
      );
    }

    const novoVoluntario = {
      ...data,
      status: 'Pendente',
      dataCriacao: new Date().toISOString(),
    };

    const docRef = await db.collection('voluntarios').add(novoVoluntario);
    
    return NextResponse.json({ id: docRef.id, ...novoVoluntario }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registar o voluntário.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';
import { validateProjectPeriod } from '../../../lib/services/projectService';

export async function GET() {
  try {
    const snapshot = await db.collection('projetos').get();
    const projetos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(projetos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao procurar os projetos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const validation = validateProjectPeriod(data);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const novoProjeto = {
      ...data,
      dataCriacao: new Date().toISOString(),
    };

    const docRef = await db.collection('projetos').add(novoProjeto);
    return NextResponse.json({ id: docRef.id, ...novoProjeto }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registar o projeto.' }, { status: 500 });
  }
}
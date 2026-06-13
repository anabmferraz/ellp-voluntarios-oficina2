import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const docRef = db.collection('usuarios').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });
    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao procurar o utilizador.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const docRef = db.collection('usuarios').doc(id);

    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });

    if (data.perfil === 'admin') {
      data.voluntarioId = null;
    }

    await docRef.update({
      ...data,
      dataAtualizacao: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Utilizador atualizado com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar o utilizador.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const docRef = db.collection('usuarios').doc(id);

    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 });

    await docRef.delete();
    return NextResponse.json({ message: 'Utilizador eliminado com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao eliminar o utilizador.' }, { status: 500 });
  }
}
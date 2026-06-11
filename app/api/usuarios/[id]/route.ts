import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const docRef = db.collection('usuarios').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao procurar o Usuário.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const docRef = db.collection('usuarios').doc(params.id);
    
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });

    if (data.perfil === 'admin') {
      data.voluntarioId = null;
    }

    await docRef.update({
      ...data,
      dataAtualizacao: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Usuário atualizado com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar o Usuário.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const docRef = db.collection('usuarios').doc(params.id);
    
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });

    await docRef.delete();
    return NextResponse.json({ message: 'Usuário eliminado com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao eliminar o Usuário.' }, { status: 500 });
  }
}
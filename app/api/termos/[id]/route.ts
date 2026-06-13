import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = db.collection('termos').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return NextResponse.json({ error: 'Termo não encontrado.' }, { status: 404 });
    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar o termo.' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const docRef = db.collection('termos').doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Termo não encontrado.' }, { status: 404 });

    await docRef.update({
      ...data,
      dataAtualizacao: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Status do termo atualizado com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar o termo.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = db.collection('termos').doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Termo não encontrado.' }, { status: 404 });

    await docRef.delete();
    return NextResponse.json({ message: 'Registro do termo eliminado com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao eliminar o termo.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';

export async function GET() {
  try {
    const snapshot = await db.collection('termos').get();
    const termos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(termos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar os termos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const novoTermo = {
      ...data,
      status: 'Gerado', 
      dataCriacao: new Date().toISOString(),
      dataAceite: null,
      dataRemissao: null
    };

    const docRef = await db.collection('termos').add(novoTermo);
    return NextResponse.json({ id: docRef.id, ...novoTermo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registrar o termo.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';
import { validateActivityPeriod } from '../../../../lib/services/activityService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const docRef = db.collection('vinculos').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) return NextResponse.json({ error: 'Vínculo não encontrado.' }, { status: 404 });
    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao procurar o vínculo.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const docRef = db.collection('vinculos').doc(params.id);
    
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Vínculo não encontrado.' }, { status: 404 });

    const validation = validateActivityPeriod(data);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    await docRef.update({
      ...data,
      dataAtualizacao: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Vínculo atualizado com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar o vínculo.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const docRef = db.collection('vinculos').doc(params.id);
    
    const doc = await docRef.get();
    if (!doc.exists) return NextResponse.json({ error: 'Vínculo não encontrado.' }, { status: 404 });

    await docRef.delete();
    return NextResponse.json({ message: 'Vínculo eliminado com sucesso.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao eliminar o vínculo.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase-admin';
import { validateActivityPeriod } from '../../../lib/services/activityService';

export async function GET() {
  try {
    const snapshot = await db.collection('vinculos').get();
    const vinculos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(vinculos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao procurar os vínculos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const validation = validateActivityPeriod(data);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    const novoVinculo = {
      ...data,
      dataCriacao: new Date().toISOString(),
    };

    const docRef = await db.collection('vinculos').add(novoVinculo);
    return NextResponse.json({ id: docRef.id, ...novoVinculo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registar o vínculo.' }, { status: 500 });
  }
}
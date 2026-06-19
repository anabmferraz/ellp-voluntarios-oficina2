import { NextResponse } from 'next/server';
import { db, storage } from '../../../../../lib/firebase-admin';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const docRef = db.collection('termos').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Termo não encontrado.' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'O arquivo deve ser um PDF.' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'O arquivo não pode exceder 10 MB.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const FIRESTORE_SAFE_LIMIT = 720 * 1024; // ~720KB → cabe no doc de 1MB após base64

    let urlTermoAssinado: string | null = null;
    let pdfBase64: string | null = null;

    if (buffer.length <= FIRESTORE_SAFE_LIMIT) {
      // Arquivo pequeno: guarda direto no Firestore como base64
      pdfBase64 = buffer.toString('base64');
    } else {
      // Arquivo grande: precisa do Firebase Storage
      try {
        const filePath = `termos/${id}/assinado_${Date.now()}.pdf`;
        const bucket = storage.bucket();
        const fileRef = bucket.file(filePath);
        await fileRef.save(buffer, { contentType: 'application/pdf' });
        const [url] = await fileRef.getSignedUrl({ action: 'read', expires: '2099-01-01' });
        urlTermoAssinado = url;
      } catch (storageErr) {
        console.warn('[upload] Firebase Storage indisponível:',
          storageErr instanceof Error ? storageErr.message : storageErr);
        return NextResponse.json(
          { error: 'Arquivo maior que 720KB requer Firebase Storage habilitado no console.' },
          { status: 422 }
        );
      }
    }

    const now = new Date().toISOString();

    await docRef.update({
      status: 'Concluído',
      nomeArquivoAssinado: file.name,
      ...(pdfBase64 ? { pdfBase64 } : { urlTermoAssinado }),
      dataAceite: now,
      dataAtualizacao: now,
    });

    // Atualiza status do voluntário vinculado
    const termoData = doc.data();
    if (termoData?.voluntarioId) {
      await db.collection('voluntarios').doc(termoData.voluntarioId).update({
        status: 'Concluído',
        dataAtualizacao: now,
      });
    }

    return NextResponse.json({ url: urlTermoAssinado }, { status: 200 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[upload] Erro:', msg);
    return NextResponse.json({ error: 'Erro ao registrar o termo assinado.' }, { status: 500 });
  }
}

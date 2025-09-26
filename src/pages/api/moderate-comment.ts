export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export const GET: APIRoute = async ({ url }) => {
  console.log('🚀 Moderate Comment API Route iniciado');
  
  try {
    const searchParams = url.searchParams;
    const action = searchParams.get('action'); // 'approve' or 'reject'
    const token = searchParams.get('token');
    const commentId = searchParams.get('id');

    console.log('📋 Parámetros recibidos:', { action, token: !!token, commentId });

    // Validación básica
    if (!action || !token || !commentId) {
      throw new Error('Missing required parameters');
    }

    if (action !== 'approve' && action !== 'reject') {
      throw new Error('Invalid action. Must be "approve" or "reject"');
    }

    // Obtener el comentario de Firestore
    console.log('📖 Obteniendo comentario de Firestore...');
    const commentRef = db.collection('comments').doc(commentId);
    const commentSnap = await commentRef.get();

    if (!commentSnap.exists) {
      throw new Error('Comment not found');
    }

    const commentData = commentSnap.data();
    
    if (!commentData) {
      throw new Error('Comment data not found');
    }
    
    // Verificar token de moderación
    if (commentData.moderationToken !== token) {
      throw new Error('Invalid moderation token');
    }

    // Verificar que el comentario esté pendiente
    if (commentData.status !== 'pending') {
      throw new Error(`Comment is already ${commentData.status}`);
    }

    // Actualizar estado del comentario
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    console.log(`📝 Actualizando comentario a estado: ${newStatus}`);
    
    await commentRef.update({
      status: newStatus,
      moderatedAt: FieldValue.serverTimestamp(),
      moderationToken: null // Limpiar token después de usar
    });

    console.log('✅ Comentario moderado exitosamente');

    // Respuesta HTML con feedback visual
    const actionText = action === 'approve' ? 'approved' : 'rejected';
    const actionColor = action === 'approve' ? '#22c55e' : '#ef4444';
    const actionIcon = action === 'approve' ? '✅' : '❌';

    const responseHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Comment ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}</title>
      <style>
        body {
          font-family: 'Inter', Arial, sans-serif;
          background: #f8f9fa;
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }
        .icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .title {
          color: ${actionColor};
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 10px 0;
        }
        .subtitle {
          color: #666;
          font-size: 16px;
          margin: 0 0 20px 0;
        }
        .comment-preview {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid ${actionColor};
          margin: 20px 0;
          text-align: left;
        }
        .comment-author {
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }
        .comment-text {
          color: #666;
          line-height: 1.5;
        }
        .back-link {
          display: inline-block;
          background: #4523AE;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          margin-top: 20px;
        }
        .back-link:hover {
          background: #3a1d8f;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">${actionIcon}</div>
        <h1 class="title">Comment ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}</h1>
        <p class="subtitle">The comment has been successfully ${actionText}.</p>
        
        <div class="comment-preview">
          <div class="comment-author">${commentData.name}</div>
          <div class="comment-text">${commentData.comment}</div>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          ${action === 'approve' 
            ? 'This comment will now appear on your portfolio website.' 
            : 'This comment will not appear on your portfolio website.'
          }
        </p>
        
        <a href="/" class="back-link">← Back to Portfolio</a>
      </div>
    </body>
    </html>
    `;

    return new Response(responseHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    });

  } catch (error) {
    console.error('❌ Error en moderación:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    // Respuesta HTML de error
    const errorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Moderation Error</title>
      <style>
        body {
          font-family: 'Inter', Arial, sans-serif;
          background: #f8f9fa;
          margin: 0;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }
        .icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .title {
          color: #ef4444;
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 10px 0;
        }
        .error-message {
          color: #666;
          font-size: 16px;
          margin: 0 0 20px 0;
        }
        .back-link {
          display: inline-block;
          background: #4523AE;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          margin-top: 20px;
        }
        .back-link:hover {
          background: #3a1d8f;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">⚠️</div>
        <h1 class="title">Moderation Error</h1>
        <p class="error-message">${errorMessage}</p>
        <a href="/" class="back-link">← Back to Portfolio</a>
      </div>
    </body>
    </html>
    `;

    return new Response(errorHtml, {
      status: 400,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
};

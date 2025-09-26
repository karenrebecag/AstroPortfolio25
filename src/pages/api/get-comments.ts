export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';
import type { Comment } from '../../types/comments';

export const GET: APIRoute = async ({ url }) => {
  console.log('🚀 Get Comments API Route iniciado');
  
  try {
    const storyId = url.searchParams.get('storyId');
    
    if (!storyId) {
      throw new Error('storyId parameter is required');
    }
    
    console.log('📖 Obteniendo comentarios aprobados de Firestore para story:', storyId);
    
    // Query para obtener comentarios aprobados de un story específico
    const querySnapshot = await db.collection('comments')
      .where('status', '==', 'approved')
      .where('storyId', '==', storyId)
      .get();
    
    const comments: Comment[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        name: data.name,
        comment: data.comment,
        storyId: data.storyId,
        profilePicUrl: data.profilePicUrl || undefined,
        timestamp: data.timestamp?.toDate() || new Date(),
        status: data.status,
        moderationToken: undefined // No incluir token en respuesta pública
      });
    });

    // Ordenar por timestamp descendente en JavaScript (más recientes primero)
    comments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    console.log(`✅ ${comments.length} comentarios aprobados obtenidos`);

    return new Response(
      JSON.stringify({
        success: true,
        comments,
        count: comments.length
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache por 5 minutos
        }
      }
    );

  } catch (error) {
    console.error('❌ Error obteniendo comentarios:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
        comments: [],
        count: 0
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';
import type { Review } from '../../types/reviews';

export const GET: APIRoute = async ({ url }) => {
  console.log('🚀 Get Reviews API Route iniciado');
  
  try {
    console.log('📖 Obteniendo reviews aprobados de Firestore');
    
    // Query para obtener reviews aprobados
    const querySnapshot = await db.collection('reviews')
      .where('status', '==', 'approved')
      .orderBy('timestamp', 'desc')
      .get();
    
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        name: data.name,
        position: data.position || undefined,
        review: data.review,
        timestamp: data.timestamp?.toDate() || new Date(),
        status: data.status,
        moderationToken: undefined, // No incluir token en respuesta pública
      });
    });

    console.log(`✅ ${reviews.length} reviews aprobados obtenidos`);

    return new Response(
      JSON.stringify({
        success: true,
        reviews,
        count: reviews.length
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
    console.error('❌ Error obteniendo reviews:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
        reviews: [],
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

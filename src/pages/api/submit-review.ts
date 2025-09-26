export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { db } from '../../lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { Review } from '../../types/reviews';

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 Submit Review API Route iniciado');
  
  try {
    // Verificar variables de entorno
    if (!import.meta.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurado');
    }

    // Obtener datos del formulario
    console.log('📝 Procesando datos del review...');
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const review = formData.get('review') as string;

    console.log('📋 Datos recibidos:', { 
      name: !!name,
      position: !!position, 
      review: !!review
    });

    // Validación básica
    if (!name || !review) {
      throw new Error('Name and review are required');
    }

    // No profile picture processing needed anymore

    // Generar token único para moderación
    const moderationToken = uuidv4();
    
    // Crear documento del review en Firestore
    console.log('💾 Guardando review en Firestore...');
    const reviewData = {
      name,
      position: position || null,
      review,
      timestamp: FieldValue.serverTimestamp(),
      status: 'pending',
      moderationToken
    };

    const docRef = await db.collection('reviews').add(reviewData);

    console.log('✅ Review guardado con ID:', docRef.id);

    // Configurar Resend para email de moderación
    console.log('📧 Enviando email de moderación...');
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // URLs para moderación
    const baseUrl = import.meta.env.SITE_URL || 'http://localhost:4321';
    const approveUrl = `${baseUrl}/api/moderate-review?action=approve&token=${moderationToken}&id=${docRef.id}`;
    const rejectUrl = `${baseUrl}/api/moderate-review?action=reject&token=${moderationToken}&id=${docRef.id}`;

    // Template de email para moderación
    const emailContent = `
NEW REVIEW FOR MODERATION
=========================

REVIEW DETAILS:
• Name: ${name}
• Position: ${position || 'Not specified'}
• Review: ${review}
• Timestamp: ${new Date().toLocaleString('en-US', { 
  timeZone: 'America/Mexico_City',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

MODERATION ACTIONS:
• Approve: ${approveUrl}
• Reject: ${rejectUrl}
    `;

    // Enviar email de moderación
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Reviews <onboarding@resend.dev>',
      to: import.meta.env.EMAIL_TO || 'karen.ortizg@yahoo.com',
      subject: `New Review for Moderation - ${name}`,
      text: emailContent,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-top: 2px solid #4523AE;">
              <h1 style="color: #4523AE; margin: 0; font-size: 24px; font-weight: 600;">
                New Review for Moderation
              </h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">
                From your portfolio website
              </p>
            </div>

            <!-- Review Details -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Review Details</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4523AE;">
                <p style="margin: 0 0 8px 0; color: #333;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 8px 0; color: #333;"><strong>Position:</strong> ${position || 'Not specified'}</p>
                <p style="margin: 0 0 15px 0; color: #333;"><strong>Review:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e0e0e0;">
                  <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${review}</p>
                </div>
              </div>
            </div>

            <!-- Moderation Actions -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Moderation Actions</h3>
              <div style="display: flex; gap: 15px; justify-content: center;">
                <a href="${approveUrl}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; text-align: center;">
                  ✅ APPROVE REVIEW
                </a>
                <a href="${rejectUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; text-align: center;">
                  ❌ REJECT REVIEW
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                Review submitted on ${new Date().toLocaleString('en-US', { 
                  timeZone: 'America/Mexico_City',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p style="color: #4523AE; margin: 5px 0 0 0; font-size: 12px; font-weight: 500;">
                Karen Ortiz Portfolio - Reviews System
              </p>
            </div>

          </div>
        </div>
      `
    });
    
    if (error) {
      console.error('❌ Error de Resend:', error);
      throw new Error(`Email error: ${error.message}`);
    }
    
    console.log('✅ Email de moderación enviado:', data?.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Review submitted successfully! It will appear after moderation.',
        reviewId: docRef.id
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('❌ Error completo:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage
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

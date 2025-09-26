export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { put } from '@vercel/blob';
import { db } from '../../lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { Comment } from '../../types/comments';

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 Submit Comment API Route iniciado');
  
  try {
    // Verificar variables de entorno
    if (!import.meta.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurado');
    }

    // Obtener datos del formulario
    console.log('📝 Procesando datos del comentario...');
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const comment = formData.get('comment') as string;
    const storyId = formData.get('storyId') as string;
    const parentId = formData.get('parentId') as string | null;
    const profilePic = formData.get('profilePic') as File | null;

    console.log('📋 Datos recibidos:', { 
      name: !!name, 
      comment: !!comment,
      hasProfilePic: !!(profilePic && profilePic.size > 0)
    });

    // Validación básica
    if (!name || !comment || !storyId) {
      throw new Error('Name, comment, and storyId are required');
    }

    // Procesar foto de perfil si existe
    let profilePicUrl = '';
    
    if (profilePic && profilePic.size > 0) {
      console.log('📸 Procesando foto de perfil...');
      
      // Validar tamaño (máximo 5MB)
      if (profilePic.size > 5 * 1024 * 1024) {
        throw new Error('Profile picture is too large. Maximum size is 5MB.');
      }
      
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(profilePic.type)) {
        throw new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
      }
      
      try {
        console.log('📤 Subiendo foto de perfil a Vercel Blob...');
        
        // Generar nombre único para la imagen
        const fileExtension = profilePic.name.split('.').pop();
        const uniqueFileName = `profile-pics/${uuidv4()}.${fileExtension}`;
        
        const blob = await put(uniqueFileName, profilePic, {
          access: 'public',
          addRandomSuffix: false, // Ya tenemos UUID
        });
        
        profilePicUrl = blob.url;
        console.log('✅ Foto de perfil subida a:', profilePicUrl);
        
      } catch (uploadError) {
        console.error('❌ Error subiendo foto de perfil:', uploadError);
        // No fallar completamente si no se puede subir la imagen
      }
    }

    // Generar token único para moderación
    const moderationToken = uuidv4();
    
    // Crear documento del comentario en Firestore
    console.log('💾 Guardando comentario en Firestore...');
    const commentData = {
      name,
      comment,
      storyId,
      parentId: parentId || null,
      profilePicUrl: profilePicUrl || null,
      timestamp: FieldValue.serverTimestamp(),
      status: 'pending',
      moderationToken,
      likes: 0,
      likedBy: []
    };

    const docRef = await db.collection('comments').add(commentData);

    console.log('✅ Comentario guardado con ID:', docRef.id);

    // Configurar Resend para email de moderación
    console.log('📧 Enviando email de moderación...');
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // URLs para moderación
    const baseUrl = import.meta.env.SITE_URL || 'http://localhost:4321';
    const approveUrl = `${baseUrl}/api/moderate-comment?action=approve&token=${moderationToken}&id=${docRef.id}`;
    const rejectUrl = `${baseUrl}/api/moderate-comment?action=reject&token=${moderationToken}&id=${docRef.id}`;

    // Template de email para moderación
    const emailContent = `
NEW COMMENT FOR MODERATION
==========================

COMMENT DETAILS:
• Story: ${storyId}
• Name: ${name}
• Comment: ${comment}
• Profile Picture: ${profilePicUrl ? 'Yes' : 'No'}
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
      from: 'Portfolio Comments <onboarding@resend.dev>',
      to: import.meta.env.EMAIL_TO || 'karen.ortizg@yahoo.com',
      subject: `New Comment for Moderation - ${name}`,
      text: emailContent,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-top: 2px solid #4523AE;">
              <h1 style="color: #4523AE; margin: 0; font-size: 24px; font-weight: 600;">
                New Comment for Moderation
              </h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">
                From your portfolio website
              </p>
            </div>

            <!-- Comment Details -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Comment Details</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4523AE;">
                <p style="margin: 0 0 8px 0; color: #333;"><strong>Success Story:</strong> ${storyId}</p>
                <p style="margin: 0 0 8px 0; color: #333;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 0 0 15px 0; color: #333;"><strong>Comment:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #e0e0e0;">
                  <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${comment}</p>
                </div>
                ${profilePicUrl ? `
                <div style="margin-top: 15px;">
                  <p style="margin: 0 0 8px 0; color: #333;"><strong>Profile Picture:</strong></p>
                  <img src="${profilePicUrl}" alt="Profile Picture" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #4523AE;" />
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Moderation Actions -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Moderation Actions</h3>
              <div style="display: flex; gap: 15px; justify-content: center;">
                <a href="${approveUrl}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; text-align: center;">
                  ✅ APPROVE COMMENT
                </a>
                <a href="${rejectUrl}" style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; text-align: center;">
                  ❌ REJECT COMMENT
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                Comment submitted on ${new Date().toLocaleString('en-US', { 
                  timeZone: 'America/Mexico_City',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p style="color: #4523AE; margin: 5px 0 0 0; font-size: 12px; font-weight: 500;">
                Karen Ortiz Portfolio - Comments System
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
        message: 'Comment submitted successfully! It will appear after moderation.',
        commentId: docRef.id
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

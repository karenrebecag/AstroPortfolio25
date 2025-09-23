export const prerender = false; // Necesario para API routes en modo hybrid

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { put } from '@vercel/blob';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  interests: string[];
  budget: string;
  message: string;
  attachment?: File;
}

export const POST: APIRoute = async ({ request }) => {
  console.log('🚀 API Route iniciado');
  
  try {
    // Verificar variables de entorno
    console.log('📧 Verificando variables de entorno...');
    console.log('RESEND_API_KEY:', import.meta.env.RESEND_API_KEY ? '✅ Configurado' : '❌ Faltante');
    console.log('EMAIL_TO:', import.meta.env.EMAIL_TO ? '✅ Configurado' : '❌ Faltante');
    console.log('BLOB_READ_WRITE_TOKEN:', import.meta.env.BLOB_READ_WRITE_TOKEN ? '✅ Configurado' : '❌ Faltante');
    
    if (!import.meta.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY no está configurado');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Server configuration error'
        }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Obtener datos del formulario
    console.log('📝 Procesando datos del formulario...');
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const interests = formData.getAll('interests') as string[];
    const budget = formData.get('budget') as string;
    const message = formData.get('message') as string;
    const attachment = formData.get('attachment') as File | null;

    console.log('📋 Datos recibidos:', { 
      name: name ? '✅' : '❌', 
      email: email ? '✅' : '❌', 
      message: message ? '✅' : '❌',
      phone: phone || 'N/A',
      country: country || 'N/A',
      interests: interests.length,
      budget: budget || 'N/A',
      attachment: attachment ? `${attachment.name} (${attachment.size} bytes)` : 'N/A'
    });

    // Validación básica
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Name, email and message are required'
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Configurar Resend
    console.log('🔧 Configurando Resend...');
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    // Format interests for email
    const interestsText = interests.length > 0 
      ? interests.join(', ') 
      : 'Not specified';

    // Process attachments - Upload to Vercel Blob
    let attachmentUrl = '';
    let attachmentInfo = '';
    
    if (attachment && attachment.size > 0) {
      console.log('📎 Procesando archivo adjunto...');
      
      // Validar tamaño del archivo (máximo 10MB)
      if (attachment.size > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'File is too large. Maximum size is 10MB.'
          }),
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }

      try {
        // Verificar si tenemos token de Vercel Blob
        const blobToken = import.meta.env.BLOB_READ_WRITE_TOKEN;
        console.log('🔍 Blob token disponible:', !!blobToken);
        
        if (blobToken) {
          console.log('📤 Intentando subir archivo a Vercel Blob...');
          // Subir archivo a Vercel Blob
          const filename = `${Date.now()}-${attachment.name}`;
          const blob = await put(filename, attachment, {
            access: 'public',
            token: blobToken,
          });
          
          attachmentUrl = blob.url;
          attachmentInfo = `${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)`;
          console.log('✅ Archivo subido exitosamente a:', attachmentUrl);
        } else {
          console.log('⚠️ BLOB_READ_WRITE_TOKEN no disponible, solo se mencionará el archivo');
          attachmentInfo = `${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)`;
        }
        
      } catch (uploadError) {
        console.error('❌ Error subiendo archivo a Blob:', uploadError);
        console.error('❌ Upload error type:', typeof uploadError);
        console.error('❌ Upload error message:', (uploadError as any)?.message);
        // Continuar sin attachment si falla la subida
        attachmentInfo = `${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)`;
      }
    }

    // Create email content
    const attachmentText = attachmentUrl 
      ? `\n    ATTACHMENT:\n    • ${attachmentInfo}\n    • Download: ${attachmentUrl}\n`
      : '';

    const emailContent = `
    NEW CONTACT MESSAGE
    ===================
    
    CONTACT INFORMATION:
    • Name: ${name}
    • Email: ${email}
    • Phone: ${phone || 'Not provided'}
    • Country: ${country || 'Not provided'}
    
    PROJECT DETAILS:
    • Interests: ${interestsText}
    • Budget: ${budget || 'Not specified'}
    
    MESSAGE:
    ${message}${attachmentText}
    
    Date: ${new Date().toLocaleString('en-US', { 
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
    `;

    // Preparar datos para Resend
    console.log('📧 Preparando email para envío...');
    const emailData = {
      from: 'Portfolio Karen Ortiz <onboarding@resend.dev>',
      to: import.meta.env.EMAIL_TO || 'karen.ortizg@yahoo.com',
      subject: `New Contact from ${name} - Portfolio`,
      text: emailContent,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #4523AE;">
              <h1 style="color: #4523AE; margin: 0; font-size: 24px; font-weight: 600;">
                New Contact Message
              </h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">
                Karen Ortiz Portfolio
              </p>
            </div>

            <!-- Contact Info -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">
                Contact Information
              </h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4523AE;">
                <p style="margin: 0 0 8px 0; color: #333;">
                  <strong>Name:</strong> ${name}
                </p>
                <p style="margin: 0 0 8px 0; color: #333;">
                  <strong>Email:</strong> <a href="mailto:${email}" style="color: #4523AE; text-decoration: none;">${email}</a>
                </p>
                <p style="margin: 0 0 8px 0; color: #333;">
                  <strong>Phone:</strong> ${phone || 'Not provided'}
                </p>
                <p style="margin: 0; color: #333;">
                  <strong>Country:</strong> ${country || 'Not provided'}
                </p>
              </div>
            </div>

            <!-- Project Details -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">
                Project Details
              </h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #9D7FC1;">
                <p style="margin: 0 0 8px 0; color: #333;">
                  <strong>Interests:</strong> ${interestsText}
                </p>
                <p style="margin: 0; color: #333;">
                  <strong>Budget:</strong> ${budget || 'Not specified'}
                </p>
              </div>
            </div>

            <!-- Message -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">
                Message
              </h3>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #4523AE;">
                <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>

            ${attachmentUrl ? `
            <!-- Attachment -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">
                Attachment
              </h3>
              <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <div style="background: #0ea5e9; color: white; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                    FILE
                  </div>
                  <div>
                    <p style="margin: 0; color: #333; font-weight: 500;">${attachmentInfo}</p>
                  </div>
                </div>
                <a href="${attachmentUrl}" style="display: inline-block; background: #4523AE; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
                  📎 Download File
                </a>
              </div>
            </div>
            ` : ''}

            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                Sent on ${new Date().toLocaleString('en-US', { 
                  timeZone: 'America/Mexico_City',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p style="color: #4523AE; margin: 5px 0 0 0; font-size: 12px; font-weight: 500;">
                Karen Ortiz Portfolio - Full Stack Developer
              </p>
            </div>

          </div>
        </div>
      `
    };

    // Nota: Los archivos se suben a Vercel Blob y se incluye el link en el email
    if (attachmentUrl) {
      console.log('✅ Archivo adjunto incluido como link en el email');
    }

    // Enviar el email con Resend
    console.log('📤 Enviando email...');
    const { data, error } = await resend.emails.send(emailData);
    
    if (error) {
      console.error('❌ Error de Resend:', error);
      throw new Error(`Resend error: ${error.message}`);
    }
    
    console.log('✅ Email enviado exitosamente:', data?.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email enviado correctamente'
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
    
    // Logging detallado para debugging en producción
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error constructor:', error?.constructor?.name);
    
    // Extraer mensaje de error más específico
    let errorMessage = 'Internal server error';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    } else {
      console.error('❌ Non-Error object:', JSON.stringify(error, null, 2));
      errorMessage = String(error);
    }
    
    // En desarrollo, incluir más detalles
    const isDev = import.meta.env.DEV;
    
    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
        ...(isDev && { 
          details: errorDetails,
          env: {
            RESEND_API_KEY: !!import.meta.env.RESEND_API_KEY,
            EMAIL_TO: !!import.meta.env.EMAIL_TO,
            BLOB_READ_WRITE_TOKEN: !!import.meta.env.BLOB_READ_WRITE_TOKEN
          }
        })
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

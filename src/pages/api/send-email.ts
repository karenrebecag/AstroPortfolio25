export const prerender = false; // Necesario para API routes en modo hybrid

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

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

    // Create email content
    const attachmentText = attachment && attachment.size > 0 
      ? `\n    ATTACHMENT:\n    • ${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)\n`
      : '';

    const emailContent = `
    NEW CONTACT MESSAGE - KAREN ORTIZ PORTFOLIO
    
    ═══════════════════════════════════════════════════════
    
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
    
    ═══════════════════════════════════════════════════════
    
    Sent from: Karen Ortiz Portfolio
    Date: ${new Date().toLocaleString('en-US', { 
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
    `;

    // Procesar archivo adjunto si existe
    let attachments: any[] = [];
    if (attachment && attachment.size > 0) {
      // Convertir archivo a buffer
      const buffer = Buffer.from(await attachment.arrayBuffer());
      
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

      attachments.push({
        filename: attachment.name,
        content: buffer,
        contentType: attachment.type
      });
    }

    // Preparar datos para Resend
    console.log('📧 Preparando email para envío...');
    const emailData = {
      from: 'Portfolio Karen Ortiz <onboarding@resend.dev>',
      to: [import.meta.env.EMAIL_TO || 'karen.ortizg@yahoo.com'],
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

            ${attachment && attachment.size > 0 ? `
            <!-- Attachment -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">
                Attachment
              </h3>
              <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9; display: flex; align-items: center; gap: 10px;">
                <div style="background: #0ea5e9; color: white; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                  FILE
                </div>
                <div>
                  <p style="margin: 0; color: #333; font-weight: 500;">${attachment.name}</p>
                  <p style="margin: 0; color: #666; font-size: 12px;">${(attachment.size / 1024).toFixed(1)} KB • ${attachment.type}</p>
                </div>
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

    // Agregar attachments si existen (Resend no soporta attachments en la versión gratuita)
    if (attachments.length > 0) {
      console.log('⚠️ Nota: Resend no soporta attachments en plan gratuito');
      // Los attachments se mencionan en el contenido del email
    }

    // Enviar el email con Resend
    console.log('📤 Enviando email...');
    const result = await resend.emails.send(emailData);
    
    if (result.error) {
      console.error('❌ Error de Resend:', result.error);
      throw new Error(`Resend error: ${result.error.message}`);
    }
    
    console.log('✅ Email enviado exitosamente:', result.data?.id);

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
    console.error('Error enviando email:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error'
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

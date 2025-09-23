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
        if (import.meta.env.BLOB_READ_WRITE_TOKEN) {
          // Subir archivo a Vercel Blob
          const filename = `${Date.now()}-${attachment.name}`;
          const blob = await put(filename, attachment, {
            access: 'public',
            token: import.meta.env.BLOB_READ_WRITE_TOKEN,
          });
          
          attachmentUrl = blob.url;
          attachmentInfo = `${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)`;
          console.log('✅ Archivo subido a:', attachmentUrl);
        } else {
          console.log('⚠️ BLOB_READ_WRITE_TOKEN no disponible, solo se mencionará el archivo');
          attachmentInfo = `${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)`;
        }
        
      } catch (uploadError) {
        console.error('❌ Error subiendo archivo:', uploadError);
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Reset styles para evitar conflictos */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { margin: 0; padding: 0; background-color: #0a0a0a; }
            table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            td { font-size: 1px; line-height: 1px; }
            img { border: 0; outline: none; text-decoration: none; }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a;">
          
          <!-- Gmail Mobile Hack: Spacer invisible -->
          <div style="display: none; line-height: 0; color: #0a0a0a; font-size: 0;">
            &nbsp;
          </div>
          
          <!-- Tabla principal con min-width hack -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: auto; background-color: #0a0a0a;">
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" border="0" align="center" 
                       width="600" style="min-width: 600px; width: 600px; max-width: 600px; margin: 0 auto;">
                  <tr>
                    <td style="min-width: 600px; padding: 20px 0;">
                      
                      <!-- Contenedor principal dark mode -->
                      <table cellpadding="0" cellspacing="0" border="0" width="100%" 
                             style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden;">
                        
                        <!-- Header -->
                        <tr>
                          <td style="padding: 40px 40px 30px 40px; text-align: center; border-bottom: 1px solid #2a2a3e;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; font-family: 'Inter', Arial, sans-serif; letter-spacing: -0.5px;">
                              New Contact Message
                            </h1>
                            <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 16px; font-family: 'Inter', Arial, sans-serif;">
                              From Karen Ortiz Portfolio
                            </p>
                          </td>
                        </tr>

                        <!-- Contact Information -->
                        <tr>
                          <td style="padding: 30px 40px 0 40px;">
                            <h3 style="color: #ffffff; margin: 0 0 16px 0; font-size: 20px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">
                              Contact Information
                            </h3>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" 
                                   style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                              <tr>
                                <td style="padding: 24px;">
                                  <p style="margin: 0 0 12px 0; color: #e5e7eb; font-size: 15px; font-family: 'Inter', Arial, sans-serif; line-height: 1.5;">
                                    <strong style="color: #ffffff;">Name:</strong> ${name}
                                  </p>
                                  <p style="margin: 0 0 12px 0; color: #e5e7eb; font-size: 15px; font-family: 'Inter', Arial, sans-serif; line-height: 1.5;">
                                    <strong style="color: #ffffff;">Email:</strong> ${email}
                                  </p>
                                  <p style="margin: 0 0 12px 0; color: #e5e7eb; font-size: 15px; font-family: 'Inter', Arial, sans-serif; line-height: 1.5;">
                                    <strong style="color: #ffffff;">Phone:</strong> ${phone || 'Not provided'}
                                  </p>
                                  <p style="margin: 0; color: #e5e7eb; font-size: 15px; font-family: 'Inter', Arial, sans-serif; line-height: 1.5;">
                                    <strong style="color: #ffffff;">Country:</strong> ${country || 'Not provided'}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Project Details -->
                        <tr>
                          <td style="padding: 30px 40px 0 40px;">
                            <h3 style="color: #ffffff; margin: 0 0 16px 0; font-size: 20px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">
                              Project Details
                            </h3>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" 
                                   style="background: rgba(139, 92, 246, 0.1); border-radius: 12px; border: 1px solid rgba(139, 92, 246, 0.2);">
                              <tr>
                                <td style="padding: 24px;">
                                  <p style="margin: 0 0 12px 0; color: #e5e7eb; font-size: 15px; font-family: 'Inter', Arial, sans-serif; line-height: 1.5;">
                                    <strong style="color: #ffffff;">Interests:</strong> ${interestsText}
                                  </p>
                                  <p style="margin: 0; color: #e5e7eb; font-size: 15px; font-family: 'Inter', Arial, sans-serif; line-height: 1.5;">
                                    <strong style="color: #ffffff;">Budget:</strong> ${budget || 'Not specified'}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Message -->
                        <tr>
                          <td style="padding: 30px 40px 0 40px;">
                            <h3 style="color: #ffffff; margin: 0 0 16px 0; font-size: 20px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">
                              Message
                            </h3>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" 
                                   style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                              <tr>
                                <td style="padding: 24px;">
                                  <p style="margin: 0; color: #e5e7eb; font-size: 15px; font-family: 'Inter', Arial, sans-serif; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        ${attachmentUrl ? `
                        <!-- Attachment -->
                        <tr>
                          <td style="padding: 30px 40px 0 40px;">
                            <h3 style="color: #ffffff; margin: 0 0 16px 0; font-size: 20px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">
                              Attachment
                            </h3>
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" 
                                   style="background: rgba(34, 197, 94, 0.1); border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.2);">
                              <tr>
                                <td style="padding: 24px;">
                                  <p style="margin: 0 0 16px 0; color: #e5e7eb; font-size: 15px; font-family: 'Inter', Arial, sans-serif; line-height: 1.5;">
                                    <strong style="color: #ffffff;">File:</strong> ${attachmentInfo}
                                  </p>
                                  <table cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                      <td style="background: #ffffff; border-radius: 8px; padding: 0;">
                                        <a href="${attachmentUrl}" style="display: block; color: #000000; padding: 12px 24px; text-decoration: none; font-size: 14px; font-weight: 600; font-family: 'Inter', Arial, sans-serif; border-radius: 8px;">
                                          Download File
                                        </a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        ` : ''}

                        <!-- Footer -->
                        <tr>
                          <td style="padding: 40px 40px 40px 40px; text-align: center; border-top: 1px solid #2a2a3e;">
                            <p style="color: #9ca3af; margin: 0; font-size: 14px; font-family: 'Inter', Arial, sans-serif;">
                              Sent on ${new Date().toLocaleString('en-US', { 
                                timeZone: 'America/Mexico_City',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p style="color: #8b5cf6; margin: 8px 0 0 0; font-size: 14px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">
                              Karen Ortiz Portfolio - Full Stack Developer
                            </p>
                          </td>
                        </tr>

                      </table>
                      
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!-- Gmail Mobile Hack: Spacer adicional -->
          <table cellpadding="0" cellspacing="0" border="0" style="display: none;">
            <tr>
              <td height="1" style="min-width: 600px; font-size: 0px; line-height: 0px;">
                <img height="1" width="600" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                     style="min-width: 600px; width: 600px; display: block; max-height: 1px;" />
              </td>
            </tr>
          </table>
          
        </body>
        </html>
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
    
    // Extraer mensaje de error más específico
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    
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

import nodemailer from 'nodemailer';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const country = formData.get("country");
    const interests = formData.getAll("interests");
    const budget = formData.get("budget");
    const message = formData.get("message");
    const attachment = formData.get("attachment");
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Name, email and message are required"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: parseInt("587"),
      secure: false,
      // true para 465, false para otros puertos
      auth: {
        user: "karenrortizg@gmail.com",
        pass: "vkts cjug shsu otvk"
      }
    });
    const interestsText = interests.length > 0 ? interests.join(", ") : "Not specified";
    const attachmentText = attachment && attachment.size > 0 ? `
    ATTACHMENT:
    • ${attachment.name} (${(attachment.size / 1024).toFixed(1)} KB)
` : "";
    const emailContent = `
    NEW CONTACT MESSAGE - KAREN ORTIZ PORTFOLIO
    
    ═══════════════════════════════════════════════════════
    
    CONTACT INFORMATION:
    • Name: ${name}
    • Email: ${email}
    • Phone: ${phone || "Not provided"}
    • Country: ${country || "Not provided"}
    
    PROJECT DETAILS:
    • Interests: ${interestsText}
    • Budget: ${budget || "Not specified"}
    
    MESSAGE:
    ${message}${attachmentText}
    
    ═══════════════════════════════════════════════════════
    
    Sent from: Karen Ortiz Portfolio
    Date: ${(/* @__PURE__ */ new Date()).toLocaleString("en-US", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}
    `;
    let attachments = [];
    if (attachment && attachment.size > 0) {
      const buffer = Buffer.from(await attachment.arrayBuffer());
      if (attachment.size > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "File is too large. Maximum size is 10MB."
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json"
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
    const mailOptions = {
      from: `"Portfolio Karen Ortiz" <${"karenrortizg@gmail.com"}>`,
      to: "karenrortizg@gmail.com",
      subject: `New Contact from ${name} - Portfolio`,
      text: emailContent,
      attachments,
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
                  <strong>Phone:</strong> ${phone || "Not provided"}
                </p>
                <p style="margin: 0; color: #333;">
                  <strong>Country:</strong> ${country || "Not provided"}
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
                  <strong>Budget:</strong> ${budget || "Not specified"}
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
            ` : ""}

            <!-- Footer -->
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0; font-size: 12px;">
                Sent on ${(/* @__PURE__ */ new Date()).toLocaleString("en-US", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
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
    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email enviado correctamente"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error enviando email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

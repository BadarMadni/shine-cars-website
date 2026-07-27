import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #CC2229, #0F1629); padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">New Contact Message</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0;">Shine Cars - Website Enquiry</p>
        </div>
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; width: 120px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">
                <a href="mailto:${email}" style="color: #CC2229; text-decoration: none;">${email}</a>
              </td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Subject</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600;">${subject}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 10px 0; color: #6b7280; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; font-weight: 600;">${message}</td>
            </tr>
          </table>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
          This message was submitted from the Shine Cars website
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Shine Cars" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `New Contact Message - ${name}${subject ? ` (${subject})` : ""}`,
      html: htmlEmail,
    });

    return Response.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Contact email error:", errMsg);
    return Response.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}

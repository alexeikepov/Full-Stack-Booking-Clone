import nodemailer from "nodemailer";
import { config } from "../config";

// Email service configuration
const createTransporter = () => {
  if (!process.env.EMAIL_SERVICE) {
    // Return a mock transporter when no email service is configured
    const mockTransporter = {
      sendMail: async (mailOptions: any) => {
        console.log("📧 Mock email would be sent to:", mailOptions.to);
        console.log("📧 Subject:", mailOptions.subject);
        return {
          messageId: `mock-${Date.now()}@booking-clone.com`,
          response: "Mock email sent successfully",
        };
      },
      verify: async () => {
        console.log("✅ Mock email service verified");
        return true;
      },
    };
    return mockTransporter as any;
  }

  // Gmail SMTP configuration (requires app passwords)
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
      },
      connectionTimeout: 10000, // 10 seconds connection timeout
      greetingTimeout: 5000, // 5 seconds greeting timeout
      socketTimeout: 15000, // 15 seconds socket timeout
    });
  }

  // SMTP configuration for other providers
  if (process.env.EMAIL_SERVICE === "smtp") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      connectionTimeout: 10000, // 10 seconds connection timeout
      greetingTimeout: 5000, // 5 seconds greeting timeout
      socketTimeout: 15000, // 15 seconds socket timeout
    });
  }

  // For development/testing - use Ethereal Email (fake SMTP service)
  // This creates a test account automatically
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "ethereal.user@ethereal.email",
      pass: "ethereal.pass",
    },
  });
};

// Email templates
const createConfirmationEmailTemplate = (
  confirmationCode: string,
  bookingDetails: {
    propertyName: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    totalPrice: string;
  },
) => {
  return {
    subject: `Booking Confirmation - ${confirmationCode}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .confirmation-code { background: #007bff; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 5px; margin: 20px 0; }
          .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Thank you for your reservation</p>
          </div>
          
          <div class="content">
            <p>Dear ${bookingDetails.guestName},</p>
            
            <p>Your booking has been confirmed! Please save this confirmation code for your records:</p>
            
            <div class="confirmation-code">
              ${confirmationCode}
            </div>
            
            <div class="booking-details">
              <h3>📋 Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Property:</span>
                <span>${bookingDetails.propertyName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-in:</span>
                <span>${bookingDetails.checkIn}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out:</span>
                <span>${bookingDetails.checkOut}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Price:</span>
                <span style="font-weight: bold; color: #007bff;">${bookingDetails.totalPrice}</span>
              </div>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>📱 Use Your Confirmation Code To:</strong></p>
              <ul>
                <li>Manage your booking</li>
                <li>Check-in at the property</li>
                <li>Contact customer support</li>
                <li>Access special offers</li>
              </ul>
            </div>
            
            <p>If you have any questions or need to modify your booking, please contact our support team with your confirmation code.</p>
            
            <p>We look forward to hosting you!</p>
            
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© 2025 Booking Clone. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Confirmation - ${confirmationCode}
      
      Dear ${bookingDetails.guestName},
      
      Your booking has been confirmed! Please save this confirmation code: ${confirmationCode}
      
      Booking Details:
      - Property: ${bookingDetails.propertyName}
      - Check-in: ${bookingDetails.checkIn}
      - Check-out: ${bookingDetails.checkOut}
      - Total Price: ${bookingDetails.totalPrice}
      
      Use your confirmation code to manage your booking, check-in at the property, and contact customer support.
      
      We look forward to hosting you!
      
      This is an automated message. Please do not reply to this email.
      © 2025 Booking Clone. All rights reserved.
    `,
  };
};

// Main email sending functions
export const sendConfirmationEmail = async (
  recipientEmail: string,
  confirmationCode: string,
  bookingDetails: {
    propertyName: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    totalPrice: string;
  },
): Promise<{
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}> => {
  try {
    const transporter = createTransporter();
    const emailTemplate = createConfirmationEmailTemplate(
      confirmationCode,
      bookingDetails,
    );

    const mailOptions = {
      from:
        process.env.EMAIL_FROM || '"Booking Clone" <noreply@bookingclone.com>',
      to: recipientEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    const info = await transporter.sendMail(mailOptions);

    // For development - log the preview URL for Ethereal Email
    let previewUrl: string | undefined;
    if (process.env.NODE_ENV === "development") {
      const testUrl = nodemailer.getTestMessageUrl(info);
      previewUrl = testUrl || undefined;
      if (previewUrl) {
        console.log("📧 Preview URL:", previewUrl);
      }
    }

    console.log("✅ Email sent successfully:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
    };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Test email connection
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ Email service is ready");
    return true;
  } catch (error) {
    console.error("❌ Email service connection failed:", error);
    return false;
  }
};

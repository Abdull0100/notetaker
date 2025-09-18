// Email service implementation using Nodemailer
// Based on latest Context7 Nodemailer documentation

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

// Create transporter instance (reuse for efficiency)
let transporter: Transporter | null = null;

/**
 * Create and configure Nodemailer transporter
 * Uses environment-specific configuration
 */
function createTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  // Production configuration
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Optional: Enable connection pooling for high-volume sending
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  } else {
    // Development configuration - log to console
    transporter = nodemailer.createTransport({
      // Use Ethereal Email for testing (creates test accounts automatically)
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.ETHEREAL_PASS || 'ethereal.pass',
      },
    });
  }

  return transporter;
}

/**
 * Send email using Nodemailer
 * Automatically creates transporter if needed
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  try {
    const transporter = createTransporter();
    
    // Verify SMTP configuration (optional, but recommended)
    if (process.env.NODE_ENV === 'production') {
      try {
        await transporter.verify();
        console.log('✅ SMTP server is ready to send emails');
      } catch (verificationError) {
        console.error('❌ SMTP verification failed:', verificationError);
        throw new Error('Email service configuration error');
      }
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@localhost',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`✅ Email sent successfully to ${options.to}`);
      console.log(`📧 Message ID: ${info.messageId}`);
    } else {
      console.log('📧 Development email sent:', {
        to: options.to,
        subject: options.subject,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info), // Preview URL for Ethereal
      });
    }

  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Verify email configuration
 * Useful for health checks
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
}

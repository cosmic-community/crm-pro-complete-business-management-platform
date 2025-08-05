import { Resend } from 'resend'

// Initialize Resend with API key or undefined if not available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured. Email sending is disabled.')
    return
  }

  const { to, subject, html, from = 'CRM Pro <noreply@crmpro.com>' } = options

  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

export const emailTemplates = {
  taskAssigned: (assigneeName: string, taskTitle: string, dueDate?: string) => ({
    subject: `New Task Assigned: ${taskTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Task Assigned</h2>
        <p>Hello ${assigneeName},</p>
        <p>You have been assigned a new task:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${taskTitle}</h3>
          ${dueDate ? `<p style="margin: 5px 0; color: #666;"><strong>Due Date:</strong> ${dueDate}</p>` : ''}
        </div>
        
        <p>Please log in to your CRM Pro dashboard to view the full details and update the task status.</p>
        
        <p>Best regards,<br>CRM Pro Team</p>
      </div>
    `,
  }),

  appointmentConfirmation: (customerName: string, appointmentDate: string, serviceName: string) => ({
    subject: `Appointment Confirmation - ${serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Appointment Confirmation</h2>
        <p>Dear ${customerName},</p>
        <p>This is to confirm your appointment:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceName}</p>
          <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${appointmentDate}</p>
        </div>
        
        <p>If you need to reschedule or have any questions, please contact us.</p>
        
        <p>Thank you,<br>CRM Pro Team</p>
      </div>
    `,
  }),

  welcomeEmail: (customerName: string) => ({
    subject: 'Welcome to CRM Pro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to CRM Pro!</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for joining CRM Pro. We're excited to have you as part of our community.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>With CRM Pro, you can:</p>
          <ul>
            <li>Manage your appointments efficiently</li>
            <li>Track your tasks and projects</li>
            <li>Access detailed reports and analytics</li>
            <li>Collaborate with your team</li>
          </ul>
        </div>
        
        <p>If you have any questions, feel free to reach out to our support team.</p>
        
        <p>Best regards,<br>The CRM Pro Team</p>
      </div>
    `,
  }),
}
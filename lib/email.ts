import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
}

export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await resend.emails.send({
      from: data.from || 'CRM Pro <noreply@crmprodemp.com>',
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text,
    })

    if (result.error) {
      console.error('Email send error:', result.error)
      return { success: false, error: result.error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Email templates
export const emailTemplates = {
  welcome: (firstName: string) => ({
    subject: 'Welcome to CRM Pro!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to CRM Pro, ${firstName}!</h1>
        <p>Your account has been successfully created. You can now log in and start managing your business more effectively.</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The CRM Pro Team</p>
      </div>
    `,
    text: `Welcome to CRM Pro, ${firstName}! Your account has been successfully created.`,
  }),

  appointmentReminder: (customerName: string, appointmentTitle: string, appointmentDate: string) => ({
    subject: 'Appointment Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Appointment Reminder</h1>
        <p>Hi ${customerName},</p>
        <p>This is a friendly reminder about your upcoming appointment:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>${appointmentTitle}</strong><br>
          ${appointmentDate}
        </div>
        <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
        <p>We look forward to seeing you!</p>
      </div>
    `,
    text: `Hi ${customerName}, this is a reminder about your appointment: ${appointmentTitle} on ${appointmentDate}.`,
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Reset Your Password</h1>
        <p>You requested to reset your password. Click the link below to create a new password:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>The link will expire in 24 hours.</p>
      </div>
    `,
    text: `Reset your password by clicking this link: ${resetLink}`,
  }),

  taskAssigned: (assigneeName: string, taskTitle: string, dueDate?: string) => ({
    subject: 'New Task Assigned',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">New Task Assigned</h1>
        <p>Hi ${assigneeName},</p>
        <p>You have been assigned a new task:</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>${taskTitle}</strong><br>
          ${dueDate ? `Due: ${dueDate}` : 'No due date set'}
        </div>
        <p>Please log in to your CRM Pro account to view the full details and update the task status.</p>
      </div>
    `,
    text: `Hi ${assigneeName}, you have been assigned a new task: ${taskTitle}${dueDate ? ` (Due: ${dueDate})` : ''}.`,
  }),
}
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface WelcomeEmailOptions {
  to: string;
  name: string;
  email: string;
  password: string;
}

interface PasswordResetEmailOptions {
  to: string;
  name: string;
  resetUrl: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (options: WelcomeEmailOptions): Promise<void> => {
  const { to, name, email, password } = options;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Bethel AG Dubai</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
            <div style="background: white; width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.2); font-size: 60px; line-height: 100px;">
              🎉
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Welcome to Bethel AG Dubai!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Your account has been created successfully</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px;">
            <p style="color: #333; font-size: 18px; margin: 0 0 20px; line-height: 1.6;">
              Hi <strong>${name}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px; margin: 0 0 30px; line-height: 1.6;">
              We're excited to have you join our community! Your account has been created and you can now access all the features of our platform.
            </p>
            
            <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 30px; border-radius: 16px; margin-bottom: 30px; border: 2px solid #667eea;">
              <h2 style="color: #333; margin: 0 0 20px; font-size: 20px; font-weight: 600;">Your Login Credentials</h2>
              
              <div style="margin-bottom: 15px; padding: 12px 0; border-bottom: 1px solid rgba(102, 126, 234, 0.2);">
                <div style="color: #666; font-size: 14px; margin-bottom: 5px;">Email Address</div>
                <div style="color: #333; font-size: 16px; font-weight: 600;">${email}</div>
              </div>
              
              <div style="padding: 12px 0;">
                <div style="color: #666; font-size: 14px; margin-bottom: 8px;">Temporary Password</div>
                <div style="background: white; color: #667eea; padding: 12px 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 18px; font-weight: 600; letter-spacing: 1px; border: 2px solid #667eea; display: inline-block;">${password}</div>
              </div>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #ffc107;">
              <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.6;">
                <strong>⚠️ Important:</strong> For security reasons, please change your password after your first login. You can do this from your account settings.
              </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0 0 15px; font-size: 18px; font-weight: 600;">Getting Started</h3>
              <ul style="color: #666; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Complete your profile information</li>
                <li>Explore the dashboard and features</li>
                <li>Connect with other community members</li>
                <li>Stay updated with announcements</li>
              </ul>
            </div>
            
            <p style="color: #999; font-size: 13px; margin: 30px 0 0; line-height: 1.6;">
              If you have any questions or need assistance, feel free to reach out to our support team.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin: 0 0 10px;">
              <strong>Bethel AG Dubai</strong>
            </p>
            <p style="color: #999; font-size: 13px; margin: 0;">
              © ${new Date().getFullYear()} Bethel AG Dubai. All rights reserved.
            </p>
          </div>
          
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Welcome to Bethel AG Dubai - Your Account Details',
    html,
  });
};

export const sendPasswordResetEmail = async (options: PasswordResetEmailOptions): Promise<void> => {
  const { to, name, resetUrl } = options;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
            <div style="background: white; width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.2); font-size: 60px; line-height: 100px;">
              🔐
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Password Reset Request</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">We received a request to reset your password</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px;">
            <p style="color: #333; font-size: 18px; margin: 0 0 20px; line-height: 1.6;">
              Hi <strong>${name}</strong>,
            </p>
            
            <p style="color: #666; font-size: 16px; margin: 0 0 30px; line-height: 1.6;">
              You requested to reset your password. Click the button below to create a new password for your account.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 18px 50px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);">
                Reset Password
              </a>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #667eea;">
              <p style="color: #333; font-size: 14px; margin: 0 0 10px; line-height: 1.6;">
                <strong>⏰ This link will expire in 10 minutes</strong>
              </p>
              <p style="color: #666; font-size: 13px; margin: 0; line-height: 1.6;">
                For security reasons, this password reset link is only valid for a short period of time.
              </p>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
              <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.6;">
                <strong>⚠️ Didn't request this?</strong><br>
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </div>
            
            <div style="background: #e7f3ff; padding: 20px; border-radius: 12px; border-left: 4px solid #0A84FF;">
              <p style="color: #004085; font-size: 13px; margin: 0 0 10px; line-height: 1.6;">
                <strong>Alternative Link:</strong>
              </p>
              <p style="color: #666; font-size: 12px; margin: 0; word-break: break-all; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #0A84FF;">${resetUrl}</a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin: 0 0 10px;">
              <strong>Bethel AG Dubai</strong>
            </p>
            <p style="color: #999; font-size: 13px; margin: 0;">
              © ${new Date().getFullYear()} Bethel AG Dubai. All rights reserved.
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
          
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    to,
    subject: 'Password Reset Request - Bethel AG Dubai',
    html,
  });
};
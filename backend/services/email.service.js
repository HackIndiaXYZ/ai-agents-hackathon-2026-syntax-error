const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
  });
};

const sendOTPEmail = async (email, otp, type = 'password_reset') => {
  const transporter = createTransporter();
  
  const subject = type === 'password_reset' ? 'Reset Your Password - Startup Intelligence' : 'Verify Your Email - Startup Intelligence';
  const action = type === 'password_reset' ? 'reset your password' : 'verify your email';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#0a0a1a;font-family:'Segoe UI',sans-serif;">
      <div style="max-width:500px;margin:40px auto;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:16px;padding:40px;border:1px solid rgba(99,102,241,0.3);">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:60px;height:60px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <span style="font-size:28px;">🚀</span>
          </div>
          <h1 style="color:#e2e8f0;font-size:24px;margin:0;font-weight:700;">Startup Intelligence</h1>
          <p style="color:#94a3b8;margin:8px 0 0;">Multi-Agent AI Platform</p>
        </div>
        
        <h2 style="color:#e2e8f0;font-size:20px;text-align:center;margin-bottom:8px;">Your OTP Code</h2>
        <p style="color:#94a3b8;text-align:center;margin-bottom:32px;">Use this code to ${action}</p>
        
        <div style="background:rgba(99,102,241,0.15);border:2px solid rgba(99,102,241,0.5);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:42px;font-weight:800;color:#818cf8;letter-spacing:12px;font-family:monospace;">${otp}</span>
        </div>
        
        <div style="background:rgba(245,158,11,0.1);border-left:4px solid #f59e0b;padding:12px 16px;border-radius:4px;margin-bottom:24px;">
          <p style="color:#fbbf24;margin:0;font-size:14px;">⏱ This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
        
        <p style="color:#64748b;font-size:12px;text-align:center;margin:0;">
          If you didn't request this, please ignore this email.<br/>
          © 2024 Startup Intelligence Platform
        </p>
      </div>
    </body>
    </html>
  `;
  
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Startup Intelligence" <noreply@startupiq.ai>',
      to: email,
      subject,
      html
    });
    console.log(`[Email Service] OTP email sent successfully to ${email}`);
  } catch (err) {
    console.error(`[Email Service] Failed to send OTP email via SMTP:`, err.message);
    console.log(`\n*************************************************`);
    console.log(`  DEVELOPMENT OTP CODE FOR ${email}: ${otp}`);
    console.log(`*************************************************\n`);
    
    // In development, do not crash the request if SMTP is offline. Just log the OTP to console.
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    throw err;
  }
};

const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to Startup Intelligence! 🚀',
    html: `
      <div style="max-width:500px;margin:40px auto;background:#1a1a2e;border-radius:16px;padding:40px;font-family:'Segoe UI',sans-serif;">
        <h1 style="color:#818cf8;">Welcome, ${name}! 🎉</h1>
        <p style="color:#94a3b8;">You've successfully joined the Startup Intelligence Platform. Start analyzing startups with our AI-powered multi-agent system.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px;">Go to Dashboard →</a>
      </div>
    `
  });
};

module.exports = { sendOTPEmail, sendWelcomeEmail };

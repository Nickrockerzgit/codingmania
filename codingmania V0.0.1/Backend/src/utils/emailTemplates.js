const dotenv = require('dotenv');
dotenv.config();

const emailTemplates = {
    welcome: (name) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4a5568; text-align: center;">Welcome to Our Platform!</h2>
            <p style="color: #4a5568; font-size: 16px;">Hello ${name},</p>
            <p style="color: #4a5568; font-size: 16px;">Thank you for signing up with us. We're excited to have you on board!</p>
            <p style="color: #4a5568; font-size: 16px;">Feel free to explore our platform and discover all the features we offer.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.WEBSITE_URL || 'http://localhost:5001'}" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Our Website</a>
            </div>
            <p style="color: #718096; font-size: 14px; margin-top: 30px; text-align: center;">If you have any questions, please don't hesitate to contact us.</p>
        </div>
    `,
    
    signin: (name) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4a5568; text-align: center;">New Sign In</h2>
            <p style="color: #4a5568; font-size: 16px;">Hello ${name},</p>
            <p style="color: #4a5568; font-size: 16px;">We noticed a new sign-in to your account.</p>
            <p style="color: #4a5568; font-size: 16px;">If this was you, you can safely ignore this email. If you didn't sign in recently, please secure your account by changing your password.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.WEBSITE_URL || 'http://localhost:5001'}/change-password" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Change Password</a>
            </div>
            <p style="color: #718096; font-size: 14px; margin-top: 30px; text-align: center;">If you have any questions, please don't hesitate to contact us.</p>
        </div>
    `,

    otp: (name, otp) => `
    <div style="font-family: Arial; max-width:600px; padding:20px;">
        <h2 style="color:#4a5568;">Hello ${name},</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#4299e1;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
    </div>
`,


    joinUs: (name) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4a5568; text-align: center;">Thank You for Joining Us!</h2>
            <p style="color: #4a5568; font-size: 16px;">Hello ${name},</p>
            <p style="color: #4a5568; font-size: 16px;">Thank you for your interest in joining our team. We've received your application and will review it shortly.</p>
            <p style="color: #4a5568; font-size: 16px;">Our team will get back to you soon with the next steps.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.WEBSITE_URL || 'http://localhost:5001'}/about-us" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Learn More About Us</a>
            </div>
            <p style="color: #718096; font-size: 14px; margin-top: 30px; text-align: center;">If you have any questions, please don't hesitate to contact us.</p>
        </div>
    `,
    
    eventRegistration: (name, eventName) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4a5568; text-align: center;">Event Registration Confirmation</h2>
            <p style="color: #4a5568; font-size: 16px;">Hello ${name},</p>
            <p style="color: #4a5568; font-size: 16px;">Thank you for registering for <strong>${eventName}</strong>. Your registration has been confirmed!</p>
            <p style="color: #4a5568; font-size: 16px;">We're excited to have you participate in this event. You'll receive more details about the event schedule and requirements soon.</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.WEBSITE_URL || 'http://localhost:5001'}/events" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Event Details</a>
            </div>
            <p style="color: #718096; font-size: 14px; margin-top: 30px; text-align: center;">If you have any questions, please don't hesitate to contact us.</p>
        </div>
    `,

    // ... baaki templates same ...

eventAccepted: (name, eventName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #f9fafb;">
    <h2 style="color: #10b981; text-align: center;">Congratulations! 🎉</h2>
    <p style="color: #4a5568; font-size: 16px;">Dear ${name},</p>
    <p style="color: #4a5568; font-size: 16px;">We are thrilled to inform you that your team registration for <strong>${eventName}</strong> has been <strong>ACCEPTED</strong>!</p>
    <p style="color: #4a5568; font-size: 16px;">Your team has been shortlisted. We will soon share the next steps, schedule, and further instructions with you.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.WEBSITE_URL || 'http://localhost:5001'}/events" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        View Event Details
      </a>
    </div>
    <p style="color: #718096; font-size: 14px; text-align: center;">We're excited to see you participate! If you have any questions, feel free to reach out.</p>
    <p style="color: #4a5568; text-align: center; margin-top: 20px;">Best regards,<br><strong>Technoverse Team</strong></p>
  </div>
`,

eventRejected: (name, eventName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background: #f9fafb;">
    <h2 style="color: #e53e3e; text-align: center;">Registration Update</h2>
    <p style="color: #4a5568; font-size: 16px;">Dear ${name},</p>
    <p style="color: #4a5568; font-size: 16px;">Thank you for registering your team for <strong>${eventName}</strong>. After careful review, we regret to inform you that your registration has not been selected this time.</p>
    <p style="color: #4a5568; font-size: 16px;">We received a large number of applications and had to make tough decisions. Please don't be discouraged — we encourage you to participate in our future events.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.WEBSITE_URL || 'http://localhost:5001'}/events" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
        Explore Upcoming Events
      </a>
    </div>
    <p style="color: #718096; font-size: 14px; text-align: center;">Thank you for your interest and support. We hope to see you in our future programs.</p>
    <p style="color: #4a5568; text-align: center; margin-top: 20px;">Warm regards,<br><strong>Technoverse Team</strong></p>
  </div>
`
};

module.exports = emailTemplates;
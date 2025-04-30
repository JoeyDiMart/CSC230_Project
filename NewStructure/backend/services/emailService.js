// Import required modules
import nodemailer from 'nodemailer';

// Configure the SMTP transporter using Brevo's SMTP relay
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
        user: '8bc0a7001@smtp-brevo.com',
        pass: '4LCWZ3vbAV6KTcHR'
    }
});

// Main function to send emails
// @param to - recipient email address
// @param subject - email subject line
// @param text - plain text version of the email
// @param html - HTML version of the email
// @returns Promise<boolean> - true if email sent successfully, throws error otherwise
export const sendEmail = async (to, subject, text, html) => {
    try {
        // Send the email using the configured transporter
        const info = await transporter.sendMail({
            from: 'CIRT Publishing System <cirtutampa@outlook.com>',
            to,
            subject,
            text,
            html
        });
        
        // Log the message ID for tracking
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        // Log any errors that occur during email sending
        console.error('Error sending email:', error);
        throw error;
    }
};

// Predefined email templates for common use cases
// @param title - title of the publication/poster
// @param type - type of content (poster or journal)
// @returns Object containing email content
export const getApprovalEmail = (title, type) => ({
    subject: `${type} Approved: ${title}`,
    text: `Your ${type.toLowerCase()} titled "${title}" has been approved. You can view it in the system now.`,
    html: `
        <h2>Your ${type} has been approved!</h2>
        <p>Title: ${title}</p>
        <p>Your ${type.toLowerCase()} has been approved and is now visible in the system.</p>
    `
});

// Template for password reset emails
// @param resetLink - URL for password reset
// @returns Object containing email content
export const getPasswordResetEmail = (resetLink) => ({
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you did not request this reset, please ignore this email.</p>
    `
});

// Template for new account registration confirmation
// @param username - username of the new account
// @param loginLink - link to login page
// @returns Object containing email content
export const getRegistrationEmail = (username, loginLink) => ({
    subject: 'Welcome to CIRT Publishing System',
    text: `Welcome ${username}! Your account has been created. You can log in using this link: ${loginLink}`,
    html: `
        <h2>Welcome to CIRT Publishing System</h2>
        <p>Dear ${username},</p>
        <p>Your account has been successfully created.</p>
        <p>You can log in to your account using this link:</p>
        <p><a href="${loginLink}">Login to your account</a></p>
        <p>If you have any questions, please contact our support team.</p>
    `
});

// Template for new content submission notification
// @param submitter - name of the person who submitted
// @param title - title of the submitted content
// @param type - type of content (poster or journal)
// @param reviewLink - link to review the content
// @returns Object containing email content
export const getSubmissionEmail = (submitter, title, type, reviewLink) => ({
    subject: `New ${type} Submission: ${title}`,
    text: `A new ${type.toLowerCase()} titled "${title}" has been submitted by ${submitter}. Review it here: ${reviewLink}`,
    html: `
        <h2>New ${type} Submission</h2>
        <p>A new ${type.toLowerCase()} has been submitted:</p>
        <p>Title: ${title}</p>
        <p>Submitted by: ${submitter}</p>
        <p>Review the submission:</p>
        <p><a href="${reviewLink}">Review Submission</a></p>
    `
});

// Template for forgot password emails
// @param email - recipient email address
// @param tempPassword - temporary password
// @returns Object containing email content
export const getForgotPasswordEmail = (email, tempPassword) => ({
    subject: 'CIRT Publishing System - Password Reset',
    text: `Hello,

You have requested to reset your password for the CIRT Publishing System.

Your temporary password is: ${tempPassword}

Please log in and change your password immediately.

If you did not request this password reset, please contact support immediately.

Thank you,
CIRT Publishing System Team`,
    html: `
    <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>
        <p>You have requested to reset your password for the CIRT Publishing System.</p>
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please log in and change your password immediately.</p>
        <p>If you did not request this password reset, please contact support immediately.</p>
        <p>Thank you,<br>CIRT Publishing System Team</p>
    </div>`
});

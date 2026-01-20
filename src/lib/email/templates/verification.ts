/**
 * Email Verification Template
 *
 * HTML email template for account email verification.
 * Styled to match the WavePoint brand.
 */

export interface VerificationEmailVars {
  verificationUrl: string;
  expiresInHours: number;
}

export const verificationEmailTemplate = {
  subject: "Verify your email - WavePoint",

  html: ({ verificationUrl, expiresInHours }: VerificationEmailVars) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0d0d0d; font-family: Georgia, 'Times New Roman', serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0d0d0d; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1614; border: 1px solid rgba(201, 162, 39, 0.3); border-radius: 8px;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; text-align: center; border-bottom: 1px solid rgba(201, 162, 39, 0.2);">
              <h1 style="margin: 0; color: #c9a227; font-size: 24px; font-weight: normal; letter-spacing: 1px;">
                WavePoint
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #e8e4d9; font-size: 20px; font-weight: normal;">
                Verify Your Email Address
              </h2>
              <p style="margin: 0 0 24px; color: #a8a29e; font-size: 16px; line-height: 1.6;">
                Thank you for creating an account with WavePoint. Please click the button below to verify your email address and complete your registration.
              </p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="${verificationUrl}"
                       style="display: inline-block; padding: 14px 32px; background-color: #c9a227; color: #0d0d0d; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px; color: #78716c; font-size: 14px; line-height: 1.5;">
                This link will expire in ${expiresInHours} hours. If you didn't create an account with WavePoint, you can safely ignore this email.
              </p>

              <!-- Fallback URL -->
              <p style="margin: 0; color: #78716c; font-size: 12px; line-height: 1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #c9a227; word-break: break-all;">${verificationUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center; border-top: 1px solid rgba(201, 162, 39, 0.2);">
              <p style="margin: 0; color: #57534e; font-size: 12px;">
                &copy; ${new Date().getFullYear()} WavePoint. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,

  text: ({ verificationUrl, expiresInHours }: VerificationEmailVars) =>
    `WavePoint - Email Verification

Verify Your Email Address

Thank you for creating an account with WavePoint. Please visit the link below to verify your email address:

${verificationUrl}

This link will expire in ${expiresInHours} hours.

If you didn't create an account with WavePoint, you can safely ignore this email.

---
WavePoint`,
};

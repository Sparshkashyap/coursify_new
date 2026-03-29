export const resetPasswordTemplate = (resetUrl, name) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed,#d946ef);padding:36px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.2;">Coursify</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Learn Without Limits</p>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px 20px;">
              <h2 style="margin:0 0 16px;font-size:24px;color:#111827;">Reset your password</h2>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#4b5563;">
                Hi ${name || "there"},
              </p>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#4b5563;">
                We received a request to reset your Coursify account password. Click the button below to set a new password.
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#4b5563;">
                This reset link will expire in <strong>10 minutes</strong>.
              </p>

              <div style="text-align:center;margin:32px 0;">
                <a href="${resetUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:700;">
                  Reset Password
                </a>
              </div>

              <p style="margin:0 0 12px;font-size:14px;line-height:1.7;color:#6b7280;">
                If the button does not work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 20px;word-break:break-word;font-size:13px;line-height:1.7;color:#4f46e5;">
                ${resetUrl}
              </p>

              <div style="margin-top:28px;padding:18px;border-radius:12px;background:#f9fafb;border:1px solid #e5e7eb;">
                <p style="margin:0;font-size:13px;line-height:1.7;color:#6b7280;">
                  If you did not request a password reset, you can safely ignore this email. Your account will remain secure.
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 32px;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
                © ${new Date().getFullYear()} Coursify. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
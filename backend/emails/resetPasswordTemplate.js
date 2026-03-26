export const resetPasswordTemplate = (resetUrl, name) => {

return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Password Reset</title>
</head>

<body style="font-family: Arial; background:#f4f4f4; padding:40px">

<div style="
max-width:600px;
margin:auto;
background:white;
padding:30px;
border-radius:10px;
box-shadow:0 5px 20px rgba(0,0,0,0.1);
">

<h2 style="color:#333;">Password Reset Request</h2>

<p>Hello ${name},</p>

<p>
We received a request to reset your password.
Click the button below to create a new password.
</p>

<a href="${resetUrl}" style="
display:inline-block;
padding:12px 25px;
background:#6366f1;
color:white;
text-decoration:none;
border-radius:5px;
margin-top:20px;
">
Reset Password
</a>

<p style="margin-top:30px;">
If you did not request this, please ignore this email.
</p>

<p style="color:gray;">
This link expires in 10 minutes.
</p>

</div>

</body>
</html>
`;

};
🦇 Batman Authentication System

A Batman themed full-stack authentication system built with React, Node.js, Express, and MongoDB, featuring secure login, registration, email verification, password reset, and persistent authentication.

🌐 Live at: https://batauthsys.netlify.app

🚀 Features:
🔑 User Authentication: Register & Login with JWT-based sessions
✉️ Email Verification: Verify account using OTP sent via email
🔒 Password Reset: Secure OTP-based password reset flow
🍪 HTTP-only Cookies: Secure session management with SameSite=None & Secure flags in production
📬 SMTP Integration: Emails for welcome, OTP verification, and password reset
🖤 Batman-Themed UI: Dark, immersive design with a bottom dock
🖥️ Persistent Login: User stays logged in even after refresh

🛠️ Tech Stack:
Frontend
React + Vite
TailwindCSS
React Toastify

Backend
Node.js + Express
MongoDB + Mongoose
JWT for authentication
Nodemailer (SMTP) for emails

Deployment
Netlify (Frontend)
Render (Backend)

1️⃣ Clone the repo
`git clone https://github.com/AbhayPratap05/bat-auth.git`
`cd bat-auth`

2️⃣ Setup Backend
`cd server`
`npm install`
Create a .env file inside server/ with:
`PORT=4000
MONGODB_URL=your-mongodb-uri
JWT_SECRET=your-secret-key
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
SENDER_EMAIL=your-sender-email
NODE_ENV=development`
Run the backend:
`npm start`

3️⃣ Setup Frontend
`cd client`
`npm install`
Create a .env file inside client/ with:
`VITE_BACKEND_URL=http://localhost:4000`
Run the frontend:
`npm run dev`

📸 SCREENSHOTS:

<img width="1470" height="806" alt="Screenshot 2025-08-28 at 04 23 21" src="https://github.com/user-attachments/assets/f75f658f-ca1f-4583-9c2b-a4bcbd220ecc" />
<img width="1470" height="805" alt="Screenshot 2025-08-28 at 04 25 33" src="https://github.com/user-attachments/assets/fdc37cba-5b36-434f-92d5-c81662b40ac1" />

<img width="1319" height="575" alt="Screenshot 2025-08-28 at 04 28 47" src="https://github.com/user-attachments/assets/f262bb06-05ea-4547-8df0-dd17954e1415" />
<img width="1470" height="805" alt="Screenshot 2025-08-28 at 04 25 09" src="https://github.com/user-attachments/assets/659c1d38-9c20-439b-a549-b870b162ca6a" />

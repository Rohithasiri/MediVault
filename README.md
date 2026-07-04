# 🏥 MediVault

A hospital management system that stores your complete medical history and makes it instantly accessible in emergencies.

---

## Features

- 🔐 **Secure Authentication**: Register and login with email/password or Google OAuth.
- 📧 **OTP Verification**: Magic link/OTP verification code requested for logins.
- ⚠️ **Allergies Management**: Track allergy names, severity levels (mild, moderate, severe), and custom notes.
- 💡 **Medicines Tracking**: Maintain current dosage, frequency, and instructions.
- 🏨 **Surgery History**: Document past operations, surgeons, and locations.
- 📋 **OCR-Powered Medical Report Scanning**: Upload report images to automatically extract allergies, medicines, and surgeries using `Tesseract.js` directly on the client.
- 🚨 **Emergency View**: Access a read-only view of a user's critical medical profile without requiring a login.
- 📱 **QR Code Access**: Generate a print-ready emergency QR code linked directly to the Emergency View page.
- 👤 **Complete Medical Profile**: Input and update blood group, emergency contact details, and personal info.

---

## Tech Stack

- **Frontend**: React.js, React Router v7
- **Backend / Auth / Database**: Supabase
- **OCR (Optical Character Recognition)**: Tesseract.js
- **QR Code Generation**: qrcode.react

---

## Setup & Installation

### 1. Clone and Install dependencies
```bash
git clone https://github.com/Rohithasiri/MediVault.git
cd MediVault
npm install
```

### 2. Database Setup (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com) and open the **SQL Editor**.
2. Copy the database schema from the [schema.sql](./schema.sql) file in this repository.
3. Paste and run the commands to create all the required tables and security (RLS) policies.

### 3. Supabase Auth Configuration
In your Supabase project under **Authentication > URL Configuration**:
* **Site URL**: Set to `http://localhost:3000` (or your production domain).
* **Redirect URLs**: Add `http://localhost:3000/verify-google` to permit Google OAuth redirects.

### 4. Configure Environment Variables
Create a `.env` file in the root directory and configure your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run the app
```bash
npm start
```

---

## Live Demo

Check out the live deployment on Vercel:
👉 [https://medi-vault-henna.vercel.app](https://medi-vault-henna.vercel.app)

---

## License

MIT

# 🏥 MediVault

A hospital management system that stores your complete medical history and makes it instantly accessible in emergencies.

## Features

- 🔐 Secure authentication with email/password and Google OAuth
- 📧 OTP verification for every login
- ⚠️ Allergies management
- 💊 Medicines tracking
- 🏨 Surgery history
- 📋 OCR-powered medical report scanning
- 🚨 Emergency view — no login needed for doctors
- 📱 QR code for instant emergency access
- 👤 Complete medical profile

## Tech Stack

- React.js
- Supabase (Auth + Database)
- Tesseract.js (OCR)
- Google OAuth

## Setup

1. Clone the repo
```bash
git clone https://github.com/Rohithasiri/MediVault.git
cd MediVault
npm install
```

2. Create a `.env` file in the root:
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
REACT_APP_GEMINI_KEY=your-gemini-key
3. Run the app:
```bash
npm start
```

## Live Demo

Coming soon on Vercel!

## Screenshots

Landing page, dashboard, emergency view and more coming soon.

## License

MIT

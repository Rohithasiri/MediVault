import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function VerifyGoogle() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const sendOTP = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      setEmail(user.email);

      // Sign out temporarily and send OTP
      await supabase.auth.signOut();
      const { error } = await supabase.auth.signInWithOtp({ 
        email: user.email,
        options: { shouldCreateUser: false }
       });
      if (error) setError(error.message);
      setSending(false);
    };
    sendOTP();
  }, [navigate]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const token = otp.join('');
    if (token.length < 6) { setError('Please enter the full 6-digit code'); return; }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) { setError(error.message); setLoading(false); return; }
    navigate('/dashboard');
  };

  const handleResend = async () => {
    await supabase.auth.signInWithOtp({ email });
    alert('OTP resent to ' + email);
  };

  if (sending) return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>📨</div>
        <h2 style={styles.title}>Sending OTP...</h2>
        <p style={styles.subtitle}>Please wait while we send a verification code to your email.</p>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconWrap}>📬</div>
        <h2 style={styles.title}>Verify your email</h2>
        <p style={styles.subtitle}>
          We sent a 6-digit verification code to<br />
          <strong style={styles.email}>{email}</strong>
        </p>

        <div style={styles.otpRow}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              style={styles.otpInput}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e.target.value, index)}
              onKeyDown={e => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.verifyBtn} onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify & Continue →'}
        </button>

        <p style={styles.resendText}>
          Didn't receive it?{' '}
          <span style={styles.resendLink} onClick={handleResend}>Resend code</span>
        </p>

        <p style={styles.backText}>
          <span style={styles.backLink} onClick={() => navigate('/auth')}>← Back to login</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#fdf6ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  card: { background: 'white', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 8px 40px rgba(61,46,30,0.10)', border: '1px solid #ede8e0' },
  iconWrap: { fontSize: '52px', marginBottom: '16px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#3d2e1e', margin: '0 0 10px' },
  subtitle: { fontSize: '15px', color: '#a89880', lineHeight: '1.7', margin: '0 0 32px' },
  email: { color: '#3d2e1e' },
  otpRow: { display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' },
  otpInput: { width: '48px', height: '56px', border: '2px solid #ede8e0', borderRadius: '12px', fontSize: '22px', fontWeight: '700', textAlign: 'center', color: '#3d2e1e', outline: 'none', background: 'white' },
  error: { background: '#fff1f1', color: '#c0392b', border: '1px solid #f5c6c6', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' },
  verifyBtn: { width: '100%', padding: '14px', background: '#3d2e1e', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '20px' },
  resendText: { fontSize: '14px', color: '#a89880', marginBottom: '12px' },
  resendLink: { color: '#b5541a', fontWeight: '600', cursor: 'pointer' },
  backText: { fontSize: '14px', margin: 0 },
  backLink: { color: '#7a6652', cursor: 'pointer', fontWeight: '500' },
};

export default VerifyGoogle;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      await supabase.auth.signOut();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
      });
      if (otpError) { setError(otpError.message); setLoading(false); return; }
      navigate('/otp', { state: { email } });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      if (error) { setError(error.message); setLoading(false); return; }
      navigate('/otp', { state: { email } });
    }
    setLoading(false);
  };
  const handleGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/verify-google'
    }
  });
  if (error) setError(error.message);
};

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.logo}>🏥 MediVault</div>
          <h2 style={styles.leftTitle}>Your health records,<br />always ready.</h2>
          <p style={styles.leftSub}>Join thousands who trust MediVault to store their medical history securely.</p>
          <div style={styles.featureList}>
            <div style={styles.featureItem}>🌿 Store allergies, medicines & surgeries</div>
            <div style={styles.featureItem}>🤖 AI-powered report scanning</div>
            <div style={styles.featureItem}>🚨 Instant emergency access</div>
            <div style={styles.featureItem}>🔒 Private & secure always</div>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>{isLogin ? 'Welcome back' : 'Create account'}</h2>
          <p style={styles.subtitle}>{isLogin ? 'Sign in to your MediVault account' : 'Start your health journey today'}</p>

          {/* Google Button */}
          <button style={styles.googleBtn} onClick={handleGoogle}>
            <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: 18, height: 18 }} />
            Continue with Google
          </button>

          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Rohith Ayenugu"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign in →' : 'Create account →'}
          </button>

          <p style={styles.switchText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span style={styles.switchLink} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex', minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  left: {
    flex: 1, background: '#3d2e1e',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px',
  },
  leftInner: { maxWidth: '400px' },
  logo: { fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '48px' },
  leftTitle: {
    fontSize: '40px', fontWeight: '900', color: 'white',
    lineHeight: '1.15', margin: '0 0 16px', letterSpacing: '-0.5px',
  },
  leftSub: { fontSize: '15px', color: '#c4ab94', lineHeight: '1.7', margin: '0 0 36px' },
  featureList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  featureItem: { fontSize: '14px', color: '#e8d9cc', display: 'flex', alignItems: 'center', gap: '8px' },
  right: {
    flex: 1, background: '#fdf6ee',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px',
  },
  card: {
    background: 'white', borderRadius: '20px', padding: '40px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 8px 40px rgba(61,46,30,0.10)',
    border: '1px solid #ede8e0',
  },
  title: { fontSize: '26px', fontWeight: '800', color: '#3d2e1e', margin: '0 0 6px' },
  subtitle: { fontSize: '14px', color: '#a89880', margin: '0 0 28px' },
  googleBtn: {
    width: '100%', padding: '13px',
    background: 'white', border: '2px solid #ede8e0',
    borderRadius: '10px', fontSize: '15px', fontWeight: '600',
    color: '#3d2e1e', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    marginBottom: '20px',
  },
  dividerRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  dividerLine: { flex: 1, height: '1px', background: '#ede8e0' },
  dividerText: { fontSize: '13px', color: '#a89880' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#7a6652', marginBottom: '6px' },
  input: {
    width: '100%', padding: '12px 14px',
    border: '2px solid #ede8e0', borderRadius: '10px',
    fontSize: '15px', outline: 'none', color: '#3d2e1e',
    background: 'white', boxSizing: 'border-box',
  },
  error: {
    background: '#fff1f1', color: '#c0392b', border: '1px solid #f5c6c6',
    borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px',
  },
  submitBtn: {
    width: '100%', padding: '14px', background: '#3d2e1e',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginBottom: '20px',
  },
  switchText: { textAlign: 'center', fontSize: '14px', color: '#a89880', margin: 0 },
  switchLink: { color: '#b5541a', fontWeight: '600', cursor: 'pointer' },
};

export default AuthPage;

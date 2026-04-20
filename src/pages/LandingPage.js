import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.logo}>🏥 MediVault</div>
        <div style={styles.navLinks}>
          <span style={styles.navLink}>Features</span>
          <span style={styles.navLink}>How it works</span>
          <span style={styles.navLink}>Security</span>
          <span style={styles.navLink}>Testimonials</span>
        </div>
        <div style={styles.navButtons}>
          <button style={styles.loginBtn} onClick={() => navigate('/auth')}>Sign in</button>
          <button style={styles.signupBtn} onClick={() => navigate('/auth')}>Sign up</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        {/* Left */}
        <div style={styles.left}>
          <div style={styles.badge}>🚨 Built for emergencies</div>
          <h1 style={styles.heroTitle}>When seconds<br />matter, your<br />records are ready.</h1>
          <p style={styles.heroSubtitle}>
            MediVault stores your allergies, medicines, and surgeries securely.
            In an emergency, doctors get instant access to everything they need to save your life.
          </p>
          <div style={styles.emailRow}>
            <input style={styles.emailInput} type="email" placeholder="Your email" />
            <button style={styles.subscribeBtn} onClick={() => navigate('/auth')}>
              Get started →
            </button>
          </div>

          {/* Stats row */}
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <div style={styles.statNum}>3s</div>
              <div style={styles.statLabel}>Emergency access</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statNum}>100%</div>
              <div style={styles.statLabel}>Secure & private</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statNum}>AI</div>
              <div style={styles.statLabel}>Report scanning</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statNum}>24/7</div>
              <div style={styles.statLabel}>Always available</div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={styles.right}>
          {/* Main card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>👤</span>
              <div>
                <div style={styles.cardName}>Rohith A.</div>
                <div style={styles.cardSub}>Medical Profile</div>
              </div>
              <span style={styles.cardBadge}>✅ Ready</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.cardSection}>
              <div style={styles.sectionTitle}>🌿 Allergies</div>
              <div style={styles.tagRow}>
                <span style={styles.tag}>Penicillin</span>
                <span style={styles.tag}>Peanuts</span>
                <span style={styles.tag}>Dust</span>
              </div>
            </div>
            <div style={styles.cardSection}>
              <div style={styles.sectionTitle}>💊 Medicines</div>
              <div style={styles.tagRow}>
                <span style={styles.tag}>Metformin 500mg</span>
                <span style={styles.tag}>Vitamin D</span>
              </div>
            </div>
            <div style={styles.cardSection}>
              <div style={styles.sectionTitle}>🏨 Surgeries</div>
              <div style={styles.tagRow}>
                <span style={styles.tag}>Appendectomy 2019</span>
              </div>
            </div>
            <div style={styles.emergencyBtn}>
              🚨 Emergency Access — Tap to view
            </div>
          </div>

          {/* Floating mini cards */}
          <div style={styles.miniCardsRow}>
            <div style={styles.miniCard}>
              <div style={styles.miniIcon}>📋</div>
              <div style={styles.miniTitle}>Upload Reports</div>
              <div style={styles.miniSub}>AI extracts your data instantly</div>
            </div>
            <div style={styles.miniCard}>
              <div style={styles.miniIcon}>🔒</div>
              <div style={styles.miniTitle}>Private & Secure</div>
              <div style={styles.miniSub}>Only you control access</div>
            </div>
            <div style={styles.miniCard}>
              <div style={styles.miniIcon}>📱</div>
              <div style={styles.miniTitle}>Always Accessible</div>
              <div style={styles.miniSub}>Any device, anywhere</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fdf6ee',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 60px',
    background: 'white',
    borderBottom: '1px solid #ede8e0',
  },
  logo: { fontSize: '18px', fontWeight: 'bold', color: '#3d2e1e' },
  navLinks: { display: 'flex', gap: '32px' },
  navLink: { fontSize: '14px', color: '#7a6652', cursor: 'pointer' },
  navButtons: { display: 'flex', gap: '12px', alignItems: 'center' },
  loginBtn: {
    background: 'transparent', border: 'none',
    fontSize: '14px', color: '#7a6652', cursor: 'pointer', fontWeight: '500',
  },
  signupBtn: {
    background: '#3d2e1e', color: 'white', border: 'none',
    padding: '9px 20px', borderRadius: '20px',
    fontSize: '14px', cursor: 'pointer', fontWeight: '600',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '60px 80px',
    gap: '60px',
    flex: 1,
  },
  left: { flex: 1, maxWidth: '520px' },
  badge: {
    display: 'inline-block',
    background: '#fdecd8', color: '#b5541a',
    padding: '6px 14px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600', marginBottom: '24px',
  },
  heroTitle: {
    fontSize: '58px', fontWeight: '900', color: '#3d2e1e',
    lineHeight: '1.08', margin: '0 0 24px', letterSpacing: '-1px',
  },
  heroSubtitle: {
    fontSize: '16px', color: '#7a6652',
    lineHeight: '1.8', margin: '0 0 36px', maxWidth: '420px',
  },
  emailRow: { display: 'flex', maxWidth: '420px', marginBottom: '40px' },
  emailInput: {
    flex: 1, padding: '13px 18px',
    border: '2px solid #d9cfc4', borderRight: 'none',
    borderRadius: '8px 0 0 8px', fontSize: '15px',
    outline: 'none', background: 'white', color: '#3d2e1e',
  },
  subscribeBtn: {
    background: '#3d2e1e', color: 'white', border: 'none',
    padding: '13px 22px', borderRadius: '0 8px 8px 0',
    fontSize: '15px', cursor: 'pointer', fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  statsRow: {
    display: 'flex', alignItems: 'center', gap: '24px',
    background: 'white', padding: '20px 28px',
    borderRadius: '16px', border: '1px solid #ede8e0',
    boxShadow: '0 4px 20px rgba(61,46,30,0.06)',
  },
  statItem: { textAlign: 'center' },
  statNum: { fontSize: '22px', fontWeight: '900', color: '#3d2e1e' },
  statLabel: { fontSize: '11px', color: '#a89880', marginTop: '2px' },
  statDivider: { width: '1px', height: '36px', background: '#ede8e0' },
  right: { flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' },
  card: {
    background: 'white', borderRadius: '20px', padding: '28px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 8px 40px rgba(61,46,30,0.10)',
    border: '1px solid #ede8e0',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  cardIcon: { fontSize: '36px' },
  cardName: { fontSize: '16px', fontWeight: '700', color: '#3d2e1e' },
  cardSub: { fontSize: '12px', color: '#a89880' },
  cardBadge: {
    marginLeft: 'auto', background: '#edfbf0', color: '#2d7a4a',
    padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
  },
  divider: { height: '1px', background: '#ede8e0', margin: '0 0 16px' },
  cardSection: { marginBottom: '14px' },
  sectionTitle: { fontSize: '13px', fontWeight: '700', color: '#7a6652', marginBottom: '8px' },
  tagRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tag: {
    background: '#fdf0e4', color: '#b5541a',
    padding: '5px 12px', borderRadius: '12px',
    fontSize: '13px', fontWeight: '500',
  },
  emergencyBtn: {
    marginTop: '16px', background: '#fff1f1', color: '#c0392b',
    border: '1px solid #f5c6c6', borderRadius: '10px',
    padding: '12px', textAlign: 'center',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  miniCardsRow: {
    display: 'flex', gap: '12px', width: '100%', maxWidth: '420px',
  },
  miniCard: {
    flex: 1, background: 'white', borderRadius: '14px',
    padding: '16px 12px', textAlign: 'center',
    border: '1px solid #ede8e0',
    boxShadow: '0 4px 16px rgba(61,46,30,0.06)',
  },
  miniIcon: { fontSize: '24px', marginBottom: '8px' },
  miniTitle: { fontSize: '12px', fontWeight: '700', color: '#3d2e1e', marginBottom: '4px' },
  miniSub: { fontSize: '11px', color: '#a89880', lineHeight: '1.4' },
};

export default LandingPage;

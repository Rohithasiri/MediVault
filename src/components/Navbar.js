import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate('/dashboard')}>🏥 MediVault</div>
      <div style={styles.navLinks}>
        <span style={styles.navLink} onClick={() => navigate('/dashboard')}>Dashboard</span>
        <span style={styles.navLink} onClick={() => navigate('/profile')}>Profile</span>
        <span style={styles.navLink} onClick={() => navigate('/allergies')}>Allergies</span>
        <span style={styles.navLink} onClick={() => navigate('/medicines')}>Medicines</span>
        <span style={styles.navLink} onClick={() => navigate('/surgeries')}>Surgeries</span>
        <span style={styles.navLink} onClick={() => navigate('/upload')}>Upload Report</span>
      </div>
      <button style={styles.logoutBtn} onClick={handleLogout}>Sign out</button>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 60px',
    background: 'white',
    borderBottom: '1px solid #ede8e0',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { fontSize: '18px', fontWeight: 'bold', color: '#3d2e1e', cursor: 'pointer' },
  navLinks: { display: 'flex', gap: '24px' },
  navLink: { fontSize: '14px', color: '#7a6652', cursor: 'pointer', fontWeight: '500' },
  logoutBtn: {
    background: 'transparent', border: '1px solid #d9cfc4',
    padding: '8px 16px', borderRadius: '20px',
    fontSize: '13px', color: '#7a6652', cursor: 'pointer',
  },
};

export default Navbar;

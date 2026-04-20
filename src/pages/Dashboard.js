import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({ allergies: 0, medicines: 0, surgeries: 0 });
  const [recent, setRecent] = useState([]);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      setUser(user);

      const [a, m, s] = await Promise.all([
        supabase.from('allergies').select('*', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('medicines').select('*', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('surgeries').select('*', { count: 'exact' }).eq('user_id', user.id),
      ]);

      setCounts({ allergies: a.count || 0, medicines: m.count || 0, surgeries: s.count || 0 });

      const recentItems = [
        ...(a.data || []).map(i => ({ ...i, type: 'allergy' })),
        ...(m.data || []).map(i => ({ ...i, type: 'medicine' })),
        ...(s.data || []).map(i => ({ ...i, type: 'surgery' })),
      ]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 6);

      setRecent(recentItems);
    };
    getUser();
  }, [navigate]);

  const emergencyUrl = `${window.location.origin}/emergency/${user?.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(emergencyUrl);
    alert('Emergency link copied!\n\n' + emergencyUrl);
  };

  const typeConfig = {
    allergy:  { icon: '⚠️', color: '#fdf0e4', text: '#b5541a', label: 'Allergy',  page: '/allergies' },
    medicine: { icon: '💊', color: '#eff6ff', text: '#1d6faa', label: 'Medicine', page: '/medicines' },
    surgery:  { icon: '🏨', color: '#f0fdf4', text: '#2d7a4a', label: 'Surgery',  page: '/surgeries' },
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.content}>
        <div style={styles.welcomeRow}>
          <div>
            <h1 style={styles.welcomeTitle}>
              Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0]} 👋
            </h1>
            <p style={styles.welcomeSub}>Click any card to view and manage your medical records</p>
          </div>
          <div style={styles.emergencyButtons}>
            <button style={styles.qrBtn} onClick={() => setShowQR(true)}>📱 Show QR code</button>
            <button style={styles.emergencyBadge} onClick={copyLink}>📋 Copy emergency link</button>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard} onClick={() => navigate('/allergies')}>
            <div style={styles.statIcon}>⚠️</div>
            <div style={styles.statNum}>{counts.allergies}</div>
            <div style={styles.statLabel}>Allergies</div>
            <div style={styles.statAction}>View & manage →</div>
          </div>
          <div style={styles.statCard} onClick={() => navigate('/medicines')}>
            <div style={styles.statIcon}>💊</div>
            <div style={styles.statNum}>{counts.medicines}</div>
            <div style={styles.statLabel}>Medicines</div>
            <div style={styles.statAction}>View & manage →</div>
          </div>
          <div style={styles.statCard} onClick={() => navigate('/surgeries')}>
            <div style={styles.statIcon}>🏨</div>
            <div style={styles.statNum}>{counts.surgeries}</div>
            <div style={styles.statLabel}>Surgeries</div>
            <div style={styles.statAction}>View & manage →</div>
          </div>
          <div style={styles.statCard} onClick={() => navigate('/upload')}>
            <div style={styles.statIcon}>📋</div>
            <div style={styles.statNum}>📤</div>
            <div style={styles.statLabel}>Upload Report</div>
            <div style={styles.statAction}>Scan now →</div>
          </div>
        </div>

        <div style={styles.recentSection}>
          <div style={styles.recentHeader}>
            <h2 style={styles.recentTitle}>🕒 Recently added</h2>
            <span style={styles.recentSub}>Your last {recent.length} entries across all categories</span>
          </div>

          {recent.length === 0 ? (
            <div style={styles.emptyRecent}>
              <div style={styles.emptyIcon}>📭</div>
              <p style={styles.emptyText}>No records yet. Start by adding an allergy, medicine or surgery!</p>
              <div style={styles.emptyButtons}>
                <button style={styles.emptyBtn} onClick={() => navigate('/allergies')}>+ Add allergy</button>
                <button style={styles.emptyBtn} onClick={() => navigate('/medicines')}>+ Add medicine</button>
                <button style={styles.emptyBtn} onClick={() => navigate('/surgeries')}>+ Add surgery</button>
              </div>
            </div>
          ) : (
            <div style={styles.recentGrid}>
              {recent.map(item => {
                const config = typeConfig[item.type];
                return (
                  <div key={item.id} style={styles.recentCard} onClick={() => navigate(config.page)}>
                    <div style={styles.recentCardTop}>
                      <span style={{ ...styles.recentTypeBadge, background: config.color, color: config.text }}>
                        {config.icon} {config.label}
                      </span>
                      <span style={styles.recentDate}>{formatDate(item.created_at)}</span>
                    </div>
                    <div style={styles.recentName}>{item.name}</div>
                    <div style={styles.recentMeta}>
                      {item.severity && <span style={styles.recentTag}>{item.severity}</span>}
                      {item.dosage && <span style={styles.recentTag}>{item.dosage}</span>}
                      {item.frequency && <span style={styles.recentTag}>{item.frequency}</span>}
                      {item.hospital && <span style={styles.recentTag}>{item.hospital}</span>}
                      {item.surgery_date && <span style={styles.recentTag}>📅 {item.surgery_date}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showQR && (
        <div style={styles.modalOverlay} onClick={() => setShowQR(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>📱 Your Emergency QR Code</h2>
            <p style={styles.modalSub}>Doctors can scan this to instantly access your medical profile — no login needed.</p>
            <div style={styles.qrWrapper}>
              <QRCodeSVG value={emergencyUrl} size={220} level="H" />
            </div>
            <p style={styles.modalUrl}>{emergencyUrl}</p>
            <div style={styles.modalButtons}>
              <button style={styles.copyBtn} onClick={copyLink}>📋 Copy link</button>
              <button style={styles.printBtn} onClick={() => window.print()}>🖨️ Print QR</button>
              <button style={styles.closeBtn} onClick={() => setShowQR(false)}>Close</button>
            </div>
            <p style={styles.modalTip}>💡 Tip: Save a screenshot of this QR code on your phone's lock screen or print it for your wallet.</p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#fdf6ee', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  content: { padding: '48px 60px' },
  welcomeRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' },
  welcomeTitle: { fontSize: '32px', fontWeight: '800', color: '#3d2e1e', margin: '0 0 6px' },
  welcomeSub: { fontSize: '15px', color: '#a89880', margin: 0 },
  emergencyButtons: { display: 'flex', gap: '12px' },
  qrBtn: { background: '#fdf0e4', color: '#b5541a', border: '2px solid #e8c9a8', borderRadius: '20px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  emergencyBadge: { background: '#fff1f1', color: '#c0392b', border: '1px solid #f5c6c6', borderRadius: '20px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' },
  statCard: { background: 'white', borderRadius: '16px', padding: '32px 24px', border: '1px solid #ede8e0', cursor: 'pointer', boxShadow: '0 4px 20px rgba(61,46,30,0.06)', textAlign: 'center' },
  statIcon: { fontSize: '36px', marginBottom: '12px' },
  statNum: { fontSize: '40px', fontWeight: '900', color: '#3d2e1e', marginBottom: '6px' },
  statLabel: { fontSize: '15px', color: '#7a6652', fontWeight: '600', marginBottom: '16px' },
  statAction: { fontSize: '13px', color: '#b5541a', fontWeight: '500' },
  recentSection: { background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #ede8e0', boxShadow: '0 4px 20px rgba(61,46,30,0.06)' },
  recentHeader: { display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' },
  recentTitle: { fontSize: '20px', fontWeight: '800', color: '#3d2e1e', margin: 0 },
  recentSub: { fontSize: '13px', color: '#a89880' },
  emptyRecent: { textAlign: 'center', padding: '32px 0' },
  emptyIcon: { fontSize: '48px', marginBottom: '12px' },
  emptyText: { fontSize: '15px', color: '#a89880', marginBottom: '20px' },
  emptyButtons: { display: 'flex', gap: '12px', justifyContent: 'center' },
  emptyBtn: { background: '#fdf0e4', color: '#b5541a', border: '2px solid #e8c9a8', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  recentGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  recentCard: { background: '#fdf6ee', borderRadius: '14px', padding: '18px', border: '1px solid #ede8e0', cursor: 'pointer' },
  recentCardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' },
  recentTypeBadge: { padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' },
  recentDate: { fontSize: '11px', color: '#a89880' },
  recentName: { fontSize: '15px', fontWeight: '700', color: '#3d2e1e', marginBottom: '8px' },
  recentMeta: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  recentTag: { background: 'white', color: '#7a6652', padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '500', border: '1px solid #ede8e0' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '440px', width: '90%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalTitle: { fontSize: '22px', fontWeight: '800', color: '#3d2e1e', margin: '0 0 8px' },
  modalSub: { fontSize: '14px', color: '#a89880', margin: '0 0 24px', lineHeight: '1.6' },
  qrWrapper: { background: '#fdf6ee', padding: '24px', borderRadius: '16px', display: 'inline-block', marginBottom: '16px', border: '2px solid #ede8e0' },
  modalUrl: { fontSize: '11px', color: '#a89880', wordBreak: 'break-all', margin: '0 0 20px', background: '#fdf6ee', padding: '8px', borderRadius: '8px' },
  modalButtons: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' },
  copyBtn: { background: '#fdf0e4', color: '#b5541a', border: '2px solid #e8c9a8', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  printBtn: { background: '#3d2e1e', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  closeBtn: { background: '#f0f0f0', color: '#666', border: 'none', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  modalTip: { fontSize: '12px', color: '#a89880', lineHeight: '1.6', margin: 0 },
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: '', dob: '', blood_group: '', contact: '',
    emergency_contact: '', emergency_contact_name: '', address: '', gender: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').upsert({ id: user.id, ...profile, updated_at: new Date() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div style={styles.loading}>Loading profile...</div>;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.pageTitle}>👤 My Profile</h1>
            <p style={styles.pageSub}>Your personal and medical information. Keep this up to date for emergencies.</p>
          </div>
          <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save changes'}
          </button>
        </div>

        <div style={styles.grid}>
          {/* Personal Info */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👤 Personal information</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full name</label>
              <input style={styles.input} placeholder="e.g. Rohitha Yenugu" value={profile.name || ''} onChange={e => handleChange('name', e.target.value)} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Date of birth</label>
              <input style={styles.input} type="date" value={profile.dob || ''} onChange={e => handleChange('dob', e.target.value)} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Gender</label>
              <select style={styles.input} value={profile.gender || ''} onChange={e => handleChange('gender', e.target.value)}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Address</label>
              <textarea style={styles.textarea} placeholder="e.g. Hyderabad, Telangana" value={profile.address || ''} onChange={e => handleChange('address', e.target.value)} />
            </div>
          </div>

          {/* Medical Info */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🩸 Medical information</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Blood group</label>
              <select style={styles.input} value={profile.blood_group || ''} onChange={e => handleChange('blood_group', e.target.value)}>
                <option value="">Select blood group</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {profile.blood_group && (
              <div style={styles.bloodBadge}>
                <span style={styles.bloodIcon}>🩸</span>
                <div>
                  <div style={styles.bloodLabel}>Blood group</div>
                  <div style={styles.bloodValue}>{profile.blood_group}</div>
                </div>
              </div>
            )}

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Contact number</label>
              <input style={styles.input} type="tel" placeholder="e.g. +91 9876543210" value={profile.contact || ''} onChange={e => handleChange('contact', e.target.value)} />
            </div>
          </div>

          {/* Emergency Contact */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>🚨 Emergency contact</h3>
            <p style={styles.cardSub}>Who should doctors call in an emergency?</p>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Contact name</label>
              <input style={styles.input} placeholder="e.g. Gandhi Yenugu (Father)" value={profile.emergency_contact_name || ''} onChange={e => handleChange('emergency_contact_name', e.target.value)} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Contact number</label>
              <input style={styles.input} type="tel" placeholder="e.g. +91 9876543210" value={profile.emergency_contact || ''} onChange={e => handleChange('emergency_contact', e.target.value)} />
            </div>
            <div style={styles.emergencyPreview}>
              <div style={styles.emergencyPreviewTitle}>📋 Preview</div>
              <div style={styles.emergencyPreviewBody}>
                {profile.emergency_contact_name || 'Contact name'} — {profile.emergency_contact || 'Contact number'}
              </div>
            </div>
          </div>

          {/* Profile Summary */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 Profile summary</h3>
            <p style={styles.cardSub}>This is how your profile appears in emergency view.</p>
            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Name</span>
                <span style={styles.summaryValue}>{profile.name || '—'}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>DOB</span>
                <span style={styles.summaryValue}>{profile.dob || '—'}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Gender</span>
                <span style={styles.summaryValue}>{profile.gender || '—'}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Blood group</span>
                <span style={{ ...styles.summaryValue, fontWeight: '800', color: '#c0392b' }}>{profile.blood_group || '—'}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Contact</span>
                <span style={styles.summaryValue}>{profile.contact || '—'}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Emergency</span>
                <span style={styles.summaryValue}>{profile.emergency_contact_name || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#fdf6ee', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '18px', color: '#7a6652' },
  content: { padding: '40px 60px' },
  headerRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#3d2e1e', margin: '0 0 6px' },
  pageSub: { fontSize: '15px', color: '#a89880', margin: 0 },
  saveBtn: { background: '#3d2e1e', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' },
  card: { background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #ede8e0', boxShadow: '0 4px 20px rgba(61,46,30,0.06)' },
  cardTitle: { fontSize: '16px', fontWeight: '800', color: '#3d2e1e', margin: '0 0 6px' },
  cardSub: { fontSize: '13px', color: '#a89880', margin: '0 0 20px' },
  fieldGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#7a6652', marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: '2px solid #ede8e0', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#3d2e1e', background: 'white', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '11px 14px', border: '2px solid #ede8e0', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#3d2e1e', background: 'white', boxSizing: 'border-box', height: '80px', resize: 'vertical' },
  bloodBadge: { display: 'flex', alignItems: 'center', gap: '12px', background: '#fff1f1', border: '1px solid #f5c6c6', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' },
  bloodIcon: { fontSize: '28px' },
  bloodLabel: { fontSize: '12px', color: '#a89880', marginBottom: '2px' },
  bloodValue: { fontSize: '22px', fontWeight: '900', color: '#c0392b' },
  emergencyPreview: { background: '#fff1f1', border: '1px solid #f5c6c6', borderRadius: '10px', padding: '14px', marginTop: '8px' },
  emergencyPreviewTitle: { fontSize: '12px', fontWeight: '700', color: '#c0392b', marginBottom: '6px' },
  emergencyPreviewBody: { fontSize: '14px', color: '#3d2e1e', fontWeight: '500' },
  summaryBox: { background: '#fdf6ee', borderRadius: '10px', padding: '16px', border: '1px solid #ede8e0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ede8e0' },
  summaryLabel: { fontSize: '13px', color: '#a89880', fontWeight: '500' },
  summaryValue: { fontSize: '13px', color: '#3d2e1e', fontWeight: '600' },
};

export default ProfilePage;

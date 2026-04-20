import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function EmergencyView() {
  const { userId } = useParams();
  const [data, setData] = useState({ allergies: [], medicines: [], surgeries: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [a, m, s] = await Promise.all([
        supabase.from('allergies').select('*').eq('user_id', userId),
        supabase.from('medicines').select('*').eq('user_id', userId),
        supabase.from('surgeries').select('*').eq('user_id', userId),
      ]);
      setData({ allergies: a.data || [], medicines: m.data || [], surgeries: s.data || [] });
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  if (loading) return <div style={styles.loading}>Loading emergency profile...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.emergencyBadge}>🚨 EMERGENCY MEDICAL PROFILE</div>
          <h1 style={styles.title}>MediVault</h1>
          <p style={styles.subtitle}>This is a read-only emergency medical profile. For use by medical professionals only.</p>
        </div>
        <button style={styles.printBtn} onClick={() => window.print()}>🖨️ Print</button>
      </div>

      <div style={styles.content}>
        {/* Allergies */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🌿</span>
            <h2 style={styles.cardTitle}>Allergies</h2>
            <span style={styles.cardCount}>{data.allergies.length}</span>
          </div>
          {data.allergies.length === 0 ? (
            <p style={styles.empty}>No allergies recorded</p>
          ) : (
            data.allergies.map(a => (
              <div key={a.id} style={styles.item}>
                <div style={styles.itemLeft}>
                  <span style={{
                    ...styles.severityBadge,
                    background: a.severity === 'severe' ? '#fff1f1' : a.severity === 'moderate' ? '#fff7ed' : '#f0fdf4',
                    color: a.severity === 'severe' ? '#c0392b' : a.severity === 'moderate' ? '#c2410c' : '#2d7a4a',
                  }}>
                    {a.severity}
                  </span>
                  <div>
                    <div style={styles.itemName}>{a.name}</div>
                    {a.notes && <div style={styles.itemNotes}>{a.notes}</div>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Medicines */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>💊</span>
            <h2 style={styles.cardTitle}>Current Medicines</h2>
            <span style={styles.cardCount}>{data.medicines.length}</span>
          </div>
          {data.medicines.length === 0 ? (
            <p style={styles.empty}>No medicines recorded</p>
          ) : (
            data.medicines.map(m => (
              <div key={m.id} style={styles.item}>
                <div style={styles.itemName}>{m.name}</div>
                <div style={styles.metaRow}>
                  {m.dosage && <span style={styles.metaTag}>{m.dosage}</span>}
                  {m.frequency && <span style={styles.metaTag}>{m.frequency}</span>}
                  {m.notes && <span style={styles.itemNotes}>{m.notes}</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Surgeries */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🏨</span>
            <h2 style={styles.cardTitle}>Past Surgeries</h2>
            <span style={styles.cardCount}>{data.surgeries.length}</span>
          </div>
          {data.surgeries.length === 0 ? (
            <p style={styles.empty}>No surgeries recorded</p>
          ) : (
            data.surgeries.map(s => (
              <div key={s.id} style={styles.item}>
                <div style={styles.itemName}>{s.name}</div>
                <div style={styles.metaRow}>
                  {s.surgery_date && <span style={styles.metaTag}>📅 {s.surgery_date}</span>}
                  {s.hospital && <span style={styles.metaTag}>🏥 {s.hospital}</span>}
                  {s.surgeon && <span style={styles.metaTag}>👨‍⚕️ {s.surgeon}</span>}
                </div>
                {s.notes && <div style={styles.itemNotes}>{s.notes}</div>}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.footer}>
        Powered by MediVault • This profile was created by the patient for emergency use
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#fdf6ee', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontSize: '18px', color: '#7a6652' },
  header: { background: '#3d2e1e', padding: '32px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: {},
  emergencyBadge: { background: '#c0392b', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', marginBottom: '12px', letterSpacing: '1px' },
  title: { fontSize: '32px', fontWeight: '900', color: 'white', margin: '0 0 8px' },
  subtitle: { fontSize: '14px', color: '#c4ab94', margin: 0 },
  printBtn: { background: 'white', color: '#3d2e1e', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  content: { padding: '40px 60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
  card: { background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #ede8e0', boxShadow: '0 4px 20px rgba(61,46,30,0.06)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #ede8e0' },
  cardIcon: { fontSize: '24px' },
  cardTitle: { fontSize: '18px', fontWeight: '800', color: '#3d2e1e', margin: 0, flex: 1 },
  cardCount: { background: '#fdf0e4', color: '#b5541a', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' },
  empty: { color: '#a89880', fontSize: '14px', textAlign: 'center', padding: '20px 0' },
  item: { padding: '12px 0', borderBottom: '1px solid #fdf6ee' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  severityBadge: { padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize', whiteSpace: 'nowrap' },
  itemName: { fontSize: '15px', fontWeight: '700', color: '#3d2e1e', marginBottom: '4px' },
  itemNotes: { fontSize: '13px', color: '#a89880' },
  metaRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' },
  metaTag: { background: '#fdf0e4', color: '#b5541a', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' },
  footer: { textAlign: 'center', padding: '24px', fontSize: '13px', color: '#a89880', borderTop: '1px solid #ede8e0' },
};

export default EmergencyView;

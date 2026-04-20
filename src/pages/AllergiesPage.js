import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

function AllergiesPage() {
  const navigate = useNavigate();
  const [allergies, setAllergies] = useState([]);
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState('mild');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      fetchAllergies(user.id);
    };
    check();
  }, [navigate]);

  const fetchAllergies = async (userId) => {
    const { data } = await supabase.from('allergies').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setAllergies(data || []);
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('allergies').insert({ user_id: user.id, name, severity, notes });
    setName(''); setNotes(''); setSeverity('mild');
    fetchAllergies(user.id);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('allergies').delete().eq('id', id);
    fetchAllergies(user.id);
  };

  const severityColor = (s) => s === 'severe' ? '#fff1f1' : s === 'moderate' ? '#fff7ed' : '#f0fdf4';
  const severityText = (s) => s === 'severe' ? '#c0392b' : s === 'moderate' ? '#c2410c' : '#2d7a4a';

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>🌿 Allergies</h1>
        <p style={styles.pageSub}>Track all your known allergies so doctors are always informed.</p>

        {/* Add Form */}
        <div style={styles.form}>
          <h3 style={styles.formTitle}>Add new allergy</h3>
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Allergy name</label>
              <input style={styles.input} placeholder="e.g. Penicillin" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Severity</label>
              <select style={styles.input} value={severity} onChange={e => setSeverity(e.target.value)}>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Notes (optional)</label>
              <input style={styles.input} placeholder="e.g. Causes rash" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <button style={styles.addBtn} onClick={handleAdd} disabled={loading}>
              {loading ? 'Adding...' : '+ Add'}
            </button>
          </div>
        </div>

        {/* List */}
        <div style={styles.list}>
          {allergies.length === 0 ? (
            <div style={styles.empty}>No allergies added yet. Add your first one above!</div>
          ) : (
            allergies.map(a => (
              <div key={a.id} style={styles.item}>
                <div style={styles.itemLeft}>
                  <span style={{ ...styles.severityBadge, background: severityColor(a.severity), color: severityText(a.severity) }}>
                    {a.severity}
                  </span>
                  <div>
                    <div style={styles.itemName}>{a.name}</div>
                    {a.notes && <div style={styles.itemNotes}>{a.notes}</div>}
                  </div>
                </div>
                <button style={styles.deleteBtn} onClick={() => handleDelete(a.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#fdf6ee', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  content: { padding: '40px 60px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#3d2e1e', margin: '0 0 6px' },
  pageSub: { fontSize: '15px', color: '#a89880', margin: '0 0 32px' },
  form: { background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #ede8e0', marginBottom: '28px', boxShadow: '0 4px 20px rgba(61,46,30,0.06)' },
  formTitle: { fontSize: '16px', fontWeight: '700', color: '#3d2e1e', margin: '0 0 20px' },
  formRow: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
  inputGroup: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '160px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#7a6652', marginBottom: '6px' },
  input: { padding: '11px 14px', border: '2px solid #ede8e0', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#3d2e1e', background: 'white' },
  addBtn: { background: '#3d2e1e', color: 'white', border: 'none', padding: '11px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty: { textAlign: 'center', color: '#a89880', fontSize: '15px', padding: '40px', background: 'white', borderRadius: '16px', border: '1px solid #ede8e0' },
  item: { background: 'white', borderRadius: '14px', padding: '18px 24px', border: '1px solid #ede8e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(61,46,30,0.05)' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  severityBadge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' },
  itemName: { fontSize: '15px', fontWeight: '700', color: '#3d2e1e' },
  itemNotes: { fontSize: '13px', color: '#a89880', marginTop: '2px' },
  deleteBtn: { background: '#fff1f1', color: '#c0392b', border: '1px solid #f5c6c6', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' },
};

export default AllergiesPage;

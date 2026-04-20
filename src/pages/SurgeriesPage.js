import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

function SurgeriesPage() {
  const navigate = useNavigate();
  const [surgeries, setSurgeries] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [hospital, setHospital] = useState('');
  const [surgeon, setSurgeon] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      fetchSurgeries(user.id);
    };
    check();
  }, [navigate]);

  const fetchSurgeries = async (userId) => {
    const { data } = await supabase.from('surgeries').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setSurgeries(data || []);
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('surgeries').insert({ user_id: user.id, name, surgery_date: date || null, hospital, surgeon, notes });
    setName(''); setDate(''); setHospital(''); setSurgeon(''); setNotes('');
    fetchSurgeries(user.id);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('surgeries').delete().eq('id', id);
    fetchSurgeries(user.id);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>🏨 Surgeries</h1>
        <p style={styles.pageSub}>Log all past surgeries so doctors have your complete history.</p>

        <div style={styles.form}>
          <h3 style={styles.formTitle}>Add new surgery</h3>
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Surgery name</label>
              <input style={styles.input} placeholder="e.g. Appendectomy" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Date</label>
              <input style={styles.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hospital</label>
              <input style={styles.input} placeholder="e.g. Apollo Hospital" value={hospital} onChange={e => setHospital(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Surgeon</label>
              <input style={styles.input} placeholder="e.g. Dr. Sharma" value={surgeon} onChange={e => setSurgeon(e.target.value)} />
            </div>
            <button style={styles.addBtn} onClick={handleAdd} disabled={loading}>
              {loading ? 'Adding...' : '+ Add'}
            </button>
          </div>
        </div>

        <div style={styles.list}>
          {surgeries.length === 0 ? (
            <div style={styles.empty}>No surgeries added yet. Add your first one above!</div>
          ) : (
            surgeries.map(s => (
              <div key={s.id} style={styles.item}>
                <div style={styles.itemLeft}>
                  <span style={styles.icon}>🏨</span>
                  <div>
                    <div style={styles.itemName}>{s.name}</div>
                    <div style={styles.itemMeta}>
                      {s.surgery_date && <span style={styles.metaTag}>📅 {s.surgery_date}</span>}
                      {s.hospital && <span style={styles.metaTag}>🏥 {s.hospital}</span>}
                      {s.surgeon && <span style={styles.metaTag}>👨‍⚕️ {s.surgeon}</span>}
                    </div>
                    {s.notes && <div style={styles.itemNotes}>{s.notes}</div>}
                  </div>
                </div>
                <button style={styles.deleteBtn} onClick={() => handleDelete(s.id)}>Delete</button>
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
  inputGroup: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '140px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#7a6652', marginBottom: '6px' },
  input: { padding: '11px 14px', border: '2px solid #ede8e0', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#3d2e1e', background: 'white' },
  addBtn: { background: '#3d2e1e', color: 'white', border: 'none', padding: '11px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty: { textAlign: 'center', color: '#a89880', fontSize: '15px', padding: '40px', background: 'white', borderRadius: '16px', border: '1px solid #ede8e0' },
  item: { background: 'white', borderRadius: '14px', padding: '18px 24px', border: '1px solid #ede8e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(61,46,30,0.05)' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  icon: { fontSize: '28px' },
  itemName: { fontSize: '15px', fontWeight: '700', color: '#3d2e1e', marginBottom: '4px' },
  itemMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' },
  metaTag: { background: '#fdf0e4', color: '#b5541a', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' },
  itemNotes: { fontSize: '13px', color: '#a89880' },
  deleteBtn: { background: '#fff1f1', color: '#c0392b', border: '1px solid #f5c6c6', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' },
};

export default SurgeriesPage;

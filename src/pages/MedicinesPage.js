import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

function MedicinesPage() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/auth'); return; }
      fetchMedicines(user.id);
    };
    check();
  }, [navigate]);

  const fetchMedicines = async (userId) => {
    const { data } = await supabase.from('medicines').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setMedicines(data || []);
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('medicines').insert({ user_id: user.id, name, dosage, frequency, notes });
    setName(''); setDosage(''); setFrequency(''); setNotes('');
    fetchMedicines(user.id);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('medicines').delete().eq('id', id);
    fetchMedicines(user.id);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>💊 Medicines</h1>
        <p style={styles.pageSub}>Keep track of all your current and past medications.</p>

        <div style={styles.form}>
          <h3 style={styles.formTitle}>Add new medicine</h3>
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Medicine name</label>
              <input style={styles.input} placeholder="e.g. Metformin" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Dosage</label>
              <input style={styles.input} placeholder="e.g. 500mg" value={dosage} onChange={e => setDosage(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Frequency</label>
              <input style={styles.input} placeholder="e.g. Twice daily" value={frequency} onChange={e => setFrequency(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Notes (optional)</label>
              <input style={styles.input} placeholder="e.g. After meals" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <button style={styles.addBtn} onClick={handleAdd} disabled={loading}>
              {loading ? 'Adding...' : '+ Add'}
            </button>
          </div>
        </div>

        <div style={styles.list}>
          {medicines.length === 0 ? (
            <div style={styles.empty}>No medicines added yet. Add your first one above!</div>
          ) : (
            medicines.map(m => (
              <div key={m.id} style={styles.item}>
                <div style={styles.itemLeft}>
                  <span style={styles.pillBadge}>💊</span>
                  <div>
                    <div style={styles.itemName}>{m.name}</div>
                    <div style={styles.itemMeta}>
                      {m.dosage && <span style={styles.metaTag}>{m.dosage}</span>}
                      {m.frequency && <span style={styles.metaTag}>{m.frequency}</span>}
                      {m.notes && <span style={styles.metaTag}>{m.notes}</span>}
                    </div>
                  </div>
                </div>
                <button style={styles.deleteBtn} onClick={() => handleDelete(m.id)}>Delete</button>
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
  pillBadge: { fontSize: '28px' },
  itemName: { fontSize: '15px', fontWeight: '700', color: '#3d2e1e', marginBottom: '4px' },
  itemMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  metaTag: { background: '#fdf0e4', color: '#b5541a', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' },
  deleteBtn: { background: '#fff1f1', color: '#c0392b', border: '1px solid #f5c6c6', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' },
};

export default MedicinesPage;

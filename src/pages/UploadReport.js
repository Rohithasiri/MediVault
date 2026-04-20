import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import Tesseract from 'tesseract.js';

function UploadReport() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extracted, setExtracted] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setExtracted(null);
    setSaved(false);
    setError('');
    if (f && f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const parseText = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const allergies = [];
    const medicines = [];
    const surgeries = [];

    const allergyKeywords = ['allerg', 'hypersensitiv', 'reaction to', 'intoleran'];
    const medicineKeywords = ['mg', 'tablet', 'capsule', 'syrup', 'injection', 'dose', 'tab ', 'cap ', 'rx', 'prescribed', 'medicine', 'drug'];
    const surgeryKeywords = ['surgery', 'operation', 'procedure', 'operated', 'appendect', 'bypass', 'transplant', 'removal', 'excision'];
    const severityWords = ['severe', 'moderate', 'mild'];

    lines.forEach(line => {
      const lower = line.toLowerCase();

      if (allergyKeywords.some(k => lower.includes(k))) {
        let severity = 'mild';
        severityWords.forEach(s => { if (lower.includes(s)) severity = s; });
        allergies.push({ name: line.substring(0, 60), severity, notes: '' });
        return;
      }

      if (surgeryKeywords.some(k => lower.includes(k))) {
        surgeries.push({ name: line.substring(0, 60), surgery_date: '', hospital: '', surgeon: '', notes: '' });
        return;
      }

      if (medicineKeywords.some(k => lower.includes(k))) {
        const parts = line.split(/\s+/);
        const name = parts.slice(0, 3).join(' ');
        const dosage = parts.find(p => /\d+mg|\d+ml/i.test(p)) || '';
        const frequency = parts.find(p => /daily|twice|thrice|od|bd|tds|qid/i.test(p)) || '';
        medicines.push({ name, dosage, frequency, notes: line.substring(0, 80) });
        return;
      }
    });

    return { allergies, medicines, surgeries };
  };

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setExtracted(null);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });

      const text = result.data.text;
      console.log('OCR Text:', text);

      if (!text.trim()) {
        setError('Could not read text from image. Try a clearer photo.');
        setLoading(false);
        return;
      }

      const parsed = parseText(text);
      setExtracted({ ...parsed, rawText: text });
    } catch (err) {
      setError('OCR failed: ' + err.message);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!extracted) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/auth'); return; }

    const promises = [];
    if (extracted.allergies?.length > 0) {
      promises.push(supabase.from('allergies').insert(
        extracted.allergies.map(a => ({ user_id: user.id, name: a.name, severity: a.severity || 'mild', notes: a.notes || '' }))
      ));
    }
    if (extracted.medicines?.length > 0) {
      promises.push(supabase.from('medicines').insert(
        extracted.medicines.map(m => ({ user_id: user.id, name: m.name, dosage: m.dosage || '', frequency: m.frequency || '', notes: m.notes || '' }))
      ));
    }
    if (extracted.surgeries?.length > 0) {
      promises.push(supabase.from('surgeries').insert(
        extracted.surgeries.map(s => ({ user_id: user.id, name: s.name, surgery_date: s.surgery_date || null, hospital: s.hospital || '', surgeon: s.surgeon || '', notes: s.notes || '' }))
      ));
    }
    await Promise.all(promises);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h1 style={styles.pageTitle}>📋 Upload Medical Report</h1>
        <p style={styles.pageSub}>Upload a medical report image and OCR will automatically read and extract your medical data.</p>

        <div style={styles.uploadBox}>
          <div style={styles.uploadIcon}>📤</div>
          <p style={styles.uploadText}>Upload your medical report (image)</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.fileInput}
            id="fileInput"
          />
          <label htmlFor="fileInput" style={styles.fileLabel}>
            {file ? `✅ ${file.name}` : 'Choose image'}
          </label>

          {preview && (
            <img src={preview} alt="preview" style={styles.preview} />
          )}

          {file && !loading && (
            <button style={styles.extractBtn} onClick={handleExtract}>
              🔍 Scan with OCR
            </button>
          )}

          {loading && (
            <div style={styles.progressBox}>
              <div style={styles.progressLabel}>🔍 Scanning... {progress}%</div>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressBar, width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {extracted && (
          <div style={styles.results}>
            <h2 style={styles.resultsTitle}>✅ Extracted data — please review</h2>

            {extracted.allergies?.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>🌿 Allergies ({extracted.allergies.length})</h3>
                {extracted.allergies.map((a, i) => (
                  <div key={i} style={styles.resultItem}>
                    <strong>{a.name}</strong>
                    {a.severity && <span style={styles.tag}>{a.severity}</span>}
                  </div>
                ))}
              </div>
            )}

            {extracted.medicines?.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>💊 Medicines ({extracted.medicines.length})</h3>
                {extracted.medicines.map((m, i) => (
                  <div key={i} style={styles.resultItem}>
                    <strong>{m.name}</strong>
                    {m.dosage && <span style={styles.tag}>{m.dosage}</span>}
                    {m.frequency && <span style={styles.tag}>{m.frequency}</span>}
                  </div>
                ))}
              </div>
            )}

            {extracted.surgeries?.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>🏨 Surgeries ({extracted.surgeries.length})</h3>
                {extracted.surgeries.map((s, i) => (
                  <div key={i} style={styles.resultItem}>
                    <strong>{s.name}</strong>
                  </div>
                ))}
              </div>
            )}

            {extracted.rawText && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>📄 Raw scanned text</h3>
                <div style={styles.rawText}>{extracted.rawText}</div>
              </div>
            )}

            {extracted.allergies?.length === 0 && extracted.medicines?.length === 0 && extracted.surgeries?.length === 0 && (
              <div style={styles.emptyResult}>
                No medical data auto-detected. You can still see the raw text above and manually add items.
              </div>
            )}

            {(extracted.allergies?.length > 0 || extracted.medicines?.length > 0 || extracted.surgeries?.length > 0) && (
              !saved ? (
                <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save all to my profile'}
                </button>
              ) : (
                <div style={styles.successBox}>
                  ✅ All data saved to your profile!
                  <button style={styles.dashBtn} onClick={() => navigate('/dashboard')}>Go to dashboard →</button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#fdf6ee', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  content: { padding: '40px 60px', maxWidth: '800px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#3d2e1e', margin: '0 0 6px' },
  pageSub: { fontSize: '15px', color: '#a89880', margin: '0 0 32px' },
  uploadBox: { background: 'white', borderRadius: '20px', padding: '40px', border: '2px dashed #d9cfc4', textAlign: 'center', marginBottom: '24px' },
  uploadIcon: { fontSize: '48px', marginBottom: '12px' },
  uploadText: { fontSize: '16px', color: '#7a6652', marginBottom: '20px' },
  fileInput: { display: 'none' },
  fileLabel: { display: 'inline-block', background: '#fdf0e4', color: '#b5541a', border: '2px solid #e8c9a8', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' },
  preview: { display: 'block', maxWidth: '100%', maxHeight: '300px', margin: '16px auto', borderRadius: '10px', border: '1px solid #ede8e0' },
  extractBtn: { display: 'block', margin: '16px auto 0', background: '#3d2e1e', color: 'white', border: 'none', padding: '13px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  progressBox: { marginTop: '20px' },
  progressLabel: { fontSize: '14px', color: '#7a6652', marginBottom: '8px' },
  progressTrack: { background: '#fdf0e4', borderRadius: '10px', height: '10px', overflow: 'hidden' },
  progressBar: { background: '#3d2e1e', height: '100%', borderRadius: '10px', transition: 'width 0.3s' },
  error: { background: '#fff1f1', color: '#c0392b', border: '1px solid #f5c6c6', borderRadius: '10px', padding: '14px', fontSize: '14px', marginBottom: '20px' },
  results: { background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #ede8e0', boxShadow: '0 4px 20px rgba(61,46,30,0.06)' },
  resultsTitle: { fontSize: '18px', fontWeight: '800', color: '#3d2e1e', margin: '0 0 24px' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '15px', fontWeight: '700', color: '#7a6652', margin: '0 0 12px' },
  resultItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #fdf0e4', flexWrap: 'wrap' },
  tag: { background: '#fdf0e4', color: '#b5541a', padding: '3px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '500' },
  rawText: { background: '#fafafa', border: '1px solid #ede8e0', borderRadius: '10px', padding: '16px', fontSize: '13px', color: '#555', fontFamily: 'monospace', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' },
  emptyResult: { textAlign: 'center', color: '#a89880', fontSize: '14px', padding: '20px 0' },
  saveBtn: { background: '#3d2e1e', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
  successBox: { background: '#edfbf0', color: '#2d7a4a', border: '1px solid #a8e6bc', borderRadius: '10px', padding: '16px 20px', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  dashBtn: { background: '#2d7a4a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' },
};

export default UploadReport;

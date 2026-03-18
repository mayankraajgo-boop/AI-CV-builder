import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

// Simple text extraction from PDF using FileReader + basic parsing
// (no external lib needed — reads raw text from PDF binary)
const extractTextFromPDF = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      // Extract readable ASCII text from PDF binary
      const cleaned = text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ');
      resolve(cleaned);
    };
    reader.readAsBinaryString(file);
  });
};

const parseResumeText = (text) => {
  const lines = text.split(/\s{2,}|\n/).map(l => l.trim()).filter(Boolean);

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,15}\d)/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // Name — usually first non-empty line
  const name = lines[0] || '';

  // Skills — look for common skill keywords
  const skillKeywords = ['JavaScript', 'Python', 'React', 'Node', 'Java', 'CSS', 'HTML', 'SQL',
    'TypeScript', 'MongoDB', 'Express', 'AWS', 'Docker', 'Git', 'Angular', 'Vue', 'PHP',
    'C++', 'C#', 'Ruby', 'Swift', 'Kotlin', 'Flutter', 'Django', 'Spring', 'Redis', 'GraphQL'];
  const foundSkills = skillKeywords.filter(s => new RegExp(s, 'i').test(text));

  // Summary — look for text after "summary" or "objective" keyword
  const summaryMatch = text.match(/(?:summary|objective|profile)[:\s]+([^.]{20,200}\.)/i);
  const summary = summaryMatch ? summaryMatch[1].trim() : '';

  // Location — look for city, state pattern
  const locationMatch = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?,\s*[A-Z]{2})/);
  const location = locationMatch ? locationMatch[0] : '';

  return {
    personalInfo: { fullName: name, email, phone, location, summary, linkedin: '', website: '' },
    skills: foundSkills,
    experience: [],
    education: [],
    projects: [],
  };
};

const PDFImport = ({ onImport, onClose }) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    setLoading(true);
    try {
      const text = await extractTextFromPDF(file);
      const parsed = parseResumeText(text);
      onImport(parsed);
      toast.success('Resume imported! Review and edit the extracted data.');
      onClose();
    } catch {
      toast.error('Failed to parse PDF. Please fill in manually.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 20, padding: 32, maxWidth: 480, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 0 }}>
            <i className="fas fa-file-import me-2" style={{ color: '#4F46E5' }}></i>Import PDF Resume
          </h5>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#4F46E5' : '#334155'}`,
            borderRadius: 12,
            padding: '40px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(79,70,229,0.08)' : 'rgba(15,23,42,0.5)',
            transition: 'all 0.2s',
            marginBottom: 16,
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />
          {loading ? (
            <div>
              <div className="spinner-border" style={{ color: '#4F46E5', marginBottom: 12 }}></div>
              <p style={{ color: '#94A3B8', marginBottom: 0 }}>Extracting data...</p>
            </div>
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt" style={{ fontSize: 40, color: '#4F46E5', marginBottom: 12, display: 'block' }}></i>
              <p style={{ color: '#E2E8F0', fontWeight: 600, marginBottom: 4 }}>Drop your PDF here or click to browse</p>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: 0 }}>Supports PDF files up to 10MB</p>
            </>
          )}
        </div>

        <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 10, padding: '12px 16px' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: 0 }}>
            <i className="fas fa-info-circle me-2" style={{ color: '#4F46E5' }}></i>
            We'll extract your name, email, phone, skills, and more. You can edit everything after import.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDFImport;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteResume } from '../store/resumeSlice';
import toast from 'react-hot-toast';

const ResumeCard = ({ resume }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Delete this resume?')) {
      await dispatch(deleteResume(resume._id));
      toast.success('Resume deleted');
    }
  };

  const updatedDate = new Date(resume.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const scoreColor = resume.atsScore >= 80 ? '#10B981' : resume.atsScore >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div
      className="card h-100"
      style={{ cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
      onClick={() => navigate(`/builder/${resume._id}`)}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(79,70,229,0.25)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg,#4F46E5,#7C3AED)', position: 'absolute', top: 0, left: 0, right: 0 }} />

      <div className="card-body p-4">
        {/* Template badge */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span style={{ background: 'rgba(79,70,229,0.15)', color: '#818CF8', fontSize: '0.7rem', padding: '3px 10px', borderRadius: 20, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {resume.templateId || 'Modern'}
          </span>
          {resume.atsScore > 0 && (
            <span style={{ color: scoreColor, fontSize: '0.75rem', fontWeight: 700 }}>
              ATS {resume.atsScore}%
            </span>
          )}
        </div>

        {/* Resume icon */}
        <div style={{ width: 48, height: 60, background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <i className="fas fa-file-alt" style={{ color: '#4F46E5', fontSize: 20 }}></i>
        </div>

        <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{resume.title}</h6>
        <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: 0 }}>
          {resume.personalInfo?.fullName || 'No name set'}
        </p>
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center" style={{ background: 'rgba(0,0,0,0.2)', border: 'none', padding: '10px 16px' }}>
        <span style={{ color: '#64748B', fontSize: '0.75rem' }}>
          <i className="fas fa-clock me-1"></i>{updatedDate}
        </span>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(79,70,229,0.15)', color: '#818CF8', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem' }}
            onClick={(e) => { e.stopPropagation(); navigate(`/builder/${resume._id}`); }}
          >
            <i className="fas fa-edit me-1"></i>Edit
          </button>
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: '0.75rem' }}
            onClick={handleDelete}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;

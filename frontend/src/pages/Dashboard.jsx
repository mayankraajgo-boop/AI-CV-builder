import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchResumes, createResume, deleteResume, updateResume } from '../store/resumeSlice';
import DashboardLayout from '../layouts/DashboardMain';
import toast from 'react-hot-toast';

const SkeletonCard = () => (
  <div className="card p-4">
    <div className="skeleton mb-3" style={{ height: 20, width: '40%' }}></div>
    <div className="skeleton mb-2" style={{ height: 60 }}></div>
    <div className="skeleton" style={{ height: 14, width: '60%' }}></div>
  </div>
);

const ResumeCard = ({ resume, onDuplicate, onRename }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(resume.title);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (window.confirm(`Delete "${resume.title}"?`)) {
      await dispatch(deleteResume(resume._id));
      toast.success('Resume deleted');
    }
  };

  const handleRename = async (e) => {
    e.stopPropagation();
    if (!newTitle.trim()) return;
    await dispatch(updateResume({ id: resume._id, data: { ...resume, title: newTitle.trim() } }));
    setRenaming(false);
    toast.success('Renamed!');
  };

  const updatedDate = new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const scoreColor = resume.atsScore >= 80 ? '#10B981' : resume.atsScore >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="card h-100" style={{ cursor: 'pointer', transition: 'all 0.25s', position: 'relative', overflow: 'visible' }}
      onClick={() => !renaming && navigate(`/builder/${resume._id}`)}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(79,70,229,0.25)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ height: 3, background: 'linear-gradient(90deg,#4F46E5,#7C3AED)', position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '12px 12px 0 0' }} />

      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <span style={{ background: 'rgba(79,70,229,0.15)', color: '#818CF8', fontSize: '0.7rem', padding: '3px 10px', borderRadius: 20, fontWeight: 600, textTransform: 'uppercase' }}>
            {resume.templateId || 'Modern'}
          </span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(p => !p); }}
              style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: '2px 6px', borderRadius: 4, fontSize: 16 }}
            >⋮</button>
            {showMenu && (
              <div style={{ position: 'absolute', right: 0, top: '100%', background: '#1E293B', border: '1px solid #334155', borderRadius: 10, padding: '6px 0', zIndex: 50, minWidth: 140, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                onClick={(e) => e.stopPropagation()}>
                <button onClick={(e) => { e.stopPropagation(); navigate(`/builder/${resume._id}`); setShowMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'none', border: 'none', color: '#E2E8F0', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <i className="fas fa-edit" style={{ color: '#4F46E5', width: 14 }}></i>Edit
                </button>
                <button onClick={(e) => { e.stopPropagation(); setRenaming(true); setShowMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'none', border: 'none', color: '#E2E8F0', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <i className="fas fa-pen" style={{ color: '#F59E0B', width: 14 }}></i>Rename
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDuplicate(resume); setShowMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'none', border: 'none', color: '#E2E8F0', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <i className="fas fa-copy" style={{ color: '#10B981', width: 14 }}></i>Duplicate
                </button>
                <div style={{ height: 1, background: '#334155', margin: '4px 0' }} />
                <button onClick={handleDelete}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <i className="fas fa-trash" style={{ width: 14 }}></i>Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ width: 48, height: 60, background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <i className="fas fa-file-alt" style={{ color: '#4F46E5', fontSize: 20 }}></i>
        </div>

        {renaming ? (
          <div onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              className="form-control form-control-sm mb-2"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRename(e); if (e.key === 'Escape') setRenaming(false); }}
            />
            <div className="d-flex gap-2">
              <button onClick={handleRename} className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>Save</button>
              <button onClick={(e) => { e.stopPropagation(); setRenaming(false); }} className="btn btn-sm" style={{ fontSize: '0.75rem', padding: '3px 10px', background: '#334155', color: '#94A3B8', border: 'none' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h6 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{resume.title}</h6>
            <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: 0 }}>{resume.personalInfo?.fullName || 'No name set'}</p>
          </>
        )}
      </div>

      <div className="card-footer d-flex justify-content-between align-items-center" style={{ background: 'rgba(0,0,0,0.2)', border: 'none', padding: '10px 16px' }}>
        <span style={{ color: '#64748B', fontSize: '0.75rem' }}>
          <i className="fas fa-clock me-1"></i>{updatedDate}
        </span>
        {resume.atsScore > 0 && (
          <span style={{ color: scoreColor, fontSize: '0.75rem', fontWeight: 700 }}>ATS {resume.atsScore}%</span>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, loading } = useSelector((s) => s.resume);
  const { user } = useSelector((s) => s.auth);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('updated');

  useEffect(() => { dispatch(fetchResumes()); }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => document.querySelectorAll('[data-menu]').forEach(el => el.style.display = 'none');
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleCreate = async () => {
    const result = await dispatch(createResume({ title: 'Untitled Resume' }));
    if (!result.error) {
      navigate(`/builder/${result.payload.resume._id}`);
      toast.success('New resume created!');
    }
  };

  const handleDuplicate = async (resume) => {
    const { _id, createdAt, updatedAt, __v, ...data } = resume;
    const result = await dispatch(createResume({ ...data, title: `${resume.title} (Copy)` }));
    if (!result.error) toast.success('Resume duplicated!');
  };

  const filtered = resumes
    .filter(r => r.title?.toLowerCase().includes(search.toLowerCase()) || r.personalInfo?.fullName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'updated' ? new Date(b.updatedAt) - new Date(a.updatedAt) : a.title?.localeCompare(b.title));

  const stats = [
    { label: 'Total Resumes', value: resumes.length, icon: 'fas fa-file-alt', color: '#4F46E5' },
    { label: 'Avg ATS Score', value: resumes.length ? Math.round(resumes.reduce((a, r) => a + (r.atsScore || 0), 0) / resumes.length) + '%' : '—', icon: 'fas fa-chart-bar', color: '#10B981' },
    { label: 'Plan', value: 'Free', icon: 'fas fa-star', color: '#F59E0B' },
    { label: 'AI Features', value: 'Soon', icon: 'fas fa-brain', color: '#7C3AED' },
  ];

  return (
    <DashboardLayout>
      <div style={{ padding: '24px 16px' }} className="dashboard-content fade-in">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3 fade-in-up">
          <div>
            <h1 style={{ color: '#E2E8F0', fontWeight: 800, fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', marginBottom: 4 }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#64748B', marginBottom: 0, fontSize: '0.9rem' }}>Manage your resumes and track your progress</p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate} style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>
            <i className="fas fa-plus me-2"></i>New Resume
          </button>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4 stagger-children">
          {stats.map((s, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div className="card p-3 d-flex flex-row align-items-center gap-3">
                <div style={{ width: 44, height: 44, background: `${s.color}20`, border: `1px solid ${s.color}40`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={s.icon} style={{ color: s.color, fontSize: 18 }}></i>
                </div>
                <div>
                  <div style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '1.3rem', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 13 }}></i>
            <input
              className="form-control"
              placeholder="Search resumes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: 'auto', minWidth: 140 }}>
            <option value="updated">Last Updated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Resumes */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: 0, fontSize: '1rem' }}>
            <i className="fas fa-file-alt me-2" style={{ color: '#4F46E5' }}></i>My Resumes
          </h5>
          <span style={{ color: '#64748B', fontSize: '0.8rem' }}>{filtered.length} of {resumes.length}</span>
        </div>

        {loading ? (
          <div className="row g-3">
            {[1, 2, 3].map(i => <div className="col-12 col-md-6 col-lg-4" key={i}><SkeletonCard /></div>)}
          </div>
        ) : resumes.length === 0 ? (
          <div className="card p-5 text-center">
            <i className="fas fa-file-circle-plus" style={{ fontSize: 48, color: '#334155', marginBottom: 16 }}></i>
            <h5 style={{ color: '#E2E8F0', fontWeight: 700 }}>No resumes yet</h5>
            <p style={{ color: '#64748B', marginBottom: 24 }}>Create your first resume and start your job search journey</p>
            <button className="btn btn-primary mx-auto" style={{ width: 'fit-content' }} onClick={handleCreate}>
              <i className="fas fa-plus me-2"></i>Create Your First Resume
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-4 text-center">
            <i className="fas fa-search" style={{ fontSize: 32, color: '#334155', marginBottom: 12 }}></i>
            <p style={{ color: '#64748B', marginBottom: 0 }}>No resumes match "{search}"</p>
          </div>
        ) : (
          <div className="row g-3">
            {filtered.map(r => (
              <div className="col-12 col-md-6 col-lg-4" key={r._id}>
                <ResumeCard resume={r} onDuplicate={handleDuplicate} onRename={() => {}} />
              </div>
            ))}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 d-flex align-items-center justify-content-center"
                style={{ minHeight: 200, cursor: 'pointer', border: '2px dashed #334155', background: 'transparent', transition: 'all 0.25s' }}
                onClick={handleCreate}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = 'rgba(79,70,229,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#334155'; e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="text-center p-4">
                  <i className="fas fa-plus-circle" style={{ fontSize: 32, color: '#334155', marginBottom: 12 }}></i>
                  <p style={{ color: '#64748B', marginBottom: 0, fontWeight: 500 }}>Create New Resume</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAB — mobile only */}
        <button className="fab-btn" onClick={handleCreate} aria-label="Create new resume">
          <i className="fas fa-plus"></i>
        </button>

        <style>{`
          @media (min-width: 992px) { .dashboard-content { padding: 32px !important; } }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

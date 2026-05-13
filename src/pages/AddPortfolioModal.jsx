// src/pages/AddPortfolioModal.jsx
import { useState } from 'react';
import { X, Upload, Save, Loader2, AlertCircle } from 'lucide-react';

const AddPortfolioModal = ({ isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '', challenge: '', solution: '', result: '', projectUrl: '', githubUrl: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => { setFile(e.target.files[0]); setErrorMessage(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('challenge', formData.challenge);
    data.append('solution', formData.solution);
    data.append('result', formData.result);
    data.append('projectUrl', formData.projectUrl);
    data.append('githubUrl', formData.githubUrl);
    if (file) data.append('projectImage', file); // Matches upload.single('projectImage') in backend

    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/profile/portfolio', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: data,
      });

      const responseData = await response.json();

      if (response.ok) {
        onUpdate(responseData.portfolio); // Update the profile page state
        setFormData({ title: '', challenge: '', solution: '', result: '', projectUrl: '', githubUrl: '' });
        setFile(null);
        onClose();
      } else {
        setErrorMessage(responseData.message || 'Failed to add case study.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0a0f1c] border border-white/10 rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-white tracking-tight">DEPLOY NEW CASE STUDY</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-sm text-red-200">
            <AlertCircle size={20} className="text-red-400 shrink-0" /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Project Name *</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Cover Image</label>
            <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-white/10 rounded-xl hover:border-blue-500/50 transition cursor-pointer">
              <Upload size={20} className="text-gray-500 mb-2" />
              <span className="text-[10px] text-gray-500">{file ? file.name : 'Upload Project Image'}</span>
              <input type="file" hidden onChange={handleFileChange} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">The Challenge</label>
              <textarea name="challenge" rows="3" value={formData.challenge} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">The Solution *</label>
              <textarea required name="solution" rows="3" value={formData.solution} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none resize-none" />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">The Result / Impact</label>
             <input name="result" value={formData.result} onChange={handleChange} placeholder="e.g., Increased retention by 40%" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Live URL</label>
              <input name="projectUrl" value={formData.projectUrl} onChange={handleChange} placeholder="https://" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">GitHub URL</label>
              <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition disabled:opacity-50 mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? 'DEPLOYING...' : 'PUBLISH CASE STUDY'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPortfolioModal;
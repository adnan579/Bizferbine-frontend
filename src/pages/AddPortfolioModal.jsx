// src/pages/AddPortfolioModal.jsx
import { useState } from 'react';
import { X, Upload, Save, Loader2, AlertCircle } from 'lucide-react';
import apiClient from '../utils/apiClient';

const AddPortfolioModal = ({ isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '', challenge: '', solution: '', result: '', projectUrl: '', githubUrl: '', stack: ''
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
    data.append('stack', formData.stack); // New!
    if (file) data.append('projectImage', file);

    try {
      const response = await apiClient.post('/profile/portfolio', {
        body: data,
      });

      const responseData = await response.json();
      if (response.ok) {
        onUpdate(responseData.portfolio);
        setFormData({ title: '', challenge: '', solution: '', result: '', projectUrl: '', githubUrl: '', stack: '' });
        setFile(null);
        onClose();
      } else {
        setErrorMessage(responseData.message || 'Failed to deploy case study.');
      }
    } catch (err) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Project Name *</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Tech Stack (CSV)</label>
              <input name="stack" value={formData.stack} onChange={handleChange} placeholder="React, Node.js, MongoDB" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">The Solution Architecture *</label>
            <textarea required name="solution" rows="3" value={formData.solution} onChange={handleChange} placeholder="Explain how you built it and the problems you solved..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Impact Metric</label>
              <input name="result" value={formData.result} onChange={handleChange} placeholder="e.g. Scaled to 10k users" className="w-full bg-black border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Cover Image</label>
              <label className="flex items-center justify-center h-11 border border-white/10 rounded-xl hover:border-blue-500/50 transition cursor-pointer bg-black">
                <span className="text-xs text-gray-400 flex items-center gap-2"><Upload size={14}/> {file ? file.name.substring(0,20) : 'Upload Image'}</span>
                <input type="file" hidden onChange={handleFileChange} />
              </label>
            </div>
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
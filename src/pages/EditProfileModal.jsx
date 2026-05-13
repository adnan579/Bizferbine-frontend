// src/pages/EditProfileModal.jsx
import { useState, useEffect } from 'react';
import { X, Upload, Save, Loader2, AlertCircle } from 'lucide-react';

const EditProfileModal = ({ profile, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    username: profile?.username || '',
    headline: profile?.headline || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    skills: profile?.skills?.join(', ') || '',
    linkedIn: profile?.socialLinks?.linkedIn || '',
    github: profile?.socialLinks?.github || '',
  });
  
  const [files, setFiles] = useState({ profilePicture: null, profileBanner: null });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update formData when profile changes (e.g., when modal opens)
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        username: profile.username || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        skills: profile.skills?.join(', ') || '',
        linkedIn: profile.socialLinks?.linkedIn || '',
        github: profile.socialLinks?.github || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('username', formData.username);
    data.append('headline', formData.headline);
    data.append('bio', formData.bio);
    data.append('location', formData.location);
    data.append('skills', formData.skills);
    data.append('linkedIn', formData.linkedIn);
    data.append('github', formData.github);
    
    if (files.profilePicture) data.append('profilePicture', files.profilePicture);
    if (files.profileBanner) data.append('profileBanner', files.profileBanner);

    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: data, 
      });

      const responseData = await response.json();

      if (response.ok) {
        onUpdate(responseData.profile);
        
        // Update the cached user name in local storage so the top right navbar updates!
        const cachedUser = JSON.parse(localStorage.getItem('user'));
        cachedUser.name = responseData.profile.name;
        localStorage.setItem('user', JSON.stringify(cachedUser));
        
        onClose();
      } else {
        setErrorMessage(responseData.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMessage('Server Connection Error. Is your backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#0a0f1c] border-l border-white/10 h-full shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight italic">EDIT_SYSTEM_PARAMETERS</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Avatar_Node</label>
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-white/10 rounded-2xl hover:border-blue-500/50 transition cursor-pointer">
                <Upload size={20} className="text-gray-500 mb-2" />
                <span className="text-[10px] text-gray-500 truncate max-w-[150px] px-2">{files.profilePicture ? files.profilePicture.name : 'Select Image'}</span>
                <input type="file" name="profilePicture" hidden onChange={handleFileChange} />
              </label>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Banner_Vector</label>
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-white/10 rounded-2xl hover:border-purple-500/50 transition cursor-pointer">
                <Upload size={20} className="text-gray-500 mb-2" />
                <span className="text-[10px] text-gray-500 truncate max-w-[150px] px-2">{files.profileBanner ? files.profileBanner.name : 'Select Image'}</span>
                <input type="file" name="profileBanner" hidden onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Full_Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Username (@)</label>
              <input name="username" value={formData.username} onChange={handleChange} placeholder="e.g. adnansayyed" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-blue-400 focus:border-blue-500 outline-none transition" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Headline_Branding</label>
            <input name="headline" value={formData.headline} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition" />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Identity_Bio</label>
            <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Location_Node</label>
              <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Skill_Matrix (CSV)</label>
              <input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node, Figma" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition" />
            </div>
          </div>

          {/* Social Links Form Additions */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
             <div>
              <label className="block text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-2">LinkedIn URL</label>
              <input name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-2">GitHub URL</label>
              <input name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? 'UPLOADING_DATA...' : 'COMMIT_CHANGES'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
// src/pages/EditProfileModal.jsx
import { useState, useEffect } from 'react';
import { X, Upload, Save, Loader2, AlertCircle, User, Briefcase, Link as LinkIcon } from 'lucide-react';

const EditProfileModal = ({ profile, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    username: profile?.username || '',
    headline: profile?.headline || '',
    industry: profile?.industry || '', // NEW: Critical for Mentorship Matching!
    bio: profile?.bio || '',
    location: profile?.location || '',
    skills: profile?.skills?.join(', ') || '',
    linkedIn: profile?.socialLinks?.linkedIn || '',
    github: profile?.socialLinks?.github || '',
    website: profile?.socialLinks?.website || '', // NEW
  });
  
  const [files, setFiles] = useState({ profilePicture: null, profileBanner: null });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        username: profile.username || '',
        headline: profile.headline || '',
        industry: profile.industry || '',
        bio: profile.bio || '',
        location: profile.location || '',
        skills: profile.skills?.join(', ') || '',
        linkedIn: profile.socialLinks?.linkedIn || '',
        github: profile.socialLinks?.github || '',
        website: profile.socialLinks?.website || '',
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
    data.append('industry', formData.industry); // Wired to backend
    data.append('bio', formData.bio);
    data.append('location', formData.location);
    data.append('skills', formData.skills);
    data.append('linkedIn', formData.linkedIn);
    data.append('github', formData.github);
    data.append('website', formData.website); // Wired to backend
    
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
        
        // Sync cached user data for the top navbar
        const cachedUser = JSON.parse(localStorage.getItem('user'));
        cachedUser.name = responseData.profile.name;
        localStorage.setItem('user', JSON.stringify(cachedUser));
        
        onClose();
      } else {
        setErrorMessage(responseData.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMessage('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-xl bg-[#0B0F19] border-l border-white/5 h-full shadow-2xl p-6 md:p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
        
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#0B0F19] z-10 py-2 border-b border-white/5">
          <h2 className="text-xl font-bold text-white tracking-tight">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 pb-24">
          
          {/* MEDIA UPLOADS */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col items-center justify-center h-24 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] hover:border-blue-500/50 transition cursor-pointer group">
              <Upload size={18} className="text-gray-500 group-hover:text-blue-400 mb-2 transition" />
              <span className="text-xs text-gray-400 truncate max-w-[150px] px-2">{files.profilePicture ? files.profilePicture.name : 'Profile Picture'}</span>
              <input type="file" name="profilePicture" accept="image/*" hidden onChange={handleFileChange} />
            </label>
            <label className="flex flex-col items-center justify-center h-24 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-white/[0.04] hover:border-blue-500/50 transition cursor-pointer group">
              <Upload size={18} className="text-gray-500 group-hover:text-blue-400 mb-2 transition" />
              <span className="text-xs text-gray-400 truncate max-w-[150px] px-2">{files.profileBanner ? files.profileBanner.name : 'Cover Banner'}</span>
              <input type="file" name="profileBanner" accept="image/*" hidden onChange={handleFileChange} />
            </label>
          </div>

          {/* SECTION 1: BASIC INFO */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <User size={16} className="text-blue-400"/> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-500 text-sm">@</span>
                  <input name="username" value={formData.username} onChange={handleChange} placeholder="adnan" className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: PROFESSIONAL */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Briefcase size={16} className="text-emerald-400"/> Professional Identity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Headline</label>
                <input name="headline" value={formData.headline} onChange={handleChange} placeholder="e.g. Full Stack Founder" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Industry Sector</label>
                <input required name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. SaaS, Fintech, AI" className="w-full bg-white/[0.03] border border-emerald-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none transition" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">About / Bio</label>
              <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} placeholder="Summarize your background and current goals..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition resize-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="City, Country" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Skills (Comma separated)</label>
                <input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Marketing" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none transition" />
              </div>
            </div>
          </div>

          {/* SECTION 3: EXTERNAL LINKS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <LinkIcon size={16} className="text-purple-400"/> External Links
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Website</label>
                <input name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">LinkedIn</label>
                <input name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="linkedin.com/in/..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">GitHub</label>
                <input name="github" value={formData.github} onChange={handleChange} placeholder="github.com/..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none transition" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? 'Saving Profile...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
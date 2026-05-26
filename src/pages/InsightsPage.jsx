// src/pages/InsightsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Image as ImageIcon, Send, ThumbsUp, MessageSquare, Zap, Loader2, Share2, Flag } from 'lucide-react';
import apiClient from '../utils/apiClient';

// --- SAFE IMAGE LOADER FOR CLOUDINARY ---
const getImageUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `https://bizferbine-backend.onrender.com/${path}`;
};

const InsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW STATES FOR COMMENTS
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const navigate = useNavigate();
  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  const fetchInsights = async () => {
    try {
      const response = await apiClient.get('/insights');
      if (response.ok) {
        setInsights(await response.json());
      } else {
        setError('Failed to load insights feed.');
      }
    } catch (err) { setError('Server connection error.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else fetchInsights();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('tags', formData.tags);
    if (imageFile) data.append('image', imageFile);

    try {
      const response = await apiClient.post('/insights', {
        body: data,
      });
      if (response.ok) {
        setFormData({ title: '', content: '', tags: '' });
        setImageFile(null);
        fetchInsights();
      } else {
        alert('Failed to publish insight.');
      }
    } catch (err) { console.error(err); }
    finally { setIsSubmitting(false); }
  };

  const handleLike = async (insightId) => {
    try {
      const response = await apiClient.put(`/insights/${insightId}/like`);
      if (response.ok) {
        setInsights(insights.map(insight => {
          if (insight._id === insightId) {
            const hasLiked = insight.likes.includes(loggedInUser.id);
            const newLikesArray = hasLiked
              ? insight.likes.filter(id => id !== loggedInUser.id)
              : [...insight.likes, loggedInUser.id];
            return { ...insight, likes: newLikesArray };
          }
          return insight;
        }));
      }
    } catch (err) { console.error('Failed to like insight:', err); }
  };

  const handleShare = (insightId) => {
    navigator.clipboard.writeText(`${window.location.origin}/insights/${insightId}`);
    alert('Insight link copied to clipboard! 🚀');
  };

  const handleCommentSubmit = async (e, insightId) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await apiClient.post(`/insights/${insightId}/comment`, {
        body: JSON.stringify({ text: commentText })
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(insights.map(i => i._id === insightId ? data.insight : i));
        setCommentText('');
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  // PHASE 4: CONTENT FLAGGING
  const handleFlagInsight = async (insightId) => {
    if (!window.confirm('Are you sure you want to flag this content to the platform admins?')) return;
    try {
      const response = await apiClient.post('/disputes', {
        body: JSON.stringify({ reportedEntityId: insightId, module: 'Insights', reason: 'Automated queue flag from user feed.' })
      });
      if (response.ok) {
        alert('Content flagged for review. Our Overseers will investigate.');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to flag insight.');
      }
    } catch (err) { console.error('Failed to flag insight:', err); }
  };

  if (loading) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse">Loading_Network_Feed...</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 pb-20">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Command Center</span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto mt-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3 mb-2">
            <Zap className="text-yellow-400" size={32} /> Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Insights</span>
          </h1>
          <p className="text-gray-400 text-sm">Broadcast thought leadership and analyze network trends.</p>
        </div>

        {/* CREATE POST BOX */}
        <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 mb-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] pointer-events-none"></div>
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <input
              type="text" required placeholder="Insight Title (e.g., The Future of Node.js Scaling)"
              value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-transparent border-b border-white/10 pb-2 text-lg font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
            />
            <textarea
              required rows="3" placeholder="Share your expertise (Max 120 words)..."
              value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-transparent border-none text-sm text-gray-300 placeholder-gray-600 focus:outline-none resize-none"
            />
            <input
              type="text" placeholder="Tags (comma separated)"
              value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-black/50 border border-white/5 rounded-lg px-4 py-2 text-xs font-mono text-blue-400 placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition"
            />
            <div className="flex justify-between items-center pt-2">
              <label className="flex items-center gap-2 text-gray-400 hover:text-blue-400 cursor-pointer transition text-xs font-mono uppercase tracking-widest bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg">
                <ImageIcon size={16} />
                {imageFile ? <span className="truncate max-w-[100px]">{imageFile.name}</span> : 'Attach Vector'}
                <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              </label>
              <button disabled={isSubmitting} type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition disabled:opacity-50">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Broadcast
              </button>
            </div>
          </form>
        </div>

        {/* FEED SECTION */}
        <div className="space-y-6">
          {insights.map((insight) => {
            const hasLiked = insight.likes?.includes(loggedInUser.id);
            const isCommenting = activeCommentId === insight._id;

            return (
              <article key={insight._id} className="bg-[#0a0f1c] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-black text-white shrink-0">
                    {insight.author?.name ? insight.author.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{insight.author?.name || 'Unknown User'}</h3>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{insight.author?.role || 'Network User'}</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">{insight.title}</h2>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">{insight.content}</p>

                {/* IMPLEMENTED CLOUDINARY SAFE LOADER */}
                {insight.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-white/5 max-h-80 flex justify-center bg-black">
                    <img src={getImageUrl(insight.imageUrl)} alt="Insight attachment" className="object-cover w-full h-full" />
                  </div>
                )}

                {/* Interaction Footer */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleLike(insight._id)}
                    className={`flex items-center gap-2 text-xs font-mono tracking-widest uppercase transition ${hasLiked ? 'text-blue-400' : 'text-gray-500 hover:text-white'}`}
                  >
                    <ThumbsUp size={16} className={hasLiked ? "fill-blue-400/20" : ""} />
                    {insight.likes?.length || 0} Likes
                  </button>
                  <button
                    onClick={() => setActiveCommentId(isCommenting ? null : insight._id)}
                    className={`flex items-center gap-2 text-xs font-mono tracking-widest uppercase transition ${isCommenting ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}
                  >
                    <MessageSquare size={16} className={isCommenting ? "fill-purple-400/20" : ""} />
                    {insight.comments?.length || 0} Comments
                  </button>
                  <button
                    onClick={() => handleShare(insight._id)}
                    className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-emerald-400 tracking-widest uppercase transition ml-auto"
                  >
                    <Share2 size={16} /> Share
                  </button>
                  <button
                    onClick={() => handleFlagInsight(insight._id)}
                    className="flex items-center gap-2 text-[10px] font-mono text-rose-500/70 hover:text-rose-400 tracking-widest uppercase transition ml-4"
                    title="Flag for Moderation"
                  >
                    <Flag size={14} /> Flag
                  </button>
                </div>

                {/* EXPANDABLE COMMENTS SECTION */}
                {isCommenting && (
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="space-y-4 mb-4 max-h-40 overflow-y-auto pr-2">
                      {insight.comments?.length > 0 ? (
                        insight.comments.map((comment, idx) => (
                          <div key={idx} className="bg-black/50 border border-white/5 p-3 rounded-xl flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 shrink-0"></div>
                            <div>
                              <p className="text-sm text-gray-300">{comment.text}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-gray-500 font-mono uppercase">No comments yet. Be the first.</p>
                      )}
                    </div>
                    <form onSubmit={(e) => handleCommentSubmit(e, insight._id)} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add to the discussion..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                      />
                      <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-purple-500/20">
                        Post
                      </button>
                    </form>
                  </div>
                )}

              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default InsightsPage;
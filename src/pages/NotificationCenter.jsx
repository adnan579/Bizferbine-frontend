// src/pages/NotificationCenter.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, Zap, Briefcase, UserPlus, MessageSquare, Award, CheckCheck, Loader2 } from 'lucide-react';

const NotificationCenter = ({ isOpen, onClose, onUnreadUpdate }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/notifications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts);
        if (onUnreadUpdate) onUnreadUpdate(data.unreadCount); // Update the red dot on the bell!
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when the panel opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (notification) => {
    if (!notification.isRead) {
      try {
        await fetch(`https://bizferbine-backend.onrender.com/api/notifications/${notification._id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        // Update local state instantly
        setAlerts(alerts.map(a => a._id === notification._id ? { ...a, isRead: true } : a));
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }

    // Route the user based on the notification type
    onClose(); // Close the panel
    switch (notification.type) {
      case 'InsightInteraction':
        navigate('/insights');
        break;
      case 'DealRoomUpdate':
        navigate('/deals');
        break;
      case 'NewFollower':
        navigate(`/profile/${notification.sender._id}`);
        break;
      case 'Testimonial':
        navigate('/profile');
        break;
      case 'MentorshipOffer':
        // We will build the Mentorship page next!
        alert('Routing to Mentorship Module... (Page coming soon)');
        break;
      default:
        break;
    }
  };

  // Helper to pick the right icon and color for the alert type
  const getAlertUI = (type) => {
    switch (type) {
      case 'InsightInteraction': return { icon: <Zap size={16} />, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' };
      case 'DealRoomUpdate': return { icon: <Briefcase size={16} />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'NewFollower': return { icon: <UserPlus size={16} />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 'Testimonial': return { icon: <Award size={16} />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      case 'MentorshipOffer': return { icon: <MessageSquare size={16} />, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      default: return { icon: <Bell size={16} />, color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0a0f1c] border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050810]/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Bell size={20} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">System Alerts</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-blue-400 font-mono text-sm gap-4">
              <Loader2 className="animate-spin" size={24} />
              Syncing Network...
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-20">
              <CheckCheck size={40} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">No unread alerts.</p>
            </div>
          ) : (
            alerts.map((alert) => {
              const ui = getAlertUI(alert.type);
              return (
                <button 
                  key={alert._id}
                  onClick={() => handleMarkAsRead(alert)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group flex items-start gap-4 ${
                    alert.isRead 
                      ? 'bg-white/5 border-white/5 opacity-60 hover:opacity-100' 
                      : 'bg-black border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:border-blue-500/40'
                  }`}
                >
                  {/* Sender Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#050810] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center font-bold text-white relative">
                    {alert.sender?.profilePictureUrl ? (
                      <img src={`https://bizferbine-backend.onrender.com/${alert.sender.profilePictureUrl}`} className="w-full h-full object-cover" alt="Sender" />
                    ) : (
                      alert.sender?.name?.charAt(0).toUpperCase() || 'S'
                    )}
                    {/* Unread Indicator Dot */}
                    {!alert.isRead && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black"></div>}
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-widest ${ui.color} flex items-center gap-1 w-max`}>
                        {ui.icon} {alert.type.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap ml-2">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed mt-2 ${alert.isRead ? 'text-gray-400' : 'text-gray-200 font-medium'}`}>
                      {alert.message}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
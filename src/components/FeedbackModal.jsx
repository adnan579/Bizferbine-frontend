// src/components/FeedbackModal.jsx
import { useState } from 'react';
import { Send, Loader2, MessageSquare, X } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', feedback: '' });
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success'

  // INJECTED THE LIVE WEB APP SCRIPT URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRlWg6hV5KsvbovCHEyXPYOtH8p7Si_CQrOAJVKekIPb7_i7tlTI_dhh1IeSvabaL_fg/exec";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', feedback: '' });
      
      // Reset and close modal after 2 seconds
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert("Failed to send feedback.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0a0f1c] border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition z-20 bg-black/40 rounded-full">
          <X size={20} />
        </button>

        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none"></div>
        
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <MessageSquare className="text-blue-400" size={20} /> System Feedback
        </h3>
        <p className="text-sm text-gray-400 mb-6">Help us optimize the ecosystem. Report bugs or request features.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <input 
              required type="text" placeholder="Your Name" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition" 
            />
            <input 
              required type="email" placeholder="Your Email" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition" 
            />
          </div>
          <textarea 
            required rows="4" placeholder="What should we build next? Did you find a bug?" 
            value={formData.feedback} onChange={e => setFormData({...formData, feedback: e.target.value})}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none resize-none transition" 
          />
          
          <button 
            disabled={status !== 'idle'} 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition disabled:opacity-50"
          >
            {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 
             status === 'success' ? 'TRANSMITTED SUCCESSFULLY' : 
             <><Send size={16} /> Transmit Feedback</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
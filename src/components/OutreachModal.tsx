import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Mail, 
  ExternalLink,
  Sliders,
  UserCheck
} from 'lucide-react';
import { Creator, CampaignBrief } from '../types';
import { CampaignFitService } from '../services/campaignFitService';

interface OutreachModalProps {
  creator: Creator | null;
  brief: CampaignBrief;
  isOpen: boolean;
  onClose: () => void;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({
  creator,
  brief,
  isOpen,
  onClose,
}) => {
  const [tone, setTone] = useState<'executive' | 'creative' | 'direct'>('executive');
  const [senderName, setSenderName] = useState('Alex Rivers');
  const [brandName, setBrandName] = useState(brief.brand);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (creator && isOpen) {
      handleGenerate();
    }
  }, [creator, brief, tone, isOpen]);

  const handleGenerate = async () => {
    if (!creator) return;
    setIsGenerating(true);
    try {
      const res = await CampaignFitService.generateOutreachPitch({
        creator,
        brief,
        tone,
        senderName,
        brandName,
      });
      setSubject(res.subject);
      setBody(res.body);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !creator) return null;

  const targetEmail = creator.contact.directEmail || creator.contact.managementEmail || 'collab@influencer.io';

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMailto = () => {
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#141822] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#0f131c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-10 h-10 rounded-xl object-cover border border-white/10"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-semibold text-white text-base">
                  Talent Outreach Pitch
                </h3>
                <span className="text-xs text-indigo-400 font-mono">
                  {creator.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Sending to: <span className="text-slate-200">{targetEmail}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration toolbar */}
        <div className="p-4 bg-[#181c24] border-b border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Communication Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full p-1.5 rounded-lg bg-[#0f131c] border border-white/[0.08] text-xs text-slate-200 focus:outline-none"
            >
              <option value="executive">Executive & Strategic</option>
              <option value="creative">Creative & Collaborative</option>
              <option value="direct">Direct Agency Terms</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Brand Representation
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full p-1.5 rounded-lg bg-[#0f131c] border border-white/[0.08] text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Sender Name
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full p-1.5 rounded-lg bg-[#0f131c] border border-white/[0.08] text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Email Editor Form */}
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Email Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono uppercase text-slate-400">
                Email Proposal Body
              </label>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isGenerating ? 'Regenerating...' : 'Regenerate Pitch'}</span>
              </button>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={11}
              className="w-full p-3 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0f131c] flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Pitch' : 'Copy Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-transparent hover:bg-white/[0.06] text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMailto}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch Mail Client</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

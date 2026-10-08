import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Activity, 
  Instagram, 
  Youtube, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { PlatformType, Creator } from '../types';
import { McpService } from '../services/mcpService';

interface IngestHandleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatorIngested: (creator: Creator) => void;
}

export const IngestHandleModal: React.FC<IngestHandleModalProps> = ({
  isOpen,
  onClose,
  onCreatorIngested,
}) => {
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('instagram');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsLoading(true);
    setSuccessMessage(null);

    try {
      const creator = await McpService.ingestHandle(handle, platform);
      onCreatorIngested(creator);
      setSuccessMessage(`Successfully ingested ${creator.name} (${creator.handle}) into Talent Intelligence index.`);
      setTimeout(() => {
        setIsLoading(false);
        setHandle('');
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#141822] shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="font-heading font-semibold text-lg text-white">
              Ingest Talent Handle
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
              Select Social Network
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPlatform('instagram')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 cursor-pointer ${
                  platform === 'instagram'
                    ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                    : 'bg-[#0f131c] text-slate-400 border-white/[0.06]'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('tiktok')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 cursor-pointer ${
                  platform === 'tiktok'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-[#0f131c] text-slate-400 border-white/[0.06]'
                }`}
              >
                <span className="font-bold text-[10px]">TT</span>
                <span>TikTok</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('youtube')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 cursor-pointer ${
                  platform === 'youtube'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-[#0f131c] text-slate-400 border-white/[0.06]'
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
              Creator Handle or Profile URL
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. @mkbhd or sarah_fit"
              required
              className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Influship MCP will automatically look up follower counts, engagement velocity, and contact emails.
            </p>
          </div>

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !handle.trim()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading && <Activity className="w-3.5 h-3.5 animate-spin" />}
              <span>{isLoading ? 'Ingesting from MCP...' : 'Ingest Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

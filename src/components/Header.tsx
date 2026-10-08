import React from 'react';
import { 
  Sparkles, 
  Activity, 
  Cpu, 
  PlusCircle, 
  Bookmark, 
  Share2, 
  FolderKanban,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { CampaignBrief, McpServerStatus } from '../types';

interface HeaderProps {
  mcpStatus: McpServerStatus;
  activeBrief: CampaignBrief;
  allBriefs: CampaignBrief[];
  onSelectBrief: (brief: CampaignBrief) => void;
  shortlistCount: number;
  onOpenShortlists: () => void;
  onOpenIngestModal: () => void;
  onOpenMcpModal: () => void;
  onCreateNewBrief: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mcpStatus,
  activeBrief,
  allBriefs,
  onSelectBrief,
  shortlistCount,
  onOpenShortlists,
  onOpenIngestModal,
  onOpenMcpModal,
  onCreateNewBrief,
}) => {
  const [briefDropdownOpen, setBriefDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0B0F17]/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-indigo-400 p-[1px] shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F17] rounded-[11px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                PULSE HORIZON
              </span>
              <span className="text-[10px] uppercase font-mono font-semibold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO INTEL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Multi-Platform Talent Intelligence & Valuation
            </p>
          </div>
        </div>

        {/* Center: Active Campaign Brief Switcher */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setBriefDropdownOpen(!briefDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141822] border border-white/[0.09] hover:border-indigo-500/40 text-xs text-slate-200 transition-colors shadow-sm"
            >
              <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Target Brief:</span>
              <span className="font-semibold text-white max-w-[200px] truncate">{activeBrief.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
            </button>

            {briefDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-72 rounded-xl bg-[#181c24] border border-white/[0.12] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setBriefDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Select Campaign Context
                </div>
                {allBriefs.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelectBrief(b)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      b.id === activeBrief.id
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-medium'
                        : 'text-slate-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-400">{b.brand} • ${b.budgetTotal.toLocaleString()} pool</div>
                    </div>
                    {b.id === activeBrief.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
                <div className="border-t border-white/[0.08] mt-2 pt-2">
                  <button
                    onClick={onCreateNewBrief}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-indigo-400 hover:bg-indigo-500/10 flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create Custom Campaign Brief</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side status & action buttons */}
        <div className="flex items-center gap-2.5">
          {/* Influship MCP radar badge */}
          <button
            onClick={onOpenMcpModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1a202d] border border-emerald-500/20 hover:border-emerald-500/40 text-xs transition-colors group cursor-pointer"
            title="Inspect Influship MCP Connection"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="text-left font-mono text-[11px]">
              <span className="text-slate-400 hidden lg:inline">MCP: </span>
              <span className="text-emerald-400 font-medium group-hover:underline">Influship Active</span>
            </div>
          </button>

          {/* Ingest handle button */}
          <button
            onClick={onOpenIngestModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c2028] hover:bg-indigo-950/40 border border-white/[0.1] hover:border-indigo-500/40 text-slate-200 text-xs font-medium transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Ingest Handle</span>
          </button>

          {/* Shortlists button */}
          <button
            onClick={onOpenShortlists}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Shortlist</span>
            {shortlistCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-indigo-950 text-[10px] font-bold font-mono">
                {shortlistCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

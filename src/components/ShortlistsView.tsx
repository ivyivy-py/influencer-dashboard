import React, { useState } from 'react';
import { 
  FolderKanban, 
  Trash2, 
  Send, 
  DollarSign, 
  FileText, 
  Download, 
  Plus, 
  CheckCircle2, 
  ExternalLink, 
  Eye, 
  ChevronRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Creator, CampaignBrief, CampaignStage, ShortlistEntry } from '../types';
import { formatNumber, formatCurrency } from '../utils/formatters';

interface ShortlistsViewProps {
  creators: Creator[];
  shortlistEntries: ShortlistEntry[];
  activeBrief: CampaignBrief;
  onUpdateStage: (entryId: string, stage: CampaignStage) => void;
  onUpdateFee: (entryId: string, fee: number) => void;
  onUpdateNotes: (entryId: string, notes: string) => void;
  onRemoveEntry: (entryId: string) => void;
  onInspect: (creator: Creator) => void;
  onOutreach: (creator: Creator) => void;
}

const STAGES: CampaignStage[] = [
  'Discovered',
  'Outreach Sent',
  'In Negotiation',
  'Contracted',
  'Content Review',
  'Live / Published',
];

export const ShortlistsView: React.FC<ShortlistsViewProps> = ({
  creators,
  shortlistEntries,
  activeBrief,
  onUpdateStage,
  onUpdateFee,
  onUpdateNotes,
  onRemoveEntry,
  onInspect,
  onOutreach,
}) => {
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Map entries with creator profiles
  const entriesWithCreators = shortlistEntries.map((e) => {
    const creator = creators.find((c) => c.id === e.creatorId);
    return {
      entry: e,
      creator,
    };
  }).filter((item) => item.creator !== undefined);

  // Aggregated metrics
  const totalAgreedFee = shortlistEntries.reduce((acc, curr) => acc + (curr.agreedFee || 0), 0);
  const totalReach = entriesWithCreators.reduce((acc, curr) => acc + (curr.creator?.totalReach || 0), 0);

  const exportCSV = () => {
    const headers = ['Creator Name', 'Handle', 'Primary Platform', 'Stage', 'Agreed Fee', 'PulseRank', 'Reach', 'Contact Email', 'Notes'];
    const rows = entriesWithCreators.map(({ entry, creator }) => [
      `"${creator?.name || ''}"`,
      `"${creator?.handle || ''}"`,
      `"${creator?.primaryPlatform || ''}"`,
      `"${entry.stage}"`,
      entry.agreedFee || 0,
      creator?.pulseRank || 0,
      creator?.totalReach || 0,
      `"${creator?.contact.directEmail || creator?.contact.managementEmail || ''}"`,
      `"${entry.notes.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeBrief.name.toLowerCase().replace(/\s+/g, '-')}-pipeline.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Aggregates */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            <h2 className="font-heading font-bold text-2xl text-white">
              Talent Pipeline & Deal CRM
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Managing active talent selections for <span className="text-indigo-300 font-semibold">{activeBrief.name}</span> ({activeBrief.brand}).
          </p>
        </div>

        {/* Aggregated KPI badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-[#0f131c] border border-white/[0.06]">
            <div className="text-[10px] font-mono uppercase text-slate-400">Creators in Pipeline</div>
            <div className="font-data font-bold text-base text-white mt-0.5">
              {shortlistEntries.length}
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#0f131c] border border-white/[0.06]">
            <div className="text-[10px] font-mono uppercase text-slate-400">Total Committed Fees</div>
            <div className="font-data font-bold text-base text-indigo-300 mt-0.5">
              {formatCurrency(totalAgreedFee)}
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#0f131c] border border-white/[0.06]">
            <div className="text-[10px] font-mono uppercase text-slate-400">Total Audience Reach</div>
            <div className="font-data font-bold text-base text-emerald-400 mt-0.5">
              {formatNumber(totalReach)}
            </div>
          </div>

          <button
            onClick={exportCSV}
            disabled={shortlistEntries.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] disabled:opacity-40 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {entriesWithCreators.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#141822] border border-white/[0.08]">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-white">No Creators Shortlisted Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Discover and add talent from Creator Discovery or Campaign Fit Scorer to manage negotiations and track contracts.
          </p>
        </div>
      ) : (
        /* Kanban Pipeline Board */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {STAGES.map((stage) => {
            const stageItems = entriesWithCreators.filter((i) => i.entry.stage === stage);

            return (
              <div
                key={stage}
                className="rounded-xl bg-[#10141e] border border-white/[0.06] flex flex-col min-h-[500px]"
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                      {stage}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.08] text-slate-300">
                    {stageItems.length}
                  </span>
                </div>

                {/* Stage Cards */}
                <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                  {stageItems.map(({ entry, creator }) => {
                    if (!creator) return null;

                    return (
                      <div
                        key={entry.id}
                        className="p-3 rounded-lg bg-[#181c24] border border-white/[0.07] hover:border-indigo-500/30 transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div>
                          {/* Creator snippet */}
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={creator.avatar}
                              alt={creator.name}
                              className="w-8 h-8 rounded-lg object-cover border border-white/10"
                            />
                            <div className="min-w-0">
                              <div 
                                className="font-semibold text-xs text-white truncate hover:text-indigo-300 cursor-pointer"
                                onClick={() => onInspect(creator)}
                              >
                                {creator.name}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400 truncate">
                                {creator.handle}
                              </div>
                            </div>
                          </div>

                          {/* Quick metrics */}
                          <div className="flex items-center justify-between text-[11px] font-data text-slate-300 py-1 border-t border-b border-white/[0.05] my-2">
                            <div>
                              <span className="text-slate-500 text-[10px]">PULSE </span>
                              <span className="text-indigo-300 font-bold">{creator.pulseRank}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 text-[10px]">ENG </span>
                              <span className="text-emerald-400">{creator.avgEngagementRate}%</span>
                            </div>
                          </div>

                          {/* Fee input */}
                          <div className="mb-2">
                            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                              Agreed Fee ($)
                            </label>
                            <input
                              type="number"
                              value={entry.agreedFee || ''}
                              onChange={(e) => onUpdateFee(entry.id, Number(e.target.value))}
                              placeholder="0"
                              className="w-full px-2 py-1 rounded bg-[#0f131c] border border-white/[0.08] text-xs font-data text-emerald-400 focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          {/* Notes */}
                          <div className="mb-2">
                            {editingNotesId === entry.id ? (
                              <div className="space-y-1">
                                <textarea
                                  value={tempNotes}
                                  onChange={(e) => setTempNotes(e.target.value)}
                                  placeholder="Add negotiation notes..."
                                  className="w-full p-1.5 rounded bg-[#0f131c] border border-white/[0.1] text-[11px] text-slate-200 resize-none h-16 focus:outline-none focus:border-indigo-500"
                                />
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => setEditingNotesId(null)}
                                    className="px-2 py-0.5 rounded text-[10px] text-slate-400"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      onUpdateNotes(entry.id, tempNotes);
                                      setEditingNotesId(null);
                                    }}
                                    className="px-2 py-0.5 rounded bg-indigo-600 text-[10px] text-white"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div 
                                onClick={() => {
                                  setEditingNotesId(entry.id);
                                  setTempNotes(entry.notes);
                                }}
                                className="p-1.5 rounded bg-[#0f131c]/60 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer min-h-[32px] border border-transparent hover:border-white/[0.08]"
                                title="Click to edit notes"
                              >
                                {entry.notes || '+ Click to add notes...'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stage Selector Dropdown */}
                        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-1">
                          <select
                            value={entry.stage}
                            onChange={(e) => onUpdateStage(entry.id, e.target.value as CampaignStage)}
                            className="bg-[#0f131c] text-slate-300 text-[10px] rounded px-1.5 py-1 border border-white/[0.08] focus:outline-none cursor-pointer"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOutreach(creator)}
                              className="p-1 rounded hover:bg-white/[0.08] text-slate-400 hover:text-white"
                              title="Outreach email"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onRemoveEntry(entry.id)}
                              className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400"
                              title="Remove"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

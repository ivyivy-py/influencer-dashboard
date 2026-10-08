import React, { useMemo, useState } from 'react';
import { 
  Target, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Bookmark, 
  Send, 
  Eye, 
  Briefcase, 
  Sliders,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Creator, CampaignBrief, CampaignFitScore } from '../types';
import { CampaignFitService } from '../services/campaignFitService';
import { formatNumber, formatCurrency } from '../utils/formatters';

interface CampaignFitViewProps {
  creators: Creator[];
  activeBrief: CampaignBrief;
  allBriefs: CampaignBrief[];
  onSelectBrief: (brief: CampaignBrief) => void;
  shortlistedIds: Set<string>;
  onToggleShortlist: (id: string) => void;
  onInspect: (creator: Creator) => void;
  onOutreach: (creator: Creator) => void;
  onCreateNewBrief: () => void;
}

export const CampaignFitView: React.FC<CampaignFitViewProps> = ({
  creators,
  activeBrief,
  allBriefs,
  onSelectBrief,
  shortlistedIds,
  onToggleShortlist,
  onInspect,
  onOutreach,
  onCreateNewBrief,
}) => {
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>(creators[0]?.id || '');

  // Calculate scores for all creators against activeBrief
  const scoredCreators = useMemo(() => {
    return creators
      .map((c) => {
        const fit = CampaignFitService.calculateFit(c, activeBrief);
        return {
          creator: c,
          fit,
        };
      })
      .sort((a, b) => b.fit.score - a.fit.score);
  }, [creators, activeBrief]);

  const selectedScored = scoredCreators.find((s) => s.creator.id === selectedCreatorId) || scoredCreators[0];

  const getTierBadge = (tier: CampaignFitScore['matchTier']) => {
    switch (tier) {
      case 'Elite Match':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'High Potential':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Moderate Fit':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Brief Header Card */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-white/[0.08] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-medium border border-indigo-500/30">
                ACTIVE CAMPAIGN BRIEF
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeBrief.brand}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-indigo-400 font-medium">
                {activeBrief.niche}
              </span>
            </div>

            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mt-1">
              {activeBrief.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {activeBrief.description}
            </p>
          </div>

          {/* Quick Metrics & Brief Switcher */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
            <div className="p-3.5 rounded-xl bg-[#0f131c] border border-white/[0.06] flex items-center justify-between gap-6">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400">Total Budget Pool</div>
                <div className="font-data font-bold text-lg text-emerald-400 mt-0.5">
                  {formatCurrency(activeBrief.budgetTotal)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-slate-400">Target Objective</div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  {activeBrief.objective}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onCreateNewBrief}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                <span>New Campaign Brief</span>
              </button>
            </div>
          </div>
        </div>

        {/* Required Deliverables Pills */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-mono text-[11px]">Required Deliverables:</span>
          {activeBrief.deliverablesRequired.map((del) => (
            <span
              key={del}
              className="px-2.5 py-1 rounded-lg bg-[#181c24] text-slate-200 border border-white/[0.08] font-medium"
            >
              {del}
            </span>
          ))}
          <span className="text-slate-400 font-mono text-[11px] ml-auto">
            Target Production Deadline: {activeBrief.deadline}
          </span>
        </div>
      </div>

      {/* Main 2-column layout: Left ranked list, Right detailed inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ranked Fit List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Ranked Creator Alignment ({scoredCreators.length})</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">By Algorithmic Match</span>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {scoredCreators.map(({ creator, fit }, idx) => {
              const isSelected = creator.id === selectedCreatorId;
              const isShortlisted = shortlistedIds.has(creator.id);

              return (
                <div
                  key={creator.id}
                  onClick={() => setSelectedCreatorId(creator.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-[#141822] hover:bg-[#181d29] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-500 w-5 text-center">
                      #{idx + 1}
                    </span>
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-white truncate">
                          {creator.name}
                        </span>
                        {creator.verified && (
                          <CheckCircle className="w-3 h-3 text-indigo-400 flex-shrink-0 fill-indigo-400/20" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {creator.handle} • {formatNumber(creator.totalReach)} reach
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-data font-bold text-base text-emerald-400">
                        {fit.score}%
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getTierBadge(fit.matchTier)}`}>
                      {fit.matchTier}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-depth Alignment Intelligence & Rationale (7 cols) */}
        {selectedScored && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-[#141822] border border-white/[0.08] shadow-xl">
              {/* Creator header in inspection */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedScored.creator.avatar}
                    alt={selectedScored.creator.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-xl text-white">
                        {selectedScored.creator.name}
                      </h3>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${getTierBadge(selectedScored.fit.matchTier)}`}>
                        {selectedScored.fit.matchTier}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedScored.creator.handle} • {selectedScored.creator.categories.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-400">COMPOSITE FIT SCORE</div>
                  <div className="font-data font-black text-3xl text-emerald-400">
                    {selectedScored.fit.score}%
                  </div>
                </div>
              </div>

              {/* Rationale Narrative */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950/20 to-purple-950/20 border border-indigo-500/20">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-indigo-300 uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Strategic Match Rationale</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedScored.fit.rationale}
                </p>
              </div>

              {/* Score Breakdown Bars */}
              <div className="mt-5 space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  Alignment Matrix Breakdown
                </h4>

                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Audience Demographic Resonance</span>
                      <span className="font-data font-bold text-white">{selectedScored.fit.breakdown.audienceAlignment}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0f131c]">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${selectedScored.fit.breakdown.audienceAlignment}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Content Tone & Niche Relevance</span>
                      <span className="font-data font-bold text-white">{selectedScored.fit.breakdown.contentRelevance}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0f131c]">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: `${selectedScored.fit.breakdown.contentRelevance}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Historical Engagement Quality & Velocity</span>
                      <span className="font-data font-bold text-emerald-400">{selectedScored.fit.breakdown.engagementQuality}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0f131c]">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${selectedScored.fit.breakdown.engagementQuality}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Budget Pool & CPM Efficiency</span>
                      <span className="font-data font-bold text-white">{selectedScored.fit.breakdown.budgetEfficiency}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0f131c]">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${selectedScored.fit.breakdown.budgetEfficiency}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Projections */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#181c24] border border-white/[0.06]">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Projected Campaign Reach</div>
                  <div className="font-data font-bold text-base text-white mt-1">
                    ~{formatNumber(selectedScored.fit.predictedReach)} Imp.
                  </div>
                  <div className="text-[10px] text-slate-400">Target audience pool</div>
                </div>

                <div className="p-3 rounded-xl bg-[#181c24] border border-white/[0.06]">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Predicted Effective CPM</div>
                  <div className="font-data font-bold text-base text-emerald-400 mt-1">
                    ${selectedScored.fit.predictedCpm}
                  </div>
                  <div className="text-[10px] text-slate-400">Commercial cost efficiency</div>
                </div>
              </div>

              {/* Recommended Deliverables */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06]">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-semibold mb-2">
                  Recommended Creative Package
                </div>
                <div className="space-y-1.5 text-xs text-slate-200">
                  {selectedScored.fit.recommendedDeliverables.map((rec) => (
                    <div key={rec} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={() => onInspect(selectedScored.creator)}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Full Dossier</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleShortlist(selectedScored.creator.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      shortlistedIds.has(selectedScored.creator.id)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-200'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{shortlistedIds.has(selectedScored.creator.id) ? 'Shortlisted' : 'Add to Pipeline'}</span>
                  </button>

                  <button
                    onClick={() => onOutreach(selectedScored.creator)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Outreach Pitch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

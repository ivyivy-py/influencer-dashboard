import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Bookmark, 
  Send 
} from 'lucide-react';
import { Creator, NicheCategory } from '../types';
import { formatNumber, formatCurrency, getNicheStyle } from '../utils/formatters';
import { MetricSparkline } from './MetricSparkline';

interface LeaderboardViewProps {
  creators: Creator[];
  shortlistedIds: Set<string>;
  onToggleShortlist: (id: string) => void;
  onInspect: (creator: Creator) => void;
  onOutreach: (creator: Creator) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  creators,
  shortlistedIds,
  onToggleShortlist,
  onInspect,
  onOutreach,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NicheCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'pulseRank' | 'totalReach' | 'avgEngagementRate' | 'valuation'>('pulseRank');

  const filteredAndSorted = useMemo(() => {
    let list = [...creators];
    if (selectedCategory !== 'all') {
      list = list.filter((c) => c.categories.includes(selectedCategory));
    }
    list.sort((a, b) => {
      if (sortBy === 'pulseRank') return b.pulseRank - a.pulseRank;
      if (sortBy === 'totalReach') return b.totalReach - a.totalReach;
      if (sortBy === 'avgEngagementRate') return b.avgEngagementRate - a.avgEngagementRate;
      if (sortBy === 'valuation') {
        const valA = a.valuationPerPost.instagramReel || a.valuationPerPost.tiktokVideo;
        const valB = b.valuationPerPost.instagramReel || b.valuationPerPost.tiktokVideo;
        return valB - valA;
      }
      return 0;
    });
    return list;
  }, [creators, selectedCategory, sortBy]);

  const topThree = filteredAndSorted.slice(0, 3);
  const remaining = filteredAndSorted.slice(3);

  const categories: (NicheCategory | 'all')[] = [
    'all',
    'Tech & AI',
    'Beauty & Skincare',
    'Gaming & Esports',
    'Personal Finance',
    'Lifestyle & Vlog',
    'Fitness & Health',
    'Fashion & Style',
    'Food & Culinary',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Strategy Summary */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-[#141822] to-purple-950/30 border border-white/[0.08] relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-medium border border-indigo-500/30 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>PULSERANK™ GLOBAL TALENT INDEX</span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
            Top Creator Valuation & Velocity Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            The algorithmic benchmark combining 30-day audience velocity, verified non-bot authenticity, organic conversion signals, and multi-platform reach. Audited real-time via Influship MCP.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-[#181c24] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat === 'all' ? 'All Industries' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* #2 Rank */}
          {topThree[1] && (
            <div 
              onClick={() => onInspect(topThree[1])}
              className="rounded-2xl border border-slate-700/60 bg-[#141822]/90 p-5 flex flex-col justify-between hover:border-indigo-400/50 transition-all cursor-pointer relative group order-2 md:order-1"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-600">
                  <Medal className="w-3.5 h-3.5 text-slate-300" /> RANK #2
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +{topThree[1].platforms[0]?.growthMoM}%
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].name}
                  className="w-14 h-14 rounded-xl object-cover border border-white/20"
                />
                <div>
                  <h3 className="font-heading font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                    {topThree[1].name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">{topThree[1].handle}</div>
                  <div className="text-[11px] text-slate-400">{topThree[1].categories[0]}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-[#0f131c] border border-white/[0.05] text-center text-xs">
                <div>
                  <div className="text-[10px] font-mono text-slate-400">PULSE</div>
                  <div className="font-data font-bold text-indigo-300 text-sm">{topThree[1].pulseRank}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400">REACH</div>
                  <div className="font-data font-bold text-white text-sm">{formatNumber(topThree[1].totalReach)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400">ENG %</div>
                  <div className="font-data font-bold text-emerald-400 text-sm">{topThree[1].avgEngagementRate}%</div>
                </div>
              </div>
            </div>
          )}

          {/* #1 Rank - Crown Center */}
          {topThree[0] && (
            <div 
              onClick={() => onInspect(topThree[0])}
              className="rounded-2xl border-2 border-indigo-500/60 bg-gradient-to-b from-indigo-950/40 via-[#181d29] to-[#141822] p-5 flex flex-col justify-between shadow-xl shadow-indigo-500/10 hover:border-indigo-400 transition-all cursor-pointer relative group order-1 md:order-2"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-indigo-400 text-slate-950 text-[10px] font-black font-mono tracking-wider flex items-center gap-1 shadow-md">
                <Crown className="w-3.5 h-3.5 text-slate-950 fill-current" />
                INDEX CHAMPION #1
              </div>

              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
                  <Crown className="w-3.5 h-3.5" /> RANK #1
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +{topThree[0].platforms[0]?.growthMoM}%
                </span>
              </div>

              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative">
                  <img
                    src={topThree[0].avatar}
                    alt={topThree[0].name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5">
                    <Crown className="w-3 h-3 fill-current" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-lg group-hover:text-indigo-300 transition-colors">
                    {topThree[0].name}
                  </h3>
                  <div className="text-xs text-indigo-300 font-mono">{topThree[0].handle}</div>
                  <div className="text-[11px] text-slate-300">{topThree[0].categories.join(' • ')}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-[#0f131c] border border-indigo-500/20 text-center text-xs">
                <div>
                  <div className="text-[10px] font-mono text-slate-400">PULSE</div>
                  <div className="font-data font-bold text-amber-300 text-base">{topThree[0].pulseRank}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400">REACH</div>
                  <div className="font-data font-bold text-white text-base">{formatNumber(topThree[0].totalReach)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400">ENG %</div>
                  <div className="font-data font-bold text-emerald-400 text-base">{topThree[0].avgEngagementRate}%</div>
                </div>
              </div>
            </div>
          )}

          {/* #3 Rank */}
          {topThree[2] && (
            <div 
              onClick={() => onInspect(topThree[2])}
              className="rounded-2xl border border-amber-800/40 bg-[#141822]/90 p-5 flex flex-col justify-between hover:border-indigo-400/50 transition-all cursor-pointer relative group order-3"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-900/30 text-amber-400 text-xs font-mono font-bold border border-amber-800/40">
                  <Medal className="w-3.5 h-3.5 text-amber-400" /> RANK #3
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +{topThree[2].platforms[0]?.growthMoM}%
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].name}
                  className="w-14 h-14 rounded-xl object-cover border border-white/20"
                />
                <div>
                  <h3 className="font-heading font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                    {topThree[2].name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">{topThree[2].handle}</div>
                  <div className="text-[11px] text-slate-400">{topThree[2].categories[0]}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-[#0f131c] border border-white/[0.05] text-center text-xs">
                <div>
                  <div className="text-[10px] font-mono text-slate-400">PULSE</div>
                  <div className="font-data font-bold text-indigo-300 text-sm">{topThree[2].pulseRank}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400">REACH</div>
                  <div className="font-data font-bold text-white text-sm">{formatNumber(topThree[2].totalReach)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400">ENG %</div>
                  <div className="font-data font-bold text-emerald-400 text-sm">{topThree[2].avgEngagementRate}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULL RANKINGS TABLE */}
      <div className="rounded-xl border border-white/[0.08] bg-[#141822]/90 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/[0.08] bg-[#0f131c]/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-400" />
            <h3 className="font-heading font-semibold text-sm text-white">
              Full Index Standings ({filteredAndSorted.length} Creators)
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Sort by:</span>
            <div className="flex rounded-lg bg-[#181c24] border border-white/[0.06] p-0.5">
              {[
                { id: 'pulseRank', label: 'PulseRank' },
                { id: 'totalReach', label: 'Reach' },
                { id: 'avgEngagementRate', label: 'Eng %' },
                { id: 'valuation', label: 'Valuation' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSortBy(btn.id as any)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    sortBy === btn.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0f131c]/80 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-4 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-3">Industry</th>
                <th className="py-3 px-3">PulseRank</th>
                <th className="py-3 px-3">Audience Reach</th>
                <th className="py-3 px-3">Engagement</th>
                <th className="py-3 px-3">30-Day Velocity</th>
                <th className="py-3 px-3">Est. Reel Rate</th>
                <th className="py-3 px-3">Authenticity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredAndSorted.map((creator, index) => {
                const isShortlisted = shortlistedIds.has(creator.id);
                return (
                  <tr
                    key={creator.id}
                    onClick={() => onInspect(creator)}
                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-400 group-hover:text-indigo-400">
                      #{index + 1}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-9 h-9 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {creator.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{creator.handle}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-[11px] font-medium text-slate-300">
                        {creator.categories[0]}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-data font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30">
                        {creator.pulseRank}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-data text-white font-medium">
                      {formatNumber(creator.totalReach)}
                    </td>

                    <td className="py-3 px-3 font-data text-emerald-400 font-semibold">
                      {creator.avgEngagementRate}%
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <MetricSparkline data={creator.sparkline} color="#10B981" width={48} height={14} />
                        <span className="text-[10px] font-mono text-emerald-400">
                          +{creator.platforms[0]?.growthMoM}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-data text-indigo-300">
                      {formatCurrency(creator.valuationPerPost.instagramReel || creator.valuationPerPost.tiktokVideo)}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-emerald-400">
                      {creator.demographics.authenticityScore}% AQS
                    </td>

                    <td 
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspect(creator)}
                          className="p-1.5 rounded hover:bg-white/[0.08] text-slate-300"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOutreach(creator)}
                          className="p-1.5 rounded hover:bg-white/[0.08] text-slate-300"
                          title="Outreach Email"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleShortlist(creator.id)}
                          className={`p-1.5 rounded ${
                            isShortlisted ? 'bg-indigo-600 text-white' : 'hover:bg-white/[0.08] text-slate-400'
                          }`}
                          title="Toggle shortlist"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

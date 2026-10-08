import React from 'react';
import { 
  CheckCircle, 
  TrendingUp, 
  Bookmark, 
  Send, 
  Eye, 
  ShieldCheck, 
  Instagram, 
  Youtube,
  ArrowUpDown
} from 'lucide-react';
import { Creator, PlatformType } from '../types';
import { formatNumber, formatCurrency, getNicheStyle } from '../utils/formatters';
import { MetricSparkline } from './MetricSparkline';

interface CreatorTableProps {
  creators: Creator[];
  shortlistedIds: Set<string>;
  onToggleShortlist: (id: string) => void;
  onInspect: (creator: Creator) => void;
  onOutreach: (creator: Creator) => void;
  onSortBy: (column: 'pulseRank' | 'totalReach' | 'avgEngagementRate' | 'valuation') => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

export const CreatorTable: React.FC<CreatorTableProps> = ({
  creators,
  shortlistedIds,
  onToggleShortlist,
  onInspect,
  onOutreach,
  onSortBy,
  sortColumn,
  sortDirection,
}) => {
  const renderPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20">
            <Instagram className="w-2.5 h-2.5" /> IG
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
            TT
          </span>
        );
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
            <Youtube className="w-2.5 h-2.5" /> YT
          </span>
        );
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/[0.08] bg-[#141822]/90 shadow-xl">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-white/[0.08] bg-[#0f131c]/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
            <th className="py-3 px-4 w-12 text-center">Save</th>
            <th className="py-3 px-4 min-w-[220px]">Creator</th>
            <th className="py-3 px-3">Primary</th>
            <th className="py-3 px-3">Niche Category</th>
            <th 
              className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => onSortBy('pulseRank')}
            >
              <div className="flex items-center gap-1">
                <span>PulseRank</span>
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
              </div>
            </th>
            <th 
              className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => onSortBy('totalReach')}
            >
              <div className="flex items-center gap-1">
                <span>Reach</span>
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
              </div>
            </th>
            <th 
              className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => onSortBy('avgEngagementRate')}
            >
              <div className="flex items-center gap-1">
                <span>Eng. Rate</span>
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
              </div>
            </th>
            <th className="py-3 px-3">30-Day Velocity</th>
            <th 
              className="py-3 px-3 cursor-pointer hover:text-white transition-colors"
              onClick={() => onSortBy('valuation')}
            >
              <div className="flex items-center gap-1">
                <span>Est. Rate / Reel</span>
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
              </div>
            </th>
            <th className="py-3 px-3">Contact Email</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {creators.map((c) => {
            const isShortlisted = shortlistedIds.has(c.id);
            return (
              <tr 
                key={c.id} 
                className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                onClick={() => onInspect(c)}
              >
                {/* Save shortlist */}
                <td 
                  className="py-3 px-4 text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleShortlist(c.id);
                  }}
                >
                  <button 
                    title={isShortlisted ? 'Remove shortlist' : 'Add shortlist'}
                    className={`p-1.5 rounded-md transition-colors ${
                      isShortlisted
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current' : ''}`} />
                  </button>
                </td>

                {/* Creator Profile */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-9 h-9 rounded-lg object-cover border border-white/[0.1]"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {c.name}
                        </span>
                        {c.verified && (
                          <CheckCircle className="w-3 h-3 text-indigo-400 fill-indigo-400/20" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {c.handle}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Platform */}
                <td className="py-3 px-3">
                  {renderPlatformBadge(c.primaryPlatform)}
                </td>

                {/* Niche Category */}
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-1">
                    {c.categories.map((cat) => {
                      const style = getNicheStyle(cat);
                      return (
                        <span
                          key={cat}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}
                        >
                          {cat}
                        </span>
                      );
                    })}
                  </div>
                </td>

                {/* PulseRank */}
                <td className="py-3 px-3">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-data font-bold">
                    {c.pulseRank}
                  </div>
                </td>

                {/* Total Reach */}
                <td className="py-3 px-3 font-data font-medium text-slate-200">
                  {formatNumber(c.totalReach)}
                </td>

                {/* Engagement Rate */}
                <td className="py-3 px-3">
                  <span className="font-data font-semibold text-emerald-400">
                    {c.avgEngagementRate}%
                  </span>
                </td>

                {/* Sparkline & velocity */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <MetricSparkline data={c.sparkline} color="#10B981" width={48} height={14} />
                    <span className="text-[10px] font-mono text-emerald-400 font-medium">
                      +{c.platforms[0]?.growthMoM}%
                    </span>
                  </div>
                </td>

                {/* Rate */}
                <td className="py-3 px-3 font-data font-medium text-indigo-300">
                  {formatCurrency(c.valuationPerPost.instagramReel || c.valuationPerPost.tiktokVideo)}
                </td>

                {/* Contact Email */}
                <td className="py-3 px-3 font-mono text-[11px] text-slate-400 max-w-[150px] truncate">
                  {c.contact.directEmail || c.contact.managementEmail}
                </td>

                {/* Actions */}
                <td 
                  className="py-3 px-4 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onInspect(c)}
                      className="p-1.5 rounded hover:bg-white/[0.08] text-slate-300 hover:text-white"
                      title="Inspect Profile"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOutreach(c)}
                      className="p-1.5 rounded hover:bg-white/[0.08] text-slate-300 hover:text-white"
                      title="Outreach Email"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

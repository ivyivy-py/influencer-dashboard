import React from 'react';
import { 
  CheckCircle, 
  TrendingUp, 
  Mail, 
  ExternalLink, 
  Bookmark, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  DollarSign,
  Instagram,
  Youtube
} from 'lucide-react';
import { Creator, PlatformType } from '../types';
import { formatNumber, formatCurrency, getNicheStyle } from '../utils/formatters';
import { MetricSparkline } from './MetricSparkline';

interface CreatorCardProps {
  creator: Creator;
  isShortlisted: boolean;
  onToggleShortlist: () => void;
  onInspect: () => void;
  onOutreach: () => void;
  onScoreFit: () => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  isShortlisted,
  onToggleShortlist,
  onInspect,
  onOutreach,
  onScoreFit,
}) => {
  const primaryPlatform = creator.primaryPlatform;

  const renderPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full">
            <Instagram className="w-3 h-3" />
            <span>Instagram</span>
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
            <span className="font-bold text-[10px]">TT</span>
            <span>TikTok</span>
          </span>
        );
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <Youtube className="w-3 h-3" />
            <span>YouTube</span>
          </span>
        );
    }
  };

  return (
    <div className="group relative rounded-xl border border-white/[0.08] hover:border-indigo-500/40 bg-[#141822]/90 hover:bg-[#181d29] p-4 transition-all duration-200 flex flex-col justify-between shadow-lg shadow-black/20 hover:shadow-indigo-500/5">
      {/* Top row: Avatar, Info, PulseRank */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-13 h-13 rounded-xl object-cover border border-white/[0.12] group-hover:border-indigo-400/50 transition-colors"
                loading="lazy"
              />
              {creator.verified && (
                <div 
                  className="absolute -bottom-1 -right-1 bg-[#0B0F17] rounded-full p-0.5"
                  title="Verified Creator Profile"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-heading font-semibold text-white text-sm hover:text-indigo-300 transition-colors cursor-pointer" onClick={onInspect}>
                  {creator.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <span>{creator.handle}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400">{creator.location}</span>
              </div>
            </div>
          </div>

          {/* PulseRank badge */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-[10px] font-mono text-indigo-300 font-semibold tracking-wider">PULSE</span>
              <span className="font-data font-bold text-base px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                {creator.pulseRank}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center justify-end gap-0.5 mt-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>+{creator.platforms[0]?.growthMoM || 8.4}% MoM</span>
            </span>
          </div>
        </div>

        {/* Categories & platform pill */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {renderPlatformIcon(primaryPlatform)}
          {creator.categories.map((cat) => {
            const style = getNicheStyle(cat);
            return (
              <span
                key={cat}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}
              >
                {cat}
              </span>
            );
          })}
        </div>

        {/* Bio preview */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {creator.bio}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-[#0f131c]/80 border border-white/[0.05] mb-4">
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Total Reach</div>
            <div className="font-data font-bold text-sm text-white mt-0.5">
              {formatNumber(creator.totalReach)}
            </div>
            <div className="text-[10px] text-slate-400">{creator.tier.split(' ')[0]}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Avg. Eng. Rate</div>
            <div className="font-data font-bold text-sm text-emerald-400 mt-0.5">
              {creator.avgEngagementRate}%
            </div>
            <div className="mt-1">
              <MetricSparkline data={creator.sparkline} color="#10B981" width={56} height={14} />
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-mono text-slate-400">Est. / Reel</div>
            <div className="font-data font-bold text-sm text-indigo-300 mt-0.5">
              {formatCurrency(creator.valuationPerPost.instagramReel || creator.valuationPerPost.tiktokVideo)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              AQS: {creator.demographics.authenticityScore}%
            </div>
          </div>
        </div>

        {/* Contact info pill */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3 px-1">
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="font-mono truncate">{creator.contact.directEmail || creator.contact.managementEmail}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Safety: {creator.brandSafetyRating}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <button
          onClick={onInspect}
          className="flex-1 py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 transition-colors text-center cursor-pointer"
        >
          Inspect Profile
        </button>

        <button
          onClick={onScoreFit}
          title="Score fit against active brief"
          className="py-1.5 px-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Fit</span>
        </button>

        <button
          onClick={onOutreach}
          title="Compose outreach email"
          className="py-1.5 px-2 rounded-lg hover:bg-white/[0.08] text-slate-300 text-xs transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 text-slate-300" />
        </button>

        <button
          onClick={onToggleShortlist}
          title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
          className={`py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer ${
            isShortlisted
              ? 'bg-indigo-600 text-white'
              : 'hover:bg-white/[0.08] text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};

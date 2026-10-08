import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  TrendingUp, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Bookmark, 
  Send, 
  Globe, 
  Instagram, 
  Youtube, 
  Users, 
  BarChart3, 
  AlertTriangle,
  Download
} from 'lucide-react';
import { Creator, PlatformType } from '../types';
import { formatNumber, formatCurrency, getNicheStyle } from '../utils/formatters';
import { MetricSparkline } from './MetricSparkline';

interface CreatorDetailModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: () => void;
  onOutreach: () => void;
  onScoreFit: () => void;
  onSelectSimilarCreator?: (handle: string) => void;
}

export const CreatorDetailModal: React.FC<CreatorDetailModalProps> = ({
  creator,
  isOpen,
  onClose,
  isShortlisted,
  onToggleShortlist,
  onOutreach,
  onScoreFit,
  onSelectSimilarCreator,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'audience' | 'rates'>('overview');

  if (!isOpen || !creator) return null;

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const exportDossier = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(creator, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${creator.handle.replace('@', '')}-pulse-dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-white/[0.12] bg-[#141822] shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Banner */}
        <div className="relative h-36 sm:h-44 w-full bg-[#1c2028] overflow-hidden flex-shrink-0">
          <img
            src={creator.banner || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'}
            alt="Creator Banner"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141822] via-[#141822]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black text-slate-300 hover:text-white border border-white/10 transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Export Dossier button */}
          <button
            onClick={exportDossier}
            className="absolute top-3 right-14 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black text-xs text-slate-300 hover:text-white border border-white/10 transition-colors z-10 cursor-pointer"
            title="Download full JSON talent report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Dossier</span>
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 -mt-16 sm:-mt-20 pb-4 relative z-10 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-[#141822] shadow-2xl"
                />
                {creator.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-[#141822] rounded-full p-1 shadow-md">
                    <CheckCircle className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                  </div>
                )}
              </div>

              <div className="mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">
                    {creator.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs border border-indigo-500/30 font-semibold">
                    PulseRank {creator.pulseRank}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                  <span className="text-indigo-400 font-medium">{creator.handle}</span>
                  <span>•</span>
                  <span>{creator.location}</span>
                  <span>•</span>
                  <span>{creator.tier}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:mb-2">
              <button
                onClick={onScoreFit}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Score Brief Fit</span>
              </button>

              <button
                onClick={onOutreach}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-indigo-400" />
                <span>Outreach Pitch</span>
              </button>

              <button
                onClick={onToggleShortlist}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isShortlisted
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/[0.08] hover:bg-white/[0.15] text-slate-300'
                }`}
                title={isShortlisted ? 'Saved in shortlist' : 'Add to shortlist'}
              >
                <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bio & Categories */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {creator.bio}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap flex-shrink-0">
              {creator.categories.map((c) => {
                const style = getNicheStyle(c);
                return (
                  <span
                    key={c}
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}
                  >
                    {c}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-white/[0.08] bg-[#0f131c]/50 flex-shrink-0">
          <div className="flex gap-4">
            {[
              { id: 'overview', label: 'Intelligence Overview' },
              { id: 'content', label: 'Sponsored & Live Posts' },
              { id: 'audience', label: 'Audience & Bot Audit' },
              { id: 'rates', label: 'Rate Card & Valuation' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* KPI Matrix Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06]">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Total Reach</div>
                  <div className="font-data font-bold text-lg text-white mt-1">
                    {formatNumber(creator.totalReach)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Across 3 platforms</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06]">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Engagement Velocity</div>
                  <div className="font-data font-bold text-lg text-emerald-400 mt-1">
                    {creator.avgEngagementRate}%
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{creator.platforms[0]?.growthMoM}% 30d</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06]">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Audience Authenticity</div>
                  <div className="font-data font-bold text-lg text-indigo-300 mt-1">
                    {creator.demographics.authenticityScore}% Real
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Bot Risk: {creator.demographics.suspiciousFollowersPct}% (Low)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06]">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Valuation / Dedicated</div>
                  <div className="font-data font-bold text-lg text-indigo-300 mt-1">
                    {formatCurrency(creator.valuationPerPost.youtubeDedicated || creator.valuationPerPost.instagramReel * 2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Estimated commercial CPM</div>
                </div>
              </div>

              {/* Platform breakdown */}
              <div className="p-4 rounded-xl bg-[#181c24] border border-white/[0.06]">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                  Live Platform Breakdown (Influship MCP Synchronized)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {creator.platforms.map((plat) => (
                    <div 
                      key={plat.platform}
                      className="p-3 rounded-lg bg-[#0f131c] border border-white/[0.05] flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="capitalize font-semibold text-xs text-white">
                          {plat.platform}
                        </span>
                        <span className="font-mono text-[10px] text-indigo-400">
                          @{plat.handle}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>Followers:</span>
                          <span className="font-data text-white">{formatNumber(plat.followers)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Avg. Views:</span>
                          <span className="font-data text-white">{formatNumber(plat.avgViews)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Engagement:</span>
                          <span className="font-data text-emerald-400">{plat.engagementRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Intelligence (Master prompt: Creator will return emails, Retrieve known contact emails) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/30 to-purple-950/20 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <h4 className="font-heading font-semibold text-sm text-white">
                      Verified Contact Intelligence & Representation
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Mailbox Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#0f131c]/80 border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">DIRECT TALENT EMAIL</div>
                      <div className="font-mono text-white font-medium mt-0.5">
                        {creator.contact.directEmail || 'Not published publicly'}
                      </div>
                    </div>
                    {creator.contact.directEmail && (
                      <button
                        onClick={() => handleCopyEmail(creator.contact.directEmail!)}
                        className="p-1.5 rounded hover:bg-white/[0.08] text-slate-400 hover:text-white"
                        title="Copy direct email"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-[#0f131c]/80 border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">
                        MANAGEMENT ({creator.contact.agencyName || 'Agency'})
                      </div>
                      <div className="font-mono text-white font-medium mt-0.5">
                        {creator.contact.managementEmail || 'Self-managed'}
                      </div>
                    </div>
                    {creator.contact.managementEmail && (
                      <button
                        onClick={() => handleCopyEmail(creator.contact.managementEmail!)}
                        className="p-1.5 rounded hover:bg-white/[0.08] text-slate-400 hover:text-white"
                        title="Copy management email"
                      >
                        {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Past Brands & Similar creators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#181c24] border border-white/[0.06]">
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    Verified Brand Collaborations
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {creator.pastBrandsWorkedWith.map((brand) => (
                      <span
                        key={brand}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#0f131c] text-slate-300 border border-white/[0.05]"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#181c24] border border-white/[0.06]">
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    Algorithmic Lookalikes (MCP Matcher)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {creator.similarCreatorHandles.map((handle) => (
                      <button
                        key={handle}
                        onClick={() => onSelectSimilarCreator && onSelectSimilarCreator(handle)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{handle}</span>
                        <ExternalLink className="w-3 h-3 text-indigo-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: SPONSORED & RECENT POSTS */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  Recent Sponsored & Viral Content Samples
                </h4>
                <span className="text-[11px] text-slate-400">
                  Showing {creator.recentPosts.length} tracked assets
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {creator.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl overflow-hidden bg-[#181c24] border border-white/[0.08] hover:border-indigo-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img
                        src={post.thumbnail}
                        alt="Post Thumbnail"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white font-mono text-[10px] uppercase">
                          {post.platform}
                        </span>
                        {post.isSponsored && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/80 backdrop-blur-md text-emerald-950 font-bold text-[10px] uppercase">
                            Sponsored by {post.sponsorBrand}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white font-mono text-[10px]">
                        {post.publishedAt}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2">
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {post.caption}
                      </p>

                      <div className="pt-2 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400">Views</div>
                          <div className="font-data font-semibold text-white">
                            {formatNumber(post.views || 0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400">Likes</div>
                          <div className="font-data font-semibold text-white">
                            {formatNumber(post.likes)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400">Eng. Rate</div>
                          <div className="font-data font-semibold text-emerald-400">
                            {post.engagementRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIENCE & BOT AUDIT */}
          {activeTab === 'audience' && (
            <div className="space-y-6">
              {/* Authenticity banner */}
              <div className="p-4 rounded-xl bg-[#181c24] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-heading font-semibold text-sm text-white">
                      Audience Authenticity & Fraud Risk Audit
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Computed via Influship MCP proprietary anomaly detection & bot follower clustering.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-data font-bold text-2xl text-emerald-400">
                    {creator.demographics.authenticityScore}%
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">Real Human Audience</div>
                </div>
              </div>

              {/* Age & Gender grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age distribution */}
                <div className="p-4 rounded-xl bg-[#181c24] border border-white/[0.06]">
                  <h5 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                    Age Group Distribution
                  </h5>
                  <div className="space-y-2.5">
                    {creator.demographics.ageGroups.map((ag) => (
                      <div key={ag.label} className="text-xs">
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>{ag.label} years</span>
                          <span className="font-data font-semibold text-white">{ag.percentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#0f131c] overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{ width: `${ag.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gender split & Top countries */}
                <div className="p-4 rounded-xl bg-[#181c24] border border-white/[0.06] space-y-4">
                  <div>
                    <h5 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                      Gender Demographic Split
                    </h5>
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-400">Female: </span>
                        <span className="font-data font-bold text-pink-400">{creator.demographics.genderSplit.female}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Male: </span>
                        <span className="font-data font-bold text-sky-400">{creator.demographics.genderSplit.male}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Other: </span>
                        <span className="font-data font-bold text-purple-400">{creator.demographics.genderSplit.other}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#0f131c] overflow-hidden flex mt-2">
                      <div className="h-full bg-pink-500" style={{ width: `${creator.demographics.genderSplit.female}%` }} />
                      <div className="h-full bg-sky-500" style={{ width: `${creator.demographics.genderSplit.male}%` }} />
                      <div className="h-full bg-purple-500" style={{ width: `${creator.demographics.genderSplit.other}%` }} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06]">
                    <h5 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                      Top Audience Countries
                    </h5>
                    <div className="space-y-1.5 text-xs">
                      {creator.demographics.topCountries.map((c) => (
                        <div key={c.country} className="flex justify-between text-slate-300">
                          <span>{c.country}</span>
                          <span className="font-data font-semibold text-white">{c.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RATE CARD & VALUATION */}
          {activeTab === 'rates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-semibold text-sm text-white">
                    Estimated Commercial Rate Card & Deliverable Matrix
                  </h4>
                  <p className="text-xs text-slate-400">
                    Valuations benchmarked from recent CPM deals, reach velocity, and creator representation records.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">YouTube Dedicated Video</div>
                    <div className="text-[11px] text-slate-400">8+ min review or workflow teardown</div>
                  </div>
                  <div className="font-data font-bold text-base text-indigo-300">
                    {formatCurrency(creator.valuationPerPost.youtubeDedicated)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">YouTube Integrated Segment</div>
                    <div className="text-[11px] text-slate-400">60-90s sponsored segment in long-form</div>
                  </div>
                  <div className="font-data font-bold text-base text-indigo-300">
                    {formatCurrency(creator.valuationPerPost.youtubeIntegrated)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Instagram Reel (Short-Form)</div>
                    <div className="text-[11px] text-slate-400">High engagement native vertical reel</div>
                  </div>
                  <div className="font-data font-bold text-base text-indigo-300">
                    {formatCurrency(creator.valuationPerPost.instagramReel)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">TikTok Native Post</div>
                    <div className="text-[11px] text-slate-400">Algorithm targeted sound/trend creative</div>
                  </div>
                  <div className="font-data font-bold text-base text-indigo-300">
                    {formatCurrency(creator.valuationPerPost.tiktokVideo)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Instagram Story Set</div>
                    <div className="text-[11px] text-slate-400">3x sequential stories with tracking sticker</div>
                  </div>
                  <div className="font-data font-bold text-base text-indigo-300">
                    {formatCurrency(creator.valuationPerPost.storyRate)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#181c24] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">Instagram Feed Post (Carousel)</div>
                    <div className="text-[11px] text-slate-400">Multi-slide editorial carousel</div>
                  </div>
                  <div className="font-data font-bold text-base text-indigo-300">
                    {formatCurrency(creator.valuationPerPost.instagramPost)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-[#0f131c] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            Influship Intel ID: <span className="text-slate-300">{creator.id}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={onOutreach}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose Outreach Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  RotateCcw, 
  Sparkles, 
  MessageSquareQuote, 
  CheckCircle2, 
  AlertCircle,
  X,
  History,
  Check
} from 'lucide-react';
import { Creator, PlatformType, NicheCategory, CreatorTier } from '../types';
import { CreatorCard } from './CreatorCard';
import { CreatorTable } from './CreatorTable';

interface DiscoverViewProps {
  creators: Creator[];
  shortlistedIds: Set<string>;
  onToggleShortlist: (id: string) => void;
  onInspect: (creator: Creator) => void;
  onOutreach: (creator: Creator) => void;
  onScoreFit: (creator: Creator) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  creators,
  shortlistedIds,
  onToggleShortlist,
  onInspect,
  onOutreach,
  onScoreFit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<NicheCategory | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<CreatorTier | 'all'>('all');
  const [minPulseRank, setMinPulseRank] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Sort state for table
  const [sortColumn, setSortColumn] = useState<'pulseRank' | 'totalReach' | 'avgEngagementRate' | 'valuation'>('pulseRank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Search history presets (Master prompt: "reopen search results")
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'Hardware & AI setups',
    'Clinical skincare France',
    'Valorant esports streamers',
    '@mkbhd',
  ]);
  const [showHistory, setShowHistory] = useState(false);

  // Feedback modal (Master prompt: "submit feedback")
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim().replace(/^@/, '');
        const match =
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.categories.some((cat) => cat.toLowerCase().includes(q)) ||
          c.pastBrandsWorkedWith.some((b) => b.toLowerCase().includes(q)) ||
          c.location.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Platform
      if (selectedPlatform !== 'all') {
        const hasPlatform = c.platforms.some((p) => p.platform === selectedPlatform);
        if (!hasPlatform) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        if (!c.categories.includes(selectedCategory)) return false;
      }

      // Tier
      if (selectedTier !== 'all') {
        if (c.tier !== selectedTier) return false;
      }

      // Min PulseRank
      if (minPulseRank > 0) {
        if (c.pulseRank < minPulseRank) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortColumn === 'pulseRank') {
        return sortDirection === 'desc' ? b.pulseRank - a.pulseRank : a.pulseRank - b.pulseRank;
      }
      if (sortColumn === 'totalReach') {
        return sortDirection === 'desc' ? b.totalReach - a.totalReach : a.totalReach - b.totalReach;
      }
      if (sortColumn === 'avgEngagementRate') {
        return sortDirection === 'desc' ? b.avgEngagementRate - a.avgEngagementRate : a.avgEngagementRate - b.avgEngagementRate;
      }
      if (sortColumn === 'valuation') {
        const valA = a.valuationPerPost.instagramReel || a.valuationPerPost.tiktokVideo;
        const valB = b.valuationPerPost.instagramReel || b.valuationPerPost.tiktokVideo;
        return sortDirection === 'desc' ? valB - valA : valA - valB;
      }
      return 0;
    });
  }, [creators, searchQuery, selectedPlatform, selectedCategory, selectedTier, minPulseRank, sortColumn, sortDirection]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedCategory('all');
    setSelectedTier('all');
    setMinPulseRank(0);
  };

  const handleApplyPreset = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
  };

  const handleTableSort = (column: 'pulseRank' | 'totalReach' | 'avgEngagementRate' | 'valuation') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackOpen(false);
      setFeedbackText('');
    }, 1500);
  };

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
      {/* Search Bar & Action Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141822] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creator handle, keyword, verified brand partnership, or bio..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0f131c] border border-white/[0.09] text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Preset History / Reopen Search dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#181c24] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-slate-300 font-medium transition-colors cursor-pointer"
              title="Reopen previous searches"
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Saved Queries</span>
            </button>

            {showHistory && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#181c24] border border-white/[0.12] p-2 shadow-2xl z-30 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400">
                  Recent Search Queries
                </div>
                {searchHistory.map((h) => (
                  <button
                    key={h}
                    onClick={() => handleApplyPreset(h)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    {h}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Button (Master prompt requirement) */}
          <button
            onClick={() => setFeedbackOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#181c24] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-slate-300 font-medium transition-colors cursor-pointer"
            title="Submit search result feedback"
          >
            <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Feedback</span>
          </button>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex rounded-xl bg-[#0f131c] border border-white/[0.08] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Analytical Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar Rows */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          {/* Platforms */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase mr-1">Platform:</span>
            {[
              { id: 'all', label: 'All Channels' },
              { id: 'instagram', label: 'Instagram' },
              { id: 'tiktok', label: 'TikTok' },
              { id: 'youtube', label: 'YouTube' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedPlatform === p.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#0f131c] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Audience Tiers */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Tier:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as any)}
              className="bg-[#0f131c] text-slate-300 text-xs rounded-lg px-2.5 py-1 border border-white/[0.08] focus:outline-none cursor-pointer"
            >
              <option value="all">All Audience Sizes</option>
              <option value="Nano (<10K)">Nano (&lt;10K)</option>
              <option value="Micro (10K-100K)">Micro (10K-100K)</option>
              <option value="Mid-Tier (100K-500K)">Mid-Tier (100K-500K)</option>
              <option value="Macro (500K-1M)">Macro (500K-1M)</option>
              <option value="Mega (1M+)">Mega (1M+)</option>
            </select>
          </div>

          {/* PulseRank Min Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Min PulseRank:</span>
            <div className="flex gap-1">
              {[0, 90, 93, 95].map((val) => (
                <button
                  key={val}
                  onClick={() => setMinPulseRank(val)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                    minPulseRank === val
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {val === 0 ? 'Any' : `${val}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedPlatform !== 'all' || selectedCategory !== 'all' || selectedTier !== 'all' || minPulseRank > 0) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors ml-auto cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold'
                  : 'bg-[#0f131c] text-slate-400 hover:text-white border border-white/[0.05]'
              }`}
            >
              {cat === 'all' ? 'All Niches' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Meta Results Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
        <div>
          Showing <span className="text-white font-bold">{filteredCreators.length}</span> talent dossiers
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>Influship MCP Query:</span>
          <span className="text-emerald-400">18ms latency</span>
          <span>•</span>
          <span>Index: Real-Time</span>
        </div>
      </div>

      {/* Main Results View (Grid or Table) */}
      {filteredCreators.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#141822] border border-white/[0.08]">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-white">No Matching Creators Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search keywords, lowering the minimum PulseRank, or clearing selected filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              isShortlisted={shortlistedIds.has(creator.id)}
              onToggleShortlist={() => onToggleShortlist(creator.id)}
              onInspect={() => onInspect(creator)}
              onOutreach={() => onOutreach(creator)}
              onScoreFit={() => onScoreFit(creator)}
            />
          ))}
        </div>
      ) : (
        <CreatorTable
          creators={filteredCreators}
          shortlistedIds={shortlistedIds}
          onToggleShortlist={onToggleShortlist}
          onInspect={onInspect}
          onOutreach={onOutreach}
          onSortBy={handleTableSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      )}

      {/* Feedback Modal (Master prompt requirement) */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#141822] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-indigo-400" />
                <h3 className="font-heading font-semibold text-lg text-white">
                  Submit Search Feedback
                </h3>
              </div>
              <button
                onClick={() => setFeedbackOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">
                  Query Quality & Relevance Notes
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share feedback on search accuracy, missing creators, or valuation accuracy..."
                  rows={4}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {feedbackSubmitted && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Feedback received. Thank you!</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={feedbackSubmitted}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

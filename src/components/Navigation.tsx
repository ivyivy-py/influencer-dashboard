import React from 'react';
import { 
  Compass, 
  Trophy, 
  Target, 
  FolderKanban, 
  Terminal, 
  Layers
} from 'lucide-react';

export type ActiveTab = 'discover' | 'leaderboard' | 'campaign_fit' | 'shortlists' | 'mcp_terminal';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  shortlistCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  shortlistCount,
}) => {
  const tabs = [
    {
      id: 'discover' as ActiveTab,
      label: 'Creator Discovery',
      icon: Compass,
      badge: null,
    },
    {
      id: 'leaderboard' as ActiveTab,
      label: 'PulseRank Index',
      icon: Trophy,
      badge: 'TOP 100',
    },
    {
      id: 'campaign_fit' as ActiveTab,
      label: 'Campaign Fit Scorer',
      icon: Target,
      badge: 'AI FIT',
    },
    {
      id: 'shortlists' as ActiveTab,
      label: 'Campaign CRM & Pipeline',
      icon: FolderKanban,
      badge: shortlistCount > 0 ? `${shortlistCount}` : null,
    },
    {
      id: 'mcp_terminal' as ActiveTab,
      label: 'Live MCP Terminal',
      icon: Terminal,
      badge: 'LIVE',
    },
  ];

  return (
    <div className="border-b border-white/[0.08] bg-[#0f131c]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/35 shadow-sm shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-indigo-500/30 text-indigo-200'
                        : tab.badge === 'LIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/[0.08] text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

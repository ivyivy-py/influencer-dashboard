/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_CREATORS, INITIAL_BRIEFS } from './data/mockCreators';
import { Creator, CampaignBrief, ShortlistEntry, CampaignStage } from './types';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { DiscoverView } from './components/DiscoverView';
import { LeaderboardView } from './components/LeaderboardView';
import { CampaignFitView } from './components/CampaignFitView';
import { ShortlistsView } from './components/ShortlistsView';
import { McpTerminalView } from './components/McpTerminalView';
import { CreatorDetailModal } from './components/CreatorDetailModal';
import { OutreachModal } from './components/OutreachModal';
import { IngestHandleModal } from './components/IngestHandleModal';
import { NewBriefModal } from './components/NewBriefModal';
import { McpService } from './services/mcpService';

export default function App() {
  // Creators state
  const [creators, setCreators] = useState<Creator[]>(() => {
    const saved = localStorage.getItem('pulse_creators');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_CREATORS;
  });

  // Briefs state
  const [allBriefs, setAllBriefs] = useState<CampaignBrief[]>(() => {
    const saved = localStorage.getItem('pulse_briefs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_BRIEFS;
  });

  const [activeBrief, setActiveBrief] = useState<CampaignBrief>(() => allBriefs[0] || INITIAL_BRIEFS[0]);

  // Shortlist CRM state
  const [shortlistEntries, setShortlistEntries] = useState<ShortlistEntry[]>(() => {
    const saved = localStorage.getItem('pulse_shortlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default initial pipeline entries for demonstration
    return [
      {
        id: 'entry-1',
        creatorId: 'creator-1', // Sarah Jensen
        campaignId: 'brief-1',
        stage: 'Outreach Sent',
        agreedFee: 14500,
        notes: 'Sent initial partnership pitch for M4 Pro AI review hub.',
        addedAt: new Date().toISOString(),
        statusUpdateAt: new Date().toISOString(),
      },
      {
        id: 'entry-2',
        creatorId: 'creator-2', // Chloe Dubois
        campaignId: 'brief-2',
        stage: 'In Negotiation',
        agreedFee: 7500,
        notes: 'Discussing usage rights for TikTok UGC organic whitelisting.',
        addedAt: new Date().toISOString(),
        statusUpdateAt: new Date().toISOString(),
      },
      {
        id: 'entry-3',
        creatorId: 'creator-3', // Alex Vance
        campaignId: 'brief-3',
        stage: 'Contracted',
        agreedFee: 18000,
        notes: 'Signed contract for dedicated flick test video.',
        addedAt: new Date().toISOString(),
        statusUpdateAt: new Date().toISOString(),
      },
    ];
  });

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('discover');
  const [selectedCreatorForModal, setSelectedCreatorForModal] = useState<Creator | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCreatorForOutreach, setSelectedCreatorForOutreach] = useState<Creator | null>(null);
  const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isNewBriefModalOpen, setIsNewBriefModalOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('pulse_creators', JSON.stringify(creators));
  }, [creators]);

  useEffect(() => {
    localStorage.setItem('pulse_briefs', JSON.stringify(allBriefs));
  }, [allBriefs]);

  useEffect(() => {
    localStorage.setItem('pulse_shortlist', JSON.stringify(shortlistEntries));
  }, [shortlistEntries]);

  // Derived set of shortlisted creator IDs
  const shortlistedIds = new Set(shortlistEntries.map((e) => e.creatorId));

  // Toggle shortlist status
  const handleToggleShortlist = (creatorId: string) => {
    setShortlistEntries((prev) => {
      const exists = prev.find((e) => e.creatorId === creatorId);
      if (exists) {
        return prev.filter((e) => e.creatorId !== creatorId);
      } else {
        const creator = creators.find((c) => c.id === creatorId);
        const estFee = creator 
          ? (creator.valuationPerPost.instagramReel || creator.valuationPerPost.tiktokVideo || 5000)
          : 5000;
        const newEntry: ShortlistEntry = {
          id: `entry-${Date.now()}`,
          creatorId,
          campaignId: activeBrief.id,
          stage: 'Discovered',
          agreedFee: estFee,
          notes: 'Added from Creator Discovery.',
          addedAt: new Date().toISOString(),
          statusUpdateAt: new Date().toISOString(),
        };
        return [...prev, newEntry];
      }
    });
  };

  // Pipeline stage update
  const handleUpdateStage = (entryId: string, stage: CampaignStage) => {
    setShortlistEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, stage, statusUpdateAt: new Date().toISOString() } : e))
    );
  };

  // Agreed fee update
  const handleUpdateFee = (entryId: string, fee: number) => {
    setShortlistEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, agreedFee: fee } : e))
    );
  };

  // Notes update
  const handleUpdateNotes = (entryId: string, notes: string) => {
    setShortlistEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, notes } : e))
    );
  };

  // Remove shortlist entry
  const handleRemoveEntry = (entryId: string) => {
    setShortlistEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  // Inspect modal
  const handleInspectCreator = (creator: Creator) => {
    setSelectedCreatorForModal(creator);
    setIsDetailModalOpen(true);
  };

  // Outreach modal
  const handleOpenOutreach = (creator: Creator) => {
    setSelectedCreatorForOutreach(creator);
    setIsOutreachModalOpen(true);
  };

  // Handle lookalike creator selection
  const handleSelectSimilarCreator = (handle: string) => {
    const match = creators.find(
      (c) => c.handle.toLowerCase() === handle.toLowerCase() ||
             c.handle.toLowerCase().replace('@', '') === handle.toLowerCase().replace('@', '')
    );
    if (match) {
      setSelectedCreatorForModal(match);
    }
  };

  // Add new ingested creator
  const handleCreatorIngested = (newCreator: Creator) => {
    setCreators((prev) => [newCreator, ...prev]);
  };

  // Add new campaign brief
  const handleSaveBrief = (newBrief: CampaignBrief) => {
    setAllBriefs((prev) => [newBrief, ...prev]);
    setActiveBrief(newBrief);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#dfe2ee] font-body flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <Header
        mcpStatus={McpService.getStatus()}
        activeBrief={activeBrief}
        allBriefs={allBriefs}
        onSelectBrief={setActiveBrief}
        shortlistCount={shortlistEntries.length}
        onOpenShortlists={() => setActiveTab('shortlists')}
        onOpenIngestModal={() => setIsIngestModalOpen(true)}
        onOpenMcpModal={() => setActiveTab('mcp_terminal')}
        onCreateNewBrief={() => setIsNewBriefModalOpen(true)}
      />

      {/* Primary Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        shortlistCount={shortlistEntries.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'discover' && (
          <DiscoverView
            creators={creators}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={handleToggleShortlist}
            onInspect={handleInspectCreator}
            onOutreach={handleOpenOutreach}
            onScoreFit={(creator) => {
              setActiveTab('campaign_fit');
            }}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            creators={creators}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={handleToggleShortlist}
            onInspect={handleInspectCreator}
            onOutreach={handleOpenOutreach}
          />
        )}

        {activeTab === 'campaign_fit' && (
          <CampaignFitView
            creators={creators}
            activeBrief={activeBrief}
            allBriefs={allBriefs}
            onSelectBrief={setActiveBrief}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={handleToggleShortlist}
            onInspect={handleInspectCreator}
            onOutreach={handleOpenOutreach}
            onCreateNewBrief={() => setIsNewBriefModalOpen(true)}
          />
        )}

        {activeTab === 'shortlists' && (
          <ShortlistsView
            creators={creators}
            shortlistEntries={shortlistEntries}
            activeBrief={activeBrief}
            onUpdateStage={handleUpdateStage}
            onUpdateFee={handleUpdateFee}
            onUpdateNotes={handleUpdateNotes}
            onRemoveEntry={handleRemoveEntry}
            onInspect={handleInspectCreator}
            onOutreach={handleOpenOutreach}
          />
        )}

        {activeTab === 'mcp_terminal' && (
          <McpTerminalView
            status={McpService.getStatus()}
            allCreators={creators}
            onIngestCreator={handleCreatorIngested}
          />
        )}
      </main>

      {/* Deep-Dive Inspection Modal */}
      <CreatorDetailModal
        creator={selectedCreatorForModal}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isShortlisted={selectedCreatorForModal ? shortlistedIds.has(selectedCreatorForModal.id) : false}
        onToggleShortlist={() => {
          if (selectedCreatorForModal) {
            handleToggleShortlist(selectedCreatorForModal.id);
          }
        }}
        onOutreach={() => {
          if (selectedCreatorForModal) {
            setIsDetailModalOpen(false);
            handleOpenOutreach(selectedCreatorForModal);
          }
        }}
        onScoreFit={() => {
          setIsDetailModalOpen(false);
          setActiveTab('campaign_fit');
        }}
        onSelectSimilarCreator={handleSelectSimilarCreator}
      />

      {/* Outreach Email Composer Modal */}
      <OutreachModal
        creator={selectedCreatorForOutreach}
        brief={activeBrief}
        isOpen={isOutreachModalOpen}
        onClose={() => setIsOutreachModalOpen(false)}
      />

      {/* Ingest Talent Handle Modal */}
      <IngestHandleModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onCreatorIngested={handleCreatorIngested}
      />

      {/* New Campaign Brief Modal */}
      <NewBriefModal
        isOpen={isNewBriefModalOpen}
        onClose={() => setIsNewBriefModalOpen(false)}
        onSaveBrief={handleSaveBrief}
      />

      {/* Global Minimalist Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090d14] py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PULSE HORIZON // TALENT INTELLIGENCE PLATFORM • INFLUSHIP MCP COMPLIANT
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Latency: 18ms</span>
            <span>•</span>
            <span>Audience Authenticity: 96.4% Avg</span>
            <span>•</span>
            <span className="text-emerald-400">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

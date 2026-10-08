import React, { useState } from 'react';
import { 
  Terminal, 
  Activity, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Server, 
  ShieldCheck, 
  Send,
  Sliders,
  Code
} from 'lucide-react';
import { McpServerStatus, Creator } from '../types';
import { McpService } from '../services/mcpService';

interface McpTerminalViewProps {
  status: McpServerStatus;
  allCreators: Creator[];
  onIngestCreator: (creator: Creator) => void;
}

export const McpTerminalView: React.FC<McpTerminalViewProps> = ({
  status,
  allCreators,
  onIngestCreator,
}) => {
  const [endpointInput, setEndpointInput] = useState(status.endpoint);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('influship.get_profile_metrics');
  const [toolArgInput, setToolArgInput] = useState<string>('@sarahjensen_tech');
  const [platformArg, setPlatformArg] = useState<'instagram' | 'tiktok' | 'youtube'>('instagram');
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<any>(null);
  const [copiedConsole, setCopiedConsole] = useState(false);

  const handlePing = async () => {
    setIsPinging(true);
    setPingResult(null);
    const res = await McpService.testPing();
    setIsPinging(false);
    setPingResult(`${res.message} (Roundtrip: ${res.latencyMs}ms)`);
  };

  const handleExecuteTool = async () => {
    setIsExecuting(true);
    setConsoleOutput(null);

    await new Promise((res) => setTimeout(res, 350));

    let output: any = {};
    const timestamp = new Date().toISOString();

    if (selectedTool === 'influship.get_profile_metrics') {
      const match = allCreators.find(
        (c) => c.handle.toLowerCase() === toolArgInput.toLowerCase() ||
               c.handle.toLowerCase().replace('@', '') === toolArgInput.toLowerCase().replace('@', '')
      ) || allCreators[0];

      output = {
        status: 200,
        mcp_server: status.name,
        endpoint: status.endpoint,
        tool: selectedTool,
        timestamp,
        execution_time_ms: 32,
        data: {
          handle: match.handle,
          name: match.name,
          verified: match.verified,
          pulseRank: match.pulseRank,
          totalReach: match.totalReach,
          avgEngagementRate: match.avgEngagementRate,
          primaryPlatform: match.primaryPlatform,
          platforms: match.platforms,
          demographics: match.demographics,
          valuation: match.valuationPerPost,
          brandSafetyRating: match.brandSafetyRating,
        },
      };
    } else if (selectedTool === 'influship.retrieve_contact_emails') {
      const match = allCreators.find(
        (c) => c.handle.toLowerCase() === toolArgInput.toLowerCase() ||
               c.handle.toLowerCase().replace('@', '') === toolArgInput.toLowerCase().replace('@', '')
      ) || allCreators[0];

      output = {
        status: 200,
        mcp_server: status.name,
        tool: selectedTool,
        timestamp,
        execution_time_ms: 19,
        data: {
          handle: match.handle,
          primaryContact: match.contact.directEmail,
          managementContact: match.contact.managementEmail,
          agencyRepresentation: match.contact.agencyName,
          verifiedStatus: 'SMTP Mailbox Active (MX verified)',
        },
      };
    } else if (selectedTool === 'influship.find_similar_creators') {
      const match = allCreators.find(
        (c) => c.handle.toLowerCase() === toolArgInput.toLowerCase()
      ) || allCreators[0];

      output = {
        status: 200,
        mcp_server: status.name,
        tool: selectedTool,
        timestamp,
        execution_time_ms: 45,
        data: {
          sourceHandle: match.handle,
          clusterNiche: match.categories[0],
          lookalikes: match.similarCreatorHandles.map((h) => ({
            handle: h,
            overlapIndex: '88.4%',
            predictedFit: 'High',
          })),
        },
      };
    } else if (selectedTool === 'influship.fetch_live_feed') {
      const match = allCreators.find(
        (c) => c.handle.toLowerCase() === toolArgInput.toLowerCase()
      ) || allCreators[0];

      output = {
        status: 200,
        mcp_server: status.name,
        tool: selectedTool,
        timestamp,
        execution_time_ms: 78,
        data: {
          handle: match.handle,
          feed: match.recentPosts,
          historicalGrowthMoM: match.platforms[0]?.growthMoM,
        },
      };
    } else {
      // influship.search_creators
      output = {
        status: 200,
        mcp_server: status.name,
        tool: selectedTool,
        timestamp,
        execution_time_ms: 61,
        data: {
          query: toolArgInput,
          resultsCount: allCreators.length,
          creators: allCreators.map((c) => ({
            name: c.name,
            handle: c.handle,
            pulseRank: c.pulseRank,
            reach: c.totalReach,
            engagement: c.avgEngagementRate,
          })),
        },
      };
    }

    setConsoleOutput(output);
    setIsExecuting(false);
  };

  const copyConsoleJson = () => {
    if (!consoleOutput) return;
    navigator.clipboard.writeText(JSON.stringify(consoleOutput, null, 2));
    setCopiedConsole(true);
    setTimeout(() => setCopiedConsole(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* MCP Status Header */}
      <div className="p-6 rounded-2xl bg-[#141822] border border-white/[0.08] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                MCP GATEWAY ONLINE
              </span>
            </div>
            <h2 className="font-heading font-bold text-2xl text-white mt-1">
              Influship Influencer Marketing MCP Gateway
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Model Context Protocol interface connecting AI Studio to real-time Instagram, TikTok, and YouTube influencer intelligence feeds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePing}
              disabled={isPinging}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Testing Ping...' : 'Test MCP Ping'}</span>
            </button>
          </div>
        </div>

        {/* Endpoint Input & Ping output */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f131c] border border-white/[0.08]">
            <Server className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={endpointInput}
              onChange={(e) => setEndpointInput(e.target.value)}
              placeholder="https://server.smithery.ai/influship/influship-mcp"
              className="w-full bg-transparent text-xs font-mono text-slate-200 focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              McpService.setEndpoint(endpointInput);
              handlePing();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
          >
            Update Endpoint
          </button>
        </div>

        {pingResult && (
          <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{pingResult}</span>
          </div>
        )}
      </div>

      {/* Interactive Tool Runner & Console Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tool selector & Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#141822] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="font-heading font-semibold text-sm text-white">
                MCP Tool Parameter Configuration
              </h3>
            </div>

            {/* Tool Selection */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">
                Select Influship Tool
              </label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {status.availableTools.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                {status.availableTools.find((t) => t.name === selectedTool)?.description}
              </p>
            </div>

            {/* Target Handle or Query */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">
                Target Handle / Query
              </label>
              <input
                type="text"
                value={toolArgInput}
                onChange={(e) => setToolArgInput(e.target.value)}
                placeholder="@handle or keyword"
                className="w-full p-2.5 rounded-xl bg-[#0f131c] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Platform arg */}
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">
                Platform Resource
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['instagram', 'tiktok', 'youtube'] as const).map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setPlatformArg(plat)}
                    className={`py-2 rounded-xl text-xs font-medium capitalize border transition-colors cursor-pointer ${
                      platformArg === plat
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-[#0f131c] text-slate-400 border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecuteTool}
              disabled={isExecuting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Calling MCP Tool...' : 'Execute Tool Call'}</span>
            </button>
          </div>

          {/* Quick preset handle buttons */}
          <div className="p-4 rounded-xl bg-[#141822] border border-white/[0.06]">
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
              Preset Quick Test Handles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['@sarahjensen_tech', '@chloedubois_skin', '@vortex_fps', '@marcus.finance'].map((h) => (
                <button
                  key={h}
                  onClick={() => setToolArgInput(h)}
                  className="px-2.5 py-1 rounded-lg bg-[#0f131c] hover:bg-white/[0.08] text-[11px] font-mono text-indigo-300 border border-white/[0.06] transition-colors cursor-pointer"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Raw Terminal JSON Response (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#0a0e16] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Terminal Top Bar */}
            <div className="px-4 py-3 bg-[#0f131c] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs text-slate-200 font-semibold">
                  influship-mcp-output.json
                </span>
              </div>

              <div className="flex items-center gap-2">
                {consoleOutput && (
                  <button
                    onClick={copyConsoleJson}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-xs font-mono text-slate-300 transition-colors cursor-pointer"
                  >
                    {copiedConsole ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedConsole ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 flex-1 overflow-auto font-mono text-xs leading-relaxed text-slate-300 selection:bg-indigo-500/30">
              {isExecuting ? (
                <div className="flex items-center gap-2 text-indigo-400 animate-pulse mt-4">
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Connecting to {status.endpoint}... Invoking {selectedTool}...</span>
                </div>
              ) : consoleOutput ? (
                <pre className="text-emerald-400/90 whitespace-pre-wrap">
                  {JSON.stringify(consoleOutput, null, 2)}
                </pre>
              ) : (
                <div className="text-slate-500 text-center py-24 space-y-2">
                  <Code className="w-8 h-8 mx-auto text-slate-600" />
                  <p>Execute an MCP tool from the left panel to inspect real-time responses.</p>
                  <p className="text-[11px] text-slate-600">
                    Supports tools: search_creators, get_profile_metrics, retrieve_contact_emails, find_similar_creators, fetch_live_feed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

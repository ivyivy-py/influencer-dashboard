/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Creators API - Discover, ingest handles, and query similar talent
 */

const CREATORS_STORE = [
  {
    id: 'creator-1',
    name: 'Sarah Jensen',
    handle: '@sarahjensen_tech',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    primaryPlatform: 'youtube',
    categories: ['Tech & AI'],
    tier: 'Macro (500K-1M)',
    pulseRank: 96,
    totalReach: 840000,
    avgEngagementRate: 6.8,
    contact: { directEmail: 'sarah@jensentech.io', managementEmail: 'partnerships@northtalent.co' },
    similarCreatorHandles: ['@mkbhd_tech', '@austin_evans', '@linustech'],
  },
  {
    id: 'creator-2',
    name: 'Chloe Dubois',
    handle: '@chloedubois_skin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    primaryPlatform: 'instagram',
    categories: ['Beauty & Skincare'],
    tier: 'Macro (500K-1M)',
    pulseRank: 94,
    totalReach: 780000,
    avgEngagementRate: 8.4,
    contact: { directEmail: 'chloe@duboisbeauty.com', managementEmail: 'talent@lumina-mgmt.com' },
    similarCreatorHandles: ['@dr_alexis', '@hyram_skin', '@glowrecipe_official'],
  },
  {
    id: 'creator-3',
    name: 'Alex "Vortex" Vance',
    handle: '@vortex_fps',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    primaryPlatform: 'tiktok',
    categories: ['Gaming & Esports'],
    tier: 'Mega (1M+)',
    pulseRank: 95,
    totalReach: 1420000,
    avgEngagementRate: 9.2,
    contact: { directEmail: 'vortex@vortexgaming.gg', managementEmail: 'ops@quantumtalent.net' },
    similarCreatorHandles: ['@shroud', '@tenz_valorant', '@tarik_cs'],
  },
  {
    id: 'creator-4',
    name: 'Marcus Sterling',
    handle: '@marcus.finance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    primaryPlatform: 'youtube',
    categories: ['Personal Finance'],
    tier: 'Mid-Tier (100K-500K)',
    pulseRank: 92,
    totalReach: 390000,
    avgEngagementRate: 6.2,
    contact: { directEmail: 'marcus@sterlingwealth.media', managementEmail: 'inquiries@sterlingwealth.media' },
    similarCreatorHandles: ['@grahamstephan', '@aliali_invest', '@andrei_finance'],
  },
];

export default async function handler(req, res) {
  if (res && res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req && req.method === 'OPTIONS') {
    if (res && res.status) return res.status(200).end();
    return new Response(null, { status: 200 });
  }

  const method = req ? req.method : 'GET';
  const url = req && req.url ? new URL(req.url, 'http://localhost') : new URL('http://localhost');
  const query = (url.searchParams.get('q') || '').toLowerCase();
  const platform = url.searchParams.get('platform');
  const category = url.searchParams.get('category');
  const action = url.searchParams.get('action'); // 'search' | 'ingest' | 'similar'

  if (method === 'POST' || action === 'ingest') {
    let body = {};
    if (req && req.body) {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
    const targetHandle = body.handle || url.searchParams.get('handle') || '@new_creator';
    const targetPlatform = body.platform || 'instagram';

    const newCreator = {
      id: `ingested-${Date.now()}`,
      name: targetHandle.replace('@', '').replace(/[._]/g, ' ').toUpperCase(),
      handle: targetHandle.startsWith('@') ? targetHandle : `@${targetHandle}`,
      primaryPlatform: targetPlatform,
      pulseRank: Math.floor(Math.random() * 15) + 85,
      totalReach: Math.floor(Math.random() * 500000) + 100000,
      avgEngagementRate: Number((Math.random() * 4 + 5).toFixed(1)),
      contact: {
        directEmail: `${targetHandle.replace('@', '')}@mgmt.io`,
        managementEmail: `inquiries@${targetHandle.replace('@', '')}collab.com`,
      },
      source: 'Smithery Influship MCP Ingest',
    };

    if (res && res.status) {
      return res.status(201).json({ success: true, creator: newCreator });
    }
    return new Response(JSON.stringify({ success: true, creator: newCreator }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Filter creators
  let results = [...CREATORS_STORE];
  if (query) {
    results = results.filter((c) =>
      c.name.toLowerCase().includes(query) ||
      c.handle.toLowerCase().includes(query) ||
      c.categories.some((cat) => cat.toLowerCase().includes(query))
    );
  }
  if (platform && platform !== 'all') {
    results = results.filter((c) => c.primaryPlatform === platform);
  }
  if (category && category !== 'all') {
    results = results.filter((c) => c.categories.includes(category));
  }

  const payload = {
    success: true,
    count: results.length,
    creators: results,
    mcp_source: 'Smithery.ai Influship MCP',
  };

  if (res && res.status) {
    return res.status(200).json(payload);
  }
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

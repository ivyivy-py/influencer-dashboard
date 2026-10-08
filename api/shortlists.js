/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Shortlists API - Save and manage briefs, talent selections, and pipeline status
 */

let SHORTLIST_STORAGE = [
  { id: 'entry-1', handle: '@sarahjensen_tech', stage: 'Outreach Sent', fee: 14500, notes: 'Initial pitch sent' },
  { id: 'entry-2', handle: '@chloedubois_skin', stage: 'In Negotiation', fee: 7500, notes: 'Discussing usage rights' },
  { id: 'entry-3', handle: '@vortex_fps', stage: 'Contracted', fee: 18000, notes: 'Signed contract for dedicated review' },
];

export default async function handler(req, res) {
  if (res && res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req && req.method === 'OPTIONS') {
    if (res && res.status) return res.status(200).end();
    return new Response(null, { status: 200 });
  }

  const method = req ? req.method : 'GET';

  if (method === 'POST') {
    let body = {};
    if (req && req.body) {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
    const newEntry = {
      id: `entry-${Date.now()}`,
      handle: body.handle || '@creator',
      stage: body.stage || 'Discovered',
      fee: body.fee || 5000,
      notes: body.notes || 'Added from API',
      timestamp: new Date().toISOString(),
    };
    SHORTLIST_STORAGE.push(newEntry);

    if (res && res.status) {
      return res.status(201).json({ success: true, entry: newEntry });
    }
    return new Response(JSON.stringify({ success: true, entry: newEntry }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = {
    success: true,
    count: SHORTLIST_STORAGE.length,
    shortlists: SHORTLIST_STORAGE,
  };

  if (res && res.status) {
    return res.status(200).json(payload);
  }
  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

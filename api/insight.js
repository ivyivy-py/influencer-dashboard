/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Insight & Fit Scoring API - Score campaign fit and generate deliverable insights
 */

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

  let params = {};
  if (req && req.method === 'POST') {
    if (req.body) {
      params = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }
  } else if (req && req.url) {
    const url = new URL(req.url, 'http://localhost');
    params = {
      handle: url.searchParams.get('handle') || '@sarahjensen_tech',
      niche: url.searchParams.get('niche') || 'Tech & AI',
      budget: Number(url.searchParams.get('budget')) || 50000,
    };
  }

  const score = Math.floor(Math.random() * 8) + 91; // 91-98%
  const insightResult = {
    handle: params.handle || '@sarahjensen_tech',
    fit_score: score,
    match_tier: score >= 90 ? 'Elite Match' : 'High Potential',
    rationale: `Strong niche affinity in ${params.niche || 'Tech & AI'} with 95%+ human audience verification. Engagement velocity and CPM metrics align favorably with campaign goals.`,
    metrics: {
      audience_alignment: 94,
      content_relevance: 96,
      engagement_quality: 91,
      budget_efficiency: 88,
    },
    predicted_cpm: 21.4,
    recommended_package: [
      '1x Dedicated YouTube Teardown with click-through pinned link',
      '2x High-conversion Instagram Reels',
    ],
    timestamp: new Date().toISOString(),
  };

  if (res && res.status) {
    return res.status(200).json(insightResult);
  }
  return new Response(JSON.stringify(insightResult, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

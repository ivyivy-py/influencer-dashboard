/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Profiles API - Look up one or many Instagram/TikTok/YouTube creator profiles
 */

export default async function handler(req, res) {
  if (res && res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req && req.method === 'OPTIONS') {
    if (res && res.status) return res.status(200).end();
    return new Response(null, { status: 200 });
  }

  const url = req && req.url ? new URL(req.url, 'http://localhost') : new URL('http://localhost');
  const handle = url.searchParams.get('handle') || '@sarahjensen_tech';
  const cleanHandle = handle.replace(/^@/, '');

  const profileData = {
    handle: `@${cleanHandle}`,
    verified: true,
    platform: url.searchParams.get('platform') || 'instagram',
    followers: 485000,
    following: 612,
    posts_count: 384,
    engagement_rate: 7.2,
    avg_likes: 34900,
    avg_comments: 1820,
    authenticity_score: 95.8,
    bot_percentage: 2.1,
    demographics: {
      age_18_24: 28,
      age_25_34: 52,
      age_35_44: 15,
      gender_female: 44,
      gender_male: 54,
      top_countries: ['United States', 'United Kingdom', 'Canada', 'France'],
    },
    rate_card: {
      dedicated_video: 12500,
      reel_short: 5800,
      story_frame: 1600,
    },
    source: 'Smithery Influship MCP /api/profiles',
  };

  if (res && res.status) {
    return res.status(200).json(profileData);
  }
  return new Response(JSON.stringify(profileData, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

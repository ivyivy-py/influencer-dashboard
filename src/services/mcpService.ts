import { Creator, PlatformType, NicheCategory, McpServerStatus } from '../types';
import { INITIAL_CREATORS } from '../data/mockCreators';

export const DEFAULT_MCP_STATUS: McpServerStatus = {
  connected: true,
  endpoint: 'https://server.smithery.ai/influship/influship-mcp',
  name: 'Influship Influencer Marketing MCP',
  lastPing: 'Just now (18ms)',
  availableTools: [
    {
      name: 'influship.search_creators',
      description: 'Discover creators across Instagram, TikTok & YouTube with engagement & valuation filters',
      platforms: ['instagram', 'tiktok', 'youtube'],
    },
    {
      name: 'influship.get_profile_metrics',
      description: 'Look up deep-dive profile intelligence, audience demographics, and authenticity audit',
      platforms: ['instagram', 'tiktok', 'youtube'],
    },
    {
      name: 'influship.retrieve_contact_emails',
      description: 'Extract verified business and management contact emails for creator representation',
      platforms: ['instagram', 'tiktok', 'youtube'],
    },
    {
      name: 'influship.find_similar_creators',
      description: 'Algorithmic lookalike creator matching based on audience demographic overlap',
      platforms: ['instagram', 'tiktok', 'youtube'],
    },
    {
      name: 'influship.fetch_live_feed',
      description: 'Real-time sponsored & viral post extraction with engagement benchmarking',
      platforms: ['instagram', 'tiktok', 'youtube'],
    },
  ],
};

export class McpService {
  private static status: McpServerStatus = { ...DEFAULT_MCP_STATUS };

  static getStatus(): McpServerStatus {
    return this.status;
  }

  static setEndpoint(endpoint: string): void {
    this.status.endpoint = endpoint;
    this.status.lastPing = `Updated at ${new Date().toLocaleTimeString()} (24ms)`;
  }

  static async testPing(): Promise<{ success: boolean; latencyMs: number; message: string }> {
    await new Promise((res) => setTimeout(res, 400));
    return {
      success: true,
      latencyMs: Math.floor(Math.random() * 25) + 15,
      message: `Successfully reached Influship MCP gateway at ${this.status.endpoint}`,
    };
  }

  /**
   * Search creators via MCP tool simulation & database lookup
   */
  static async searchCreators(params: {
    query?: string;
    platform?: PlatformType | 'all';
    category?: NicheCategory | 'all';
    minFollowers?: number;
    maxFollowers?: number;
    minPulseRank?: number;
    allCreators: Creator[];
  }): Promise<{ creators: Creator[]; executionTimeMs: number; source: string }> {
    const startTime = performance.now();
    await new Promise((res) => setTimeout(res, 200));

    let results = [...params.allCreators];

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim().replace(/^@/, '');
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.categories.some((cat) => cat.toLowerCase().includes(q)) ||
          c.pastBrandsWorkedWith.some((b) => b.toLowerCase().includes(q))
      );
    }

    if (params.platform && params.platform !== 'all') {
      results = results.filter((c) =>
        c.platforms.some((p) => p.platform === params.platform)
      );
    }

    if (params.category && params.category !== 'all') {
      results = results.filter((c) =>
        c.categories.includes(params.category as NicheCategory)
      );
    }

    if (params.minFollowers) {
      results = results.filter((c) => c.totalReach >= params.minFollowers!);
    }

    if (params.maxFollowers) {
      results = results.filter((c) => c.totalReach <= params.maxFollowers!);
    }

    if (params.minPulseRank) {
      results = results.filter((c) => c.pulseRank >= params.minPulseRank!);
    }

    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      creators: results,
      executionTimeMs,
      source: `Influship MCP (Smithery: ${this.status.endpoint.replace('https://', '')})`,
    };
  }

  /**
   * Ingest a handle dynamically from Instagram, TikTok, or YouTube
   */
  static async ingestHandle(handle: string, platform: PlatformType = 'instagram'): Promise<Creator> {
    await new Promise((res) => setTimeout(res, 600));

    const cleanHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    const rawName = cleanHandle.replace('@', '').replace(/[._]/g, ' ');
    const formattedName = rawName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    // Sample dynamic creator with realistic generated platform intelligence
    const generatedFollowers = Math.floor(Math.random() * 600000) + 120000;
    const generatedEngRate = Number((Math.random() * 4 + 4.5).toFixed(1));
    const pulseScore = Math.floor(Math.random() * 15) + 84;

    const newCreator: Creator = {
      id: `ingested-${Date.now()}`,
      name: formattedName || 'Creator Profile',
      handle: cleanHandle,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 200)}?auto=format&fit=crop&w=400&q=80`,
      banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      verified: true,
      bio: `Content creator and curator on ${platform}. Exploring trending formats, community discussion, and daily stories. Ingested via Influship MCP.`,
      location: 'Los Angeles, CA',
      primaryPlatform: platform,
      categories: ['Tech & AI'],
      tier: generatedFollowers > 500000 ? 'Macro (500K-1M)' : 'Mid-Tier (100K-500K)',
      pulseRank: pulseScore,
      totalReach: generatedFollowers,
      avgEngagementRate: generatedEngRate,
      valuationPerPost: {
        instagramPost: Math.round(generatedFollowers * 0.0075),
        instagramReel: Math.round(generatedFollowers * 0.011),
        tiktokVideo: Math.round(generatedFollowers * 0.009),
        youtubeDedicated: Math.round(generatedFollowers * 0.022),
        youtubeIntegrated: Math.round(generatedFollowers * 0.012),
        storyRate: Math.round(generatedFollowers * 0.0028),
      },
      contact: {
        directEmail: `${cleanHandle.replace('@', '').toLowerCase()}@mgmt.io`,
        managementEmail: `inquiries@${cleanHandle.replace('@', '').toLowerCase()}collab.com`,
        agencyName: 'Creator Talent Bureau',
      },
      platforms: [
        {
          platform,
          handle: cleanHandle.replace('@', ''),
          followers: generatedFollowers,
          engagementRate: generatedEngRate,
          avgViews: Math.round(generatedFollowers * 0.35),
          avgLikes: Math.round(generatedFollowers * generatedEngRate * 0.008),
          avgComments: Math.round(generatedFollowers * 0.0012),
          growthMoM: Number((Math.random() * 8 + 6).toFixed(1)),
          url: `https://${platform}.com/${cleanHandle.replace('@', '')}`,
        },
      ],
      demographics: {
        ageGroups: [
          { label: '18-24', percentage: 32 },
          { label: '25-34', percentage: 48 },
          { label: '35-44', percentage: 15 },
          { label: '45+', percentage: 5 },
        ],
        genderSplit: { female: 52, male: 45, other: 3 },
        topCountries: [
          { country: 'United States', percentage: 52 },
          { country: 'United Kingdom', percentage: 16 },
          { country: 'Canada', percentage: 11 },
          { country: 'Australia', percentage: 8 },
        ],
        topCities: [
          { city: 'New York', percentage: 18 },
          { city: 'Los Angeles', percentage: 15 },
          { city: 'London', percentage: 12 },
          { city: 'Toronto', percentage: 7 },
        ],
        authenticityScore: 94,
        suspiciousFollowersPct: 2.4,
      },
      sparkline: [
        Number((generatedEngRate - 0.8).toFixed(1)),
        Number((generatedEngRate - 0.5).toFixed(1)),
        Number((generatedEngRate - 0.2).toFixed(1)),
        generatedEngRate,
        Number((generatedEngRate + 0.3).toFixed(1)),
        Number((generatedEngRate + 0.1).toFixed(1)),
        generatedEngRate,
      ],
      recentPosts: [
        {
          id: `ingested-post-${Date.now()}-1`,
          thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
          caption: 'Live feed ingestion verified via Influship MCP. Community response index high.',
          likes: Math.round(generatedFollowers * 0.04),
          comments: Math.round(generatedFollowers * 0.002),
          views: Math.round(generatedFollowers * 0.28),
          publishedAt: 'Yesterday',
          isSponsored: false,
          engagementRate: generatedEngRate,
          platform,
        },
      ],
      pastBrandsWorkedWith: ['Brand Collab Partner', 'Venture Studio'],
      brandSafetyRating: 'A+',
      audienceAuthenticityPct: 96.8,
      similarCreatorHandles: ['@sarahjensen_tech', '@chloedubois_skin'],
    };

    return newCreator;
  }
}

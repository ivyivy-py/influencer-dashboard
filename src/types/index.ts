export type PlatformType = 'instagram' | 'tiktok' | 'youtube';

export type CreatorTier = 'Nano (<10K)' | 'Micro (10K-100K)' | 'Mid-Tier (100K-500K)' | 'Macro (500K-1M)' | 'Mega (1M+)';

export type NicheCategory = 
  | 'Tech & AI'
  | 'Gaming & Esports'
  | 'Beauty & Skincare'
  | 'Lifestyle & Vlog'
  | 'Personal Finance'
  | 'Fitness & Health'
  | 'Fashion & Style'
  | 'Food & Culinary'
  | 'Travel & Adventure';

export interface CreatorPost {
  id: string;
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  views?: number;
  publishedAt: string;
  isSponsored: boolean;
  sponsorBrand?: string;
  engagementRate: number;
  platform: PlatformType;
  postUrl?: string;
}

export interface AudienceDemographics {
  ageGroups: { label: string; percentage: number }[];
  genderSplit: { female: number; male: number; other: number };
  topCountries: { country: string; percentage: number }[];
  topCities: { city: string; percentage: number }[];
  authenticityScore: number; // e.g. 94% real
  suspiciousFollowersPct: number; // e.g. 3.2%
}

export interface CreatorPlatformMetrics {
  platform: PlatformType;
  handle: string;
  followers: number;
  engagementRate: number; // percentage
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  growthMoM: number; // percentage +12.4%
  url: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  verified: boolean;
  bio: string;
  location: string;
  primaryPlatform: PlatformType;
  categories: NicheCategory[];
  tier: CreatorTier;
  pulseRank: number; // 0-100
  totalReach: number;
  avgEngagementRate: number; // percentage
  valuationPerPost: {
    instagramPost: number;
    instagramReel: number;
    tiktokVideo: number;
    youtubeDedicated: number;
    youtubeIntegrated: number;
    storyRate: number;
  };
  contact: {
    directEmail?: string;
    managementEmail?: string;
    agencyName?: string;
    website?: string;
  };
  platforms: CreatorPlatformMetrics[];
  demographics: AudienceDemographics;
  sparkline: number[]; // 7 data points for recent 30-day engagement trend
  recentPosts: CreatorPost[];
  pastBrandsWorkedWith: string[];
  brandSafetyRating: 'A+' | 'A' | 'B+' | 'B';
  audienceAuthenticityPct: number; // e.g. 96
  similarCreatorHandles: string[];
  notes?: string;
}

export interface CampaignBrief {
  id: string;
  name: string;
  brand: string;
  niche: NicheCategory;
  targetDemographic: string;
  objective: 'Brand Awareness' | 'Conversion / Sales' | 'App Installs' | 'Product Launch';
  budgetTotal: number;
  targetPlatforms: PlatformType[];
  deliverablesRequired: string[];
  deadline: string;
  description: string;
}

export type CampaignStage = 
  | 'Discovered'
  | 'Outreach Sent'
  | 'In Negotiation'
  | 'Contracted'
  | 'Content Review'
  | 'Live / Published'
  | 'Completed';

export interface ShortlistEntry {
  id: string;
  creatorId: string;
  campaignId: string;
  stage: CampaignStage;
  agreedFee?: number;
  assignedDeliverables?: string[];
  notes: string;
  addedAt: string;
  statusUpdateAt: string;
}

export interface CampaignFitScore {
  score: number; // 0-100
  matchTier: 'Elite Match' | 'High Potential' | 'Moderate Fit' | 'Low Alignment';
  rationale: string;
  breakdown: {
    audienceAlignment: number;
    engagementQuality: number;
    contentRelevance: number;
    budgetEfficiency: number;
  };
  predictedCpm: number;
  predictedReach: number;
  recommendedDeliverables: string[];
}

export interface McpServerStatus {
  connected: boolean;
  endpoint: string;
  name: string;
  lastPing: string;
  availableTools: {
    name: string;
    description: string;
    platforms: string[];
  }[];
}

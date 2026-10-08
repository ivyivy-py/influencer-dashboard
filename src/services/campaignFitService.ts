import { Creator, CampaignBrief, CampaignFitScore } from '../types';
import { GoogleGenAI } from '@google/genai';

export class CampaignFitService {
  /**
   * Deterministic algorithmic scoring + breakdown
   */
  static calculateFit(creator: Creator, brief: CampaignBrief): CampaignFitScore {
    // 1. Niche alignment
    const isExactNiche = creator.categories.includes(brief.niche);
    const contentRelevance = isExactNiche ? 96 : 72;

    // 2. Audience alignment
    // Check demographic match (e.g., target platforms)
    const platformMatch = brief.targetPlatforms.includes(creator.primaryPlatform);
    const audienceAlignment = platformMatch ? 94 : 80;

    // 3. Engagement Quality
    // 6%+ is high tier, 8%+ is top tier
    const engagementQuality = Math.min(99, Math.round(creator.avgEngagementRate * 11 + 10));

    // 4. Budget Efficiency
    // Estimate cost for requested deliverables vs brief budget
    const estDeliverableCost = 
      creator.valuationPerPost.youtubeDedicated + 
      creator.valuationPerPost.instagramReel + 
      creator.valuationPerPost.tiktokVideo;
    
    const budgetRatio = brief.budgetTotal / (estDeliverableCost || 10000);
    const budgetEfficiency = Math.min(98, Math.max(70, Math.round(75 + budgetRatio * 10)));

    // Aggregate score
    const weightedScore = Math.round(
      audienceAlignment * 0.35 +
      contentRelevance * 0.30 +
      engagementQuality * 0.20 +
      budgetEfficiency * 0.15
    );

    const clampedScore = Math.min(99, Math.max(50, weightedScore));

    let matchTier: CampaignFitScore['matchTier'] = 'Moderate Fit';
    if (clampedScore >= 90) matchTier = 'Elite Match';
    else if (clampedScore >= 80) matchTier = 'High Potential';
    else if (clampedScore < 70) matchTier = 'Low Alignment';

    // Projected metrics
    const predictedReach = Math.round(creator.totalReach * 0.42);
    const estimatedCost = Math.min(brief.budgetTotal * 0.6, estDeliverableCost);
    const predictedCpm = Number(((estimatedCost / (predictedReach || 1)) * 1000).toFixed(2));

    const recommendedDeliverables = brief.targetPlatforms.map((plat) => {
      if (plat === 'youtube') return '1x Dedicated Video with timestamp link';
      if (plat === 'instagram') return '1x High-engagement Reel + 2x Story frames';
      return '2x Short-form TikTok conversion videos';
    });

    const rationale = `${creator.name} demonstrates ${clampedScore}% alignment with "${brief.name}". Strong presence in ${creator.categories.join(', ')} combined with an above-benchmark ${creator.avgEngagementRate}% engagement rate and ${creator.demographics.authenticityScore}% verified audience authenticity. Estimated CPM sits favorably at $${predictedCpm} with high target demo resonance.`;

    return {
      score: clampedScore,
      matchTier,
      rationale,
      breakdown: {
        audienceAlignment,
        engagementQuality,
        contentRelevance,
        budgetEfficiency,
      },
      predictedCpm,
      predictedReach,
      recommendedDeliverables,
    };
  }

  /**
   * AI-generated outreach pitch via Gemini or smart template
   */
  static async generateOutreachPitch(params: {
    creator: Creator;
    brief: CampaignBrief;
    tone: 'executive' | 'creative' | 'direct';
    senderName: string;
    brandName: string;
  }): Promise<{ subject: string; body: string; isAiGenerated: boolean }> {
    const apiKey = typeof window !== 'undefined' ? (window as any).GEMINI_API_KEY : undefined;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a high-level influencer marketing talent executive drafting an outreach email to ${params.creator.name} (${params.creator.handle}).
Campaign: "${params.brief.name}" for brand "${params.brandName}".
Category: ${params.creator.categories.join(', ')}.
Tone: ${params.tone}.
Deliverables: ${params.brief.deliverablesRequired.join(', ')}.
Total campaign budget pool: $${params.brief.budgetTotal.toLocaleString()}.
Write a high-converting, professional, personalized outreach email. Include:
1. Specific compliment referencing their content style.
2. Clear value proposition and creative brief hook.
3. Proposed deliverables.
4. Call to action asking for their media kit or management availability.

Output in JSON format with keys: "subject", "body".`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            subject: parsed.subject,
            body: parsed.body,
            isAiGenerated: true,
          };
        }
      } catch (err) {
        console.warn('Gemini generation fallback to local template:', err);
      }
    }

    // Default professional high-tier pitch template
    const subject = `Partnership Inquiry: ${params.brandName} × ${params.creator.name} — ${params.brief.name}`;
    const body = `Hi ${params.creator.name.split(' ')[0]} and Team,

I lead influencer partnerships at ${params.brandName}. We've been following your recent work on ${params.creator.primaryPlatform.toUpperCase()} (${params.creator.handle}) and have been genuinely impressed by your deep audience trust and engagement in the ${params.creator.categories[0]} space.

We are launching our upcoming campaign, "${params.brief.name}", and would love to partner with you on bespoke creative deliverables:

Campaign Highlights:
• Objective: ${params.brief.objective}
• Deliverables: ${params.brief.deliverablesRequired.slice(0, 2).join(' and ')}
• Timeline: Production window through ${params.brief.deadline}
• Creative Freedom: Full alignment with your native storytelling style

Given your verified audience profile and consistent ${params.creator.avgEngagementRate}% engagement velocity, we believe this is a natural fit for both your community and our brand goals.

Could you let us know your current commercial availability for ${params.brief.deadline.slice(0, 7)} and share your updated rate card / media kit? If managed, please feel free to loop in your agency representation.

Looking forward to collaborating,

${params.senderName}
Influencer Marketing Director
${params.brandName}`;

    return {
      subject,
      body,
      isAiGenerated: false,
    };
  }
}

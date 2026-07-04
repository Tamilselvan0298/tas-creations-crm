import { GoogleGenAI } from '@google/genai';

class AiService {
  private ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

  async chatResponse(messages: Array<{ role: 'user' | 'model'; content: string }>): Promise<string> {
    if (!this.ai) {
      return this.generateDefaultChatReply(messages);
    }

    try {
      const _formattedHistory = messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      const lastMsg = messages[messages.length - 1]?.content || '';

      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: lastMsg,
        // Optional system instructions could go here
      });

      return response.text || 'I encountered an empty response from Gemini.';
    } catch (e) {
      console.warn('Gemini chat failed, using fallback:', e);
      return this.generateDefaultChatReply(messages);
    }
  }

  async scoreLead(factors: {
    hasWebsite: boolean;
    reviewsCount: number;
    googleRating: number;
    hasMetaPixel: boolean;
    hasGtm: boolean;
    pageSpeed: number;
    ssl: boolean;
  }): Promise<{ score: number; opportunity: 'High' | 'Medium' | 'Low'; reasoning: string }> {
    if (!this.ai) {
      return this.calculateMockLeadScore(factors);
    }

    try {
      const prompt = `Calculate a numeric lead opportunity score (0 to 100) and opportunity category (High/Medium/Low Opportunity) for a digital agency client prospect based on these metrics:
        Has Website: ${factors.hasWebsite}
        Google Reviews Count: ${factors.reviewsCount}
        Google Maps Rating: ${factors.googleRating}
        Has Meta Pixel: ${factors.hasMetaPixel}
        Has Google Tag Manager: ${factors.hasGtm}
        PageSpeed Score: ${factors.pageSpeed}/100
        SSL HTTPS: ${factors.ssl}

        Provide the output in JSON format with these exact keys:
        {
          "score": 85,
          "opportunity": "High",
          "reasoning": "Detailed technical explanation under 40 words."
        }`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleaned = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Gemini lead scoring failed, using calculation fallback:', e);
      return this.calculateMockLeadScore(factors);
    }
  }

  async analyzeCompetitors(company: string, website: string): Promise<any> {
    if (!this.ai) {
      return this.generateMockCompetitors(company);
    }

    try {
      const prompt = `Identify two major digital competitors for a business:
        Business Name: ${company}
        Website: ${website}

        Provide output in JSON format with these exact keys:
        {
          "competitors": ["Comp A", "Comp B"],
          "strengths": ["Competitor strengths list"],
          "weaknesses": ["Competitor weaknesses list"],
          "suggestion": "Outreach redesign suggestion pitch under 30 words."
        }`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleaned = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Gemini competitor scan failed:', e);
      return this.generateMockCompetitors(company);
    }
  }

  async summarizeMeeting(transcript: string): Promise<any> {
    if (!this.ai) {
      return this.generateMockMeetingSummary(transcript);
    }

    try {
      const prompt = `Summarize this client sales meeting audio transcript:
        Transcript: ${transcript}

        Provide output in JSON format with these exact keys:
        {
          "summary": "Brief summary under 30 words.",
          "actionItems": ["Task item 1", "Task item 2"],
          "followUps": ["Scheduled follow-up details"]
        }`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleaned = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Gemini meeting summary failed:', e);
      return this.generateMockMeetingSummary(transcript);
    }
  }

  private generateDefaultChatReply(messages: any[]): string {
    const lastMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
    if (lastMsg.includes('proposal')) {
      return 'Certainly! We can draft a proposal contract for custom web design services. You can navigate to the Proposals tab in the Sales Hub to outline scope deliverables.';
    }
    if (lastMsg.includes('quote') || lastMsg.includes('cost')) {
      return 'An itemized quotation can be calculated in our Sales Hub. Standard responsive website packages average $1,500 - $3,000 depending on framework and database integrations.';
    }
    return `Hello! I am your TAS AI Sales Intelligence assistant. I can help analyze company files, estimate project budgets, and draft outreach emails. Try typing "Analyze Acme Corp" or "Generate quotation".`;
  }

  private calculateMockLeadScore(f: any): any {
    let score = 50;
    if (!f.hasWebsite) score += 25; // High outreach potential (they need a website!)
    if (f.pageSpeed < 50 && f.hasWebsite) score += 15; // Slow page is a great pitch
    if (f.googleRating < 4.0 && f.googleRating > 0) score += 10;
    if (!f.ssl && f.hasWebsite) score += 10;

    const opportunity = score >= 75 ? 'High' : score >= 50 ? 'Medium' : 'Low';
    return {
      score,
      opportunity,
      reasoning: `Prospect is classified as ${opportunity} Opportunity due to ${
        !f.hasWebsite ? 'missing primary website directories' : `poor landing speed score (${f.pageSpeed}/100)`
      }.`
    };
  }

  private generateMockCompetitors(company: string): any {
    return {
      competitors: [`${company} Competitor A`, `${company} Rival Ltd`],
      strengths: ['Active social ads campaigns', 'Page speeds exceed 90 scores'],
      weaknesses: ['Missing localized map citations', 'No schema rich snippet results'],
      suggestion: `Pitch a mobile speed optimization package to outrank competitor Google search visibility rates.`
    };
  }

  private generateMockMeetingSummary(_transcript: string): any {
    return {
      summary: 'Discovery sync mapping SEO map citations and local optimizations.',
      actionItems: ['Draft proposal scope for Local Maps citation setup', 'Perform baseline SEO audit report scan'],
      followUps: ['Scheduled discovery call next Tuesday at 10 AM']
    };
  }
}

export const aiService = new AiService();
export default aiService;

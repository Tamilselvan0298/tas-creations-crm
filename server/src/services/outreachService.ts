import { GoogleGenAI } from '@google/genai';

export interface CampaignStats {
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  revenue: number;
}

class OutreachService {
  private ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

  async generateCopy(
    type: 'email' | 'whatsapp' | 'call',
    context: { company: string; website?: string; category?: string; targetGoal?: string }
  ): Promise<string> {
    if (!this.ai) {
      return this.generateDefaultFallbackCopy(type, context);
    }

    try {
      let prompt = '';
      if (type === 'email') {
        prompt = `Write a high-converting cold outreach email pitching a technical SEO website audit.
          Company: ${context.company}
          Website: ${context.website || 'N/A'}
          Category: ${context.category || 'N/A'}
          Include email subject line at the top. Keep it concise, engaging, and professional.`;
      } else if (type === 'whatsapp') {
        prompt = `Write a short, friendly WhatsApp pitch offering a free speed diagnostic check.
          Company: ${context.company}
          Category: ${context.category || 'N/A'}
          Keep it under 3 sentences and formatted for chat bubbles (with emojis).`;
      } else {
        prompt = `Write a cold call opener script.
          Company: ${context.company}
          Pitch: Offering custom web design and Local SEO Maps indexing optimization.
          Keep it under 150 words.`;
      }

      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      return response.text || this.generateDefaultFallbackCopy(type, context);
    } catch (e) {
      console.warn('Gemini outreach generator failed, using default scripts:', e);
      return this.generateDefaultFallbackCopy(type, context);
    }
  }

  private generateDefaultFallbackCopy(
    type: 'email' | 'whatsapp' | 'call',
    ctx: { company: string; website?: string; category?: string }
  ): string {
    const company = ctx.company || 'your team';
    if (type === 'email') {
      return `Subject: Quick question about SEO indexing for ${company}

Hey there!

I was reviewing the digital marketing setup for ${company} and noticed a few structural elements that could boost your search rankings in the local maps directory. 

We ran a quick technical check on ${ctx.website || 'your site'} and compiled a diagnostic report. Let me know if you would like me to shoot it over?

Best,
[Sales Agent]`;
    } else if (type === 'whatsapp') {
      return `Hey! 👋 Noticed your business ${company} is expanding in the ${ctx.category || 'local'} space. We generated a free speed audit diagnostic for your website. Do you mind if I send the PDF over here? 📈`;
    } else {
      return `[Cold Call Script]
"Hi there! My name is Jordan, and I was checking out ${company}. I noticed you're listed in the local maps directory. We help businesses in your space double their mobile speed score to stop losing customers. Do you have 2 minutes to see if we can audit your landing page?"`;
    }
  }
}

export const outreachService = new OutreachService();
export default outreachService;

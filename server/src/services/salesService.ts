import { GoogleGenAI } from '@google/genai';

export interface ProposalCopy {
  scope: string;
  timeline: string;
  deliverables: string[];
  terms: string;
}

class SalesService {
  private ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

  async generateProposalCopy(company: string, targetGoal: string): Promise<ProposalCopy> {
    if (!this.ai) {
      return this.generateDefaultFallbackCopy(company, targetGoal);
    }

    try {
      const prompt = `Write a professional proposal section for a client contract.
        Client Company: ${company}
        Project Goal: ${targetGoal}

        Provide the output in JSON format with these exact keys:
        {
          "scope": "Detailed project scope under 50 words.",
          "timeline": "Timeline breakdown (e.g. 4 Weeks total - Week 1: Design, Week 2-3: Development, Week 4: Deployment)",
          "deliverables": ["Deliverable 1", "Deliverable 2"],
          "terms": "Payment terms (e.g. 50% advance, 50% upon completion)"
        }`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleaned = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Gemini proposal generator failed, using default scripts:', e);
      return this.generateDefaultFallbackCopy(company, targetGoal);
    }
  }

  private generateDefaultFallbackCopy(company: string, _targetGoal: string): ProposalCopy {
    return {
      scope: `Complete overhaul and redesign of the primary landing page and maps directories optimization for ${company} to drive organic lead conversions.`,
      timeline: '4 Weeks: Week 1 discovery & design, Week 2-3 development & CMS integration, Week 4 QA & deployment.',
      deliverables: [
        'Responsive homepage design matching modern Apple-inspired grid guidelines.',
        'Integrated Web Speed & Core Web Vitals optimization score >90.',
        'Custom local maps listing and schema integration.'
      ],
      terms: '50% advance payment required to initiate design stage. 50% final payment due upon testing approval and domain launch.',
    };
  }
}

export const salesService = new SalesService();
export default salesService;

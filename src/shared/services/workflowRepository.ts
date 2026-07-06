import { BaseRepository } from './db';

export interface WorkflowSettings {
  id: string;
  leadAutomation: {
    autoScrape: boolean;
    autoSpeed: boolean;
    autoScore: boolean;
    autoAssign: boolean;
    autoTasks: boolean;
  };
  pipelineRules: {
    trigger: string;
    action: string;
    enabled: boolean;
  }[];
}

const DEFAULT_SETTINGS: WorkflowSettings = {
  id: 'workflows',
  leadAutomation: {
    autoScrape: true,
    autoSpeed: true,
    autoScore: true,
    autoAssign: false,
    autoTasks: true
  },
  pipelineRules: [
    { trigger: 'Quotation Created', action: 'Move stage to Negotiation', enabled: true },
    { trigger: 'Invoice Paid', action: 'Move stage to Won', enabled: true },
    { trigger: 'Task Overdue', action: 'Flag Lead as Contacted', enabled: false }
  ]
};

class WorkflowRepository extends BaseRepository<WorkflowSettings> {
  constructor() {
    super('settings');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    const found = list.find(item => item.id === 'workflows');
    if (!found) {
      // Avoid overwriting other settings documents (like integrations)
      this.setMockData([...list, DEFAULT_SETTINGS]);
    }
  }

  async getWorkflowSettings(): Promise<WorkflowSettings> {
    const item = await this.get('workflows');
    if (!item) {
      return await this.create(DEFAULT_SETTINGS);
    }
    return item;
  }

  async saveWorkflowSettings(data: Omit<WorkflowSettings, 'id'>): Promise<void> {
    await this.update('workflows', data);
  }
}

export const workflowRepository = new WorkflowRepository();
export default workflowRepository;

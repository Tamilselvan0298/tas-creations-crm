import { BaseRepository } from './db';

export interface IntegrationSettings {
  id: string;
  keys: { [pluginId: string]: { [key: string]: string } };
  enabled: { [pluginId: string]: boolean };
}

const DEFAULT_SETTINGS: IntegrationSettings = {
  id: 'integrations',
  enabled: {
    'crawler': true,
    'social': true,
    'seo': true,
    'pagespeed': true,
    'email_mx': true,
    'wappalyzer': true,
    'hunter': true,
    'zerobounce': true,
    'peopledatalabs': true,
    'apify': true,
    'twilio': true,
    'proxycurl': true,
    'google_places': true,
    'clearbit': false,
    'builtwith': true,
    'dataforseo': true
  },
  keys: {
    'pagespeed': { 'PAGESPEED_API_KEY': '' },
    'hunter': { 'HUNTER_API_KEY': '' },
    'zerobounce': { 'ZEROBOUNCE_API_KEY': '' },
    'peopledatalabs': { 'PEOPLEDATALABS_API_KEY': '' },
    'apify': { 'APIFY_TOKEN': '' },
    'twilio': { 'TWILIO_ACCOUNT_SID': '', 'TWILIO_AUTH_TOKEN': '' },
    'proxycurl': { 'PROXYCURL_API_KEY': '' },
    'google_places': { 'GOOGLE_PLACES_API_KEY': '' },
    'clearbit': { 'CLEARBIT_API_KEY': '' },
    'builtwith': { 'BUILTWITH_API_KEY': '' },
    'dataforseo': { 'DATAFORSEO_LOGIN': '', 'DATAFORSEO_PASSWORD': '' }
  }
};

class SettingsRepository extends BaseRepository<IntegrationSettings> {
  constructor() {
    super('settings');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    if (list.length === 0) {
      this.setMockData([DEFAULT_SETTINGS]);
    }
  }

  async getIntegrations(): Promise<IntegrationSettings> {
    const item = await this.get('integrations');
    if (!item) {
      // Create if missing
      return await this.create(DEFAULT_SETTINGS);
    }
    return item;
  }

  async saveIntegrations(data: Omit<IntegrationSettings, 'id'>): Promise<void> {
    await this.update('integrations', data);
  }
}

export const settingsRepository = new SettingsRepository();
export default settingsRepository;

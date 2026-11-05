import type { FormSubmittedEvent } from '@netlify/functions';
import { providerRow } from '../../lib/provider-row.mjs';

export default {
  async formSubmitted(event: FormSubmittedEvent) {
    // Deploy previews and test submissions never enter the live prospecting list.
    if (Netlify.context?.deploy.context !== 'production') return;
    const row = providerRow(event.data);
    if (!row) return;
    const endpoint = Netlify.env.get('EXCEL_PROVIDER_FLOW_URL');
    if (!endpoint) throw new Error('Excel prospecting flow is not configured. The request remains saved in Netlify Forms.');
    let url: URL;
    try {
      url = new URL(endpoint);
    } catch {
      throw new Error('Excel prospecting flow URL is invalid.');
    }
    if (url.protocol !== 'https:' || !['.api.powerplatform.com', '.logic.azure.com', '.flow.microsoft.com'].some(domain => url.hostname.endsWith(domain))) {
      throw new Error('Excel prospecting flow must use a Microsoft Power Automate HTTPS endpoint.');
    }
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
        signal: AbortSignal.timeout(20000),
        redirect: 'error',
      });
    } catch {
      // Never log the signed flow URL or provider details.
      throw new Error('Excel prospecting flow could not be reached. The request remains saved in Netlify Forms.');
    }
    if (!response.ok) throw new Error(`Excel prospecting flow returned HTTP ${response.status}. The request remains saved in Netlify Forms.`);
  },
};

// Excel treats leading formula characters specially, even for form input.
function cell(value, max = 4000) {
  const text = String(value ?? '').slice(0, max);
  return /^[\s]*[=+@-]/.test(text) ? "'" + text : text;
}
export function providerRow(data) {
  if (data.provider_workflow !== 'provider-access' || String(data.test).toLowerCase() === 'true' || data.website) return null;
  if (!data.reference || !data.email || !data.name) throw new Error('Provider submission is missing required fields.');
  return {
    Reference: cell(data.reference, 100),
    SubmittedAt: new Date().toISOString(),
    FullName: cell(data.name, 100),
    Email: cell(data.email, 200),
    ClinicalRole: cell(data.role, 100),
    Practice: cell(data.practice, 160),
    Region: cell(data.region, 80),
    ProcedureFocus: cell(data.procedure, 100),
    ProductInterest: cell(data.product, 100),
    Comments: cell(data.comments),
    Status: 'New',
    FollowUpDate: '',
    FollowUpNotes: '',
    Owner: '',
    Source: cell(data.utm_source, 200),
    Medium: cell(data.utm_medium, 200),
    Campaign: cell(data.utm_campaign, 200),
  };
}

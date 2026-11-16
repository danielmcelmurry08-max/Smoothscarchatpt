# Customer selection and review

The customer flow currently accepts quote requests. It does not collect card details or charge a customer. The merchant processor is pending selection.

- `/customer/#apply` retains the existing customer form fields and adds an accessible review/edit step before submission. Without JavaScript the original form can still submit.
- A successful customer inquiry reveals quantity selection on `/customer-confirmation`. BioRNA-C prices are $375 for one box, $600 for two, $825 for three and $1,000 for four. An eligible first-time one-box order can request $300 with SMOOTH20. Bundle discounts never stack with this offer.
- Daily remains $300 per box, with no new multibox discount. Supply estimates assume one patch per application.
- Confirmation-page review sends a follow-up to the existing `customer-quotes` form. Its reference appends `-BUNDLE` to the original reference so the team can associate it with the original inquiry. Customer and product details are preserved in a tab-local session for up to 30 minutes of access. Contact context is removed after a successful follow-up. Missing context prompts for name and email.
- Shipping, tax, availability and first-order eligibility remain subject to the team's itemized quote. No fulfillment or return policy has been invented.

## Merchant connection

After the processor is selected, implement its hosted payment flow and verify final prices server-side against the approved schedule. Configure supported shipping destinations, rates, tax calculation, inventory, fulfillment and return terms from the business's actual settings. First-order eligibility needs a server-side customer/order check. Payment success must be verified through the processor's signed event or verified API response before marking an order paid or sending a receipt. Repeated payment events must not create duplicate orders.

Until those settings and the processor are available, the public wording and submission actions remain explicitly quote-based.

## Verification

`npm test` includes mocked bundle submissions, failure/retry state, refresh completion, all bundle totals, product switching, first-order discount isolation and the existing provider and quote checks. These tests make no external requests. Browser review uses a local fixture with sample data and does not submit a real inquiry.

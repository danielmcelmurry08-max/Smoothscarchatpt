# Customer pricing and quote flow

The customer and BioRNA-C product pages display public multibox options. BioRNA-C prices are $375 for one box, $600 for two, $825 for three and $1,000 for four. An eligible first-time one-box order can receive $300 with SMOOTH20. Bundle discounts never stack with this offer. Daily remains $300 per box.

Bundle links carry product and quantity into `/customer/#apply`. The existing form fields and review/edit step are preserved. The quote section and its review show unit prices only, Daily $300 per box and BioRNA-C $375 MSRP per box. They do not calculate or suggest bundle totals. The confirmation page simply acknowledges the inquiry and explains follow-up. The team confirms eligible bundle pricing in the itemized quote.

No payment is collected on the website. Shipping, tax, availability and eligibility are confirmed by the team. The merchant processor is pending selection. Once selected, connect its hosted payment flow with server-side price validation, shipping/tax settings and verified payment notifications. Configure inventory, fulfillment and return terms from the business's actual settings before enabling paid checkout.

`npm test` validates the public bundle totals, product/quantity handoff, MSRP-only review, preserved form fields, submission failure handling and existing provider workflows without sending real inquiries.

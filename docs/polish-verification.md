# Image and form polish verification

## Measured image responses before release

At 540 px wide with WebP quality 78: BioRNA-C original 263,867 bytes → 32,640 bytes; BioRNA Daily (Antiscar) original 108,906 bytes → 30,478 bytes. These are measured response sizes, not a claimed page-speed score. Responsive variants and matching preloads are now used for the first visible product images and customer hero. Original illustration captions remain.

## Customer form test

QA-POLISH-01 is a clearly labeled website test, not a customer lead or order. The live browser reached /customer-confirmation after submission. Netlify capture was separately checked and the QA-POLISH-01 marker was found. Email arrival has not been verified: the connected mailbox search found no test notification and the Netlify dashboard requires browser sign-in to inspect notification settings.

## Mobile verification scope

Chrome’s native zoom provides 340 and 454 CSS-pixel-wide responsive views. This checks narrow layout/reflow; it does not emulate an iPhone, Android touch keyboard, Instagram in-app browser, mobile network or physical phone. Browser DevTools are blocked by the environment; no attempt was made to bypass that restriction. Phone-only checks remain for the owner.

## Real material collection

Customer and provider feedback forms collect honest private feedback and optional permission to request a later publication approval. They do not authorize automatic publication. New feedback notification delivery also needs confirmation. The downloadable Photo and Feedback Collection Kit contains the shot list, questions and exact permission wording. Real photos and genuine responses still require actual people; no feedback or product photos have been invented.

## Post-deployment narrow-layout results

After waiting for each page load, eight routes were checked at 340 CSS pixels: homepage, customer, provider, both product detail pages, About and both feedback pages. No horizontal overflow was measured; all three displayed images loaded through the image endpoint. Two header buttons were 42px tall, so the mobile minimum was raised to 44px. Illustration captions were also raised to 14px on small screens. This is browser reflow testing, not a claim of physical-phone or Instagram validation.

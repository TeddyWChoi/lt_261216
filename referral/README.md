# La Tale Referral Event - 2026-12-16 ~ 2027-02-14

Referral event page for La Tale NA, plain HTML5 + CSS3 + Vue 2 (no build step).

The layout is the one of the previous La Tale referral event (header, letter paper with
section cards, envelope with the notices and the paw seal). Only the background and the
characters were changed to the SHINING / IDOL update, and the content follows the new plan
(features added in the Closers referral event: level rewards, milestones, Details column,
Lucky Draw, account states).

## Running it

Open `index.html` in a browser. No build, no `npm install`.

## Sections

- Header: title, event period, introduction
- Invited Player - Welcome!: invitation code input (signed out / ready / registered / not eligible),
  Discord guide, Welcome Package, Ascension level rewards, how to level up, eligibility
- Inviting Player - My Invitation: my code, copy code / URL, referral count, Details popup,
  per-invite reward, 1 / 3 / 5 invitee milestones
- Lucky Draw: 20th anniversary goods
- Envelope: Important Notices

## Where to change things

- `js/config.js` - links, reward tables, Ascension level steps, goods photos.
  An empty link is shown as a disabled "soon" label; an empty reward `icon` is shown as a "?" slot.
  Reward icons go in `images/items/`.
- `js/api.js` - the only place that talks to the server. It returns sample data for now;
  replace the body of each function with the real request (response shapes are documented at the top).
- `mock: true` in `js/config.js` means sample data. While it is on, add `?state=guest`, `invitee`,
  `registered`, `inviter` or `inviting` to the address to look at each account state.
  Set it to `false` for the live page.

## Still to be confirmed

- Reward tables and Ascension level steps (placeholders)
- Links: IDOL & Burning 6.0 update page, Official Rules, Support, sign-in / sign-out URL
- Returning-player rule: the page says 60 days, the server is planned to use 55 days

# La Tale Referral Event (SHINING) - 2026-12-16 ~ 2027-02-14

Referral event page for La Tale NA, built as plain HTML5 + CSS3 + Vue 2 (no build step).
The look follows the SHINING pre-registration page in `../pre-register`
(sky hero, green sky section, purple stage section, night section).

## Running it

Open `index.html` in a browser. No build, no `npm install`.
Unlike the pre-registration page this one is fluid and reflows down to phone width.

## Sections

0. Top bar: section links, Sign In / account name + Sign Out
1. Hero
2. Intro ("Better Together, More Rewards!") and the 4-step flow
3. Invited player: Welcome Package
4. Invited player: Ascension level rewards, "How to Level Up Fast"
5. Discord guide, eligibility, invitation code input (4 states: signed out / ready / registered / not eligible)
6. Inviting player: my code, copy code / URL, referral count, Details popup
7. Inviting player: per-invite reward, 1 / 3 / 5 invitee milestones
8. Lucky Draw (20th anniversary goods)
9. Event rules

## Where to change things

- `js/config.js` - links, reward tables, Ascension level steps, goods photos.
  An empty link is shown as a disabled "soon" label; an empty reward `icon` is shown as a placeholder.
  Reward icons go in `images/items/`.
- `js/api.js` - the only place that talks to the server. It returns sample data for now;
  replace the body of each function with the real request (response shapes are documented at the top).
- `mock: true` in `js/config.js` also shows the PREVIEW switcher (bottom-left) for trying each
  account state. Set it to `false` for the live page.

## Still to be confirmed

- Reward tables and Ascension level steps (placeholders)
- Links: IDOL & Burning 6.0 update page, Official Rules, Support, sign-in / sign-out URL
- Returning-player rule: the page says 60 days, the server is planned to use 55 days

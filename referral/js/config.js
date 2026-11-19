/* ------------------------------------------------------------------
 * La Tale Referral Event (2026-12-16 ~ 2027-02-14) - event settings
 *
 * Everything that is still "to be confirmed" in the wireframe lives here,
 * so the page can be finished without touching index.html:
 *   - reward tables (name / qty / icon)
 *   - Ascension level steps
 *   - links that have no URL yet (empty string = shown as "coming soon")
 * ------------------------------------------------------------------ */
(function (global) {
  'use strict';

  global.EVENT_CONFIG = {
    // true  = sample data (no server needed)
    // false = real API calls (see js/api.js)
    mock: true,

    maxReferrals: 10,
    inviterGoalLevel: 300,   // invitee level that counts toward inviter milestones
    luckyDrawLevel: 1000,    // invitee level required for the Lucky Draw

    links: {
      home: 'https://latale.papayaplay.com/',
      signIn: '',            // TBD - Papaya Play login URL (with return URL)
      signOut: '',           // TBD
      shareBase: 'https://latale.papayaplay.com/ltevent/Invite.do', // shared as ?code=XXXX
      idolUpdate: '',        // TBD - New Class IDOL & Burning 6.0 update page
      wiki: 'https://latale.wiki.gg/wiki/Starting_Out',
      rewards: 'https://latale.papayaplay.com/latale.do?tp=news.view&postid=6463',
      sales: 'https://latale.papayaplay.com/latale.do?tp=news.view&postid=6439',
      discord: 'https://discord.gg/EPppnD8zNX',
      officialRules: '',     // TBD
      faq: 'https://latale.papayaplay.com/latale.do?tp=faq',
      support: ''            // TBD
    },

    // icon: path under images/items/ (empty = placeholder slot)
    rewards: {
      // 3. Invited player - Welcome Package (once per account)
      welcome: [
        { name: 'Reward 1', qty: 1, icon: '' },
        { name: 'Reward 2', qty: 1, icon: '' },
        { name: 'Reward 3', qty: 1, icon: '' },
        { name: 'Reward 4', qty: 1, icon: '' },
        { name: 'Reward 5', qty: 1, icon: '' },
        { name: 'Reward 6', qty: 1, icon: '' }
      ],

      // 4. Invited player - Ascension level rewards (level: '' = not decided yet)
      levelTiers: [
        { level: '', label: 'Tier 1', items: [{ name: 'Level Reward 1', qty: 0, icon: '' }] },
        { level: '', label: 'Tier 2', items: [{ name: 'Level Reward 2', qty: 0, icon: '' }] },
        { level: '', label: 'Tier 3', items: [{ name: 'Level Reward 3', qty: 0, icon: '' }] },
        { level: '', label: 'Final Tier', final: true, items: [{ name: 'Selectable Box', qty: 0, icon: '' }] }
      ],

      // 7. Inviting player - per eligible invitee (up to maxReferrals)
      perInvite: [
        { name: 'Per-invite reward', qty: 2, icon: '' }
      ],

      // 7. Inviting player - invitees who reached inviterGoalLevel
      milestones: [
        { count: 1, items: [{ name: 'Milestone Reward', qty: 0, icon: '' }] },
        { count: 3, items: [{ name: 'Milestone Reward', qty: 0, icon: '' }, { name: 'Milestone Reward', qty: 0, icon: '' }] },
        { count: 5, final: true, items: [{ name: 'Milestone Reward', qty: 0, icon: '' }, { name: 'Milestone Reward', qty: 0, icon: '' }, { name: 'Milestone Reward', qty: 0, icon: '' }] }
      ]
    },

    // 8. Lucky Draw - goods photos
    goods: [
      { src: 'images/goods/goods-1.jpg', caption: 'Plush & Handmade Keyring', alt: 'Plush and handmade knit keyring' },
      { src: 'images/goods/goods-2.jpg', caption: 'Metal Badges & Stamps', alt: 'Metal badges and character stamps' },
      { src: 'images/goods/goods-3.jpg', caption: 'Character Plushies', alt: 'Character plushies' },
      { src: 'images/goods/goods-4.jpg', caption: 'Mug · Tumbler · Desk Pad', alt: 'Mug, tumbler and desk pad' }
    ]
  };
})(window);

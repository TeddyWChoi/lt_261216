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
      idolUpdate: '',        // TBD - New Class Idol & Burning 6.0 update page
      wiki: 'https://latale.wiki.gg/wiki/Starting_Out',
      rewards: 'https://latale.papayaplay.com/latale.do?tp=news.view&postid=6463',
      sales: 'https://latale.papayaplay.com/latale.do?tp=news.view&postid=6439',
      discord: 'https://discord.gg/EPppnD8zNX',
      officialRules: '',     // TBD
      faq: 'https://latale.papayaplay.com/latale.do?tp=faq',
      support: ''            // TBD
    },

    // Confirmed rewards (2026-11-23 copy update). Every step has 5 items.
    //   no   : icon number requested from the GM (01-34). Shown in the slot
    //          until the icon file arrives.
    //   icon : file name under images/items/ (empty = numbered placeholder).
    //          Icons: 32px in-game originals from the FigJam board, upscaled 2x (pixel art).
    //   tile : true for icons drawn as a full square card (no transparent
    //          background) - shown smaller with rounded corners so they sit
    //          inside the round slot like the others.
    //   [Event] and non-[Event] versions of an item share one icon.
    rewards: {
      // 3. Invited player - Welcome Package (once per account)
      welcome: [
        { no: '01', name: 'Afterimage Coupon', qty: 1, icon: '01-afterimage-coupon.png' },
        { no: '02', name: '[Support] General Inventory Bag', qty: 3, icon: '02-support-general-inventory-bag.png' },
        { no: '03', name: 'Storage Expansion Bag', qty: 3, icon: '03-storage-expansion-bag.png' },
        { no: '04', name: 'Event Pet Exchange Coupon', qty: 1, icon: '04-event-pet-exchange-coupon.png' },
        { no: '05', name: 'Start of the Adventure Box', qty: 1, icon: '05-start-of-the-adventure-box.png' }
      ],

      // 4. Invited player - Ascension level rewards
      //    Final tier: one Selection Box is sent; the player opens it and picks 1 of the 5 items.
      levelTiers: [
        { level: 1, label: 'Tier 1', items: [
          { no: '06', name: 'Cheerful Tengu Totem Fragment', qty: 500, icon: '06-cheerful-tengu-totem-fragment.png' },
          { no: '07', name: 'Golden Hammer', qty: 70, icon: '07-golden-hammer.png' },
          { no: '08', name: 'Potion of Resurrection Exchange Coupon', qty: 100, icon: '08-potion-of-resurrection-exchange-coupon.png', tile: true },
          { no: '09', name: 'EXP Potion (+100)', qty: 30, icon: '09-exp-potion-100.png' },
          { no: '10', name: 'EXP Potion (+20)', qty: 30, icon: '10-exp-potion-20.png' }
        ] },
        { level: 1500, label: 'Tier 2', items: [
          { no: '11', name: 'La Tale Adventure Dice', qty: 100, icon: '11-la-tale-adventure-dice.png' },
          { no: '12', name: '[Event] Super Dawn Hammer Coupon', qty: 30, icon: '12-super-dawn-hammer-coupon.png' },
          { no: '13', name: '[Event] Noble Dawn Hammer Coupon', qty: 20, icon: '13-noble-dawn-hammer-coupon.png' },
          { no: '14', name: 'Memorial Fragment Box', qty: 30, icon: '14-memorial-fragment-box.png' },
          { no: '15', name: 'Memorial Reset Crystal', qty: 15, icon: '15-memorial-reset-crystal.png' }
        ] },
        { level: 3000, label: 'Tier 3', items: [
          { no: '16', name: 'Summonable Upgrade Spellbook', qty: 500, icon: '16-summonable-upgrade-spellbook.png' },
          { no: '17', name: 'Special Stimulant', qty: 30, icon: '17-special-stimulant.png' },
          { no: '14', name: 'Memorial Fragment Box', qty: 30, icon: '14-memorial-fragment-box.png' },
          { no: '18', name: 'Runestone Scroll', qty: 20, icon: '18-runestone-scroll.png' },
          { no: '19', name: 'Bottle of Shining Stars', qty: 10, icon: '19-bottle-of-shining-stars.png' }
        ] },
        { level: 5000, label: 'Final Tier', final: true, items: [
          { no: '20', name: 'Wished Pet Coupon II', qty: 1, icon: '20-wished-pet-coupon-2.png' },
          { no: '21', name: '[Event] Awakening Quest Skip Coupon', qty: 1, icon: '21-awakening-quest-skip-coupon.png' },
          { no: '22', name: 'Platinum Hammer', qty: 30, icon: '22-platinum-hammer.png' },
          { no: '23', name: '[Event] Item Awakening Skip Coupon', qty: 20, icon: '23-item-awakening-skip-coupon.png' },
          { no: '24', name: 'Relic Essence', qty: 30, icon: '24-relic-essence.png' }
        ] }
      ],

      // 7. Inviting player - per eligible invitee (up to maxReferrals)
      perInvite: [
        { no: '22', name: 'Platinum Hammer', qty: 3, icon: '22-platinum-hammer.png' },
        { no: '25', name: 'Red Storm Potion (60m)', qty: 3, icon: '25-red-storm-potion-60m.png' },
        { no: '26', name: 'Etoile Bung Bung Drink', qty: 2, icon: '26-etoile-bung-bung-drink.png' },
        { no: '27', name: 'Memorial Hero Fragment', qty: 10, icon: '27-memorial-hero-fragment.png' },
        { no: '28', name: 'Bottle of Orange Stars', qty: 100, icon: '28-bottle-of-orange-stars.png' }
      ],

      // 7. Inviting player - invitees who reached inviterGoalLevel
      milestones: [
        { count: 1, items: [
          { no: '17', name: 'Special Stimulant', qty: 3, icon: '17-special-stimulant.png' },
          { no: '12', name: 'Super Dawn Hammer Coupon', qty: 10, icon: '12-super-dawn-hammer-coupon.png' },
          { no: '29', name: 'Weapon Skin Material Coupon', qty: 1, icon: '29-weapon-skin-material-coupon.png', tile: true },
          { no: '30', name: 'Bottle of Blue Stars', qty: 1000, icon: '30-bottle-of-blue-stars.png' },
          { no: '31', name: 'Mysterious Hourglass', qty: 1, icon: '31-mysterious-hourglass.png' }
        ] },
        { count: 3, items: [
          { no: '17', name: 'Special Stimulant', qty: 3, icon: '17-special-stimulant.png' },
          { no: '27', name: 'Memorial Hero Fragment', qty: 50, icon: '27-memorial-hero-fragment.png' },
          { no: '32', name: 'Item Seal Lock', qty: 30, icon: '32-item-seal-lock.png' },
          { no: '33', name: 'Fisherman\'s Blessing', qty: 10, icon: '33-fishermans-blessing.png' },
          { no: '31', name: 'Mysterious Hourglass', qty: 2, icon: '31-mysterious-hourglass.png' }
        ] },
        { count: 5, final: true, items: [
          { no: '17', name: 'Special Stimulant', qty: 3, icon: '17-special-stimulant.png' },
          { no: '13', name: 'Noble Dawn Hammer Coupon', qty: 30, icon: '13-noble-dawn-hammer-coupon.png' },
          { no: '23', name: '[Event] Item Awakening Skip Coupon', qty: 10, icon: '23-item-awakening-skip-coupon.png' },
          { no: '34', name: 'Advanced Premium Syrup', qty: 5, icon: '34-advanced-premium-syrup.png' },
          { no: '31', name: 'Mysterious Hourglass', qty: 5, icon: '31-mysterious-hourglass.png' }
        ] }
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

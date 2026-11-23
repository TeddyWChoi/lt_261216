/* ------------------------------------------------------------------
 * Page settings and copy.
 * Everything that is likely to change (links, video, rewards, the
 * registration API) lives here.
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  global.preRegisterConfig = {
    updateName: "SHINING",
    tagline: "Through past, present, and future",
    // North American launch date, shown under the logo
    date: "DECEMBER 16, 2026",

    links: {
      home: "https://latale.papayaplay.com/",
      // Sign-in page; the visitor comes back to this page afterwards
      signIn: "https://www.papayaplay.com/account/signin.do?redirect_url=",
    },

    // YouTube id of the video in the first section
    videoId: "9Dus72EhhMk",

    // Login state. The live portal page prints these from the server
    // (isLogin / unid / userid); set them the same way when this is deployed.
    user: {
      isLogin: global.isLogin ? global.isLogin != 0 : false,
      unid: global.unid || "",
      userid: global.userid || "",
    },

    // Registration API (same shape as the La Boom page: JSONP GET with cm / unid / userid).
    // While `url` is empty the button runs in demo mode and only shows the success message.
    api: {
      url: "",
      cm: "",
    },

    messages: {
      10000: "You have successfully pre-registered for SHINING!",
      20001: "Account not found. Please log in again.",
      30001: "You have already pre-registered for SHINING.",
      90000: "An error occurred. Please try again later.",
      90001: "Something went wrong. Please try again later.",
    },

    // Reward cards. The artwork (and quantities) comes from the Korean pre-registration page;
    // names are the in-game English item names.
    rewards: [
      { id: 1, name: "[Event] Potion of Resurrection<br />Exchange Coupon" },
      { id: 2, name: "[Event] Bottle of<br />Shining Stars" },
      { id: 3, name: "[Event] Advanced Awakening Stone<br />Extension Ticket (90 Days)" },
      { id: 4, name: "[Event]<br />Shining Titlebook" },
      { id: 5, name: "[Event] Shining Bunny Outfit Set" },
    ],

    // Effect of the SHINING title (shown when hovering "Title Effect" on the title book)
    titleEffect: {
      stats: [
        ["Physical / Magic Critical Rate", "+1%"],
        ["Physical / Magic Critical Damage", "+10%"],
        ["EXP Gain Rate", "+3%"],
      ],
      trigger: "Activates on a direct critical hit",
      detail: "Critical Damage +200% for 15 sec.<br />(buff duration does not refresh)",
    },

    notes: [
      "Pre-registration is available once per account.",
      "Pre-registration rewards are delivered through the in-game Gift Bundle after the SHINING update.",
      "This page is optimized for PC. Some features may be limited on mobile devices.",
      "SHINING Part 1 and Part 2 will both be released on December 16, 2026.",
    ],

    news: [
      {
        number: "01",
        title: "Part 1 · From the Soul",
        list: [
          "New scenario: the first oracle",
          "New village: Linford, the City of Angels",
          "New field: Aether Road",
          "4-Player Dungeon: River of Hatred and Oath",
          "8-Player Dungeon: Amaranth Nova",
          "3 new bosses and 8 new monsters",
          "5 new NPCs",
        ],
      },
      {
        number: "02",
        title: "Part 2 · On Stage",
        list: [
          "New class: Idol",
          "Combat type: Magic",
          "Weapon: Microphone",
          "Switch freely between three weapons",
          "Encore Gauge: store up to 5",
          "Class awakening: Idol of Eternity",
          "New stage: Etoile",
        ],
      },
      {
        number: "03",
        title: "System Updates",
        list: [
          "Dungeon Conquest System",
          "Content Revamp (Summon / Champion / Legend)",
          "Growth Items",
          "Item Awakening Improvements",
          "Style Room: fashion shared across your account",
          "Fashion and Beauty in one system",
        ],
      },
    ],

    maps: [
      { name: "Linford", type: "Village", image: "images/maps/map-1.webp" },
      { name: "Aether Road", type: "Field", image: "images/maps/map-2.webp" },
      { name: "River of Hatred and Oath", type: "4-Player Dungeon", image: "images/maps/map-3.webp" },
      { name: "Amaranth Nova", type: "8-Player Dungeon", image: "images/maps/map-4.webp" },
    ],

    characters: [
      { name: "Ellone", image: "images/chars/elone.webp" },
      { name: "Nuckalava", image: "images/chars/nuckalava.webp" },
      { name: "Barbatos", image: "images/chars/barbatos.webp" },
      { name: "Benjamin", image: "images/chars/benjamin.webp" },
      { name: "Hailee", image: "images/chars/hailee.webp" },
      { name: "Charlotte", image: "images/chars/charlotte.webp" },
      { name: "Kyril", image: "images/chars/kyril.webp" },
      { name: "Ariel", image: "images/chars/ariel.webp" },
    ],
  };
})(window);

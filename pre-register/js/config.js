/* ------------------------------------------------------------------
 * Page settings and copy.
 * Everything that is likely to change (links, video, rewards, the
 * registration API) lives here.
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  global.preRegisterConfig = {
    updateName: "SHINING",

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
      10000: "You have successfully pre-registered for SHINING",
      20001: "User does not exist",
      30001: "You have already pre-registered for SHINING",
      90000: "Error",
      90001: "Logical Error",
    },

    // PLACEHOLDERS - replace with the real reward items (image: path under images/, optional).
    rewards: [
      { name: "Reward Item 01", quantity: "" },
      { name: "Reward Item 02", quantity: "" },
      { name: "Reward Item 03", quantity: "x2" },
      { name: "Reward Item 04", quantity: "x10" },
      { name: "Reward Item 05", quantity: "" },
      { name: "Reward Item 06", quantity: "x10" },
      { name: "Reward Item 07", quantity: "" },
      { name: "Reward Item 08", quantity: "" },
      { name: "Reward Item 09", quantity: "" },
      { name: "Reward Item 10", quantity: "x300" },
    ],

    news: [
      {
        number: "01",
        title: "Light of the Soul",
        list: [
          "New scenario: the first oracle",
          "New town: Linford, the City of Angels",
          "New field: Aether Road",
          "4-Player Dungeon: River of Hatred and Oath",
          "8-Player Dungeon: Amaranth Nova",
          "3 new bosses and 8 new monsters",
          "5 new NPCs",
        ],
      },
      {
        number: "02",
        title: "Light on the Stage",
        list: [
          "New class: Idol",
          "Combat type: Magic",
          "Weapon: Microphone",
          "Switch freely between three weapons",
          "Encore Gauge: store up to 5",
          "Class awakening: Eternal Idol",
          "New stage: Etoile",
        ],
      },
      {
        number: "03",
        title: "System Updates",
        list: [
          "Dungeon Conquest System",
          "Content Overhaul (Summoner / Transcendent / Legend)",
          "Growth Items",
          "Item Awakening Improvements",
          "Style Room: fashion shared across your account",
          "Fashion and Beauty in one system",
        ],
      },
    ],

    maps: [
      { name: "Linford", type: "Town", image: "images/maps/map-1.webp" },
      { name: "Aether Road", type: "Field", image: "images/maps/map-2.webp" },
      { name: "River of Hatred and Oath", type: "4-Player Dungeon", image: "images/maps/map-3.webp" },
      { name: "Amaranth Nova", type: "8-Player Dungeon", image: "images/maps/map-4.webp" },
    ],

    characters: [
      { name: "Elone", image: "images/chars/elone.webp" },
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

/* ------------------------------------------------------------------
 * API layer.
 *
 * The page only talks to window.ReferralApi. While EVENT_CONFIG.mock is
 * true the answers below are sample data; the platform team replaces the
 * body of each function with the real request and keeps the same shapes.
 *
 * getStatus() -> {
 *   loggedIn:        boolean,
 *   account:         string,          // masked Papaya Play account name
 *   canEnterCode:    boolean,         // new / returning player (server decides: returning = 55 days)
 *   registeredCode:  string,          // code this account already entered ('' if none)
 *   myCode:          string,          // code this account generated ('' if none)
 *   referrals:       [{ date, account, reached }]   // reached = Ascension Lv. 300
 * }
 * registerCode(code) -> { ok: true, code } | { ok: false, reason }
 *   reason: 'login' | 'invalid' | 'own' | 'ineligible' | 'used' | 'nochar'
 * generateCode()     -> { ok: true, code } | { ok: false, reason }
 *   reason: 'login' | 'invitee'
 * ------------------------------------------------------------------ */
(function (global) {
  'use strict';

  var SAMPLE_REFERRALS = [
    { date: '2026-12-18 09:12:44', account: 'Play***', reached: true },
    { date: '2026-12-21 20:03:10', account: 'Iris***', reached: false },
    { date: '2027-01-04 13:47:02', account: 'Mint***', reached: false }
  ];

  // Sample states for the PREVIEW switcher
  var PRESETS = {
    guest:      { loggedIn: false, account: '', canEnterCode: false, registeredCode: '', myCode: '', referrals: [] },
    invitee:    { loggedIn: true, account: 'Star***', canEnterCode: true, registeredCode: '', myCode: '', referrals: [] },
    registered: { loggedIn: true, account: 'Star***', canEnterCode: true, registeredCode: 'LTA7K29QX', myCode: '', referrals: [] },
    inviter:    { loggedIn: true, account: 'Idol***', canEnterCode: false, registeredCode: '', myCode: '', referrals: [] },
    inviting:   { loggedIn: true, account: 'Idol***', canEnterCode: false, registeredCode: '', myCode: 'LTM4P8ZT2', referrals: SAMPLE_REFERRALS }
  };

  var state = clone(PRESETS.guest);

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function later(value) {
    return new Promise(function (resolve) { setTimeout(function () { resolve(clone(value)); }, 250); });
  }
  function randomCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = 'LT';
    for (var i = 0; i < 7; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return out;
  }

  global.ReferralApi = {
    presets: Object.keys(PRESETS),

    // PREVIEW only
    usePreset: function (name) {
      state = clone(PRESETS[name] || PRESETS.guest);
      return later(state);
    },

    getStatus: function () {
      // TODO(platform): GET status of the signed-in account
      return later(state);
    },

    signIn: function () {
      var url = global.EVENT_CONFIG.links.signIn;
      if (!global.EVENT_CONFIG.mock && url) { global.location.href = url; return later(state); }
      state = clone(PRESETS.invitee);
      return later(state);
    },

    signOut: function () {
      var url = global.EVENT_CONFIG.links.signOut;
      if (!global.EVENT_CONFIG.mock && url) { global.location.href = url; return later(state); }
      state = clone(PRESETS.guest);
      return later(state);
    },

    registerCode: function (code) {
      // TODO(platform): POST the code
      if (!state.loggedIn) return later({ ok: false, reason: 'login' });
      if (!state.canEnterCode) return later({ ok: false, reason: 'ineligible' });
      if (state.registeredCode) return later({ ok: false, reason: 'used' });
      if (state.myCode && state.myCode === code) return later({ ok: false, reason: 'own' });
      if (code.length < 6) return later({ ok: false, reason: 'invalid' }); // sample rule: 6+ characters pass
      state.registeredCode = code;
      return later({ ok: true, code: code });
    },

    generateCode: function () {
      // TODO(platform): POST - one code per account
      if (!state.loggedIn) return later({ ok: false, reason: 'login' });
      if (state.registeredCode) return later({ ok: false, reason: 'invitee' });
      if (!state.myCode) state.myCode = randomCode();
      return later({ ok: true, code: state.myCode });
    }
  };
})(window);

/* ------------------------------------------------------------------
 * window.Site fallback stub
 *
 * Normally https://static.latale.com/.../site-handler.min.js defines window.Site.
 * When that script cannot load (offline / local run) this fills in an object of
 * the same shape so the page keeps working.
 * (Mirrors the dev-mode Site.setup values from the original index.pug)
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  if (global.Site && typeof global.Site.setup === "function") {
    // Real site-handler is present: just apply the same dev-mode setup
    global.testMode = true;
    global.Site.isDev = true;
    global.Site.setup({
      channel: "AZ",
      isLogin: false,
      isGameUser: true,
      memberType: "O",
      userInfo: {
        nickname: "EightCharName",
        class: 69,
        level: 200,
      },
      uphScheme: "LaTaleActoz",
      returnUrl: "",
    });
    return;
  }

  global.testMode = true;

  var urls = {
    main: "https://www.latale.com/",
    login: "https://www.latale.com/member/login",
    logout: "https://www.latale.com/member/logout",
  };

  global.Site = {
    isDev: true,
    channel: "AZ",
    isLogin: false,
    isGameUser: true,
    memberType: "O",
    uphScheme: "LaTaleActoz",
    returnUrl: "",
    url: urls,
    userInfo: {
      nickname: "EightCharName",
      class: 69,
      level: 200,
    },
    setup: function (options) {
      for (var key in options) {
        if (Object.prototype.hasOwnProperty.call(options, key)) {
          global.Site[key] = options[key];
        }
      }
    },
    go: function (key) {
      var url = urls[key] || key;
      if (url) window.open(url, "_blank");
    },
    login: function () {
      global.Site.go("login");
    },
  };
})(window);

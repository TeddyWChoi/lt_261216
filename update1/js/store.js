/* ------------------------------------------------------------------
 * Global state (replaces the original pinia store - a reactive Vue 2 instance)
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  var Util = global.Util;

  global.layoutStore = new Vue({
    data: function () {
      return {
        screen: undefined, // "base" (PC) | "mobile"
        popupImageClass: undefined, // names of the open image popup
        popupPlayCode: undefined, // YouTube id of the open video popup
        footerHtml: global.projectConfig.site.copyright,
      };
    },
    computed: {
      popupFlag: function () {
        return this.popupImageFlag || this.popupPlayFlag;
      },
      popupImageFlag: function () {
        return Util.isArray(this.popupImageClass) && this.popupImageClass.length > 0;
      },
      popupPlayFlag: function () {
        return !!this.popupPlayCode;
      },
    },
    methods: {
      setScreen: function (screen) {
        this.screen = screen;
      },
      openImagePopup: function (imageClass) {
        this.popupImageClass = imageClass ? (Util.isArray(imageClass) ? imageClass : [imageClass]) : undefined;
      },
      openPlayPopup: function (code) {
        this.popupPlayCode = code;
      },
      closePopup: function () {
        this.popupImageClass = undefined;
        this.popupPlayCode = undefined;
      },
    },
  });
})(window);

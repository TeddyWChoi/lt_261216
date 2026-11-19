/* ------------------------------------------------------------------
 * App bootstrap
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  var Util = global.Util;
  var layoutStore = global.layoutStore;
  var screenConfig = global.screenConfig;

  Vue.config.productionTip = false;
  Vue.config.devtools = false;

  global.VAnimation.install(Vue, { once: true });
  global.VSnap.install(Vue);

  // Same as the original: force a fixed 720px viewport
  function viewportCheck() {
    var viewPort = document.querySelector('meta[name="viewport"]');
    if (!viewPort) {
      viewPort = document.createElement("meta");
      viewPort.setAttribute("name", "viewport");
      document.head.appendChild(viewPort);
    }
    viewPort.setAttribute("content", "width=720, target-densitydpi=device-dpi");
  }

  function screenCheck() {
    layoutStore.setScreen(Util.isMobile() ? screenConfig.SCREEN_MOBILE : screenConfig.SCREEN_WEB);
  }

  viewportCheck();

  document.addEventListener("DOMContentLoaded", function () {
    var appendElement = document.querySelector("[data-append=template]");
    if (!appendElement) return;

    screenCheck();

    // Lock body scrolling while a popup is open
    layoutStore.$watch(
      "popupFlag",
      function (value) {
        document.body.dataset.scroll = JSON.stringify(!value);
      },
      { immediate: true },
    );

    global.app = new Vue({
      render: function (h) {
        return h("LayoutWrap");
      },
    }).$mount(appendElement);

    window.addEventListener("resize", Util.throttle(screenCheck, 100));
    window.addEventListener("keydown", function (event) {
      if (layoutStore.popupFlag && event.key === "Escape") layoutStore.closePopup();
    });
  });
})(window);

/* ------------------------------------------------------------------
 * v-snap directive (ported from src/modules/snap.ts)
 * When two or more children are visible at once, snaps scrolling to the nearer one.
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  var Util = global.Util;
  var store = {};
  var uid = 0;

  function findLastIndex(list, predicate) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (predicate(list[i])) return i;
    }
    return -1;
  }

  function createScrollEvent(element, id) {
    return function () {
      var state = store[id];
      if (!state || !state.enable) return;
      var scrollElement = window;
      var offsetTop = element.offsetTop;
      var scrollTop = scrollElement.scrollY;

      state.align = scrollTop < state.before ? "end" : "start";
      state.before = scrollTop;

      var children = element.children;
      var visibleArray = [];
      for (var index = 0; index < children.length; index++) {
        visibleArray.push(
          Util.getElementVisibility(children[index], {
            target: scrollElement,
            padding: { top: offsetTop, right: 0, bottom: 0, left: 0 },
          }),
        );
      }

      var visibleCount = visibleArray.filter(Boolean).length;
      if (visibleCount < 2) return;

      Util.disableScroll(scrollElement);
      var isMultiple = visibleCount >= 3 ? 1 : 0;
      var snapIndex =
        state.align === "start"
          ? findLastIndex(visibleArray, Boolean) - isMultiple
          : visibleArray.indexOf(true) + isMultiple;
      var snapElement = children[snapIndex];
      if (!snapElement) {
        Util.enableScroll(scrollElement);
        return;
      }

      state.enable = false;
      var rect = Util.getElementOffset(snapElement);
      var top =
        state.align === "start"
          ? rect.top - offsetTop
          : rect.bottom - scrollElement.innerHeight;
      state.before = top;

      Util.scrollToPromise(scrollElement, {
        behavior: "smooth",
        top: top,
      }).then(function () {
        state.enable = true;
        Util.enableScroll(scrollElement);
      });
    };
  }

  function bindSnap(element) {
    var id = element.dataset.snapId || "snap-" + ++uid;
    element.dataset.snapId = id;
    if (store[id]) {
      window.removeEventListener("scroll", store[id].event);
    }
    store[id] = {
      enable: true,
      before: 0,
      align: "start",
      event: null,
    };
    store[id].event = createScrollEvent(element, id);
    window.addEventListener("scroll", store[id].event);
  }

  global.VSnap = {
    install: function (Vue) {
      Vue.directive("snap", {
        bind: function (element) {
          bindSnap(element);
        },
        componentUpdated: function (element) {
          bindSnap(element);
        },
        unbind: function (element) {
          var id = element.dataset.snapId;
          if (id && store[id]) {
            window.removeEventListener("scroll", store[id].event);
            delete store[id];
          }
        },
      });
    },
  };
})(window);

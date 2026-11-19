/* ------------------------------------------------------------------
 * Shared utilities (replaces @actozsoft-web/util / lodash-es)
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  var Util = {};

  /* --- type helpers ------------------------------------------------ */

  Util.isObject = function (v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  };

  /**
   * Plain data object only. DOM nodes, Vue instances and other class
   * instances must be copied by reference, never walked into - deep merging
   * a DOM node recurses forever.
   */
  Util.isPlainObject = function (v) {
    if (!Util.isObject(v)) return false;
    var proto = Object.getPrototypeOf(v);
    return proto === Object.prototype || proto === null;
  };

  Util.isArray = Array.isArray;

  Util.isString = function (v) {
    return typeof v === "string";
  };

  /** Deep merge equivalent to lodash merge (undefined values are skipped) */
  Util.merge = function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (!src) continue;
      for (var key in src) {
        if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
        var value = src[key];
        if (value === undefined) continue;
        if (Util.isPlainObject(value)) {
          // Always merge into a fresh object so sources (DEFAULT etc.) are never mutated
          if (!Util.isPlainObject(target[key])) target[key] = {};
          Util.merge(target[key], value);
        } else {
          target[key] = value;
        }
      }
    }
    return target;
  };

  /** Equivalent to lodash defaultsDeep (only fills in missing values) */
  Util.defaultsDeep = function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (!src) continue;
      for (var key in src) {
        if (!Object.prototype.hasOwnProperty.call(src, key)) continue;
        if (target[key] === undefined) {
          target[key] = src[key];
        } else if (
          Util.isPlainObject(target[key]) &&
          Util.isPlainObject(src[key])
        ) {
          Util.defaultsDeep(target[key], src[key]);
        }
      }
    }
    return target;
  };

  Util.throttle = function (fn, wait) {
    var last = 0;
    var timer = null;
    var lastArgs = null;
    function invoke(time) {
      last = time;
      timer = null;
      fn.apply(null, lastArgs || []);
    }
    return function () {
      lastArgs = Array.prototype.slice.call(arguments);
      var now = Date.now();
      var remain = wait - (now - last);
      if (remain <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        invoke(now);
      } else if (!timer) {
        timer = setTimeout(function () {
          invoke(Date.now());
        }, remain);
      }
    };
  };

  Util.debounce = function (fn, wait) {
    var timer = null;
    return function () {
      var args = Array.prototype.slice.call(arguments);
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        fn.apply(null, args);
      }, wait);
    };
  };

  /* --- element geometry -------------------------------------------- */

  /** getElementOffset: document-relative position via the offsetParent chain */
  Util.getElementOffset = function (element, options) {
    options = Util.merge(
      {
        offset: { top: 0, right: 0, bottom: 0, left: 0 },
        useBoundingClientRect: false,
      },
      options || {},
    );
    var rect = { width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
    if (options.useBoundingClientRect) {
      var box = element.getBoundingClientRect();
      rect.width = box.width;
      rect.height = box.height;
      rect.top = box.top + window.scrollY;
      rect.left = box.left + window.scrollX;
    } else {
      var node = element;
      while (node) {
        rect.top += node.offsetTop;
        rect.left += node.offsetLeft;
        node = node.offsetParent;
      }
      rect.width = element.offsetWidth;
      rect.height = element.offsetHeight;
    }
    rect.right = rect.left + rect.width;
    rect.bottom = rect.top + rect.height;
    return rect;
  };

  /** getElementVisibility: whether the element overlaps the scroll viewport */
  Util.getElementVisibility = function (element, options) {
    options = options || {};
    var target = options.target || window;
    var isElement = target instanceof HTMLElement;
    var rect = Util.getElementOffset(element, options);
    var config = Util.merge(
      {
        offset: { top: 0, right: 0, bottom: 0, left: 0 },
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      options,
    );
    var view = isElement
      ? {
          top: target.scrollTop,
          right: target.scrollLeft + target.offsetWidth,
          bottom: target.scrollTop + target.offsetHeight,
          left: target.scrollLeft,
        }
      : {
          top: target.scrollY,
          right: target.scrollX + target.innerWidth,
          bottom: target.scrollY + target.innerHeight,
          left: target.scrollX,
        };
    rect.top += config.offset.top;
    rect.right += config.offset.right;
    rect.bottom += config.offset.bottom;
    rect.left += config.offset.left;
    view.top += config.padding.top;
    view.right += config.padding.right;
    view.bottom += config.padding.bottom;
    view.left += config.padding.left;
    return (
      rect.top < view.bottom &&
      rect.bottom > view.top &&
      rect.left < view.right &&
      rect.right > view.left
    );
  };

  Util.scrollToPromise = function (target, options) {
    target.scrollTo(options);
    return new Promise(function (resolve) {
      var done = Util.debounce(function () {
        resolve();
        target.removeEventListener("scroll", done);
      }, 100);
      target.addEventListener("scroll", done);
    });
  };

  function preventEvent(event) {
    event.preventDefault();
  }

  function preventKey(event) {
    if (
      [
        " ",
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
      ].indexOf(event.key) >= 0
    ) {
      preventEvent(event);
    }
  }

  Util.disableScroll = function (target) {
    target = target || window;
    target.addEventListener("wheel", preventEvent, { passive: false });
    target.addEventListener("keydown", preventKey, false);
    target.addEventListener("touchmove", preventEvent, { passive: false });
  };

  Util.enableScroll = function (target) {
    target = target || window;
    target.removeEventListener("wheel", preventEvent);
    target.removeEventListener("keydown", preventKey, false);
    target.removeEventListener("touchmove", preventEvent);
  };

  /* --- misc --------------------------------------------------------- */

  /** stepCounter: a counter that advances by `step` on each call */
  Util.stepCounter = function (start, step) {
    var stepValue = step !== undefined ? step : start !== undefined ? start : 1;
    var current = step !== undefined ? (start !== undefined ? start : 1) : 1;
    var first = true;
    var counter = function (value) {
      if (first) {
        first = false;
        return current;
      }
      current += value !== undefined ? value : stepValue;
      return current;
    };
    counter.current = function (value) {
      if (value) current = value;
      return current;
    };
    counter.step = function (value) {
      if (value) stepValue = value;
      return stepValue;
    };
    return counter;
  };

  /** Default behaviour of the is-mobile package (tablets excluded) */
  var MOBILE_RE =
    /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
  var NOT_MOBILE_RE = /CrOS/;

  Util.isMobile = function (ua) {
    ua = ua || navigator.userAgent;
    return MOBILE_RE.test(ua) && !NOT_MOBILE_RE.test(ua);
  };

  global.Util = Util;
})(window);

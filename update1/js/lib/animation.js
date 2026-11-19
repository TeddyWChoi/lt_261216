/* ------------------------------------------------------------------
 * v-animation directive (ported from @actozsoft-web/aaa)
 *
 * data-animation            : animation type
 * data-animation-id         : instance identifier
 * data-animation-status     : whether the element is on screen ("true" / "false")
 * data-animation-complete   : "run" while transitioning, then the status value
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  var Util = global.Util;

  var FRAME = Math.floor(1000 / 60);

  var DEFAULT = {
    key: "animation",
    animation: "fade",
    status: undefined,
    once: false,
    appear: false,
    interval: false,
    target: undefined,
    offset: 0,
    delay: 0,
    duration: 500,
    easing: "ease",
    distance: 200,
    origin: "center",
    scale: { in: 1.5, out: 0.25 },
    angle: 90,
    perspective: 2000,
    disappear: { delay: 0, duration: 0 },
    useBoundingClientRect: false,
  };

  var globalOptions = {};

  var handlers = {}; // id -> refresh
  var throttled = {}; // id -> throttled refresh
  var startHandler = {};
  var endHandler = {};
  var timers = {};
  var intervals = {};
  var sizes = {};
  var statuses = {}; // id -> boolean
  var uid = 0;

  function toPair(value, keys) {
    if (value !== null && typeof value === "object") return value;
    var out = {};
    keys.forEach(function (key) {
      out[key] = value;
    });
    return out;
  }

  function normalizeOrigin(value) {
    if (value === null || value === undefined) return { x: "center", y: "center" };
    if (value === "left" || value === "right") return { x: value, y: "center" };
    if (value === "top" || value === "bottom") return { x: "center", y: value };
    if (typeof value === "string" || typeof value === "number") {
      return { x: value, y: value };
    }
    return { x: value.x || "center", y: value.y || "center" };
  }

  function originToString(origin) {
    return origin.x + " " + origin.y;
  }

  function resolveOptions(element, binding) {
    var value = binding.value;
    if (typeof value === "function") value = value(element, binding);
    var option = Util.merge(
      {},
      DEFAULT,
      globalOptions,
      binding.arg ? { animation: binding.arg } : {},
      binding.modifiers || {},
      value || {},
    );
    return option;
  }

  /** Writes option values to CSS variables (skips values equal to the default) */
  function applyStyleVars(element, option) {
    var distance = toPair(option.distance, ["x", "y"]);
    var origin = originToString(normalizeOrigin(option.origin));
    var scale = toPair(option.scale, ["in", "out"]);
    var angle = toPair(option.angle, ["x", "y"]);
    var defaultDistance = toPair(DEFAULT.distance, ["x", "y"]);
    var defaultOrigin = originToString(normalizeOrigin(DEFAULT.origin));
    var defaultScale = toPair(DEFAULT.scale, ["in", "out"]);
    var defaultAngle = toPair(DEFAULT.angle, ["x", "y"]);

    if (option.easing !== undefined && option.easing !== DEFAULT.easing) {
      element.style.setProperty("--animation-easing", option.easing);
    }
    if (distance.x !== undefined && distance.x !== defaultDistance.x) {
      element.style.setProperty("--animation-distance-x", distance.x + "px");
    }
    if (distance.y !== undefined && distance.y !== defaultDistance.y) {
      element.style.setProperty("--animation-distance-y", distance.y + "px");
    }
    if (origin !== defaultOrigin) {
      element.style.setProperty("--animation-origin", origin);
    }
    if (option.delay !== undefined && option.delay !== DEFAULT.delay) {
      element.style.setProperty("--animation-delay", option.delay / 1000 + "s");
    }
    if (option.duration !== undefined && option.duration !== DEFAULT.duration) {
      element.style.setProperty(
        "--animation-duration",
        option.duration / 1000 + "s",
      );
    }
    if (scale.in !== undefined && scale.in !== defaultScale.in) {
      element.style.setProperty("--animation-scale-in", String(scale.in));
    }
    if (scale.out !== undefined && scale.out !== defaultScale.out) {
      element.style.setProperty("--animation-scale-out", String(scale.out));
    }
    if (angle.x !== undefined && angle.x !== defaultAngle.x) {
      element.style.setProperty("--animation-angle-x", angle.x + "deg");
    }
    if (angle.y !== undefined && angle.y !== defaultAngle.y) {
      element.style.setProperty("--animation-angle-y", angle.y + "deg");
    }
  }

  function resolveTarget(element, option) {
    if (!option.target) return undefined;
    var found;
    if (typeof option.target === "string") {
      if (option.target.indexOf(":self") === 0) {
        var selector = option.target.split(":self").pop().trim();
        found = selector ? element.querySelector(selector) : undefined;
      } else {
        found = document.querySelector(option.target);
      }
    } else if (option.target && option.target.nodeType === 1) {
      found = option.target;
    } else if (option.target && option.target.$el) {
      found = option.target.$el;
    }
    return found && found !== element ? found : undefined;
  }

  function refresh(element, option, id) {
    if (!element.dataset.animationId) return;
    element.dataset.animation = option.animation;

    var target = resolveTarget(element, option);
    var offset =
      typeof option.offset === "number"
        ? {
            top: option.offset,
            right: option.offset,
            bottom: option.offset,
            left: option.offset,
          }
        : option.offset;

    var visible =
      option.status !== undefined
        ? option.status
        : Util.getElementVisibility(target || element, {
            offset: offset,
            useBoundingClientRect: option.useBoundingClientRect,
          });

    var before = statuses[id];
    if (option.appear) {
      statuses[id] = true;
    } else if (option.once) {
      if (visible) statuses[id] = true;
    } else {
      statuses[id] = visible;
    }
    if (statuses[id] === undefined) statuses[id] = false;

    element.dataset.animationStatus = JSON.stringify(statuses[id]);
    if (before !== statuses[id]) {
      element.dataset.animationComplete = "run";
    }
  }

  /** Once on mount: assign id, initial status and CSS variables */
  function init(element, binding) {
    var option = resolveOptions(element, binding);
    var id = element.dataset.animationId || "aaa-" + ++uid;
    sizes[id] = { width: element.offsetWidth, height: element.offsetHeight };
    element.dataset.animationId = id;
    element.dataset.animation = option.animation;
    element.dataset.animationStatus = "false";
    element.dataset.animationComplete = "false";
    applyStyleVars(element, option);
  }

  /** Registers listeners (re-registered on update, but status is preserved) */
  function register(element, binding) {
    var option = resolveOptions(element, binding);
    var id = element.dataset.animationId;
    if (!id) return;

    handlers[id] = function () {
      refresh(element, option, id);
    };
    throttled[id] = Util.throttle(handlers[id], FRAME);
    startHandler[id] = function () {};
    endHandler[id] = function () {
      element.dataset.animationComplete = JSON.stringify(!!statuses[id]);
    };

    timers[id] = setTimeout(throttled[id], FRAME);
    if (option.interval) {
      intervals[id] = setInterval(
        handlers[id],
        typeof option.interval === "number" ? option.interval : FRAME,
      );
    }
    window.addEventListener("load", throttled[id]);
    window.addEventListener("resize", throttled[id]);
    window.addEventListener("scroll", throttled[id], true);
    window.addEventListener("transitionstart", throttled[id], true);
    element.addEventListener("transitionstart", startHandler[id]);
    element.addEventListener("transitionend", endHandler[id]);
  }

  /** Removes listeners only (status is preserved) */
  function unregister(element) {
    var id = element.dataset.animationId;
    if (!id || !throttled[id]) return;
    clearTimeout(timers[id]);
    clearInterval(intervals[id]);
    window.removeEventListener("load", throttled[id]);
    window.removeEventListener("resize", throttled[id]);
    window.removeEventListener("scroll", throttled[id], true);
    window.removeEventListener("transitionstart", throttled[id], true);
    element.removeEventListener("transitionstart", startHandler[id]);
    element.removeEventListener("transitionend", endHandler[id]);
  }

  function unbind(element) {
    var id = element.dataset.animationId;
    unregister(element);
    if (!id) return;
    delete handlers[id];
    delete throttled[id];
    delete statuses[id];
    delete sizes[id];
  }

  var directive = {
    bind: function (element, binding) {
      init(element, binding);
      register(element, binding);
    },
    inserted: function (element, binding) {
      var id = element.dataset.animationId;
      if (id) {
        sizes[id] = {
          width: element.offsetWidth,
          height: element.offsetHeight,
        };
        if (throttled[id]) throttled[id]();
      }
    },
    update: function (element, binding) {
      unregister(element);
      register(element, binding);
    },
    unbind: unbind,
  };

  /**
   * getOrderAnimationConfigs: accumulates delay in array order and returns a
   * key -> config map. A nested array is a group that plays simultaneously.
   */
  function getOrderAnimationConfigs(base, list) {
    var accumulated = 0;
    var flat = [];
    list.forEach(function (entry) {
      if (Array.isArray(entry)) {
        var ends = [];
        entry.forEach(function (item) {
          item.value = Util.merge(
            {},
            { delay: DEFAULT.delay, duration: DEFAULT.duration },
            base,
            item.value,
          );
          item.value.delay = (item.value.delay || 0) + accumulated;
          ends.push(item.value.delay + (item.value.duration || 0));
          flat.push(item);
        });
        accumulated = Math.max.apply(Math, ends);
      } else {
        entry.value = Util.merge(
          {},
          { delay: DEFAULT.delay, duration: DEFAULT.duration },
          base,
          entry.value,
        );
        entry.value.delay = (entry.value.delay || 0) + accumulated;
        accumulated = entry.value.delay + (entry.value.duration || 0);
        flat.push(entry);
      }
    });
    var map = {};
    flat.forEach(function (item) {
      map[item.key] = item.value || {};
    });
    return map;
  }

  global.VAnimation = {
    install: function (Vue, options) {
      Util.merge(globalOptions, options || {});
      Vue.directive("animation", directive);
    },
    getOrderAnimationConfigs: getOrderAnimationConfigs,
  };
})(window);

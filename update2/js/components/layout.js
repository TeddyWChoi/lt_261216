/* ------------------------------------------------------------------
 * Layout components (desktop / mobile wrappers, headers, popups)
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  /* ================================ PC ================================ */
  Vue.component("WebLayoutHeader", {
    name: "WebLayoutHeader",
    props: { soundState: { type: Boolean, default: undefined } },
    data: function () {
      return {
        Site: global.Site,
        homeUrl: global.linkConfig.home,
        isScrollAreaFixed: false,
        scrollAreaTop: 0,
        scrollTargetIds: ["scenario","idol","battle","style"],
        activeSectionId: "scenario",
      };
    },
    methods: {
      soundToggle: function () {
        if (this.soundState === undefined) return;
        this.$emit(this.soundState ? "sound-pause" : "sound-play");
      },
      scrollToTop: function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      scrollToSection: function (sectionId) {
        var section = document.querySelector('[data-scroll-target="' + sectionId + '"]');
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      updateScrollAreaTop: function () {
        var scrollArea = this.$refs.scrollAreaRef;
        if (!scrollArea) return;
        this.scrollAreaTop = scrollArea.getBoundingClientRect().top + window.scrollY;
      },
      // Pin the tab bar once it reaches the top of the screen
      updateScrollAreaFixedState: function () {
        if (!this.scrollAreaTop) this.updateScrollAreaTop();
        this.isScrollAreaFixed = window.scrollY >= this.scrollAreaTop;
      },
      // Highlight the tab of the section in view
      updateActiveSectionId: function () {
        var scrollArea = this.$refs.scrollAreaRef;
        var activationLine = window.scrollY + (scrollArea ? scrollArea.offsetHeight : 0) + 1;
        var ids = this.scrollTargetIds;
        this.activeSectionId = ids.reduce(function (current, sectionId) {
          var section = document.querySelector('[data-scroll-target="' + sectionId + '"]');
          if (!section) return current;
          var sectionTop = section.getBoundingClientRect().top + window.scrollY;
          return activationLine >= sectionTop ? sectionId : current;
        }, ids[0]);
      },
      updateHeaderScrollState: function () {
        this.updateScrollAreaFixedState();
        this.updateActiveSectionId();
      },
      refreshScrollAreaFixedState: function () {
        if (!this.isScrollAreaFixed) this.updateScrollAreaTop();
        this.updateHeaderScrollState();
      },
    },
    mounted: function () {
      var self = this;
      this.refreshScrollAreaFixedState();
      window.addEventListener("scroll", this.updateHeaderScrollState, { passive: true });
      window.addEventListener("resize", this.refreshScrollAreaFixedState);
    },
    beforeDestroy: function () {
      window.removeEventListener("scroll", this.updateHeaderScrollState);
      window.removeEventListener("resize", this.refreshScrollAreaFixedState);
    },
    template: `
      <header id="w-header" ref="headerRef">
        <div class="w-header-fixed-area">
          <a class="w-header-home text-hidden" :href="homeUrl">Home</a>
          <button class="w-header-btn-music text-hidden" :class="[{'w-header-playing': soundState}]" type="button" @click.stop="soundToggle">Sound on/off</button>
        </div>
        <div class="w-header-scroll-area" :class="[{'w-header-is-fixed': isScrollAreaFixed}]" ref="scrollAreaRef">
          <h1>
            <button class="w-header-logo text-hidden en" type="button" @click="scrollToTop"><span class="en-sub">Light on the Stage</span>SHINING</button>
          </h1>
          <ul>
            <li>
              <button class="w-header-btn-tab btn-tab-1" :class="[{'w-header-active': activeSectionId === 'scenario'}]" type="button" @click="scrollToSection('scenario')">Scenario</button>
            </li>
            <li>
              <button class="w-header-btn-tab btn-tab-2" :class="[{'w-header-active': activeSectionId === 'idol'}]" type="button" @click="scrollToSection('idol')">Introduction</button>
            </li>
            <li>
              <button class="w-header-btn-tab btn-tab-3" :class="[{'w-header-active': activeSectionId === 'battle'}]" type="button" @click="scrollToSection('battle')">Combat Type</button>
            </li>
            <li>
              <button class="w-header-btn-tab btn-tab-4" :class="[{'w-header-active': activeSectionId === 'style'}]" type="button" @click="scrollToSection('style')">Style Room</button>
            </li>
          </ul>
        </div>
      </header>
    `,
  });

  Vue.component("WebLayoutWrap", {
    name: "WebLayoutWrap",
    data: function () {
      return { soundState: false, soundPrevState: false };
    },
    computed: {
      layoutStore: function () {
        return global.layoutStore;
      },
    },
    watch: {
      // Pause the BGM while a video popup is open and restore it afterwards
      "layoutStore.popupPlayFlag": function (flag) {
        if (flag) {
          this.soundPrevState = this.soundState;
          this.pauseSound();
        } else if (this.soundPrevState) {
          this.playSound();
        }
      },
    },
    methods: {
      playSound: function () {
        var audio = this.$refs.bgm;
        audio.volume = 0.1;
        var played = audio.play();
        if (played && played.catch) played.catch(function () {});
      },
      pauseSound: function () {
        this.$refs.bgm.pause();
      },
      stopSound: function () {
        this.$refs.bgm.pause();
        this.$refs.bgm.currentTime = 0;
      },
    },
    beforeDestroy: function () {
      this.stopSound();
    },
    template: `
      <div class="w-layout-wrap">
        <web-layout-header :sound-state="soundState" @sound-play="playSound" @sound-pause="pauseSound" @sound-stop="stopSound"></web-layout-header>
        <web-main-view></web-main-view>
        <transition name="popup" enter-active-class="w-layout-wrap-popup-active" leave-active-class="w-layout-wrap-popup-active" enter-class="w-layout-wrap-popup-enter" leave-to-class="w-layout-wrap-popup-enter" enter-to-class="w-layout-wrap-popup-leave" leave-class="w-layout-wrap-popup-leave">
          <section class="w-layout-wrap-popup" :class="{ image: layoutStore.popupImageFlag, 'w-layout-wrap-play': layoutStore.popupPlayFlag }" v-if="layoutStore.popupFlag" @click.self="layoutStore.closePopup">
          <template v-if="layoutStore.popupPlayFlag">
            <h1 class="hide">Watch the video</h1>
            <div class="w-layout-wrap-popup-body">
              <button class="w-layout-wrap-close text-hidden ripple" type="button" @click="layoutStore.closePopup"><span>Close</span></button>
              <div class="w-layout-wrap-player">
                <iframe :src="'https://www.youtube.com/embed/' + layoutStore.popupPlayCode + '?autoplay=1&controls=1'" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </template>
          </section>
        </transition>
        <audio ref="bgm" src="media/bgm.mp3" loop preload="none" @play="soundState = true" @pause="soundState = false"></audio>
      </div>
    `,
  });

  /* ============================== MOBILE ============================== */
  Vue.component("MobileLayoutHeader", {
    name: "MobileLayoutHeader",
    data: function () {
      return { homeUrl: global.linkConfig.home };
    },
    template: `
      <header id="m-header">
        <a class="m-header-home text-hidden" :href="homeUrl">Home</a>
      </header>
    `,
  });

  Vue.component("MobileLayoutWrap", {
    name: "MobileLayoutWrap",
    computed: {
      layoutStore: function () {
        return global.layoutStore;
      },
    },
    template: `
      <div class="m-layout-wrap" style="--1a37c0de: 110px; --16b80dc2: 0px">
        <mobile-layout-header></mobile-layout-header>
        <mobile-main-view></mobile-main-view>
        <transition name="popup" enter-active-class="m-layout-wrap-popup-active" leave-active-class="m-layout-wrap-popup-active" enter-class="m-layout-wrap-popup-enter" leave-to-class="m-layout-wrap-popup-enter" enter-to-class="m-layout-wrap-popup-leave" leave-class="m-layout-wrap-popup-leave">
          <section class="m-layout-wrap-popup" :class="{ 'm-layout-wrap-play': layoutStore.popupPlayFlag }" v-if="layoutStore.popupFlag" @click.self="layoutStore.closePopup">
          <template v-if="layoutStore.popupPlayFlag">
            <h1 class="hide">Watch the video</h1>
            <div class="m-layout-wrap-popup-body">
              <button class="m-layout-wrap-close text-hidden ripple" type="button" @click="layoutStore.closePopup"><span>Close</span></button>
              <div class="m-layout-wrap-player">
                <iframe :src="'https://www.youtube.com/embed/' + layoutStore.popupPlayCode + '?autoplay=1&controls=1'" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </template>
          </section>
        </transition>
      </div>
    `,
  });

  /* ============================ ROOT WRAPPER =========================== */
  // Renders the layout matching the screen (desktop / mobile)
  Vue.component("LayoutWrap", {
    name: "LayoutWrap",
    data: function () {
      return { scrollLeft: 0 };
    },
    computed: {
      isWeb: function () {
        return global.layoutStore.screen !== global.screenConfig.SCREEN_MOBILE;
      },
    },
    methods: {
      refreshEvent: function () {
        this.scrollLeft = window.scrollX;
      },
    },
    mounted: function () {
      window.addEventListener("scroll", this.refreshEvent);
      window.addEventListener("resize", this.refreshEvent);
      this.refreshEvent();
    },
    beforeDestroy: function () {
      window.removeEventListener("scroll", this.refreshEvent);
      window.removeEventListener("resize", this.refreshEvent);
    },
    render: function (h) {
      return h(this.isWeb ? "WebLayoutWrap" : "MobileLayoutWrap", {
        class: "c-layout-wrap",
        style: { "--0cc073f3": this.scrollLeft + "px" },
      });
    },
  });
})(window);

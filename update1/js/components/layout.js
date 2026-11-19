/* ------------------------------------------------------------------
 * Layout components (header, page wrapper)
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  Vue.component("WebLayoutHeader", {
    name: "WebLayoutHeader",
    props: { soundState: { type: Boolean, default: undefined } },
    data: function () {
      return {
        Site: global.Site,
        homeUrl: global.linkConfig.home,
        isScrollAreaFixed: false,
        scrollAreaTop: 0,
        scrollTargetIds: ["scenario","map","characters","system"],
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
            <button class="w-header-logo text-hidden en" type="button" @click="scrollToTop"><span class="en-sub">Light of the Soul</span>SHINING</button>
          </h1>
          <ul>
            <li>
              <button class="w-header-btn-tab btn-tab-1" :class="[{'w-header-active': 'scenario'===activeSectionId}]" type="button" @click="scrollToSection('scenario')">Scenario</button>
            </li>
            <li>
              <button class="w-header-btn-tab btn-tab-2" :class="[{'w-header-active': 'map'===activeSectionId}]" type="button" @click="scrollToSection('map')">Maps</button>
            </li>
            <li>
              <button class="w-header-btn-tab btn-tab-3" :class="[{'w-header-active': 'characters'===activeSectionId}]" type="button" @click="scrollToSection('characters')">Monsters & NPCs</button>
            </li>
            <li>
              <button class="w-header-btn-tab btn-tab-4" :class="[{'w-header-active': 'system'===activeSectionId}]" type="button" @click="scrollToSection('system')">System Update</button>
            </li>
          </ul>
        </div>
      </header>
    `,
  });

  // Scroll-snap wrapper for the sections
  Vue.component("ScrollSnap", {
    name: "ScrollSnap",
    template: `<section class="scroll-snap" data-scroll-snap v-snap><slot></slot></section>`,
  });

  Vue.component("LayoutWrap", {
    name: "LayoutWrap",
    data: function () {
      return { soundState: false, soundPrevState: false, scrollLeft: 0 };
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
      refreshEvent: function () {
        this.scrollLeft = window.scrollX;
      },
    },
    mounted: function () {
      window.addEventListener("scroll", this.refreshEvent);
      window.addEventListener("resize", this.refreshEvent);
    },
    beforeDestroy: function () {
      window.removeEventListener("scroll", this.refreshEvent);
      window.removeEventListener("resize", this.refreshEvent);
      this.stopSound();
    },
    template: `
      <div class="w-layout-wrap w-layout-wrap-6851" :style="{ '--1a0b822c': (scrollLeft || 0) + 'px' }">
        <web-layout-header :sound-state="soundState" @sound-play="playSound" @sound-pause="pauseSound" @sound-stop="stopSound"></web-layout-header>
        <main id="main">
          <scroll-snap>
            <web-main-intro></web-main-intro>
            <web-scenario></web-scenario>
            <web-map></web-map>
            <web-characters></web-characters>
            <web-system></web-system>
          </scroll-snap>
        </main>
        <audio ref="bgm" src="media/bgm.mp3" loop preload="none" @play="soundState = true" @pause="soundState = false"></audio>
      </div>
    `,
  });
})(window);

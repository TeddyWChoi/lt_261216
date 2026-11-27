/* ------------------------------------------------------------------
 * Page sections (mobile)
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  var Util = global.Util;
  var getOrderAnimationConfigs = global.VAnimation.getOrderAnimationConfigs;
  var ANIMATION_DELAY = 200;

  /* ============================== INTRO =============================== */
  Vue.component("MobileMainIntro", {
    name: "MobileMainIntro",
    computed: {
      animationConfig: function () {
        return getOrderAnimationConfigs({ appear: false, delay: 50 }, [
          { key: "char-1", value: { animation: "fade", delay: -100 } },
          { key: "title", value: { animation: "slide-bottom" } },
          { key: "scroll", value: { animation: "fade" } },
        ]);
      },
    },
    template: `
      <section class="floating-child" id="m-intro" ref="mainEl">
        <div class="m-intro-char-1" v-animation="animationConfig['char-1']"></div>
        <h2 class="m-intro-title text-hidden floating en" v-animation="animationConfig['title']"><span class="en-sub">On Stage</span>SHINING</h2>
        <div class="m-intro-title-effect" v-animation="animationConfig['title']"></div>
        <div class="m-intro-scroll" v-animation="animationConfig['scroll']"></div>
      </section>
    `,
  });

  /* ============================= SCENARIO ============================= */
  Vue.component("MobileScenario", {
    name: "MobileScenario",
    created: function () {
      this.animationDelayCounter = Util.stepCounter(ANIMATION_DELAY, ANIMATION_DELAY);
    },
    methods: {
      animationConfig: function (options) {
        var merged = Util.defaultsDeep(options || {}, { step: 2 });
        return { animation: "slide-top", delay: this.animationDelayCounter(merged.step * ANIMATION_DELAY), once: false };
      },
    },
    template: `
      <section class="floating-child" id="m-scenario" data-scroll-target="scenario" ref="scenarioEl">
        <h2 class="m-scenario-title text-hidden floating" v-animation:slide-top="{ once: false, delay: 250, distance: 100 }">SCENARIO</h2>
        <div class="m-scenario floating" v-animation:slide-flip-top="{ once: false, delay: 350, distance: 100, angle: -90, duration: 1000 }">
          <p class="m-scenario-desc" v-animation="animationConfig()">
            Gifted at song and dance, the Idol wins everyone over with charm and optimism. Joining a talent show by chance before debut, the Idol won over the judges and the public alike and took first place. That fame led to a solo debut, an album critics called the year's best new act, and the solo concert of their dreams.
          </p>
          <p class="m-scenario-desc" v-animation="animationConfig()">
            Amid fans' cheers, the Idol wished it would last forever, but events beyond their control slowly dimmed the stage lights. Worried but still believing they could overcome it, the Idol kept practicing, until word came: no more stages. Heartbroken but unwilling to give up, the Idol danced all night and fell asleep exhausted.
          </p>
          <p class="m-scenario-desc" v-animation="animationConfig()">
            In a dream, the Idol faced a half-open door. Through the gap: a small stage and a waiting audience. Someone at the door beckoned and whispered:
          </p>
          <p class="m-scenario-desc" v-animation="animationConfig()">"So many people want to hear you sing."</p>
          <p class="m-scenario-desc" v-animation="animationConfig()">
            At those words, the Idol cast off all hesitation and took the stage. They sensed it was a world unlike their own, but it didn't matter. They wanted to sing. To dance. To show it all to everyone. Ready to dream again, the Idol steps onto a new stage: Etoile.
          </p>
        </div>
      </section>
    `,
  });

  /* =============================== IDOL =============================== */
  Vue.component("MobileIdol", {
    name: "MobileIdol",
    data: function () {
      return { activeMapIndex: 1 };
    },
    methods: {
      slideTo: function (index) {
        if (this.swiper) this.swiper.slideTo(index);
      },
    },
    mounted: function () {
      var self = this;
      this.swiper = new Swiper(this.$refs.swiperRef, {
        slidesPerView: "auto",
        mousewheel: { enabled: true, releaseOnEdges: true },
        centeredSlides: true,
        navigation: false,
        speed: 500,
        effect: "fade",
        fadeEffect: { crossFade: true },
        grabCursor: true,
        on: {
          slideChange: function (swiper) {
            self.activeMapIndex = swiper.activeIndex + 1;
          },
        },
      });
    },
    beforeDestroy: function () {
      if (this.swiper) this.swiper.destroy();
    },
    template: `
      <section class="floating-child" id="m-idol" data-scroll-target="idol" ref="idolEl">
        <button class="m-idol-btn-idol-1" :class="[{'m-idol-active': activeMapIndex === 1}]" type="button" @click="slideTo(0)"></button>
        <button class="m-idol-btn-idol-2" :class="[{'m-idol-active': activeMapIndex === 2}]" type="button" @click="slideTo(1)"></button>
        <div class="swiper m-idol-swiper" v-animation:slide-top="{ once: false, delay: 250, distance: 100 }" ref="swiperRef">
          <div class="swiper-wrapper">
          <div class="swiper-slide m-idol-slide floating-child">
            <div class="m-idol-title m-idol-title-1 en-live"><span class="en-label"><small>New Class</small><b>Idol</b><em>Idol of Beginnings</em></span></div>
            <div class="m-idol-char-1"></div>
            <div class="m-idol-desc floating-center">
              <p>
                They wanted to sing, to dance, to perform for the fans who loved them. Holding a promise of forever, they sought a stage once more.
              </p>
              <p>
                At last, they found a new stage. It felt unlike any before, but that didn't matter. As a messenger of dreams and hope, any place they're needed is a stage. Ready to dream once more, the Idol steps onto a new stage: Etoile.
              </p>
            </div>
          </div>
          <div class="swiper-slide m-idol-slide floating-child">
            <div class="m-idol-title m-idol-title-2 en-live"><span class="en-label"><small>New Class Awakening</small><b>Idol</b><em>Idol of Eternity</em></span></div>
            <div class="m-idol-char-2"></div>
            <div class="m-idol-desc">
              <p>
                The stage was always a trial, a challenge to surpass their past self. Overcoming trial after trial, the Idol still sings songs of dreams and hope for the fans.
              </p>
              <p>
                Grown stronger through Awakening, the Idol embraces the change and meets the fans as a more mature star. Their more dazzling performance is the fruit of hard work to become a true pro.
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>
    `,
  });

  /* ============================== BATTLE ============================== */
  Vue.component("MobileBattle", {
    name: "MobileBattle",
    computed: {
      layoutStore: function () {
        return global.layoutStore;
      },
    },
    created: function () {
      this.animationDelayCounter = Util.stepCounter(ANIMATION_DELAY, ANIMATION_DELAY);
    },
    methods: {
      animationConfig: function (options) {
        var merged = Util.defaultsDeep(options || {}, { step: 1 });
        return { animation: "slide-top", delay: this.animationDelayCounter(merged.step * ANIMATION_DELAY), appear: false, once: true };
      },
    },
    template: `
      <section class="floating-child" id="m-battle" data-scroll-target="battle" ref="battleEl">
        <div class="m-battle-content-1 en" v-animation="animationConfig()"><i class="en-art"></i><div class="en-hole en-hole-1"><h3 class="en-h">Combat Type</h3><p class="en-p">- Magic</p></div></div>
        <div class="m-battle-content-2 en" v-animation="animationConfig()"><i class="en-art"></i><div class="en-hole en-hole-1"><h3 class="en-h">Weapon</h3><p class="en-p">- Microphone</p></div></div>
        <div class="m-battle-content-3 en" v-animation="animationConfig()"><i class="en-art"></i><div class="en-hole en-hole-1"><h3 class="en-h">Combat Style</h3><p class="en-p">- Switch freely between 3 weapons for varied combat styles</p><p class="en-p">- Build the gauge to chain skills for steady defense or nonstop offense</p></div></div>
        <div class="m-battle-content-4 en" v-animation="animationConfig()"><i class="en-art"></i><div class="en-hole en-hole-1"><h3 class="en-h">Encore Gauge <i class="en-badge">Class Gauge</i></h3></div><div class="en-hole en-hole-2"><p class="en-p">- Resource spent for explosive firepower when chaining skills</p><p class="en-p">- Charge with Performance skills; stores up to 5</p></div></div>
        <div class="m-battle-content-5 floating-child en" v-animation="animationConfig()"><i class="en-art"></i><div class="en-hole en-hole-1"><h3 class="en-h">Skill Videos</h3></div>
          <button class="m-battle-btn-play-1" @click="layoutStore.openPlayPopup('9Dus72EhhMk')"></button>
          <button class="m-battle-btn-play-2" @click="layoutStore.openPlayPopup('DpuQGfmpU4E')"></button>
          <button class="m-battle-btn-play-3" @click="layoutStore.openPlayPopup('M6YEcZQVG-g')"></button>
        </div>
      </section>
    `,
  });

  /* =============================== STYLE =============================== */
  Vue.component("MobileStyle", {
    name: "MobileStyle",
    created: function () {
      this.animationDelayCounter = Util.stepCounter(ANIMATION_DELAY, ANIMATION_DELAY);
    },
    methods: {
      animationConfig: function (options) {
        var merged = Util.defaultsDeep(options || {}, { step: 1 });
        return { animation: "slide-top", delay: this.animationDelayCounter(merged.step * ANIMATION_DELAY), appear: false, once: true };
      },
    },
    template: `
      <section class="floating-child" id="m-style" data-scroll-target="style" ref="styleEl">
        <div class="m-style-title en" v-animation="animationConfig()"><span class="en-label">Style Room</span></div>
        <div class="m-style-content-1" v-animation="animationConfig()"></div>
        <div class="m-style-content-2" v-animation="animationConfig()"></div>
        <div class="m-style-content-3 en" v-animation="animationConfig()"><p class="en-lead">Share your fashion account-wide and equip it per character. Fashion and Beauty now in one system.</p><p class="en-p">- Search and preview items, even ones you don't own<br />- Add items to your Cart and buy them all at once<br />- Save and apply looks with Presets</p><p class="en-note">*Content and layouts may change with the update.</p></div>
      </section>
    `,
  });

  /* ============================= MAIN VIEW ============================= */
  Vue.component("MobileMainView", {
    name: "MobileMainView",
    template: `
      <main id="main">
        <mobile-main-intro class="scroll-snap-item"></mobile-main-intro>
        <mobile-scenario class="scroll-snap-item"></mobile-scenario>
        <mobile-idol class="scroll-snap-item"></mobile-idol>
        <mobile-battle class="scroll-snap-item"></mobile-battle>
        <mobile-style class="scroll-snap-item"></mobile-style>
      </main>
    `,
  });
})(window);

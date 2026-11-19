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
        <h2 class="m-intro-title text-hidden floating en" v-animation="animationConfig['title']"><span class="en-sub">Light on the Stage</span>SHINING</h2>
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
            Not only is she an outstanding singer and dancer, she wins everyone over with her special charm and positive outlook. On an audition program she happened to join before her debut, her skill and appeal were recognized together, captivating the judges and the public alike, and she proudly took first place. Riding that popularity, her debut as a solo idol singer was confirmed. With the release of her debut album, critics hailed her as the best rookie of the year, and she went on to hold the solo concert she had always dreamed of.
          </p>
          <p class="m-scenario-desc" v-animation="animationConfig()">
            Feeling the air of a place filled with the cheers and support of so many fans, she wished it could last forever. But circumstances beyond her will put out the lights of the stage, and she drifted further and further from it. She worried she might never stand on a stage again, yet she kept practicing, believing she could overcome it, until she was told she could no longer perform. Though her heart felt as if it were breaking, she could not give up, and she practiced her choreography all night until she fell asleep, exhausted.
          </p>
          <p class="m-scenario-desc" v-animation="animationConfig()">
            In her dream, she stood before a great door that was half open. Through the gap she could see a small stage and an audience waiting for it. Someone waiting at the door beckoned and whispered:
          </p>
          <p class="m-scenario-desc" v-animation="animationConfig()">“There are so many people who want to hear you sing.”</p>
          <p class="m-scenario-desc" v-animation="animationConfig()">
            At those words she cast aside the last of her hesitation and stepped onto the stage. She faintly sensed that it belonged to a world different from the one she had known, but that did not matter. She wanted to sing. She wanted to dance. She wanted to show that to everyone. And so the idol, ready to dream once more, sets foot on a new stage: ‘Etoile’.
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
                She wanted to sing. She wanted to dance. She wanted to show that to the fans who remembered and loved her. Holding on to the memory of promising her fans forever, she set out to find a stage to stand on again.
              </p>
              <p>
                And so she steps onto a new stage. It feels different from the ones before, but that does not matter to the idol. As a messenger who sings of dreams and hope, wherever someone needs her is her stage. Ready to dream once more, the idol sets foot on a new stage called ‘Etoile’.
              </p>
            </div>
          </div>
          <div class="swiper-slide m-idol-slide floating-child">
            <div class="m-idol-title m-idol-title-2 en-live"><span class="en-label"><small>New Class Awakening</small><b>Idol</b><em>Eternal Idol</em></span></div>
            <div class="m-idol-char-2"></div>
            <div class="m-idol-desc">
              <p>
                The stage was always a kind of trial, a challenge to surpass the person she had been. Having overcome that trial time and again, the idol sings of dreams and hope for her fans, just as she always has.
              </p>
              <p>
                Realizing she has grown stronger through her awakening, the idol accepts the change naturally and reaches out to her fans, more mature than before. Her even more dazzling performances are also the fruit of all the effort she has put into becoming a professional idol.
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
        <div class="m-battle-content-2 en" v-animation="animationConfig()"><i class="en-art"></i><div class="en-hole en-hole-1"><h3 class="en-h">Weapons</h3><p class="en-p">- Microphone</p></div></div>
        <div class="m-battle-content-3 en" v-animation="animationConfig()"><i class="en-art"></i><div class="en-hole en-hole-1"><h3 class="en-h">Combat Style</h3><p class="en-p">- Freely switch between three weapons for a wide range of combat styles</p><p class="en-p">- Build up the gauge and chain skills to gain steady defensive effects or unleash relentless attacks</p></div></div>
        <div class="m-battle-content-4 en" v-animation="animationConfig()"><i class="en-art"></i><div class="en-hole en-hole-1"><h3 class="en-h">Encore Gauge <i class="en-badge">Class Gauge</i></h3></div><div class="en-hole en-hole-2"><p class="en-p">- A resource spent to unleash explosive firepower when using skills in succession</p><p class="en-p">- Fill the gauge with performance skills to store up to 5</p></div></div>
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
        <div class="m-style-content-3 en" v-animation="animationConfig()"><p class="en-lead">A system that shares the fashion you own across your account and lets each character equip it.<br />Fashion and Beauty are combined into one system for buying and storing.</p><p class="en-p">- Preview how items look, even ones you don't own, through search and more<br />- Add the items you want to your cart and buy them all at once<br />- Save and apply your favorite fashion with the preset feature</p><p class="en-note">* Some content and screen layouts may change with the update.</p></div>
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

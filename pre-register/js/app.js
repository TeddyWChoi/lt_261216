/* ------------------------------------------------------------------
 * SHINING pre-registration page (Vue 2, no build step)
 *
 * Section order follows the La Boom pre-registration page:
 *   hero -> introduction + video -> rewards -> what's new, plus the
 *   registration popup.
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  var config = global.preRegisterConfig;
  var BASE_WIDTH = 1200; // below this width the whole page is scaled down

  Vue.config.productionTip = false;
  Vue.config.devtools = false;
  global.VAnimation.install(Vue, { once: true });

  /* ---------- "Pre-Register Now!" button ---------- */
  Vue.component("pre-register-btn", {
    props: { label: { type: String, default: "Pre-Register Now!" }, blue: Boolean },
    template: `
      <button class="sp-btn" :class="{ 'sp-btn-blue': blue }" type="button" @click="$emit('open')">
        <span>{{ label }}</span>
      </button>
    `,
  });

  /* ---------- reward card (art from the Korean page, name repainted in English) ---------- */
  Vue.component("reward-card", {
    props: { reward: Object },
    data: function () {
      return { titleEffect: config.titleEffect };
    },
    template: `
      <div class="sp-card" :class="'sp-card-' + reward.id">
        <p class="sp-card-name" v-html="reward.name"></p>
        <template v-if="reward.id === 4">
          <div class="sp-card-title-gif"></div>
          <div class="sp-card-effect">
            Title Effect
            <div class="sp-tooltip">
              <dl>
                <template v-for="stat in titleEffect.stats">
                  <dt>{{ stat[0] }}</dt>
                  <dd>{{ stat[1] }}</dd>
                </template>
              </dl>
              <strong>{{ titleEffect.trigger }}</strong>
              <p v-html="titleEffect.detail"></p>
            </div>
          </div>
        </template>
        <template v-if="reward.id === 5">
          <div class="sp-card-char"></div>
          <div class="sp-card-char-gif"></div>
        </template>
      </div>
    `,
  });

  /* ---------- "what's new" box ---------- */
  Vue.component("news-box", {
    props: { item: Object },
    template: `
      <div class="sp-news-box">
        <div class="sp-news-number">{{ item.number }}</div>
        <h3 class="sp-news-title">{{ item.title }}</h3>
        <ul>
          <li v-for="(line, index) in item.list" :key="index">{{ line }}</li>
        </ul>
      </div>
    `,
  });

  global.app = new Vue({
    el: "#shining-pre-register",
    data: function () {
      return {
        config: config,
        isLogin: config.user.isLogin,
        isLoading: false,
        isModalOpen: false,
        popupImage: "", // enlarged map image
        soundState: false,
      };
    },
    computed: {
      videoUrl: function () {
        return "https://www.youtube.com/embed/" + config.videoId;
      },
      signInUrl: function () {
        return config.links.signIn + encodeURIComponent(location.href);
      },
      isPopupOpen: function () {
        return this.isModalOpen || !!this.popupImage;
      },
    },
    watch: {
      // Lock page scrolling while a popup is open
      isPopupOpen: function (value) {
        document.documentElement.style.overflow = value ? "hidden" : "";
      },
    },
    methods: {
      openModal: function () {
        this.isModalOpen = true;
      },
      closeModal: function () {
        this.isModalOpen = false;
      },
      scrollTo: function (name) {
        var target = this.$refs[name];
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      soundToggle: function () {
        var audio = this.$refs.bgm;
        if (audio.paused) {
          audio.volume = 0.1;
          var played = audio.play();
          if (played && played.catch) played.catch(function () {});
        } else {
          audio.pause();
        }
      },
      handlePreRegister: function () {
        var self = this;
        if (this.isLoading) return;
        this.isLoading = true;

        // Demo mode: no API configured yet
        if (!config.api.url) {
          window.setTimeout(function () {
            self.alertMessage("10000");
          }, 800);
          return;
        }

        // Same call as the La Boom page: JSONP GET -> { ResultCode: [{ Code }] }
        var callbackName = "shiningPreRegister" + Date.now();
        var script = document.createElement("script");
        var cleanUp = function () {
          delete global[callbackName];
          if (script.parentNode) script.parentNode.removeChild(script);
        };
        global[callbackName] = function (response) {
          cleanUp();
          var code = response && response.ResultCode && response.ResultCode[0] ? response.ResultCode[0].Code : "90000";
          self.alertMessage(code);
        };
        script.onerror = function () {
          cleanUp();
          self.alertMessage("90000");
        };
        script.src =
          config.api.url +
          (config.api.url.indexOf("?") > -1 ? "&" : "?") +
          "callback=" + callbackName +
          "&cm=" + encodeURIComponent(config.api.cm) +
          "&unid=" + encodeURIComponent(config.user.unid) +
          "&userid=" + encodeURIComponent(config.user.userid);
        document.head.appendChild(script);
      },
      alertMessage: function (resultCode) {
        this.isLoading = false;
        if (resultCode === "10000") this.isModalOpen = false;
        alert(config.messages[resultCode] || config.messages["90000"]);
      },
      // Scale the whole page down on screens narrower than the design width
      refreshScale: function () {
        var width = document.documentElement.clientWidth;
        this.$el.style.zoom = width < BASE_WIDTH ? width / BASE_WIDTH : "";
      },
      onKeydown: function (event) {
        if (event.key !== "Escape") return;
        this.popupImage = "";
        this.isModalOpen = false;
      },
    },
    mounted: function () {
      this.refreshScale();
      window.addEventListener("resize", this.refreshScale);
      window.addEventListener("keydown", this.onKeydown);
    },
    beforeDestroy: function () {
      window.removeEventListener("resize", this.refreshScale);
      window.removeEventListener("keydown", this.onKeydown);
    },
    template: `
      <div id="shining-pre-register" class="sp-wrap">
        <!-- ===== top-right buttons ===== -->
        <div class="sp-top">
          <a class="sp-home" :href="config.links.home">Home</a>
          <button class="sp-music" :class="{ playing: soundState }" type="button" @click="soundToggle">Sound on/off</button>
        </div>

        <!-- ===== 1. hero ===== -->
        <section class="sp-hero">
          <div class="sp-stage">
            <div class="sp-hero-title-effect"></div>
            <h1 class="sp-hero-title">
              SHINING
              <span class="sp-hero-tagline">{{ config.tagline }}</span>
              <span class="sp-hero-date">{{ config.date }}</span>
            </h1>
            <div class="sp-hero-cta">
              <pre-register-btn label="Pre-Register" @open="openModal"></pre-register-btn>
              <pre-register-btn label="Rewards" blue @open="scrollTo('rewards')"></pre-register-btn>
            </div>
            <button class="sp-scroll" type="button" @click="scrollTo('intro')" v-show="!isModalOpen">Scroll down</button>
          </div>
        </section>

        <!-- ===== 2. introduction + video ===== -->
        <section class="sp-intro" ref="intro">
          <div class="sp-inner">
            <div class="sp-intro-balloon-1"></div>
            <div class="sp-intro-balloon-2"></div>
            <h2 class="sp-title sp-title-green" v-animation:slide-bottom="{ distance: 80 }">Pre-Registration<br />for SHINING</h2>
            <p class="sp-ribbon" v-animation:fade="{ delay: 150 }">La Tale's 20th Anniversary Summer Update: SHINING!</p>
            <div class="sp-video" v-animation:zoom-out="{ delay: 200, duration: 400 }">
              <iframe :src="videoUrl" title="SHINING video" frameborder="0" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="sp-desc" v-animation:slide-top="{ distance: 80 }">
              <p>
                SHINING lights up La Tale's 20th anniversary in two parts. Follow the first oracle to Linford, the City of Angels,
                and face Despair in Amaranth Nova. Then step onto a brand-new stage with the new class, Idol.
              </p>
              <p>Pre-register today to receive a bundle of SHINING items the moment the update goes live!</p>
              <pre-register-btn @open="openModal"></pre-register-btn>
            </div>
          </div>
        </section>

        <!-- ===== 3. rewards ===== -->
        <section class="sp-rewards" ref="rewards">
          <div class="sp-stage">
            <h2 class="sp-title sp-title-purple" v-animation:fade="{ duration: 400 }">Pre-Registration Rewards</h2>
            <div class="sp-rewards-char" v-animation:fade="{ delay: 100 }"></div>
            <reward-card v-for="(reward, index) in config.rewards" :key="reward.id" :reward="reward" v-animation:fade="{ delay: 150 * (index + 1) }"></reward-card>
            <div class="sp-rewards-foot">
              <p class="sp-rewards-message">* Rewards will be sent via Gift Bundle after the SHINING update!</p>
              <pre-register-btn @open="openModal"></pre-register-btn>
            </div>
          </div>
        </section>

        <!-- ===== 4. what's new ===== -->
        <section class="sp-news">
          <div class="sp-inner">
            <div class="sp-news-idol"></div>
            <h2 class="sp-title sp-title-holo" v-animation:slide-bottom="{ distance: 80 }">What's New</h2>
            <div class="sp-news-row">
              <news-box v-for="(item, index) in config.news" :key="index" :item="item" v-animation:slide-top="{ delay: index * 120, distance: 80 }"></news-box>
            </div>
            <div class="sp-news-box sp-news-large" v-animation:slide-top="{ distance: 80 }">
              <div class="sp-news-number">04</div>
              <h3 class="sp-news-title">New Maps, Monsters &amp; NPCs</h3>
              <div class="sp-maps">
                <button class="sp-map" type="button" v-for="map in config.maps" :key="map.name" @click="popupImage = map.image">
                  <img :src="map.image" :alt="map.name" loading="lazy" />
                  <strong>{{ map.name }}</strong>
                  <em>{{ map.type }}</em>
                </button>
              </div>
              <div class="sp-chars">
                <div class="sp-char" v-for="character in config.characters" :key="character.name">
                  <img :src="character.image" :alt="character.name" loading="lazy" />
                  <span>{{ character.name }}</span>
                </div>
              </div>
            </div>
            <pre-register-btn @open="openModal"></pre-register-btn>
          </div>
        </section>

        <!-- ===== 5. please note ===== -->
        <section class="sp-notice">
          <div class="sp-inner">
            <div class="sp-notice-char"></div>
            <h2 class="sp-title sp-title-blue" v-animation:fade="{ duration: 400 }">Please Note!</h2>
            <div class="sp-notice-box" v-animation:slide-top="{ distance: 80 }">
              <h3>Pre-Registration</h3>
              <ul>
                <li v-for="(note, index) in config.notes" :key="index">{{ note }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- ===== registration popup ===== -->
        <transition name="sp-fade">
          <div class="sp-modal-bg" v-if="isModalOpen" @click.self="closeModal">
            <div class="sp-modal">
              <button class="sp-close" type="button" @click="closeModal">Close</button>
              <div class="sp-modal-logo"></div>
              <h2>Pre-Registration for SHINING</h2>
              <p class="sp-modal-subtitle">Pre-register now to get a jump ahead of the other players with a bunch of items.</p>
              <div class="sp-modal-items">
                <div class="sp-modal-item" v-for="reward in config.rewards.slice(0, 3)" :key="reward.id">
                  <reward-card :reward="reward"></reward-card>
                  <span v-html="reward.name"></span>
                </div>
                <div class="sp-modal-more">AND MUCH<br />MORE!</div>
              </div>
              <p class="sp-modal-desc">In order to pre-register you must already have a created account.</p>
              <a class="sp-btn sp-btn-wide" v-if="!isLogin" :href="signInUrl"><span>Login or Register a New Account Now!</span></a>
              <button class="sp-btn sp-btn-wide" v-else type="button" @click="handlePreRegister">
                <span v-if="!isLoading">Pre-Register Now!</span>
                <span class="sp-loading" v-else></span>
              </button>
            </div>
          </div>
        </transition>

        <!-- ===== enlarged map image ===== -->
        <transition name="sp-fade">
          <div class="sp-modal-bg" v-if="popupImage" @click="popupImage = ''">
            <div class="sp-image-popup">
              <button class="sp-close" type="button">Close</button>
              <img :src="popupImage" alt="" />
            </div>
          </div>
        </transition>

        <footer class="sp-footer">COPYRIGHT © ACTOZ SOFT CO., LTD. ALL RIGHTS RESERVED.</footer>
        <audio ref="bgm" src="media/bgm.mp3" loop preload="none" @play="soundState = true" @pause="soundState = false"></audio>
      </div>
    `,
  });
})(window);

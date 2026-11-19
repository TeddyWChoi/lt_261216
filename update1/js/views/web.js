/* ------------------------------------------------------------------
 * Page sections (desktop)
 * ------------------------------------------------------------------ */
(function (global) {
  "use strict";

  var Util = global.Util;
  var getOrderAnimationConfigs = global.VAnimation.getOrderAnimationConfigs;
  var ANIMATION_DELAY = 200;

  /* ============================== INTRO =============================== */
  Vue.component("WebMainIntro", {
    name: "WebMainIntro",
    computed: {
      animationConfig: function () {
        return getOrderAnimationConfigs({ appear: false, delay: 50 }, [
          { key: "char-1", value: { animation: "fade", delay: -100 } },
          { key: "char-3", value: { animation: "fade", duration: 0, delay: -100 } },
          { key: "char-2", value: { animation: "fade", duration: 0 } },
          { key: "char-4", value: { animation: "fade", duration: 0 } },
          { key: "title", value: { animation: "slide-bottom" } },
          { key: "confetti", value: { animation: "fade", delay: 100 } },
          { key: "balloon-1", value: { animation: "fade" } },
          { key: "balloon-2", value: { animation: "fade" } },
          { key: "scroll", value: { animation: "fade" } },
        ]);
      },
    },
    template: `
      <section class="floating-child" id="w-intro" ref="mainEl">
        <div class="w-intro-title-effect" v-animation="animationConfig.title"></div>
        <h2 class="w-intro-title text-hidden floating en" v-animation="animationConfig.title"><span class="en-sub">Light of the Soul</span>SHINING</h2>
        <div class="w-intro-char-1" v-animation="animationConfig['char-1']"></div>
        <div class="w-intro-char-2" v-animation="animationConfig['char-2']"></div>
        <div class="w-intro-char-4" v-animation="animationConfig['char-4']"></div>
        <div class="w-intro-char-3" v-animation="animationConfig['char-3']"></div>
        <div class="w-intro-balloon-1" v-animation="animationConfig['balloon-1']"></div>
        <div class="w-intro-balloon-2" v-animation="animationConfig['balloon-2']"></div>
        <div class="w-intro-confetti" v-animation="animationConfig.confetti"></div>
        <div class="w-intro-scroll" v-animation="animationConfig.scroll"></div>
      </section>
    `,
  });

  /* ============================= SCENARIO ============================= */
  Vue.component("WebScenario", {
    name: "WebScenario",
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
      <section class="floating-child" id="w-scenario" data-scroll-target="scenario" ref="scenarioEl">
        <h2 class="w-scenario-title text-hidden floating" v-animation:slide-bottom="{once:false,delay:250,distance:100}">SCENARIO</h2>
        <div class="w-scenario floating" v-animation:slide-flip-top="{once:false,delay:350,distance:100,angle:-90,duration:1e3}">
          <p class="w-scenario-desc" v-animation="animationConfig()">
            Having received the first oracle of the Celestial God, the Adventurer sets out with Hilda<br />
            to gather the scattered pieces of the puzzle.<br />
            Arriving in Linford, the City of Angels, and uncovering the tragedy and the truth of its past,<br />
            the Adventurer comes face to face with ‘Despair’, busily preparing at the site of ruin for the long-awaited day.<br />
            With no way left to turn back, the Adventurer resolves to follow the words of the oracle.
          </p>
          <p class="w-scenario-desc" v-animation="animationConfig()">
            It was to destroy Despair, a being that would bring harm to the world.<br />
            To put an end to Despair, who had once been a god.
          </p>
        </div>
      </section>
    `,
  });

  /* ================================ MAP ================================ */
  Vue.component("WebMap", {
    name: "WebMap",
    data: function () {
      return { totalMapCount: 4, activeMapIndex: 1 };
    },
    computed: {
      layoutStore: function () {
        return global.layoutStore;
      },
      // Popup name (map-1 ...) to the real class name
      popupBodyClass: function () {
        return (this.layoutStore.popupImageClass || []).map(function (name) {
          return "w-map-" + name;
        });
      },
    },
    methods: {
      popupImage: function (popupName) {
        this.layoutStore.openImagePopup(popupName);
      },
    },
    mounted: function () {
      var self = this;
      var element = this.$refs.swiperRef;
      this.swiper = new Swiper(element, {
        slidesPerView: "auto",
        mousewheel: { enabled: true, releaseOnEdges: true },
        centeredSlides: true,
        pagination: { el: element.querySelector(".swiper-pagination"), clickable: true },
        navigation: {
          nextEl: element.querySelector(".swiper-button-next"),
          prevEl: element.querySelector(".swiper-button-prev"),
        },
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
      <section class="floating-child" id="w-map" data-scroll-target="map" ref="mapEl">
        <h2 class="w-map-title text-hidden floating" v-animation:slide-bottom="{once:false,delay:250,distance:100}">MAP</h2>
        <p class="w-map-map-count floating" :class="[{'w-map-white': 3===activeMapIndex||4===activeMapIndex}]" v-animation:slide-bottom="{once:false,delay:250,distance:100}">
          {{ '0'+(activeMapIndex)+' ' }}
          <span class="w-map-slash">{{ '0'+(totalMapCount) }}</span>
        </p>
        <div class="swiper w-map-swiper" :class="[{'w-map-white-pagination': 3===activeMapIndex||4===activeMapIndex}]" ref="swiperRef">
          <div class="swiper-wrapper">
          <div class="swiper-slide w-map-slide w-map w-map-map-1">
            <div class="w-map-sub-title en-live"><span class="en-label">Linford</span></div>
            <button class="w-map-btn-detail en-live" type="button" @click="popupImage('map-1')"><span class="en-label">Town</span></button>
            <p class="w-map-title">A Fragment of the Celestial Realm</p>
            <p class="w-map-desc">
              Unlike ordinary continents, Freios floats in the sky and is known as the ‘Continent of the Heavens’. From time to time, special places are discovered there. Said to have been left behind by the ancient gods of legend and called the ‘Celestial Realm’, they stir the curiosity of many with awe-inspiring scenery and immense magical power, yet the strong magic that lingers throughout does not readily allow anyone near.
            </p>
            <p class="w-map-title">The Curse That Fell on a Beautiful City</p>
            <p class="w-map-desc">
              Thanks to the efforts of many mages, some of these places were successfully settled, like the ‘Isle of Wings’ in the Infinite Corridor. Most, however, had to be abandoned because of the powerful magic, and some were even sealed after accidents linked them to the Demon Realm. Yet one fragment that carried a part of the Celestial Realm stood for ages as a symbol of hope in Freios, alongside its many people. It was Linford, known as the ‘City of Angels’.
            </p>
          </div>
          <div class="swiper-slide w-map-slide w-map w-map-map-2">
            <div class="w-map-sub-title en-live"><span class="en-label">Aether Road</span></div>
            <button class="w-map-btn-detail en-live" type="button" @click="popupImage('map-2')"><span class="en-label">Field</span></button>
            <p class="w-map-desc">
              Long ago it was an untended road, so tangled that travelers lost their way within it, until Shiina, the first emperor of the Silvaria Empire, ordered it put in order and gave it the tidy form it has today. Ten years ago, when the so-called ‘Curse of the City’ made it impossible to reach Linford, travelers naturally stopped coming to Aether Road as well.
            </p>
            <p class="w-map-desc">
              In the middle of the road is a shelter where travelers used to rest. It is said that the sun, the moon and the stars can be seen clearly from there.
            </p>
          </div>
          <div class="swiper-slide w-map-slide w-map w-map-map-3">
            <div class="w-map-sub-title en-live"><span class="en-label">River of Hatred and Oath</span></div>
            <button class="w-map-btn-detail en-live" type="button" @click="popupImage('map-3')"><span class="en-label">4-Player Dungeon</span></button>
            <p class="w-map-title">A Lonely River for the Repose of Souls</p>
            <p class="w-map-desc">
              A soul whose life has ended and has no body left to dwell in is led by the hand of a spirit to a river filled with blue tears. Before the soul can even grasp its sorrow, the spirit gathers the water to soak away every care it carries, and as its loneliness drifts off downstream, gently pushes the soul to give itself to the current. Following the warm waters of purification, the soul forgets everything, passes through a time of rest and heads back into the world.
            </p>
            <p class="w-map-desc">
              The man everyone feared fell into the river. As everyone wished, he was meant to drift away to a place no one knew. When he struggled back out of the water, those who were watching seized him again. At the mouth of the very river where all had once sworn to stand together for the sake of life, they pushed him under again and again. It was the best they could do, and their last desperate struggle.
            </p>
            <p class="w-map-desc">
              At some point the spirits stopped bringing souls there and helped them find rest in other ways. The river sank so deep that even the goddess of oblivion forgot it, but it rises once more for the one who wishes others to know the path of despair.
            </p>
          </div>
          <div class="swiper-slide w-map-slide w-map w-map-map-4">
            <div class="w-map-sub-title en-live"><span class="en-label">Amaranth Nova</span></div>
            <button class="w-map-btn-detail en-live" type="button" @click="popupImage('map-4')"><span class="en-label">8-Player Dungeon</span></button>
            <p class="w-map-title">A Twisted Place That Dreamed of Eternity</p>
            <p class="w-map-desc">
              One morning ten years ago, Linford was in turmoil. Something like an invisible barrier had spread across one end of the city so that no one could leave, and at the other end a road had appeared that had never been there before. At the end of that road gaped a hole, as if something had been attacked, filling all who saw it with dread.
            </p>
            <p class="w-map-desc">
              People tried to approach to learn what the road and the hole were, but the road to that fearful place kept stretching on and its end could never be reached. As things beyond all common sense continued, the people of Linford gave up every attempt and simply watched, and in time even that dulled until no one paid the place any mind.
            </p>
            <p class="w-map-desc">
              And then, at last, someone set foot in that place where nothing had happened. Walking through it and tracing old memories, the being climbs to a high place and looks up at the sky. So the place that seemed never to be used again becomes a stage once more, at the hands of one who walked the path of despair. Like the explosion of a star that dreamed of eternity...
            </p>
          </div>
          </div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
          <div class="swiper-pagination"></div>
        </div>
        <section class="popup-wrap">
          <transition name="popup" enter-active-class="w-map-popup-active" leave-active-class="w-map-popup-active" enter-class="w-map-popup-enter" leave-to-class="w-map-popup-enter" enter-to-class="w-map-popup-leave" leave-class="w-map-popup-leave">
            <section class="w-map-popup" v-if="layoutStore.popupFlag" @click.self="layoutStore.closePopup">
              <div class="w-map-popup-body" :class="popupBodyClass">
                <button class="w-map-close text-hidden" type="button" @click="layoutStore.closePopup">Close</button>
              </div>
            </section>
          </transition>
        </section>
      </section>
    `,
  });

  /* ============================ CHARACTERS ============================ */
  var CHARACTER_WHEEL_LOCK_TIME = 450;

  Vue.component("WebCharacters", {
    name: "WebCharacters",
    data: function () {
      return {
        activeTab: "boss", // boss | normal | npc
        activeBoss: 1,
        activeNpc: 1,
        isContentFocused: false,
        totalBossCount: 3,
        totalNpcCount: 5,
      };
    },
    watch: {
      activeTab: function () {
        this.setupNormalIntersectionObserver();
      },
    },
    methods: {
      disconnectNormalIntersectionObserver: function () {
        if (this.normalIntersectionObserver) this.normalIntersectionObserver.disconnect();
        this.normalIntersectionObserver = undefined;
      },
      // Normal monster list: reveal only the items scrolled into view
      setupNormalIntersectionObserver: function () {
        var self = this;
        this.disconnectNormalIntersectionObserver();
        if (this.activeTab !== "normal") return;
        this.$nextTick(function () {
          var root = self.$refs.contentNormalEl;
          if (!root) return;
          var items = Array.prototype.slice.call(root.querySelectorAll("[data-normal-index]"));
          items.forEach(function (item) {
            item.removeAttribute("data-normal-visible");
          });
          if (!("IntersectionObserver" in window)) {
            items.forEach(function (item) {
              item.dataset.normalVisible = "true";
            });
            return;
          }
          self.normalIntersectionObserver = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) entry.target.dataset.normalVisible = "true";
                else entry.target.removeAttribute("data-normal-visible");
              });
            },
            { root: root, threshold: [0, 0.1, 0.35] },
          );
          items.forEach(function (item) {
            self.normalIntersectionObserver.observe(item);
          });
        });
      },
      // One character per wheel notch
      handleCharacterWheel: function (event, current, total, update) {
        var self = this;
        if (this.characterWheelLocked) {
          event.preventDefault();
          return;
        }
        if (event.deltaY === 0) return;
        var next = Math.min(Math.max(current + (event.deltaY > 0 ? 1 : -1), 1), total);
        if (next === current) return;
        event.preventDefault();
        update(next);
        this.characterWheelLocked = true;
        this.characterWheelTimer = window.setTimeout(function () {
          self.characterWheelLocked = false;
          self.characterWheelTimer = undefined;
        }, CHARACTER_WHEEL_LOCK_TIME);
      },
      handleBossWheel: function (event) {
        var self = this;
        this.handleCharacterWheel(event, this.activeBoss, this.totalBossCount, function (value) {
          self.activeBoss = value;
        });
      },
      handleNpcWheel: function (event) {
        var self = this;
        this.handleCharacterWheel(event, this.activeNpc, this.totalNpcCount, function (value) {
          self.activeNpc = value;
        });
      },
      focusContent: function () {
        if (this.$refs.contentEl) this.$refs.contentEl.focus();
      },
      handleContentWheel: function (event) {
        if (!this.isContentFocused) return;
        event.stopPropagation();
        if (this.activeTab === "boss") this.handleBossWheel(event);
        else if (this.activeTab === "npc") this.handleNpcWheel(event);
      },
    },
    beforeDestroy: function () {
      if (this.characterWheelTimer) window.clearTimeout(this.characterWheelTimer);
      this.disconnectNormalIntersectionObserver();
    },
    template: `
      <section class="floating-child" id="w-characters" data-scroll-target="characters" ref="charactersEl">
        <h2 class="w-characters-title text-hidden floating">CHARACTERS</h2>
        <ul class="tabs floating" v-animation:zoom-out="{once:false,delay:150,duration:300,origin:{x:500,y:500}}">
          <li>
            <button class="w-characters-btn-tab w-characters-btn-tab-1 floating" :class="[{'w-characters-active': 'boss'===activeTab}]" type="button" @click="activeTab = 'boss'">Boss Monsters</button>
          </li>
          <li>
            <button class="w-characters-btn-tab w-characters-btn-tab-2 floating" :class="[{'w-characters-active': 'normal'===activeTab}]" type="button" @click="activeTab = 'normal'">Monsters</button>
          </li>
          <li>
            <button class="w-characters-btn-tab w-characters-btn-tab-3 floating" :class="[{'w-characters-active': 'npc'===activeTab}]" type="button" @click="activeTab = 'npc'">NPC</button>
          </li>
        </ul>
        <div class="w-characters-content floating" ref="contentEl" tabindex="0" @click="focusContent" @focus="isContentFocused=true" @blur="isContentFocused=false" @wheel="handleContentWheel" v-animation:zoom-out="{once:false,delay:150,duration:300}">
          <div class="w-characters-content-boss" v-if="'boss'===activeTab">
            <div class="w-characters-boss w-characters-boss-1" v-if="1===activeBoss">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Elone</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A spirit that prays for the health and well-being of all life, once destroyed in a certain incident. In the ‘River of Hatred and Oath’, touched by its master's will, it awakens through the power of the abyss and moves once more. Whether its master revived it as a curse of judgment or as a hand offering another chance it cannot tell, but since even this is its master's will, it simply follows without a word.
              </p>
            </div>
            <div class="w-characters-boss w-characters-boss-2" v-if="2===activeBoss">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Nuckalava</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A creature that awoke and began to move among the remains of the ancient gods. It was once a sacred being that menaced the unclean, but now it is nothing more than a monster searching ‘Amaranth Nova’ for something to devour. Sensing a sacred power it has tasted somewhere before, it pauses for a moment.
              </p>
            </div>
            <div class="w-characters-boss w-characters-boss-3" v-if="3===activeBoss">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Barbatos</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A high-ranking demon who has worked toward the long-awaited day from the moment he opened his eyes. To end his long journey, he comes to his final destination, ‘Amaranth Nova’. The time has come to lay down the ‘despair’ he has carried all this while, but for one person alone, the Adventurer, he means to show everything properly to the very end.
              </p>
            </div>
            <ul>
              <li>
                <button class="w-characters-btn-thum w-characters-btn-thum-1" :class="[{'w-characters-active': 1===activeBoss}]" type="button" @click="activeBoss=1"></button>
              </li>
              <li>
                <button class="w-characters-btn-thum w-characters-btn-thum-2" :class="[{'w-characters-active': 2===activeBoss}]" type="button" @click="activeBoss=2"></button>
              </li>
              <li>
                <button class="w-characters-btn-thum w-characters-btn-thum-3" :class="[{'w-characters-active': 3===activeBoss}]" type="button" @click="activeBoss=3"></button>
              </li>
            </ul>
          </div>
          <div class="w-characters-content-normal" ref="contentNormalEl" v-if="'normal'===activeTab">
            <div class="w-characters-normal w-characters-normal-1" data-normal-index="1">
              <p class="w-characters-title en-live"><span class="en-label">Sobaka</span></p>
              <p class="w-characters-desc">
                A small spirit that drifts at leisure over a river brimming with every kind of unseen emotion. It once served as a guide for lost souls, but now it roams as a predator that threatens others. Its silly face and movements bring a mischievous ghost to mind.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-2" data-normal-index="2">
              <p class="w-characters-title en-live"><span class="en-label">Gputi</span></p>
              <p class="w-characters-desc">
                A spirit of water and sea that once dreamed of becoming a god, or a great being equal to one. In ancient times, disappointed by those who abandoned everyone, it swept its sharp hatred into the river. Deep in a sleep that seemed never to end, it opens its eyes at someone's visit and decides to greet the guest. The moment it realizes the guest is an agent of the gods, it embraces once more the sharp feelings left in the river.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-3" data-normal-index="3">
              <p class="w-characters-title en-live"><span class="en-label">Upinea</span></p>
              <p class="w-characters-desc">
                A spirit that once dwelt in the river, carrying those who fell in to safety and calming the flow of the water. When it was no longer needed where it lived, it entered the Demon Realm against its master's wishes and became a demon. As befits a water spirit it carries a jar of water, said to be filled not only with water but with all it has gained as the price of promises.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-4" data-normal-index="4">
              <p class="w-characters-title en-live"><span class="en-label">Shurinel</span></p>
              <p class="w-characters-desc">
                A spirit of the stars that slept in a fragment of the Celestial Realm together with the remains of the ancient gods. It awakens naturally when one who shares the memory of those days visits ‘Amaranth Nova’. Wherever Shurinel passed once shone with beautiful starlight, but as it shakes off moments of despair and pain, it sinks into darkness.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-5" data-normal-index="5">
              <p class="w-characters-title en-live"><span class="en-label">Cupola</span></p>
              <p class="w-characters-desc">
                A mysterious plant that, under the influence of a special power, walks on two feet like a person. It is thought to have taken root and grown on an object that appears to be ancient before becoming what it is today. It resembles a mystical herb you might hear of only in very old tales, but now it is just a bizarre plant that pesters people with its strange dance.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-6" data-normal-index="6">
              <p class="w-characters-title en-live"><span class="en-label">Vielo</span></p>
              <p class="w-characters-desc">
                An ancient relic that recorded and remembered the lives that lie between eternity and death. After the Twilight it left its master's hands and seemed never to be used again, but the moment the aura of despair fell upon it, it took on a human form and a self. Before recording and remembering more human figures, it seeks to keep for itself the owner of a blessed soul.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-7" data-normal-index="7">
              <p class="w-characters-title en-live"><span class="en-label">Calviz</span></p>
              <p class="w-characters-desc">
                A spiritual being that awoke inside the weapons abandoned with the remains of the ancient gods. Believing the place where it opened its eyes to be a battlefield of the Twilight, it was searching for enemies to strike down when it stirred in response to the power of the Adventurer visiting Amaranth Nova. The name of a legendary giant, ‘Briareus’, is engraved on the armor it wears.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-8" data-normal-index="8">
              <p class="w-characters-title en-live"><span class="en-label">Zeruna</span></p>
              <p class="w-characters-desc">
                A little fairy that has cleaned the cracks of the Great Wall since ancient times. It nearly perished through the schemes of the Twisted One, but was forgiven and left among the cracks of the Great Wall. It now works helping Iris, but after falling into Amaranth Nova in an accident someone caused on purpose, it has been brainwashed against its will and rushes at the Adventurer, taking them for something to be cleaned up.
              </p>
            </div>
          </div>
          <div class="w-characters-content-npc" v-if="'npc'===activeTab">
            <div class="w-characters-npc w-characters-npc-1" v-if="1===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Benjamin</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A poet with a charming smile who records the romance of Linford, the City of Angels. After his son Elliot left on a journey to mend his own character, the city fell under a curse that cut it off from the outside, and the two meet again only after ten years. When the son he thought he might never see again returns, he decides to help the Adventurer who came to Linford with him. He looks unbelievably young for his age and is far more timid than he appears. He seems easygoing, but it is said to have taken a great deal of training to get there. Like father, like son: Benjamin had much to do with Elliot leaving Linford to travel.
              </p>
            </div>
            <div class="w-characters-npc w-characters-npc-2" v-if="2===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Hailee</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A high elf from Lifthrasir and a demon hunter who has been active since the days when the Silvaria Empire was still a kingdom. No one knows why she began, but she is said to have struck down many witches and demons over the years. Ten years ago she happened to visit Linford, found herself unable to leave and has had no choice but to settle there. Unlike the haughty, unapproachable image of high elves, she is considerate and kind and never shies from hard work, earning her the nickname ‘Angel’. Still, she can react almost too sharply to any talk of witches and demons. These days she enjoys giving homemade treats to the birds and cats she meets on her patrols around town.
              </p>
            </div>
            <div class="w-characters-npc w-characters-npc-3" v-if="3===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Charlotte</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A girl who has never once left Linford since she was born. From the moment she learned that the curse keeps her from going outside, her curiosity about the outside world has grown, but with so many people around her separated from their families, she rarely shows it for fear of touching their wounds. Hearing that outsiders have arrived, she feels a pleasant flutter she cannot explain. Calm, quiet and sparing with her emotions, she leaves those around her saying they can never tell what she is thinking, though Charlotte herself does not seem to mind. She likes Prirings, and her specialty is going out to look for things people rarely look for.
              </p>
            </div>
            <div class="w-characters-npc w-characters-npc-4" v-if="4===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Kyril</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                The owner of the general store ‘The Peculiar Priring’. On his first trip, taken the moment he came of age, he fell for Linford's beautiful scenery and has lived there ever since. He opened the store hoping to get rich, but when Linford fell under the curse he quietly set that dream aside. Handier than he looks, he scrapes by making whatever people ask for. What he is most confident in is making Priring-themed trinkets. He is the type to get by on his looks and a sly manner, but he never crosses the line, so it is hard to dislike him.
              </p>
            </div>
            <div class="w-characters-npc w-characters-npc-5" v-if="5===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Ariel</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                She looks like an ordinary resident of Linford, but she is in fact an angel who has lived among humans for a very long time with her wings hidden. The angels people know of are usually loyal to the gods and work for the sake of life, but Ariel is nothing like that. She loves an idle, easy life and goes so far as to say an angel's work does not suit her. During the Twilight, when something kept her from returning from a mission, she gladly settled in the human world and has stayed ever since. In Linford she now passes as ‘a woman in her late twenties who could not go home because of the city's curse’, and she grows very uneasy when an uninvited guest appears who seems to know what she is. Her wings have withered from long disuse, but she does not seem to care much.
              </p>
            </div>
            <ul>
              <li>
                <button class="w-characters-btn-thum w-characters-btn-thum-1" :class="[{'w-characters-active': 1===activeNpc}]" type="button" @click="activeNpc=1"></button>
              </li>
              <li>
                <button class="w-characters-btn-thum w-characters-btn-thum-2" :class="[{'w-characters-active': 2===activeNpc}]" type="button" @click="activeNpc=2"></button>
              </li>
              <li>
                <button class="w-characters-btn-thum w-characters-btn-thum-3" :class="[{'w-characters-active': 3===activeNpc}]" type="button" @click="activeNpc=3"></button>
              </li>
              <li>
                <button class="w-characters-btn-thum w-characters-btn-thum-4" :class="[{'w-characters-active': 4===activeNpc}]" type="button" @click="activeNpc=4"></button>
              </li>
              <li>
                <button class="w-characters-btn-thum w-characters-btn-thum-5" :class="[{'w-characters-active': 5===activeNpc}]" type="button" @click="activeNpc=5"></button>
              </li>
            </ul>
          </div>
        </div>
      </section>
    `,
  });

  /* ============================== SYSTEM ============================== */
  Vue.component("WebSystem", {
    name: "WebSystem",
    data: function () {
      return {
        // The patch note button only shows after the update goes live
        isEventDay: Date.now() > new Date(2026, 5, 24, 10, 0, 0).getTime(),
        patchNoteUrl: global.linkConfig.patchNote,
      };
    },
    template: `
      <section class="floating-child" id="w-system" data-scroll-target="system" ref="systemEl">
        <h2 class="w-system-title en-live floating" v-animation:slide-bottom="{once:false,delay:250,distance:100}"><span class="en-label">System Updates & Improvements</span></h2>
        <div class="content w-system-content-1 en-live floating en" v-animation:fade="{once:false,delay:350}"><i class="en-art"></i><div class="en-hole en-hole-1"></div><span class="en-label">Dungeon Conquest System</span></div>
        <div class="content w-system-content-2 en-live floating en" v-animation:fade="{once:false,delay:400}"><i class="en-art"></i><div class="en-hole en-hole-1"></div><span class="en-label">Content Overhaul<small>(Summoner / Transcendent / Legend)</small></span></div>
        <div class="content w-system-content-3 en-live floating en" v-animation:fade="{once:false,delay:450}"><i class="en-art"></i><div class="en-hole en-hole-1"></div><span class="en-label">Growth Items</span></div>
        <div class="content w-system-content-4 en-live floating en" v-animation:fade="{once:false,delay:500}"><i class="en-art"></i><div class="en-hole en-hole-1"></div><span class="en-label">Item Awakening Improvements</span></div>
        <a class="w-system-patch-note en-live floating" :href="patchNoteUrl" target="_blank" v-if="isEventDay" v-animation:fade="{once:false,delay:550}"><span class="en-label">View Patch Notes</span></a>
      </section>
    `,
  });
})(window);

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
        <h2 class="w-intro-title text-hidden floating en" v-animation="animationConfig.title"><span class="en-sub">From the Soul</span>SHINING</h2>
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
            Having received the first oracle from the Celestial God, the Adventurer sets out with Hilda to find the scattered Fragments of Clues.<br />
            Arriving in Linford, the City of Angels, the Adventurer uncovers the tragedy and truth of what happened there,<br />
            and comes face to face with "Despair," who has been busily preparing for a long-awaited day in the place of ruin.<br />
            With no way left to turn back,<br />
            the Adventurer decides to follow the oracle.
          </p>
          <p class="w-scenario-desc" v-animation="animationConfig()">
            That oracle: to destroy Despair, a being that would bring harm to the world,<br />
            and put an end to Despair, who was once a god.
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
            <button class="w-map-btn-detail en-live" type="button" @click="popupImage('map-1')"><span class="en-label">Village</span></button>
            <p class="w-map-title">A Fragment of the Heavens</p>
            <p class="w-map-desc">
              Unlike ordinary continents, Freios floats in the sky and is known as the "Sky Continent," and from time to time, special places are discovered there. Said to have been left behind by the Ancient Gods of legend, these places are called "the Heavens." Their awe-inspiring scenery and powerful magic stir the curiosity of many, but the strong magic lingering throughout makes them difficult to approach.
            </p>
            <p class="w-map-title">A Curse upon a Beautiful City</p>
            <p class="w-map-desc">
              Through the efforts of many mages, some were successfully settled, like the "Isle of Wings" in the Infinity Corridor, but most had to be abandoned because of their powerful magic, and some were even sealed away after accidents linked them to the Demon Realm. Yet one fragment holding a piece of "the Heavens" stood for ages in Freios as a place of hope, home to many people. It was Linford, known as "the City of Angels."
            </p>
          </div>
          <div class="swiper-slide w-map-slide w-map w-map-map-2">
            <div class="w-map-sub-title en-live"><span class="en-label">Aether Road</span></div>
            <button class="w-map-btn-detail en-live" type="button" @click="popupImage('map-2')"><span class="en-label">Field</span></button>
            <p class="w-map-desc">
              Long ago, it was so neglected and tangled that travelers would get lost inside, but by order of Siena, the first Emperor of the Sylvaria Empire, it took on the orderly form it has today. Ten years ago, the so-called "City's Curse" cut off all travel to Linford, and naturally, people stopped walking Aether Road as well.
            </p>
            <p class="w-map-desc">
              At the center of the road is a shelter where travelers once rested. It is said that from there, the sun, moon, and stars can be seen clearly.
            </p>
          </div>
          <div class="swiper-slide w-map-slide w-map w-map-map-3">
            <div class="w-map-sub-title en-live"><span class="en-label">River of Hatred and Oath</span></div>
            <button class="w-map-btn-detail en-live" type="button" @click="popupImage('map-3')"><span class="en-label">4-Player Dungeon</span></button>
            <p class="w-map-title">A Lonely River for the Rest of Souls</p>
            <p class="w-map-desc">
              When a soul's life is spent and it has no body left to dwell in, a spirit takes it by the hand and leads it to a river filled with blue tears. Before the soul can even feel its grief, the spirit gathers the river's water to wash away all its sorrows, and as its loneliness drifts downstream, the spirit gently pushes the soul to give itself to the current. Following the warm, purifying waters, the soul soon forgets everything, and after a time of rest, returns to the world.
            </p>
            <p class="w-map-desc">
              A man everyone feared fell into the river. As everyone wished, he was meant to drift away to a place no one knew. When he struggled his way back out of the water, those watching seized him again. At the mouth of the river where all had sworn to stand together for life, they pushed him under the water again and again. It was the best they could do, and their last desperate struggle.
            </p>
            <p class="w-map-desc">
              At some point, the spirit stopped bringing souls there and helped them find rest in other ways. The river sank so deep that even the Goddess of Oblivion forgot it, but now it rises once more for one who would make others walk the path of despair.
            </p>
          </div>
          <div class="swiper-slide w-map-slide w-map w-map-map-4">
            <div class="w-map-sub-title en-live"><span class="en-label">Amaranth Nova</span></div>
            <button class="w-map-btn-detail en-live" type="button" @click="popupImage('map-4')"><span class="en-label">8-Player Dungeon</span></button>
            <p class="w-map-title">A Twisted Place That Dreamed of Eternity</p>
            <p class="w-map-desc">
              One morning ten years ago, Linford awoke in turmoil. Something like an invisible barrier had spread across one end of the city, trapping its residents inside, while at the other end, a road that had never existed before appeared. At the end of that road gaped a hole, as if something had struck it, filling all who saw it with fear.
            </p>
            <p class="w-map-desc">
              People tried to approach and learn what the road and the hole were, but the path to that place of fear kept stretching on, and no one could ever reach its end. Faced with something beyond all reason, the people of Linford gave up every attempt and simply began to watch, until even that faded with time and no one paid the place any mind.
            </p>
            <p class="w-map-desc">
              Then, to that place where nothing had happened for so long, someone's footsteps finally arrived. Walking within and tracing old memories, the being climbs to a high place and gazes at the sky. And so a place that seemed never to be used again becomes a stage once more for the one who walked the path of despair. Like the explosion of a star that once dreamed of eternity...
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
            <button class="w-characters-btn-tab w-characters-btn-tab-3 floating" :class="[{'w-characters-active': 'npc'===activeTab}]" type="button" @click="activeTab = 'npc'">NPCs</button>
          </li>
        </ul>
        <div class="w-characters-content floating" ref="contentEl" tabindex="0" @click="focusContent" @focus="isContentFocused=true" @blur="isContentFocused=false" @wheel="handleContentWheel" v-animation:zoom-out="{once:false,delay:150,duration:300}">
          <div class="w-characters-content-boss" v-if="'boss'===activeTab">
            <div class="w-characters-boss w-characters-boss-1" v-if="1===activeBoss">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Ellone</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A spirit who prayed for the health and well-being of all life, until she vanished in a mysterious incident. In the "River of Hatred and Oath," where her master's will reached her, she awakens through the power of the Abyss and moves once more. Whether her master revived her as a Curse of Judgment or as a hand offering a second chance, she cannot know, but since even this is her master's will, she follows without a word.
              </p>
            </div>
            <div class="w-characters-boss w-characters-boss-2" v-if="2===activeBoss">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Nuckalava</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A creature that awakens and stirs among the remains of an Ancient God. Once a holy being that menaced all things impure, it is now nothing but a monster hunting for prey in "Amaranth Nova." Sensing a holy power it once tasted somewhere, it pauses for a moment.
              </p>
            </div>
            <div class="w-characters-boss w-characters-boss-3" v-if="3===activeBoss">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Barbatos</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A high-ranking demon who has worked toward a long-awaited day since the moment he opened his eyes, he seeks his final destination, "Amaranth Nova," to end his long journey. The time has come to set down the "Despair" he has carried for so long, but for one person, the Adventurer, he means to show it in full before the end.
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
              <p class="w-characters-title en-live"><span class="en-label">Sovaca</span></p>
              <p class="w-characters-desc">
                A small spirit drifting leisurely over a river filled with all kinds of unseen emotions. Once a guide for lost souls, it has now become a predator that threatens others. Its goofy expression and movements bring a mischievous ghost to mind.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-2" data-normal-index="2">
              <p class="w-characters-title en-live"><span class="en-label">Gputii</span></p>
              <p class="w-characters-desc">
                A spirit of water and sea that once dreamed of becoming a god, or a great being second only to one. In ancient times, disappointed by those who abandoned everyone, it swept its sharp hatred into the river. Sunk in a sleep it seemed it would never wake from, it opens its eyes at someone's visit and decides to greet its guest. The moment it realizes the guest is an agent of the gods, it embraces the sharp emotions left in the river once more.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-3" data-normal-index="3">
              <p class="w-characters-title en-live"><span class="en-label">Upinea</span></p>
              <p class="w-characters-desc">
                A spirit that once dwelled by the river, carrying the drowning to safety and calming the flow of the water. When it was no longer needed where it once lived, it entered the Demon Realm despite its master's pleas, and became a devil. True to its nature as a water spirit, it carries a jar of water, said to be filled not only with water but with everything it has gained as the price of promises.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-4" data-normal-index="4">
              <p class="w-characters-title en-live"><span class="en-label">Shurinel</span></p>
              <p class="w-characters-desc">
                A star spirit that slept in a Fragment of the Heavens alongside the remains of an Ancient God. When a being who shares its memories of that time visits "Amaranth Nova," it naturally awakens. Wherever Shurinel passed once shone with beautiful starlight, but as it shakes off moments of despair and pain, it sinks into darkness.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-5" data-normal-index="5">
              <p class="w-characters-title en-live"><span class="en-label">Kupola</span></p>
              <p class="w-characters-desc">
                A mysterious plant that, touched by a special power, walks on two legs like a person. It is believed to have taken root in an ancient-looking object and grown into its current form. It resembles a mystical herb you might hear of only in the oldest of tales, but now it is just a strange plant that dances oddly to torment people.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-6" data-normal-index="6">
              <p class="w-characters-title en-live"><span class="en-label">Viello</span></p>
              <p class="w-characters-desc">
                An ancient relic that recorded and remembered life between eternity and death. After the Twilight, it left its master's hands and seemed destined never to be used again, but the moment the aura of despair fell upon it, it took on a human form and a will of its own. Before it records and remembers more human forms, it seeks to keep the owners of blessed souls for itself.
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-7" data-normal-index="7">
              <p class="w-characters-title en-live"><span class="en-label">Kalviz</span></p>
              <p class="w-characters-desc">
                A spiritual being that awoke inside weapons discarded along with the remains of an Ancient God. Believing it had woken on a battlefield of the Twilight Days, it searched for enemies to strike down, and now stirs in response to the power of the Adventurer who came to Amaranth Nova. The armor it wears bears the name of a legendary giant: "Briaros."
              </p>
            </div>
            <div class="w-characters-normal w-characters-normal-8" data-normal-index="8">
              <p class="w-characters-title en-live"><span class="en-label">Zeruna</span></p>
              <p class="w-characters-desc">
                A tiny fairy that has cleaned the cracks of the Great Wall since ancient times. Nearly destroyed by the scheme of a twisted one, it was forgiven and left to stay within the cracks of the Great Wall. It now helps Iris with her work, but after an accident someone caused on purpose sent it tumbling into Amaranth Nova, it was brainwashed against its will and now charges at the Adventurer as something to be cleaned.
              </p>
            </div>
          </div>
          <div class="w-characters-content-npc" v-if="'npc'===activeTab">
            <div class="w-characters-npc w-characters-npc-1" v-if="1===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Benjamin</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A poet with a winning smile who records the romance of Linford, the City of Angels. After his son Elliot set off on a journey to change his personality, the city fell under a curse that cut it off from the outside, and only after 10 years does he see his son again. When the son he thought he might never see again returns, he decides to help the Adventurer who came to Linford with him. He looks unbelievably young for his age, and is far more timid than he appears. He may seem composed, but they say he got there only after much practice. Like father, like son: Benjamin had a lot to do with Elliot leaving Linford to travel.
              </p>
            </div>
            <div class="w-characters-npc w-characters-npc-2" v-if="2===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Hailee</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A High Elf from Lifthrasir, and a Demon Hunter active since the days when the Sylvaria Empire was still a kingdom. No one knows why she began, but she is said to have struck down many witches and demons over the years. Ten years ago, she happened to visit Linford and found herself unable to leave, so she has had no choice but to settle there. Unlike the aloof, hard-to-approach image of a High Elf, she is thoughtful, kind, and never shies away from hard work, earning her the nickname "Angel." However, she can react with extreme sensitivity to anything involving witches or demons. These days, she enjoys giving homemade treats to the birds and cats she meets on her village patrols.
              </p>
            </div>
            <div class="w-characters-npc w-characters-npc-3" v-if="3===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Charlotte</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                A girl who has never once left Linford since she was born. Ever since she learned that Linford's curse keeps everyone from leaving, her curiosity about the outside world has grown, but with so many around her separated from their families, she rarely shows it, afraid of reopening their wounds. Hearing that an outsider has arrived, she feels a pleasant flutter she can't explain. Calm and quiet, she shows little emotion, so people say they can never tell what she's thinking, but Charlotte herself doesn't seem to mind. She loves Priring, and her specialty is seeking out things people rarely look for.
              </p>
            </div>
            <div class="w-characters-npc w-characters-npc-4" v-if="4===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Kyril</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                Owner of the general store "Quirky Priring." He fell for Linford's beautiful scenery on his very first journey as an adult and has lived there ever since. He opened the store hoping to get rich, but when Linford was cursed, he quietly let that dream go. Handier than he looks, he makes whatever people want and just barely gets by. His specialty is Priring-themed goods. He likes to play it cool and use his looks as a weapon, but never crosses the line, so it's hard to dislike him.
              </p>
            </div>
            <div class="w-characters-npc w-characters-npc-5" v-if="5===activeNpc">
              <p class="w-characters-title en-live" v-animation:fade="{once:false,delay:250}"><span class="en-label">Ariel</span></p>
              <p class="w-characters-desc" v-animation:fade="{once:false,delay:250}">
                She looks like an ordinary Linford resident, but she is actually an angel who has hidden her wings and lived among humans for ages. The angels people know are usually loyal to the gods and work for the sake of life, but Ariel is nothing like that. She loves nothing more than lazing around, so much so that she says angel work just isn't for her. During the Twilight Days, when something kept her from returning from a mission, she happily settled in the human world and has stayed ever since. In Linford, she lives under the cover story of "a woman in her late 20s, stranded by the city's curse while traveling," and an unwelcome guest who seems to see through her has her deeply worried. Her wings have withered from years without use, but she doesn't seem to mind much.
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
        <div class="content w-system-content-2 en-live floating en" v-animation:fade="{once:false,delay:400}"><i class="en-art"></i><div class="en-hole en-hole-1"></div><span class="en-label">Content Revamp<small>(Summons / Champions / Legend)</small></span></div>
        <div class="content w-system-content-3 en-live floating en" v-animation:fade="{once:false,delay:450}"><i class="en-art"></i><div class="en-hole en-hole-1"></div><span class="en-label">Growth Items</span></div>
        <div class="content w-system-content-4 en-live floating en" v-animation:fade="{once:false,delay:500}"><i class="en-art"></i><div class="en-hole en-hole-1"></div><span class="en-label">Item Awakening Improvements</span></div>
        <a class="w-system-patch-note en-live floating" :href="patchNoteUrl" target="_blank" v-if="isEventDay" v-animation:fade="{once:false,delay:550}"><span class="en-label">View Patch Notes</span></a>
      </section>
    `,
  });
})(window);

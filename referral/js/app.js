(function () {
  'use strict';

  var cfg = window.EVENT_CONFIG;
  var api = window.ReferralApi;

  Vue.config.productionTip = false;
  Vue.config.devtools = false;

  /* Reward slot: icon (or placeholder) + quantity chip + name */
  Vue.component('reward-item', {
    props: { item: { type: Object, required: true } },
    template:
      '<li class="item">' +
        '<div class="item-box">' +
          '<img v-if="item.icon" :src="\'images/items/\' + item.icon" alt="" loading="lazy" />' +
          '<i v-else aria-hidden="true">?</i>' +
          '<span v-if="item.qty" class="item-qty">x{{ item.qty }}</span>' +
        '</div>' +
        '<p class="item-name">{{ item.name }}</p>' +
      '</li>'
  });

  /* External link. An empty href (URL not decided yet) renders as a disabled label. */
  Vue.component('ext-link', {
    props: { href: { type: String, default: '' } },
    template:
      '<a v-if="href" :href="href" target="_blank" rel="noopener"><slot></slot></a>' +
      '<span v-else class="is-pending" title="Link coming soon" aria-disabled="true"><slot></slot></span>'
  });

  var ERRORS = {
    login: { title: 'Please log in first', message: 'Sign in to Papaya Play to continue.', action: 'signin' },
    empty: { title: 'No Code Entered', message: 'Please enter your invitation code and try again.' },
    invalid: { title: 'Invalid Code', message: 'Please check the invitation code and try again.' },
    own: { title: 'Invalid Code', message: 'You cannot enter your own invitation code.' },
    ineligible: { title: 'Not Eligible', message: 'Invitation codes can only be entered by new and returning players.' },
    used: { title: 'Already Registered', message: 'Only one invitation code can be entered per account.' },
    nochar: { title: 'No Character Found', message: 'No characters have been created. Please check your account.' },
    invitee: { title: 'Cannot Generate a Code', message: 'Players who joined with a referral code cannot invite other players.' },
    fallback: { title: 'Something Went Wrong', message: 'Please try again in a moment.' }
  };

  new Vue({
    el: '#app',
    data: function () {
      return {
        cfg: cfg,
        links: cfg.links,
        me: { loggedIn: false, account: '', canEnterCode: false, registeredCode: '', myCode: '', referrals: [] },
        inviteCode: '',
        shakeInput: false,
        busy: false,
        copiedType: null,
        showDetails: false,
        lightbox: null,
        resultPopup: null,
        toasts: [],
        windowWidth: window.innerWidth,
        envelopeNativeW: 898,
        envelopeNativeH: 500,
        previewOpen: window.innerWidth >= 768,
        previewState: 'guest',
        previewStates: [
          { id: 'guest', label: 'Signed out' },
          { id: 'invitee', label: 'New / returning player' },
          { id: 'registered', label: 'Code entered' },
          { id: 'inviter', label: 'Existing player' },
          { id: 'inviting', label: 'Existing player · 3 invited' }
        ]
      };
    },
    computed: {
      isMobile: function () {
        return this.windowWidth < 640;
      },
      envelopeScale: function () {
        return this.isMobile ? Math.min(1, (this.windowWidth - 16) / this.envelopeNativeW) : 1;
      },
      // guest | registered | ineligible | ready
      codeState: function () {
        if (!this.me.loggedIn) return 'guest';
        if (this.me.registeredCode) return 'registered';
        if (!this.me.canEnterCode) return 'ineligible';
        return 'ready';
      },
      canGenerate: function () {
        return this.me.loggedIn && !this.me.registeredCode && !this.me.myCode;
      },
      referralCount: function () {
        return Math.min(this.me.referrals.length, cfg.maxReferrals);
      },
      reachedCount: function () {
        return this.me.referrals.filter(function (r) { return r.reached; }).length;
      },
      referralRows: function () {
        var rows = [];
        for (var i = 0; i < cfg.maxReferrals; i++) {
          var r = this.me.referrals[i] || {};
          rows.push({ no: i + 1, date: r.date || '', account: r.account || '', reached: !!r.reached });
        }
        return rows;
      }
    },
    mounted: function () {
      var self = this;

      // Shared URL: ...?code=XXXX fills the invitation code field
      var shared = new URLSearchParams(window.location.search).get('code');
      if (shared) this.inviteCode = this.formatCode(this.normalizeCode(shared));

      api.getStatus().then(function (status) { self.me = status; });

      this._onKeydown = function (e) {
        if (e.key !== 'Escape') return;
        if (self.resultPopup) self.resultPopup = null;
        else if (self.lightbox !== null) self.lightbox = null;
        else self.showDetails = false;
      };
      this._onResize = function () { self.windowWidth = window.innerWidth; };
      window.addEventListener('keydown', this._onKeydown);
      window.addEventListener('resize', this._onResize);
    },
    beforeDestroy: function () {
      window.removeEventListener('keydown', this._onKeydown);
      window.removeEventListener('resize', this._onResize);
    },
    methods: {
      scrollTo: function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      },
      normalizeCode: function (code) {
        return String(code || '').replace(/[\s_-]/g, '').toUpperCase();
      },
      formatCode: function (code) {
        return code ? code.replace(/(.{3})(?=.)/g, '$1 ') : '';
      },
      showError: function (reason) {
        var e = ERRORS[reason] || ERRORS.fallback;
        this.resultPopup = { type: 'error', title: e.title, message: e.message, action: e.action || '' };
      },
      signIn: function () {
        var self = this;
        api.signIn().then(function (status) { self.me = status; self.previewState = 'invitee'; });
      },
      signOut: function () {
        var self = this;
        api.signOut().then(function (status) { self.me = status; self.previewState = 'guest'; });
      },
      usePreset: function (id) {
        var self = this;
        this.previewState = id;
        api.usePreset(id).then(function (status) { self.me = status; });
      },
      handleConfirm: function () {
        var self = this;
        if (this.busy) return;
        var code = this.normalizeCode(this.inviteCode);
        if (!code || !/^[A-Z0-9]{4,24}$/.test(code)) {
          this.shakeInput = true;
          setTimeout(function () { self.shakeInput = false; }, 400);
          this.showError(code ? 'invalid' : 'empty');
          return;
        }
        this.busy = true;
        api.registerCode(code).then(function (res) {
          self.busy = false;
          if (!res.ok) {
            self.shakeInput = true;
            setTimeout(function () { self.shakeInput = false; }, 400);
            self.showError(res.reason);
            return;
          }
          self.me.registeredCode = res.code;
          self.inviteCode = '';
          self.previewState = 'registered';
          self.resultPopup = {
            type: 'success',
            title: 'Code Registered!',
            message: 'Your invitation code has been registered. Log in to La Tale and check your in-game Mailbox for the Welcome Package!',
            action: ''
          };
          if (window.confetti && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.confetti({
              particleCount: 140, spread: 80, origin: { y: 0.6 },
              colors: ['#a78bfa', '#f472b6', '#ffd043', '#3b82f6', '#10b981']
            });
          }
        }).catch(function () { self.busy = false; self.showError('fallback'); });
      },
      handleGenerate: function () {
        var self = this;
        if (!this.canGenerate || this.busy) return;
        this.busy = true;
        api.generateCode().then(function (res) {
          self.busy = false;
          if (!res.ok) { self.showError(res.reason); return; }
          self.me.myCode = res.code;
          self.showToast('Your invitation code is ready!');
        }).catch(function () { self.busy = false; self.showError('fallback'); });
      },
      handleCopy: function (type) {
        var self = this;
        if (!this.me.myCode) return;
        var text = type === 'url'
          ? cfg.links.shareBase + '?code=' + this.me.myCode
          : this.me.myCode;
        this.copyText(text);
        this.copiedType = type;
        this.showToast(type === 'url' ? 'Invitation Link has been Copied' : 'Invitation Code has been Copied');
        setTimeout(function () { self.copiedType = null; }, 1500);
      },
      copyText: function (text) {
        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) { /* nothing else to try */ }
          document.body.removeChild(ta);
        }
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).catch(fallback);
        else fallback();
      },
      showToast: function (message) {
        var self = this;
        var id = Date.now() + Math.random();
        this.toasts.push({ id: id, message: message, leaving: false });
        setTimeout(function () {
          var toast = self.toasts.find(function (t) { return t.id === id; });
          if (toast) toast.leaving = true;
          setTimeout(function () {
            self.toasts = self.toasts.filter(function (t) { return t.id !== id; });
          }, 250);
        }, 2200);
      }
    }
  });
})();

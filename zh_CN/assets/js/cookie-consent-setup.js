/**
 * Cookie Consent Configuration
 * Documentation: https://cookieconsent.orestbida.com/
 *
 * GDPR-Compliant Approach:
 * - Analytics scripts use type="text/plain" data-category="analytics"
 * - The library blocks all marked scripts until user consents
 * - Scripts NEVER run until explicit consent is given
 * - Google Consent Mode is used for Google Analytics privacy mode before consent
 * - Other analytics (Cronitor, Pirsch, OpenPanel) are blocked until consent given
 *
 * Supported Analytics Providers:
 * - Cronitor RUM
 * - Google Analytics (GA4)
 * - OpenPanel Analytics
 * - Pirsch Analytics
 */

// Initialize Google Consent Mode BEFORE any tracking
// This tells Google services to operate in privacy mode until user consents
window.dataLayer = window.dataLayer || [];

// Reuse existing global gtag if it was already defined (e.g. by other GA scripts)
// to avoid redefining it multiple times when consent is granted.
if (typeof window.gtag !== 'function') {
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
}

// Local alias for convenience in this file
var gtag = window.gtag;
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied'
});

// Get translations from Jekyll data
var cookieConsentTranslations = {
  consentModal: {
    title: "我们使用 Cookie",
    description: "本网站使用 Cookie 以改善您的体验并分析网站流量。点击"全部接受"即表示您同意我们使用 Cookie。",
    acceptAllBtn: "全部接受",
    acceptNecessaryBtn: "全部拒绝",
    showPreferencesBtn: "管理个人偏好"
  },
  preferencesModal: {
    title: "管理 Cookie 偏好",
    acceptAllBtn: "全部接受",
    acceptNecessaryBtn: "全部拒绝",
    savePreferencesBtn: "接受当前选择",
    closeIconLabel: "关闭弹窗",
    sections: [
      {
        title: "Cookie 使用说明",
        description: "我们使用 Cookie 以确保网站的基本功能并提升您的在线体验。您可以随时选择是否接受各类 Cookie。"
      },
      {
        title: "必要 Cookie",
        description: "这些 Cookie 对于网站的正常运行至关重要。没有这些 Cookie，网站将无法正常工作。",
        linkedCategory: 'necessary'
      },
      {
        title: "分析 Cookie",
        description: "这些 Cookie 使我们能够衡量流量并分析您的行为，以改进我们的服务。",
        linkedCategory: 'analytics'
      },
      {
        title: "更多信息",
        description: "如有关于我们的 Cookie 政策和您的选择的任何问题，请<a class="cc-link" href="{{ site.url }}{{ site.baseurl }}/#contact">联系我们</a>。"
      }
    ]
  }
};

// Wait for the library to be available
var cookieConsentRetryCount = 0;
var COOKIE_CONSENT_MAX_RETRIES = 50; // 5 seconds max wait time

function initializeCookieConsent() {
  // Check if CookieConsent is available
  if (!window.CookieConsent) {
    if (cookieConsentRetryCount++ < COOKIE_CONSENT_MAX_RETRIES) {
      // Library not yet loaded, try again after a short delay
      setTimeout(initializeCookieConsent, 100);
    } else {
      console.error('CookieConsent library failed to load');
    }
    return;
  }

  window.CookieConsent.run({
    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      analytics: {}
    },

    language: {
      default: 'en',
      translations: {
        en: cookieConsentTranslations
      }
    },

    // Callback when user accepts/rejects consent
    onFirstConsent: function(consentData) {
      updateConsentMode(consentData);
    },

    // Callback when user changes preferences
    onChange: function(consentData) {
      updateConsentMode(consentData);
    }
  });

  /**
   * Update Google Consent Mode based on user preferences
   * This ensures Google services respect user choices
   */
  function updateConsentMode(consentData) {
    // Handle both callback data structures
    var categories = consentData.categories || consentData;

    // Ensure categories is an object
    if (!categories || typeof categories !== 'object') {
      console.warn('Invalid consent data structure:', consentData);
      return;
    }

    gtag('consent', 'update', {
      'analytics_storage': categories.analytics ? 'granted' : 'denied',
      'ad_storage': 'denied',
      'functionality_storage': 'denied',
      'personalization_storage': 'denied'
    });

    if (categories.analytics) {
      console.debug('✓ Analytics consent granted - tracking enabled for all providers');
      // Analytics scripts with data-category="analytics" will automatically run
      // when the library re-evaluates them after this consent update
    } else {
      console.debug('✗ Analytics consent denied - no tracking data collected');
      // Analytics scripts are already blocked by the library (type="text/plain")
      // No tracking will occur for:
      // - Cronitor RUM
      // - Google Analytics (GA4)
      // - OpenPanel Analytics
      // - Pirsch Analytics
    }
  }
}

// Initialize when the library is available
initializeCookieConsent();


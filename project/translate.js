// Immediately grab reference to the html element
const docEl = document.documentElement;

// 1) Define the global init callback for Google Translate
window.googleTranslateElementInit = function() {
  // Initialize the widget
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,hi,ta,te,bn,kn,mr,gu,pa,ur,ml',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  // 2) Reveal the page now that translation is ready
  docEl.style.visibility = '';
};

// 3) Toggle‐button logic (unchanged)
document.addEventListener('DOMContentLoaded', () => {
  const translateBtn = document.getElementById('translate-btn');
  const translateBox = document.getElementById('google_translate_element');

  if (translateBtn && translateBox) {
    translateBtn.addEventListener('click', e => {
      e.stopPropagation();
      translateBox.style.display = translateBox.style.display === 'block' ? 'none' : 'block';
    });
    document.body.addEventListener('click', e => {
      if (!e.target.closest('#translate-wrapper')) {
        translateBox.style.display = 'none';
      }
    });
    new MutationObserver(() => {
      translateBox.style.display = 'none';
    }).observe(document.body, { childList: true, subtree: true });
  }
});

// 4) Inject Google’s Translate script into <head> immediately
const s = document.createElement('script');
s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
document.head.appendChild(s);

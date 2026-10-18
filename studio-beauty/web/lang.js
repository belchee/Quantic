// Shows the section matching ?lang=sq|mk|en (default: Albanian) and keeps links in that language.
(function () {
  var supported = ['sq', 'mk', 'en'];
  var param = new URLSearchParams(location.search).get('lang');
  var lang = supported.indexOf(param) >= 0 ? param : 'sq';
  document.documentElement.lang = lang;
  document.querySelectorAll('section[lang]').forEach(function (el) {
    el.hidden = el.getAttribute('lang') !== lang;
  });
  document.querySelectorAll('nav.lang a').forEach(function (a) {
    a.setAttribute('aria-current', a.dataset.lang === lang ? 'true' : 'false');
  });
  document.querySelectorAll('a[data-keep-lang]').forEach(function (a) {
    a.href = a.getAttribute('href').split('?')[0] + '?lang=' + lang;
  });
})();

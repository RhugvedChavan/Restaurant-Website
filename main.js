document.addEventListener('DOMContentLoaded', function () {

  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (preloader) preloader.classList.add('is-hidden');
    }, 300);
  });
 

  setTimeout(function () {
    if (preloader) preloader.classList.add('is-hidden');
  }, 2000);


  var header = document.getElementById('siteHeader');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 40);
    if (backToTop) backToTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

 
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }


  var tabs = document.querySelectorAll('.menu-tab');
  var panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(function (panel) {
        var isMatch = panel.id === 'panel-' + target;
        panel.classList.toggle('is-active', isMatch);
        if (isMatch) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    });
  });


  var track = document.getElementById('testimonialTrack');
  var dotsWrap = document.getElementById('testimonialDots');

  if (track && dotsWrap) {
    var slides = Array.prototype.slice.call(track.querySelectorAll('.testimonial'));
    var current = 0;
    var timer;

    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        resetTimer();
      });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(current + 1); }, 5500);
    }

    goTo(0);
    resetTimer();
  }


  var form = document.getElementById('reserveForm');

  if (form) {
    var successMsg = document.getElementById('formSuccess');

    var validators = {
      fullName: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
      phone: function (v) { return /^[0-9+\-\s()]{7,15}$/.test(v.trim()) ? '' : 'Enter a valid phone number.'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.'; },
      date: function (v) {
        if (!v) return 'Please choose a date.';
        var chosen = new Date(v + 'T00:00:00');
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        return chosen >= today ? '' : 'Please choose a future date.';
      },
      time: function (v) { return v ? '' : 'Please choose a time.'; },
      guests: function (v) { return v ? '' : 'Please choose a party size.'; }
    };

    function showError(fieldName, message) {
      var input = form.querySelector('[name="' + fieldName + '"]');
      var errorEl = document.getElementById('err-' + fieldName);
      var fieldWrap = input.closest('.field');
      if (message) {
        fieldWrap.classList.add('has-error');
        errorEl.textContent = message;
      } else {
        fieldWrap.classList.remove('has-error');
        errorEl.textContent = '';
      }
    }

    // Set min date to today
    var dateInput = document.getElementById('date');
    if (dateInput) {
      var todayStr = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', todayStr);
    }

    // Live validation on blur
    Object.keys(validators).forEach(function (fieldName) {
      var input = form.querySelector('[name="' + fieldName + '"]');
      if (input) {
        input.addEventListener('blur', function () {
          showError(fieldName, validators[fieldName](input.value));
        });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      Object.keys(validators).forEach(function (fieldName) {
        var input = form.querySelector('[name="' + fieldName + '"]');
        var message = validators[fieldName](input.value);
        showError(fieldName, message);
        if (message) isValid = false;
      });

      if (!isValid) {
        var firstError = form.querySelector('.has-error input, .has-error select');
        if (firstError) firstError.focus();
        if (successMsg) successMsg.hidden = true;
        return;
      }

      // Simulate submission (no backend wired up — replace with a real endpoint)
      var submitBtn = form.querySelector('button[type="submit"] .btn-label');
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Confirming…';

      setTimeout(function () {
        submitBtn.textContent = originalLabel;
        if (successMsg) successMsg.hidden = false;
        form.reset();
      }, 700);
    });
  }

 
  var newsletterForm = document.getElementById('newsletterForm');
  var newsletterMsg = document.getElementById('newsletterMsg');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        if (newsletterMsg) newsletterMsg.hidden = false;
        newsletterForm.reset();
      }
    });
  }


  function placeholderDataUri(label) {
    var safeLabel = (label || 'Ember & Oak').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">' +
      '<rect width="100%" height="100%" fill="#241f19"/>' +
      '<circle cx="450" cy="400" r="34" fill="#c1440e"/>' +
      '<circle cx="450" cy="400" r="34" fill="#e86a2c" opacity="0.55"/>' +
      '<text x="450" y="480" font-family="Work Sans, sans-serif" font-size="26" ' +
      'fill="#c9bfae" text-anchor="middle">' + safeLabel + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function handleImgError() {
      img.removeEventListener('error', handleImgError);
      img.src = placeholderDataUri(img.getAttribute('alt'));
    });
  });

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});

/* ===================================================
   Casa da Limpeza — script principal
   =================================================== */

// ---------- Menu mobile ----------
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  var closeBtn = document.querySelector('.nav-close');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('is-open'); });
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { nav.classList.remove('is-open'); });
    }
  }
});

// ---------- Carrossel de produtos (banner com bolinhas, avança sozinho) ----------
(function () {
  var track = document.querySelector('.prod-slides');
  var dotsWrap = document.querySelector('.prod-dots');
  if (!track || !dotsWrap) return;

  var slides = track.querySelectorAll('.prod-slide');
  var current = 0;
  var timer;

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Ir para o slide ' + (i + 1));
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', function () { goTo(i); resetTimer(); });
    dotsWrap.appendChild(dot);
  });

  var dots = dotsWrap.querySelectorAll('button');

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 4500);
  }

  resetTimer();
})();

// ---------- Aviso de cookies ----------
(function () {
  var KEY = 'cdl-cookies-aceitos';
  var banner = document.getElementById('cookie-banner');
  var btn = document.getElementById('cookie-accept');
  if (!banner || !btn) return;

  var jaAceitou = false;
  try { jaAceitou = localStorage.getItem(KEY) === '1'; } catch (e) {}

  if (jaAceitou) {
    banner.remove();
    return;
  }

  btn.addEventListener('click', function () {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    banner.remove();
  });
})();

// ---------- Formulário de Orçamento (Web3Forms) ----------
(function () {
  var form = document.getElementById('form-orcamento');
  if (!form) return;

  var msg = document.getElementById('orcamento-msg');
  var submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form-msg';
    msg.textContent = '';

    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    var formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          msg.classList.add('ok');
          msg.textContent = 'Orçamento enviado! Nossa equipe entrará em contato em breve.';
          form.reset();
        } else {
          throw new Error(data.message || 'Falha no envio');
        }
      })
      .catch(function () {
        msg.classList.add('err');
        msg.textContent = 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });
})();

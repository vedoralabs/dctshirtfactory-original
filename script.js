// ----------------- helper: DOM ready (not required if script is at end of body) -----------------
document.addEventListener('DOMContentLoaded', () => {

  /* ========================= YEAR ========================= */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ========================= NAVBAR ========================= */
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      mobileMenu.classList.toggle("open");
    });
  }

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (navToggle && mobileMenu && !navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      navToggle.classList.remove("active");
      mobileMenu.classList.remove("open");
    }
  });


  /* ========================= PRODUCT CAROUSEL ========================= */
  const productTrack = document.getElementById("productsTrack");
  const productCards = document.querySelectorAll(".product-card");
  const prevArrow = document.getElementById("prevBtn");
  const nextArrow = document.getElementById("nextBtn");

  let pIndex = 0;

  function updateProductSlider() {
    if (!productCards || productCards.length === 0 || !productTrack) return;
    const cardWidth = productCards[0].offsetWidth;
    productTrack.style.transform = `translateX(-${pIndex * cardWidth}px)`;
  }

  if (nextArrow) {
    nextArrow.addEventListener("click", () => {
      pIndex = (pIndex + 1) % productCards.length;
      updateProductSlider();
    });
  }

  if (prevArrow) {
    prevArrow.addEventListener("click", () => {
      pIndex = (pIndex - 1 + productCards.length) % productCards.length;
      updateProductSlider();
    });
  }

  setInterval(() => {
    if (productCards.length > 0) {
      pIndex = (pIndex + 1) % productCards.length;
      updateProductSlider();
    }
  }, 10000);


  /* ========================= TESTIMONIAL SLIDER ========================= */
  const testimonials = document.querySelectorAll(".testimonial");
  const prevTestBtn = document.getElementById("prev-test");
  const nextTestBtn = document.getElementById("next-test");

  let tIndex = 0;
  let testimonialTimer;

  function showTestimonial(i) {
    if (!testimonials || testimonials.length === 0) return;
    testimonials.forEach(t => t.classList.remove("active"));
    testimonials[i].classList.add("active");
  }

  function nextTestimonial() {
    tIndex = (tIndex + 1) % testimonials.length;
    showTestimonial(tIndex);
    resetTestimonialTimer();
  }

  function prevTestimonial() {
    tIndex = (tIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(tIndex);
    resetTestimonialTimer();
  }

  if (nextTestBtn) nextTestBtn.addEventListener("click", nextTestimonial);
  if (prevTestBtn) prevTestBtn.addEventListener("click", prevTestimonial);

  function startTestimonialTimer() {
    testimonialTimer = setInterval(nextTestimonial, 6000);
  }

  function resetTestimonialTimer() {
    clearInterval(testimonialTimer);
    startTestimonialTimer();
  }

  if (testimonials.length > 0) startTestimonialTimer();


  /* ========================= WHATSAPP FORM HANDLER (this fixes your form) ========================= */
  const form = document.getElementById('whatsapp-form');
  const clearBtn = document.getElementById('clear-form');
  const phoneInput = document.getElementById('phone');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const WHATSAPP_PHONE = '918136867309'; // number in international format without + or leading 0 (India: 91 + number)

  function normalizePhone(value) {
    if (!value) return '';
    // remove spaces, dashes, brackets
    return value.replace(/[\s\-\(\)\+]/g, '');
  }

  function buildWhatsAppText({ name, phone, email, message }) {
    const lines = [];
    if (name) lines.push(`Name: ${name}`);
    if (phone) lines.push(`Phone: ${phone}`);
    if (email) lines.push(`Email: ${email}`);
    if (message) lines.push(`Order details:\n${message}`);
    lines.push('\n— Sent from D Creations website');
    return encodeURIComponent(lines.join('\n'));
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const rawPhone = phoneInput?.value || '';
      const phone = normalizePhone(rawPhone);
      const name = nameInput?.value?.trim() || '';
      const email = emailInput?.value?.trim() || '';
      const message = messageInput?.value?.trim() || '';

      // simple phone validation (India)
      if (!/^(91)?[6-9]\d{9}$/.test(phone) && !/^\d{7,15}$/.test(phone)) {
        alert('Please enter a valid phone / WhatsApp number (include country code if outside India).');
        phoneInput.focus();
        return;
      }

      // build whatsapp URL (wa.me works both mobile & desktop; api.whatsapp.com is OK too)
      const text = buildWhatsAppText({ name, phone, email, message });

      // Open chat with your business number, include customer's phone in the message for reference
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;

      // open in new tab/window
      window.open(whatsappUrl, '_blank');

      // Optional: show minimal feedback to user
      // e.g., disable submit button for a second to prevent double-click
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        setTimeout(() => submitBtn.disabled = false, 1500);
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (nameInput) nameInput.value = '';
      if (phoneInput) phoneInput.value = '';
      if (emailInput) emailInput.value = '';
      if (messageInput) messageInput.value = '';
    });
  }

  /* ========================= PRODUCT PAGE IMAGE CAROUSEL (if used) ========================= */
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');

  if (track && slides.length > 0) {
    let index = 0;
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    function updateImageCarousel() {
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    if (nextBtn)
      nextBtn.addEventListener('click', () => {
        index = (index + 1) % slides.length;
        updateImageCarousel();
      });

    if (prevBtn)
      prevBtn.addEventListener('click', () => {
        index = (index - 1 + slides.length) % slides.length;
        updateImageCarousel();
      });

    let startX = 0;
    track.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);

    track.addEventListener("touchend", (e) => {
      let endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextBtn && nextBtn.click();
      if (endX - startX > 50) prevBtn && prevBtn.click();
    });
  }

}); // end DOMContentLoaded

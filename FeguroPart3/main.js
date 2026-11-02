// Fegurð Salon — Part 3 JavaScript enhancements
// Features: current footer year, service search, accessible gallery lightbox,
// client-side form validation and email-client handoff.

document.addEventListener('DOMContentLoaded', function () {
  // Keep the copyright year current on every page.
  document.querySelectorAll('#year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Service search filters service rows and hides empty categories.
  var search = document.querySelector('#service-search');
  if (search) {
    var items = Array.from(document.querySelectorAll('.service-item'));
    var status = document.querySelector('#service-search-status');
    search.addEventListener('input', function () {
      var query = search.value.trim().toLocaleLowerCase();
      var visible = 0;
      items.forEach(function (item) {
        var match = item.textContent.toLocaleLowerCase().includes(query);
        item.hidden = !match;
        if (match) visible += 1;
      });
      document.querySelectorAll('.service-category').forEach(function (category) {
        category.hidden = !Array.from(category.querySelectorAll('.service-item')).some(function (item) { return !item.hidden; });
      });
      if (status) status.textContent = visible + (visible === 1 ? ' service found.' : ' services found.');
    });
  }

  // Accessible gallery lightbox: mouse, Enter/Space, Escape and close button.
  var lightbox = document.querySelector('#gallery-lightbox');
  if (lightbox) {
    var lightboxImage = document.querySelector('#lightbox-image');
    var lightboxCaption = document.querySelector('#lightbox-caption');
    var closeButton = lightbox.querySelector('.lightbox__close');
    var previousTrigger = null;
    function openLightbox(image) {
      previousTrigger = image;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
      else lightbox.setAttribute('open', '');
      closeButton.focus();
    }
    function closeLightbox() {
      if (typeof lightbox.close === 'function') lightbox.close();
      else lightbox.removeAttribute('open');
      if (previousTrigger) previousTrigger.focus();
    }
    document.querySelectorAll('.gallery img').forEach(function (image) {
      image.addEventListener('click', function () { openLightbox(image); });
      image.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(image); }
      });
    });
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeLightbox(); });
    lightbox.addEventListener('close', function () { if (previousTrigger) previousTrigger.focus(); });
  }

  // Form validation and email handoff. A static GitHub Pages site has no
  // server-side mail service; mailto opens the visitor's configured email app.
  document.querySelectorAll('form[data-form-type]').forEach(function (form) {
    var status = form.querySelector('[data-form-status]');
    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) { var today = new Date(); var localToday = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'); dateInput.min = localToday; }

    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () { field.setCustomValidity(''); });
      field.addEventListener('change', function () { field.setCustomValidity(''); });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        if (status) status.textContent = 'Please check the highlighted fields and complete the form correctly.';
        return;
      }
      var data = new FormData(form);
      var type = form.dataset.formType;
      var subject = type === 'enquiry' ? 'Fegurð Salon service enquiry' : 'Fegurð Salon contact message';
      var lines = [];
      data.forEach(function (value, key) { lines.push(key.replace(/([A-Z])/g, ' $1') + ': ' + value); });
      var body = lines.join('\n');
      if (type === 'enquiry') {
        var category = data.get('service') || 'your selected service';
        if (status) status.textContent = 'Thank you. Your ' + category + ' enquiry is ready. Your email application will open so you can review and send it.';
      } else if (status) {
        status.textContent = 'Thank you. Your message is ready. Your email application will open so you can review and send it.';
      }
      var mailto = 'mailto:hello@fegurdsalon.co.za?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  });
});

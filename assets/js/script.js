'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
if (testimonialsItem && testimonialsItem.length > 0) {
  for (let i = 0; i < testimonialsItem.length; i++) {

    const tItem = testimonialsItem[i];
    if (!tItem) continue;

    tItem.addEventListener("click", function () {
      if (modalImg && this.querySelector("[data-testimonials-avatar]")) {
        modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
        modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      }
      if (modalTitle && this.querySelector("[data-testimonials-title]")) modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      if (modalText && this.querySelector("[data-testimonials-text]")) modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

      testimonialsModalFunc();

    });

  }
}

// add click event to modal close button
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);


// ------------------ project modal functionality ------------------
document.addEventListener('DOMContentLoaded', () => {
  const projectList = document.querySelector('.project-list');
  const projectModalContainer = document.querySelector('[data-project-modal-container]');
  const projectModalCloseBtn = document.querySelector('[data-project-modal-close-btn]');
  const projectOverlay = document.querySelector('[data-project-overlay]');
  const projectModalImg = document.querySelector('[data-project-modal-img]');
  const projectModalTitle = document.querySelector('[data-project-modal-title]');
  const projectModalText = document.querySelector('[data-project-modal-text]');
  const projectModalTech = document.querySelector('[data-project-modal-tech]');
  const projectModalLink = document.querySelector('[data-project-modal-link]');

  if (!projectList || !projectModalContainer) return;

  // State for current project displayed in modal
  let _currentProjectIndex = -1;

  function getVisibleProjectItems() {
    // visible project items have class 'active'
    return Array.from(projectList.querySelectorAll('.project-item')).filter(it => it.classList.contains('active'));
  }

  function openProjectModal({ imgSrc, imgAlt, title, desc, href, tech, modalClass, modalHeight, modalAspect, explicitIndex }) {
    if (projectModalImg) {
      projectModalImg.src = imgSrc || '';
      projectModalImg.alt = imgAlt || title || '';
    }
    if (projectModalTitle) projectModalTitle.innerText = title || '';
    if (projectModalText) {
      const descEl = projectModalText.querySelector('.project-modal-desc');
      if (descEl) descEl.innerText = desc || '';
    }
    if (projectModalLink) projectModalLink.setAttribute('href', href || '#');
    // render tech chips
    if (projectModalTech) {
      projectModalTech.innerHTML = '';
      if (tech) {
        tech.split('|').map(t => t.trim()).filter(Boolean).forEach((t) => {
          const chip = document.createElement('span');
          chip.className = 'chip';
          chip.innerText = t;
          projectModalTech.appendChild(chip);
        });
      }
    }

    // Apply a per-project modal class if provided (e.g., modal--tobby)
    if (projectModalContainer) {
      const classes = Array.from(projectModalContainer.classList);
      classes.forEach((c) => { if (c.startsWith('modal--')) projectModalContainer.classList.remove(c); });
      if (modalClass) projectModalContainer.classList.add(modalClass);
      // Apply per-project modal sizing via CSS variables
      if (modalHeight) projectModalContainer.style.setProperty('--modal-media-height', modalHeight);
      else projectModalContainer.style.removeProperty('--modal-media-height');
      if (modalAspect) projectModalContainer.style.setProperty('--modal-media-aspect', modalAspect);
      else projectModalContainer.style.removeProperty('--modal-media-aspect');
      projectModalContainer.classList.add('active');
    }
    if (projectOverlay) projectOverlay.classList.add('active');
    if (projectModalCloseBtn) projectModalCloseBtn.focus();
    // set current index based on matching title/href (best-effort)
    if (typeof explicitIndex === 'number' && explicitIndex >= 0) {
      _currentProjectIndex = explicitIndex;
    } else {
      const items = getVisibleProjectItems();
      _currentProjectIndex = items.findIndex((it) => {
        const link = it.querySelector('a.project-link');
        const hrefVal = link ? (it.dataset.link || link.getAttribute('href')) : '';
        const titleEl = it.querySelector('.project-title');
        const titleVal = titleEl ? titleEl.innerText : '';
        return (href && hrefVal && hrefVal === href) || (title && titleVal && titleVal === title);
      });
    }
  }

  function closeProjectModal() {
    projectModalContainer.classList.remove('active');
    if (projectOverlay) projectOverlay.classList.remove('active');
  }

  function openProjectByIndex(idx) {
    const items = getVisibleProjectItems();
    if (!items || items.length === 0) return;
    const normalized = ((idx % items.length) + items.length) % items.length;
    const item = items[normalized];
    if (!item) return;
    const anchor = item.querySelector('a.project-link');
    const img = item.querySelector('img');
    const titleEl = item.querySelector('.project-title');
    const desc = item.dataset.description || (item.querySelector('.project-category') ? item.querySelector('.project-category').innerText : '');
    const tech = item.dataset.tech || '';
    const href = item.dataset.link || (anchor ? anchor.getAttribute('href') : '#');
    // Support alternate full-size modal image via data-modal-image / data-modal-alt on the project item
    const fullImg = item.dataset.modalImage || (img ? img.src : '');
    const fullAlt = item.dataset.modalAlt || (img ? img.alt : '');
    const modalClass = item.dataset.modalClass || '';
    const modalHeight = item.dataset.modalHeight || '';
    const modalAspect = item.dataset.modalAspect || '';
    _currentProjectIndex = normalized;
  openProjectModal({ imgSrc: fullImg, imgAlt: fullAlt, title: titleEl ? titleEl.innerText : '', desc, href, tech, modalClass, modalHeight, modalAspect, explicitIndex: normalized });
  }

  const nextBtn = projectModalContainer.querySelector('[data-project-modal-next-btn]');
  const prevBtn = projectModalContainer.querySelector('[data-project-modal-prev-btn]');
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      const items = getVisibleProjectItems();
      if (!items || items.length === 0) return;
      openProjectByIndex(_currentProjectIndex + 1);
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      const items = getVisibleProjectItems();
      if (!items || items.length === 0) return;
      openProjectByIndex(_currentProjectIndex - 1);
    });
  }

  // Keyboard support: Right arrow advances to next project when modal is open
  document.addEventListener('keydown', (ev) => {
    if (!projectModalContainer.classList.contains('active')) return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); openProjectByIndex(_currentProjectIndex + 1); }
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); openProjectByIndex(_currentProjectIndex - 1); }
  });

  // ...existing code...

  // Delegated click handler so it works even if items change.
  // Use openProjectByIndex to reliably set _currentProjectIndex for navigation.
  projectList.addEventListener('click', (e) => {
    const anchor = e.target.closest('.project-link');
    if (!anchor) return;
    e.preventDefault();
    const item = anchor.closest('.project-item');
    if (!item) return;
    const items = getVisibleProjectItems();
    const idx = items.indexOf(item);
    if (idx === -1) {
      // fallback: force item active, rebuild list; then compute index
      // (Should rarely happen unless filtering changed classes mid-click)
      openProjectModal({
        imgSrc: (item.dataset.modalImage || (item.querySelector('img') ? item.querySelector('img').src : '')),
        imgAlt: (item.dataset.modalAlt || (item.querySelector('img') ? item.querySelector('img').alt : '')),
        title: (item.querySelector('.project-title') ? item.querySelector('.project-title').innerText : ''),
        desc: item.dataset.description || '',
        href: item.dataset.link || anchor.getAttribute('href'),
        tech: item.dataset.tech || '',
        modalClass: item.dataset.modalClass || '',
        modalHeight: item.dataset.modalHeight || '',
        modalAspect: item.dataset.modalAspect || '',
        explicitIndex: 0
      });
      _currentProjectIndex = 0; // conservative default
    } else {
      openProjectByIndex(idx);
    }
  });

  if (projectModalCloseBtn) projectModalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectOverlay) projectOverlay.addEventListener('click', closeProjectModal);
  const projectModalCloseAlt = document.querySelector('[data-project-modal-close-btn-alt]');
  if (projectModalCloseAlt) projectModalCloseAlt.addEventListener('click', closeProjectModal);
  if (projectModalLink) {
    projectModalLink.addEventListener('click', function (ev) {
      // explicit open to avoid any interference with default anchor behavior
      ev.preventDefault();
      const href = projectModalLink.getAttribute('href');
      if (href && href !== '#') {
        window.open(href, '_blank');
      } else {
        console.warn('Project link is not set or is #');
      }
    });
  }
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeProjectModal(); });

  // Per-project card image sizing via data attributes applied as CSS variables
  if (projectList) {
    const allItems = Array.from(projectList.querySelectorAll('.project-item'));
    allItems.forEach((it) => {
      const wrap = it.querySelector('.project-img');
      if (!wrap) return;
      const aspect = it.dataset.cardAspect || '';
      const height = it.dataset.cardHeight || '';
      const maxH = it.dataset.cardMaxHeight || '';
      if (aspect) wrap.style.setProperty('--card-aspect', aspect);
      if (height) wrap.style.setProperty('--card-height', height);
      if (maxH) wrap.style.setProperty('--card-max-height', maxH);
    });
  }
});

// ------------------ blog / hobbies modal functionality ------------------
document.addEventListener('DOMContentLoaded', () => {
  const blogList = document.querySelector('.blog-posts-list');
  const blogModalContainer = document.querySelector('[data-blog-modal-container]');
  const blogOverlay = document.querySelector('[data-blog-overlay]');
  const blogCloseBtn = document.querySelector('[data-blog-modal-close-btn]');
  const blogModalImg = document.querySelector('[data-blog-modal-img]');
  const blogModalTitle = document.querySelector('[data-blog-modal-title]');
  const blogModalDesc = document.querySelector('[data-blog-modal-desc]');
  const blogModalCert = document.querySelector('[data-blog-modal-cert]');
  const blogNextBtn = document.querySelector('[data-blog-modal-next-btn]');
  const blogPrevBtn = document.querySelector('[data-blog-modal-prev-btn]');
  let _currentBlogIndex = -1;

  if (!blogList || !blogModalContainer) return;

  function openBlogModal({ imgSrc, imgAlt, title, desc, cert, certLabel, certIcon, index }) {
    if (blogModalImg) { blogModalImg.src = imgSrc || ''; blogModalImg.alt = imgAlt || title || ''; }
    if (blogModalTitle) blogModalTitle.textContent = title || '';
    if (blogModalDesc) blogModalDesc.textContent = desc || '';
    if (blogModalCert) {
      if (cert) {
        blogModalCert.setAttribute('href', cert);
        blogModalCert.style.display = '';
        // Optional customizations for label and icon
        const iconEl = blogModalCert.querySelector('ion-icon');
        const textEl = blogModalCert.querySelector('span');
        if (iconEl) iconEl.setAttribute('name', certIcon || 'download-outline');
        if (textEl) textEl.textContent = certLabel || 'Certificates';
      } else {
        blogModalCert.setAttribute('href', '#');
        blogModalCert.style.display = 'none';
      }
    }
    if (typeof index === 'number') _currentBlogIndex = index;
    blogModalContainer.classList.add('active');
    if (blogOverlay) blogOverlay.classList.add('active');
  }

  function closeBlogModal() {
    blogModalContainer.classList.remove('active');
    if (blogOverlay) blogOverlay.classList.remove('active');
  }

  const blogItems = Array.from(blogList.querySelectorAll('.blog-post-item'));

  blogList.addEventListener('click', (e) => {
    const card = e.target.closest('.blog-post-item');
    if (!card) return;
    const anchor = e.target.closest('a');
    if (anchor) e.preventDefault(); // prevent navigating away

    // Prefer data attributes if you decide to add later (data-title, data-desc)
  const img = card.querySelector('.blog-banner-box img');
    const titleEl = card.querySelector('.blog-item-title');
    const descEl = card.querySelector('.blog-text');

    // If CSS truncates text (line clamp), innerText will still have full content since it's in DOM
  const fullDesc = descEl ? descEl.textContent.trim() : '';
  const cert = (card.dataset.cert && card.dataset.cert.trim()) ? card.dataset.cert.trim() : '';
  const certLabel = (card.dataset.certLabel && card.dataset.certLabel.trim()) ? card.dataset.certLabel.trim() : '';
  const certIcon = (card.dataset.certIcon && card.dataset.certIcon.trim()) ? card.dataset.certIcon.trim() : '';

    const index = blogItems.indexOf(card);
    const fullImg = card.dataset.modalImage || (img ? img.getAttribute('src') : '');
    const fullAlt = card.dataset.modalAlt || (img ? img.getAttribute('alt') : '');
    openBlogModal({
      imgSrc: fullImg,
      imgAlt: fullAlt,
      title: titleEl ? titleEl.textContent.trim() : '',
      desc: fullDesc,
      cert,
      certLabel,
      certIcon,
      index
    });
  });

  function openBlogByIndex(idx) {
    if (!blogItems.length) return;
    const normalized = ((idx % blogItems.length) + blogItems.length) % blogItems.length;
    const card = blogItems[normalized];
    if (!card) return;
  const img = card.querySelector('.blog-banner-box img');
    const titleEl = card.querySelector('.blog-item-title');
    const descEl = card.querySelector('.blog-text');
  const fullDesc = descEl ? descEl.textContent.trim() : '';
  const cert = (card.dataset.cert && card.dataset.cert.trim()) ? card.dataset.cert.trim() : '';
  const certLabel = (card.dataset.certLabel && card.dataset.certLabel.trim()) ? card.dataset.certLabel.trim() : '';
  const certIcon = (card.dataset.certIcon && card.dataset.certIcon.trim()) ? card.dataset.certIcon.trim() : '';
    const fullImg = card.dataset.modalImage || (img ? img.getAttribute('src') : '');
    const fullAlt = card.dataset.modalAlt || (img ? img.getAttribute('alt') : '');
    openBlogModal({
      imgSrc: fullImg,
      imgAlt: fullAlt,
      title: titleEl ? titleEl.textContent.trim() : '',
      desc: fullDesc,
      cert,
      certLabel,
      certIcon,
      index: normalized
    });
  }

  if (blogNextBtn) blogNextBtn.addEventListener('click', () => { if (_currentBlogIndex !== -1) openBlogByIndex(_currentBlogIndex + 1); });
  if (blogPrevBtn) blogPrevBtn.addEventListener('click', () => { if (_currentBlogIndex !== -1) openBlogByIndex(_currentBlogIndex - 1); });

  document.addEventListener('keydown', (ev) => {
    if (!blogModalContainer.classList.contains('active')) return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); if (_currentBlogIndex !== -1) openBlogByIndex(_currentBlogIndex + 1); }
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); if (_currentBlogIndex !== -1) openBlogByIndex(_currentBlogIndex - 1); }
  });

  if (blogCloseBtn) blogCloseBtn.addEventListener('click', closeBlogModal);
  if (blogOverlay) blogOverlay.addEventListener('click', closeBlogModal);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeBlogModal(); });
  if (blogModalCert) {
    blogModalCert.addEventListener('click', (ev) => {
      const href = blogModalCert.getAttribute('href');
      if (!href || href === '#') { ev.preventDefault(); }
    });
  }
});



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  const isAll = selectedValue === "all";
  for (let i = 0; i < filterItems.length; i++) {
    const item = filterItems[i];
    if (isAll) {
      item.classList.add("active");
      continue;
    }
    const raw = (item.dataset.category || "").toLowerCase();
    // Allow multiple categories separated by comma or pipe
    const cats = raw.split(/[|,]/).map(s => s.trim()).filter(Boolean);
    if (cats.includes(selectedValue)) item.classList.add("active");
    else item.classList.remove("active");
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = (filterBtn && filterBtn.length > 0) ? filterBtn[0] : null;

for (let i = 0; filterBtn && i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const pages = Array.from(document.querySelectorAll("[data-page]"));

// add event to all nav link
navigationLinks.forEach((link) => {
  link.addEventListener("click", function () {
    const target = this.textContent.trim().toLowerCase();

    // Toggle pages
    pages.forEach((page) => {
      if (page.dataset.page === target) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });

    // Toggle nav link active state
    navigationLinks.forEach((l) => l.classList.toggle("active", l === this));

    window.scrollTo(0, 0);
  });
});

// experience-calculator.js

document.addEventListener("DOMContentLoaded", () => {

  function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = endDate === "present" ? new Date() : new Date(endDate);

  let startYear = start.getFullYear();
  let startMonth = start.getMonth(); // 0-indexed (Jan = 0)
  let endYear = end.getFullYear();
  let endMonth = end.getMonth();

  let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1; // +1 to make it inclusive

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let duration = "";
  if (years > 0) {
    duration += `${years} yr${years > 1 ? "s" : ""}`;
  }
  if (months > 0) {
    if (duration) duration += ", ";
    duration += `${months} mo${months > 1 ? "s" : ""}`;
  }
  return duration;
}


  function updateDurations() {
    const timelineItems = document.querySelectorAll(".timeline-item span[data-start-date]")
    timelineItems.forEach((item) => {
      const startDate = item.getAttribute("data-start-date")
      const endDate = item.getAttribute("data-end-date")
      const durationElement = item.querySelector(".duration")

      if (durationElement) {
        const duration = calculateDuration(startDate, endDate)
        durationElement.textContent = duration
      } else if (endDate === "present") {
        const duration = calculateDuration(startDate, "present")
        item.textContent = `${item.textContent.split("—")[0]}— Present • ${duration}`
      }
    })
  }

  // Initial update
  updateDurations()

  // Update durations every minute
  setInterval(updateDurations, 60000)
})


// toasttt

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-form]")
  const inputs = form.querySelectorAll("[data-form-input]")
  const submitBtn = form.querySelector("[data-form-btn]")
  const submitBtnText = submitBtn.querySelector("span")
  const toast = document.getElementById("toast")

  function checkFormValidity() {
    const isValid = Array.from(inputs).every((input) => input.value.trim() !== "")
    submitBtn.disabled = !isValid
  }

  inputs.forEach((input) => {
    input.addEventListener("input", checkFormValidity)
  })

  function showToast(message, isSuccess) {
    toast.innerHTML = `
            <div class="toast__icon">
                <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z" fill="#fff"></path>
                </svg>
            </div>
            <div class="toast__title">${message}</div>
            <div class="toast__close">
                <svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" fill="#fff"></path>
                </svg>
            </div>
        `
    toast.className = `toast ${isSuccess ? "success" : "error"} show`
    setTimeout(() => {
      toast.className = "toast"
    }, 3000)

    const closeBtn = toast.querySelector(".toast__close")
    closeBtn.addEventListener("click", () => {
      toast.className = "toast"
    })
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    submitBtn.disabled = true
    const originalText = submitBtnText.textContent
    submitBtnText.textContent = "Sending..."

    const formData = new FormData(form)
    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showToast("Message sent successfully!", true)
          form.reset()
          checkFormValidity()
        } else {
          showToast("Unable to send message! Please try again.", false)
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        showToast("Unable to send message! Please try again.", false)
      })
      .finally(() => {
        submitBtn.disabled = false
        submitBtnText.textContent = originalText
      })
  })
})

// Initialize single-row marquee by cloning the first group once
(function initMarquee() {
  document.querySelectorAll('.marquee').forEach(mq => {
    const track = mq.querySelector('.marquee__track');
    const groups = track.querySelectorAll('.marquee__group');
    if (groups.length >= 2 && groups[0].children.length && groups[1].children.length === 0) {
      // Clone the original group's content (the UL with icons)
      const clone = groups[0].cloneNode(true);
      // Strip aria/ids to avoid duplicates, and mark the clone as decorative
      clone.setAttribute('aria-hidden', 'true');
      // Replace empty second group with the cloned content
      track.replaceChild(clone, groups[1]);
    }
  });
})();


// --- Touch-only fixes: blur touched controls and pause marquees while touched ---
(function () {
  if (!('ontouchstart' in window)) return; // only run on touch-capable devices

  // Blur touched interactive elements so they don't stay visually 'pressed'
  document.addEventListener('touchend', function (ev) {
    try {
      var el = ev.target.closest && ev.target.closest('a, button, input, textarea, [role="button"], .form-btn, .nav-btn, .project-link');
      if (!el) return;
      setTimeout(function () {
        try { el.blur && el.blur(); } catch (e) {}
        if (el && el.style) el.style.transform = 'none';
      }, 0);
    } catch (err) { /* noop */ }
  }, { passive: true });

  // Pause marquees while user is touching them (so they behave like hover-pause)
  var marquees = document.querySelectorAll('.marquee[data-pause]');
  marquees.forEach(function (m) {
    m.addEventListener('touchstart', function () { m.classList.add('is-paused'); }, { passive: true });
    m.addEventListener('touchend', function () { setTimeout(function () { m.classList.remove('is-paused'); }, 80); }, { passive: true });
    m.addEventListener('touchcancel', function () { m.classList.remove('is-paused'); }, { passive: true });
  });

  // Clear focus when user scrolls away (prevents sticky focus after scroll)
  var scrollClear;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollClear);
    scrollClear = setTimeout(function () {
      try { document.activeElement && document.activeElement.blur(); } catch (e) {}
    }, 120);
  }, { passive: true });

})();











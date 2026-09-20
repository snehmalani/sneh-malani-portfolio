(function () {
  "use strict";

  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");
  var year = document.getElementById("year");
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    siteNav.addEventListener("click", function (event) {
      var target = event.target;
      if (target && target.tagName === "A") {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".site-nav a[href^='#']");

  function setActiveNav() {
    var marker = window.scrollY + 130;
    var current = "";
    var i;
    for (i = 0; i < sections.length; i += 1) {
      if (sections[i].offsetTop <= marker) {
        current = sections[i].id;
      }
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 12) {
      if (sections.length > 0) {
        current = sections[sections.length - 1].id;
      }
    }
    for (i = 0; i < navLinks.length; i += 1) {
      var href = navLinks[i].getAttribute("href");
      if (current && href === "#" + current) {
        navLinks[i].setAttribute("aria-current", "true");
      } else {
        navLinks[i].removeAttribute("aria-current");
      }
    }
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  var header = document.querySelector(".site-header");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollToPageTop(event) {
    if (event) {
      event.preventDefault();
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  }

  var backToTop = document.getElementById("back-to-top");
  var homeLink = document.querySelector(".logo");
  if (backToTop) {
    backToTop.addEventListener("click", scrollToPageTop);
  }
  if (homeLink) {
    homeLink.addEventListener("click", scrollToPageTop);
  }

  function setHeaderState() {
    if (!header) {
      return;
    }
    if (window.scrollY > 10) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  if (!reduceMotion) {
    document.documentElement.classList.add("motion-on");
    var reveals = document.querySelectorAll(".section-head, .company, .app-card, .skill-panels > article, .split > .card, .contact-list, .contact-form");
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        var n;
        for (n = 0; n < entries.length; n += 1) {
          if (entries[n].isIntersecting) {
            entries[n].target.classList.add("is-visible");
            observer.unobserve(entries[n].target);
          }
        }
      }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
      var r;
      for (r = 0; r < reveals.length; r += 1) {
        reveals[r].classList.add("reveal");
        observer.observe(reveals[r]);
      }
    }
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function sanitizeLine(value) {
    return String(value || "").replace(/[\r\n]+/g, " ").trim();
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var nameInput = document.getElementById("name");
      var emailInput = document.getElementById("email");
      var messageInput = document.getElementById("message");
      if (!nameInput || !emailInput || !messageInput || !statusEl) {
        return;
      }

      var name = sanitizeLine(nameInput.value);
      var email = sanitizeLine(emailInput.value);
      var message = String(messageInput.value || "").trim();

      if (!name || !email || !message) {
        statusEl.className = "form-status";
        statusEl.textContent = "Please fill in your name, email, and message.";
        return;
      }
      if (!isEmail(email)) {
        statusEl.className = "form-status";
        statusEl.textContent = "Please enter a valid email address.";
        return;
      }

      var subject = encodeURIComponent("Portfolio inquiry from " + name);
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\n\n" + message
      );
      window.location.href = "mailto:snehmalani124@gmail.com?subject=" + subject + "&body=" + body;
      statusEl.className = "form-status ok";
      statusEl.textContent = "Your email app should open. If it does not, write to snehmalani124@gmail.com.";
    });
  }
})();

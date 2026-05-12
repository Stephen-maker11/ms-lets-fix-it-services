const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const year = document.getElementById("year");
const header = document.querySelector(".site-header");
const contactForm = document.querySelector(".contact-form");

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeMenu() {
  document.body.classList.remove("nav-open");
  mainNav.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

function updateHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

document.querySelectorAll(".brand-logo").forEach((logo) => {
  logo.addEventListener("error", () => {
    logo.style.display = "none";
  });
});

const revealTargets = document.querySelectorAll(
  ".section-heading, .service-card, .trust-card, .about-copy, .workshop-visual, .why-item, .contact-details, .contact-form"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

function encodeFormData(formData) {
  return new URLSearchParams(formData).toString();
}

function setFormStatus(statusElement, message, tone) {
  statusElement.textContent = message;
  statusElement.classList.remove("success", "error");

  if (tone) {
    statusElement.classList.add(tone);
  }
}

if (contactForm) {
  const submitButton = contactForm.querySelector(".form-button");
  const statusElement = contactForm.querySelector(".form-status");
  const defaultButtonText = submitButton.textContent;

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormStatus(statusElement, "", "");

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      setFormStatus(statusElement, "Please complete all required fields before sending.", "error");
      return;
    }

    const formData = new FormData(contactForm);

    if (formData.get("bot-field")) {
      setFormStatus(statusElement, "Thanks, your enquiry has been received.", "success");
      contactForm.reset();
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
    submitButton.textContent = "Sending...";
    setFormStatus(statusElement, "Sending your enquiry to letsfixitservices@gmail.com...", "");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: encodeFormData(formData)
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      contactForm.reset();
      setFormStatus(statusElement, "Thanks, your enquiry has been sent. We will get back to you soon.", "success");
    } catch (error) {
      setFormStatus(statusElement, "Sorry, the enquiry could not be sent. Please call 083 735 9588 or email letsfixitservices@gmail.com.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      submitButton.textContent = defaultButtonText;
    }
  });
}


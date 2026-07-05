const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const lastUpdated = document.querySelector("#lastUpdated");
const formatUpdatedAt = (dateText) => {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Shanghai",
    hour12: false,
  }).format(date);
};

const setLastUpdated = (dateText) => {
  if (!lastUpdated) return;
  const formattedDate = formatUpdatedAt(dateText);
  if (!formattedDate) return;
  lastUpdated.dateTime = dateText;
  lastUpdated.textContent = `${formattedDate}（北京时间）`;
};

if (lastUpdated) {
  setLastUpdated(lastUpdated.dataset.fallback);

  fetch("https://api.github.com/repos/hongweiniu/hongweiniu.github.io", {
    headers: {
      Accept: "application/vnd.github+json",
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("GitHub update time is unavailable.");
      return response.json();
    })
    .then((repo) => {
      if (repo.pushed_at) setLastUpdated(repo.pushed_at);
    })
    .catch(() => {});
}

const heroCopy = document.querySelector(".hero-copy");
const aboutSection = document.querySelector("#about");
const aboutParagraph = aboutSection?.querySelector(".prose p");

if (heroCopy && aboutSection && aboutParagraph) {
  const heroSection = heroCopy.closest(".hero");
  const heroIntro = document.createElement("p");
  heroIntro.className = "hero-intro";
  heroIntro.textContent = aboutParagraph.textContent.trim().replace(/\s+/g, " ");
  heroCopy.appendChild(heroIntro);

  aboutSection.removeAttribute("id");
  aboutSection.hidden = true;
  if (heroSection) heroSection.id = "about";
}

const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`,
          );
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0.01,
    },
  );

  sections.forEach((section) => observer.observe(section));
}

const lightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
const galleryTriggers = Array.from(document.querySelectorAll(".gallery-trigger"));

const closeLightbox = () => {
  if (!lightbox || lightbox.hidden) return;
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  if (lightboxImage) {
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
  }
};

const openLightbox = (trigger) => {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  const image = trigger.querySelector("img");
  if (!image) return;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = trigger.dataset.caption || image.alt;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  if (lightboxClose) lightboxClose.focus();
};

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openLightbox(trigger));
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightboxBackdrop) {
  lightboxBackdrop.addEventListener("click", closeLightbox);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

import "./style.css";
import { createTargetCursor } from "./target-cursor.js";

/* ============================================================
   CHARIEL — PORTFOLIO STAR CHART
   ------------------------------------------------------------
   ARCHITECTURE NOTE (read this before editing)
   ------------------------------------------------------------
   The previous version of this site was a "world swap" SPA:
   only one full-screen section existed in the DOM at a time,
   and moving between sections meant destroying the old one and
   building a new one behind a ~1.2s transition screen.

   That's gone. This version renders all six sections once, in
   document order, on a single continuously-scrollable page.
   The "universe" concept survives as:

     - a fixed side nav that behaves like a star map: it always
       shows where you are (scrollspy) and lets you jump
       anywhere instantly (smooth scroll + real #hash routing)
     - a single reveal animation per section, played once, the
       first time it enters the viewport (IntersectionObserver)
     - the visual language (gold accents, serif display type,
       starfield, orbit lines) carried over from the original

   Why this is better for a portfolio specifically:
     - real, shareable, bookmarkable URLs per section (#projects)
     - working browser back/forward
     - a recruiter can scroll the whole thing in ~15s instead of
       clicking through six blocking transitions
     - nothing is ever hidden behind an animation — everything
       exists in the DOM at once for search / accessibility tools
   ============================================================ */

const app = document.querySelector("#app");

/* ============================================================
   SECTION / NAV DATA
   ------------------------------------------------------------
   Single source of truth for the star-map nav, the scrollspy,
   and the mobile drawer. Add a new world by adding an entry
   here AND a matching <section id="..."> in the markup below.
   ============================================================ */

const SECTIONS = [
  { id: "home", number: "01", label: "Home" },
  { id: "about", number: "02", label: "About" },
  { id: "projects", number: "03", label: "Projects" },
  { id: "experience", number: "04", label: "Experience" },
  { id: "skills", number: "05", label: "Skills" },
  { id: "contact", number: "06", label: "Contact" },
];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ============================================================
   PROJECT DATA
   ------------------------------------------------------------
   Add a project by pushing another object here — the card,
   the expand/collapse behaviour, and the tag rendering all
   pick it up automatically. Replace the placeholder links
   and descriptions with the real ones.
   ============================================================ */

const PROJECTS = [
  {
    id: "portfolio-universe",
    index: "01",
    title: "Portfolio Universe",
    category: "Web experience",
    status: "Live",
    role: "Design & development",
    stack: ["JavaScript", "Vite", "CSS"],
    summary:
      "This site — a scroll-based interactive portfolio built around a star-chart navigation concept instead of a traditional resume page.",
    details:
      "Built the whole thing from a blank Vite + vanilla JS scaffold: layout, scrollspy navigation, reveal-on-scroll choreography, and the responsive/accessibility pass. Rebuilt once already after an early version relied on full-screen transitions that slowed down navigation.",
    github: "#",
    demo: "#",
  },
  {
    id: "data-exploration",
    index: "02",
    title: "Data Exploration",
    category: "Statistics",
    status: "Coursework",
    role: "Analysis",
    stack: ["Python", "Pandas", "SPSS"],
    summary:
      "Exploring a dataset end to end — cleaning, distribution checks, and relationships between variables — to practice statistical reasoning outside the classroom.",
    details:
      "Covers exploratory data analysis, hypothesis checks, and visualization of relationships in the dataset. A good example of how the Statistics side of the double degree shows up in practice.",
    github: "#",
    demo: "",
  },
  {
    id: "next-mission",
    index: "03",
    title: "Next project",
    category: "In development",
    status: "Building",
    role: "TBD",
    stack: [],
    summary:
      "Currently scoping the next project — details will land here once it's further along.",
    details: "",
    github: "",
    demo: "",
  },
];

/* ============================================================
   SKILLS DATA
   ------------------------------------------------------------
   Deliberately no percentages — those are unverifiable and
   were flagged as a UX problem. Skills are grouped by category
   with a plain qualitative note instead.
   ============================================================ */

const SKILL_GROUPS = [
  {
    title: "Languages & tools",
    note: "Used regularly in coursework and projects",
    tags: ["JavaScript", "Python", "SQL", "Git", "VS Code"],
  },
  {
    title: "Data & statistics",
    note: "Core to the Statistics half of the degree",
    tags: [
      "Regression analysis",
      "Statistical inference",
      "Data visualization",
      "SPSS",
    ],
  },
  {
    title: "Systems & infrastructure",
    note: "From current coursework",
    tags: ["Database design", "Networking basics", "Cloud fundamentals"],
  },
  {
    title: "Currently learning",
    note: "Actively building toward",
    tags: ["Bioinformatics", "Machine learning workflows"],
  },
];

/* ============================================================
   EXPERIENCE DATA
   ============================================================ */

const EXPERIENCE = [
  {
    period: "Ongoing",
    org: "HIMSTAT BINUS",
    role: "HRD & Counselling / Equipment & Logistics Coordinator",
    body: "Support the Statistics student association across two roles: member development and counselling on the HRD side, and planning and running the equipment and logistics behind association events.",
  },
  {
    period: "Ongoing",
    org: "BINUS University",
    role: "Computer Science × Statistics, first year",
    body: "Coursework spans regression analysis, machine learning, database systems, networking and cloud computing, and bioinformatics — a deliberate combination of building systems and understanding data.",
  },
  {
    period: "Next",
    org: "Open",
    role: "Looking for the next step",
    body: "Currently exploring internships and project collaborations where the CS × Statistics combination is useful.",
  },
];

/* ============================================================
   APPLICATION STATE
   ============================================================ */

let activeSection = "home";
let isMobileNavOpen = false;

/* ============================================================
   MARKUP HELPERS
   ============================================================ */

function navLink(section, extraClass = "") {
  return `
    <a
      class="side-link${extraClass}"
      href="#${section.id}"
      data-section="${section.id}"
      aria-current="${section.id === "home" ? "page" : "false"}"
    >
      <span class="nav-number">${section.number}</span>
      <span class="nav-label">${section.label}</span>
    </a>
  `;
}

function tag(text) {
  return `<span class="tag">${text}</span>`;
}

/* ============================================================
   SECTION RENDERERS
   ============================================================ */

function renderHome() {
  return `
    <section id="home" class="world home-world" aria-label="Home">
      <div class="home-background-word" aria-hidden="true"></div>

      <div class="home-grid">

        <div class="home-copy">
          <p class="eyebrow">Portfolio</p>

          <h1>Chariel<br />Caniago</h1>

          <p class="hero-title">The Data Blazer</p>

          <p class="discipline">Computer Science <span>×</span> Statistics</p>

          <p class="intro">
            First-year student at BINUS University, building software and
            reading data as two sides of the same problem.
          </p>

          <a class="cta-button" href="#projects" data-section="projects">
            <span>See the work</span>
            <span class="cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <div class="character" aria-hidden="true">

  <div class="lightcone-stage">

    <!-- =====================================================
         LIGHT CONE AURA
         Creates the soft blue / violet / gold glow behind
         the card.
         ===================================================== -->
    <div class="lightcone-aura"></div>

    <!-- =====================================================
         LIGHT CONE 3D RIG
         This is the element that rotates when the mouse moves.
         ===================================================== -->
    <div class="lightcone" data-lightcone>

      <!-- Back layers create the thickness of the card -->
      <div class="lightcone-depth"></div>

      <div class="lightcone-shadow-2"></div>

      <!-- ===================================================
           FRONT CARD
           =================================================== -->
      <div
        class="lightcone-card"
        data-lightcone-card
      >

        <!-- Artwork / placeholder -->
        <div class="lightcone-art-placeholder">

          <!-- Small symbol above the name -->
          <div class="placeholder-symbol">
            ✦
          </div>

          <!-- Main name -->
          <span class="lightcone-name">
            CHARIEL
          </span>

          <!-- Subtitle -->
          <small class="lightcone-caption">
            LIGHT CONE
          </small>

        </div>

        <!-- Cool blue rim lighting -->
        <div class="lightcone-rim"></div>

        <!-- Cursor-controlled glass reflection -->
        <div class="lightcone-shine"></div>

        <!-- Inner gold border -->
        <div class="lightcone-inner-frame"></div>

        <!-- Outer border -->
        <div class="lightcone-frame"></div>

        <!-- Bottom-left emblem -->
        <div class="lightcone-emblem">

          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 8
                 L23.5 17
                 L32 20
                 L23.5 23
                 L20 32
                 L16.5 23
                 L8 20
                 L16.5 17
                 Z"
              stroke="currentColor"
              stroke-width="1.4"
              fill="none"
            />
          </svg>

        </div>

        <!-- =================================================
             FIVE STAR RARITY
             ================================================= -->
        <div class="lightcone-rarity">

          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>

        </div>

      </div>

      <!-- Reflection underneath -->
      <div class="lightcone-reflection"></div>

      <!-- Light projected onto the floor -->
      <div class="lightcone-floor-light"></div>

    </div>

    <!-- Small floating particles -->
    <div class="lightcone-particles">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>

  </div>


</div>

        <aside class="profile" aria-label="Quick facts">
          <h2>At a glance</h2>
          <div class="profile-divider"></div>

          <div class="profile-item">
            <span>School</span>
            <strong>BINUS University</strong>
          </div>
          <div class="profile-item">
            <span>Program</span>
            <strong>Computer Science × Statistics</strong>
          </div>
          <div class="profile-item">
            <span>Role</span>
            <strong>HIMSTAT BINUS — HRDC / Equipment &amp; Logistics</strong>
          </div>
          <div class="profile-item">
            <span>Status</span>
            <strong>Open to internships &amp; collaborations</strong>
          </div>
        </aside>

      </div>

      <div class="scroll-hint" aria-hidden="true">
        <span>Scroll</span>
        <span class="scroll-line"></span>
      </div>
    </section>
  `;
}

function renderAbout() {
  return `
    <section id="about" class="world about-world" aria-label="About">
      <div class="section-header">
        <p class="eyebrow">02 — About</p>
        <h2>Who I am</h2>
      </div>

      <div class="about-grid">
        <p class="lead">
          I live between two worlds: <em>building systems</em> and
          <em>understanding data.</em>
        </p>

        <div class="about-body">
          <p>
            I'm a Computer Science × Statistics student who enjoys turning
            messy, open-ended questions into structured problems — and then
            actually solving them, not just describing them.
          </p>
          <p>
            Whether that's writing code, analyzing a dataset, or working
            with a team on a shared deadline, I like figuring out how
            individual pieces fit into something that actually works end
            to end.
          </p>

          <div class="fact-grid">
            <div class="cursor-target">
              <span>Approach</span>
              <strong>Analytical, curious</strong>
            </div>
            <div class="cursor-target">
              <span>Focus</span>
              <strong>Data + software</strong>
            </div>
            <div class="cursor-target">
              <span>Right now</span>
              <strong>Building a portfolio &amp; project base</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderProjects() {
  return `
    <section id="projects" class="world projects-world" aria-label="Projects">
      <div class="section-header">
        <p class="eyebrow">03 — Projects</p>
        <h2>Selected work</h2>
        <p class="section-note">Click a project to read more.</p>
      </div>

      <div class="project-list">
        ${PROJECTS.map(renderProjectCard).join("")}
      </div>
    </section>
  `;
}

function renderProjectCard(project) {
  const hasDetails = Boolean(project.details);
  const links = [
    project.github
      ? `<a href="${project.github}" class="project-link">GitHub ↗</a>`
      : "",
    project.demo
      ? `<a href="${project.demo}" class="project-link">Live demo ↗</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <article class="project-card">
      <button
        class="project-summary cursor-target"
        data-project="${project.id}"
        aria-expanded="false"
        ${hasDetails ? "" : "disabled"}
      >
        <span class="project-index">${project.index}</span>

        <span class="project-heading">
          <span class="project-category">${project.category}</span>
          <span class="project-title">${project.title}</span>
          <span class="project-summary-text">${project.summary}</span>
        </span>

        <span class="project-status">${project.status}</span>

        ${hasDetails ? '<span class="project-toggle" aria-hidden="true">+</span>' : ""}
      </button>

      ${
        hasDetails
          ? `
        <div class="project-details" id="details-${project.id}" hidden>
          <p>${project.details}</p>
          <div class="project-meta">
            <span><strong>Role:</strong> ${project.role}</span>
            ${project.stack.length ? `<span class="project-tags">${project.stack.map(tag).join("")}</span>` : ""}
          </div>
          ${links ? `<div class="project-links">${links}</div>` : ""}
        </div>
      `
          : ""
      }
    </article>
  `;
}

function renderExperience() {
  return `
    <section id="experience" class="world experience-world" aria-label="Experience">
      <div class="section-header">
        <p class="eyebrow">04 — Experience</p>
        <h2>Where I've been</h2>
      </div>

      <ol class="timeline">
        ${EXPERIENCE.map(
          (item) => `
          <li class="timeline-item cursor-target">
            <div class="timeline-marker" aria-hidden="true"></div>
            <span class="timeline-period">${item.period}</span>
            <h3>${item.org}</h3>
            <p class="timeline-role">${item.role}</p>
            <p>${item.body}</p>
          </li>
        `,
        ).join("")}
      </ol>
    </section>
  `;
}

function renderSkills() {
  return `
    <section id="skills" class="world skills-world" aria-label="Skills">
      <div class="section-header">
        <p class="eyebrow">05 — Skills</p>
        <h2>What I work with</h2>
      </div>

      <div class="skills-grid">
        ${SKILL_GROUPS.map(
          (group) => `
          <div class="skill-group cursor-target">
            <h3>${group.title}</h3>
            <p class="skill-note">${group.note}</p>
            <div class="skill-tags">
              ${group.tags.map(tag).join("")}
            </div>
          </div>
        `,
        ).join("")}
      </div>
    </section>
  `;
}

function renderContact() {
  return `
    <section id="contact" class="world contact-world" aria-label="Contact">
      <div class="contact-layout">
        <div class="contact-intro">
          <p class="eyebrow">06 — Contact</p>
          <h2>Let's talk</h2>
          <p>
            The fastest way to reach me is email. I'm open to internships,
            collaborations, and just talking about interesting problems.
          </p>
        </div>

        <div class="contact-card">
          <a class="email cursor-target" href="mailto:hello@example.com">hello@example.com</a>
          <p class="contact-note">Replace with your real address before publishing.</p>

          <div class="contact-links">
            <a class="cursor-target" href="#" aria-label="LinkedIn">LinkedIn ↗</a>
            <a class="cursor-target" href="#" aria-label="GitHub">GitHub ↗</a>
            <a class="cursor-target" href="#" aria-label="Instagram">Instagram ↗</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

/* ============================================================
   PAGE SHELL
   ============================================================ */

app.innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>

  <div class="portfolio">

    <!--
      WORLD ENVIRONMENT
      ----------------------------------------------------------
      The cinematic celestial-architecture image is the actual
      environment now, not a decorative wallpaper. It sits behind
      everything as a fixed layer; .world-bg-overlay darkens it
      just enough for text to stay readable without hiding it —
      see the gradient comments in style.css for how that's tuned.
    -->
    <div class="world-bg" aria-hidden="true"></div>
    <div class="world-bg-overlay" aria-hidden="true"></div>

    <div class="starfield" aria-hidden="true">
      <div class="star-layer star-layer-far"></div>
      <div class="star-layer star-layer-mid"></div>
      <div class="star-layer star-layer-near"></div>
    </div>
    <div class="comet" aria-hidden="true"></div>

    <header class="topbar">
      <a class="logo" href="#home" data-section="home">
        <span class="logo-symbol" aria-hidden="true">✦</span>
        <span class="logo-text">
          <span class="logo-name">Chariel</span>
          <span class="logo-subtitle">Caniago</span>
        </span>
      </a>

      <button
        class="menu-button"
        id="menuButton"
        aria-label="Open navigation menu"
        aria-expanded="false"
        aria-controls="mobileNav"
      >
        <span></span><span></span><span></span>
      </button>
    </header>

    <nav class="side-navigation" aria-label="Section navigation">
      <div class="side-navigation-line" aria-hidden="true"></div>
      <div class="side-navigation-progress" id="navProgress" aria-hidden="true"></div>
      ${SECTIONS.map((s) => navLink(s)).join("")}
    </nav>

    <nav
      class="mobile-nav"
      id="mobileNav"
      aria-label="Mobile section navigation"
    >
      ${SECTIONS.map((s) => navLink(s, " mobile")).join("")}
    </nav>

    <main id="main">
      ${renderHome()}
      ${renderAbout()}
      ${renderProjects()}
      ${renderExperience()}
      ${renderSkills()}
      ${renderContact()}
    </main>

  </div>
`;

/* ============================================================
   DOM REFERENCES
   ============================================================ */

const menuButton = document.querySelector("#menuButton");
const mobileNav = document.querySelector("#mobileNav");
const allNavLinks = document.querySelectorAll("[data-section]");
const allSections = document.querySelectorAll("main > section");

/* ============================================================
   SMOOTH-SCROLL NAVIGATION
   ------------------------------------------------------------
   Every link with data-section intercepts its click, updates
   the URL hash (so the address bar / back button stay real),
   and scrolls smoothly to the target section.
   ============================================================ */

allNavLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.dataset.section;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    closeMobileNav();

    history.pushState(null, "", `#${id}`);

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
});

/* Handle a hash already in the URL on first load (deep link). */
if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) {
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }
}

/* ============================================================
   SCROLLSPY
   ------------------------------------------------------------
   Highlights the nav item for whichever section currently
   occupies the middle of the viewport. This is the "star map"
   behaviour — it always shows where you are.
   ============================================================ */

const scrollSpyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
);

allSections.forEach((section) => scrollSpyObserver.observe(section));

function setActiveSection(id) {
  if (id === activeSection) return;
  activeSection = id;

  allNavLinks.forEach((link) => {
    const isActive = link.dataset.section === id;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

/* ============================================================
   NAV SCROLL-PROGRESS ("route traveled" indicator)
   ------------------------------------------------------------
   Fills the side-navigation line downward as the page scrolls,
   with a small glowing marker (a CSS ::after on the fill) that
   travels along the line. Reinforces the star-map metaphor —
   the line isn't just decoration, it now shows how far along
   the route you are.
   ============================================================ */

const navLine = document.querySelector(".side-navigation-line");
const navProgress = document.querySelector("#navProgress");

if (navLine && navProgress) {
  let trackHeight = navLine.offsetHeight;
  let ticking = false;

  const recalcTrackHeight = () => {
    trackHeight = navLine.offsetHeight;
  };

  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    const clamped = Math.min(1, Math.max(0, progress));

    navProgress.style.height = `${trackHeight * clamped}px`;

    /* Light up each nav "star" once its section has been reached,
       and keep it lit even after scrolling past it — this is what
       builds the constellation up over the course of the visit. */
    allSections.forEach((section) => {
      const reached = section.offsetTop <= window.scrollY + window.innerHeight * 0.5;
      document
        .querySelectorAll(`[data-section="${section.id}"]`)
        .forEach((link) => {
          link.classList.toggle("visited", reached);
        });
    });

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    recalcTrackHeight();
    updateProgress();
  });

  /* Initial paint (covers loading mid-page via a deep link). */
  updateProgress();
}

/* ============================================================
   REVEAL ON SCROLL
   ------------------------------------------------------------
   Each section plays a single, quiet entrance animation the
   first time it becomes visible, then stops watching it. This
   replaces the old per-navigation transition screen — the
   "cinematic" moment now happens once per section, not once
   per click.
   ============================================================ */

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  allSections.forEach((section) => revealObserver.observe(section));
} else {
  /* Reduced motion: show everything immediately, no animation. */
  allSections.forEach((section) => section.classList.add("is-visible"));
}

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */

function openMobileNav() {
  isMobileNavOpen = true;
  mobileNav.classList.add("is-open");
  menuButton.classList.add("is-open");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close navigation menu");
}

function closeMobileNav() {
  if (!isMobileNavOpen) return;
  isMobileNavOpen = false;
  mobileNav.classList.remove("is-open");
  menuButton.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
}

menuButton.addEventListener("click", () => {
  isMobileNavOpen ? closeMobileNav() : openMobileNav();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileNav();
});

/* ============================================================
   PROJECT CARD EXPAND / COLLAPSE
   ============================================================ */

document.querySelectorAll(".project-summary").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.project;
    const details = document.getElementById(`details-${id}`);
    if (!details) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isOpen));
    details.hidden = isOpen;
    button.closest(".project-card").classList.toggle("is-open", !isOpen);
  });
});

/* ============================================================
   CURSOR-PARALLAX STARFIELD + COMET
   ------------------------------------------------------------
   This is the one deliberately "extra" interactive moment on
   the site — everything else is kept quiet on purpose, so this
   is where that budget gets spent.

   Two pieces:
     1. Parallax — the three star layers drift slightly opposite
        the cursor, each at a different depth, so the sky reads
        as three-dimensional rather than a flat printed texture.
     2. Comet — an occasional streak crosses the sky at a random
        position and angle, on a random interval, purely
        decorative and never blocking content.

   Both are skipped entirely for reduced-motion users and for
   touch devices (no cursor to react to, and the comet alone is
   enough motion on a phone).
   ============================================================ */

const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
const starLayers = document.querySelectorAll(".star-layer");
const comet = document.querySelector(".comet");

if (!prefersReducedMotion && hasFinePointer && starLayers.length) {
  /* Depth: far layer barely moves, near layer moves the most. */
  const DEPTHS = [6, 14, 26]; // px of max travel, far -> near

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  window.addEventListener(
    "mousemove",
    (event) => {
      /* Normalize cursor position to -1..1 from the viewport center. */
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;

      if (rafId === null) {
        rafId = requestAnimationFrame(updateParallax);
      }
    },
    { passive: true },
  );

  function updateParallax() {
    /* Ease toward the target so movement feels fluid, not jumpy. */
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    starLayers.forEach((layer, index) => {
      const depth = DEPTHS[index] ?? DEPTHS[DEPTHS.length - 1];
      const x = -currentX * depth;
      const y = -currentY * depth;
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      rafId = null;
    }
  }
}

if (!prefersReducedMotion && comet) {
  scheduleComet();
}

function scheduleComet() {
  /* Random gap between comets so it never feels mechanical. */
  const delay = 9000 + Math.random() * 12000;
  setTimeout(fireComet, delay);
}

function fireComet() {
  /* Random start point and travel angle, kept within the upper
     two-thirds of the viewport so it never crosses over content
     that needs to be read. */
  const startX = Math.random() * 70; // vw
  const startY = Math.random() * 40; // vh
  const angle = 18 + Math.random() * 10; // degrees

  comet.style.setProperty("--comet-x", `${startX}vw`);
  comet.style.setProperty("--comet-y", `${startY}vh`);
  comet.style.setProperty("--comet-angle", `${angle}deg`);

  comet.classList.remove("is-active");
  /* Force reflow so the animation restarts cleanly on repeat. */
  void comet.offsetWidth;
  comet.classList.add("is-active");

  comet.addEventListener(
    "animationend",
    () => {
      comet.classList.remove("is-active");
      scheduleComet();
    },
    { once: true },
  );
}

/* ============================================================
   LIGHT CONE — MOUSE PARALLAX
   ------------------------------------------------------------
   The card tilts toward the cursor while it's over the stage,
   and eases back to its resting tilt (handled in CSS via the
   floating animation) when the cursor leaves. Same eased-rAF
   pattern as the starfield parallax above, scoped to the
   .lightcone-stage bounding box instead of the whole viewport.

   Skipped for reduced-motion users and touch devices — same
   guards as the rest of the site's "extra" interactive moments.
   ============================================================ */

const lightconeStage = document.querySelector(".lightcone-stage");
const lightconeEl = document.querySelector("[data-lightcone]");
const lightconeCard = document.querySelector("[data-lightcone-card]");

if (!prefersReducedMotion && hasFinePointer && lightconeStage && lightconeEl) {
  const MAX_ROTATE_X = 8; // deg
  const MAX_ROTATE_Y = 12; // deg

  let lcTargetX = 0;
  let lcTargetY = 0;
  let lcCurrentX = 0;
  let lcCurrentY = 0;
  let lcRafId = null;
  let lcActive = false;

  const setTilt = (nx, ny) => {
    lcTargetY = nx * MAX_ROTATE_Y; // left/right cursor movement -> rotateY
    lcTargetX = -ny * MAX_ROTATE_X; // up/down cursor movement -> rotateX
  };

  const updateTilt = () => {
    lcCurrentX += (lcTargetX - lcCurrentX) * 0.12;
    lcCurrentY += (lcTargetY - lcCurrentY) * 0.12;

    lightconeEl.style.setProperty("--lc-pointer-rx", `${lcCurrentX.toFixed(2)}deg`);
    lightconeEl.style.setProperty("--lc-pointer-ry", `${lcCurrentY.toFixed(2)}deg`);

    const settled =
      Math.abs(lcTargetX - lcCurrentX) < 0.01 &&
      Math.abs(lcTargetY - lcCurrentY) < 0.01;

    if (!settled || lcActive) {
      lcRafId = requestAnimationFrame(updateTilt);
    } else {
      lcRafId = null;
    }
  };

  const kickRaf = () => {
    if (lcRafId === null) {
      lcRafId = requestAnimationFrame(updateTilt);
    }
  };

  lightconeStage.addEventListener(
    "mousemove",
    (event) => {
      const rect = lightconeStage.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      lcActive = true;
      lightconeEl.classList.add("is-interacting");
      setTilt(nx, ny);
      kickRaf();

      /* Glass shine follows the same pointer position, mapped to a
         percentage inside the card, so the highlight looks like it's
         glancing off glass as the card tilts (ported from the
         standalone Light Cone preview). */
      if (lightconeCard) {
        const gx = (nx * 0.5 + 0.5) * 100;
        const gy = (ny * 0.5 + 0.5) * 100;
        lightconeCard.style.setProperty("--gx", `${gx}%`);
        lightconeCard.style.setProperty("--gy", `${gy}%`);
        lightconeCard.style.setProperty("--band", `${115 + nx * 12}deg`);
        lightconeCard.style.setProperty("--glow", "0.5");
      }
    },
    { passive: true },
  );

  lightconeStage.addEventListener("mouseleave", () => {
    lcActive = false;
    lightconeEl.classList.remove("is-interacting");
    setTilt(0, 0);
    kickRaf();

    if (lightconeCard) {
      lightconeCard.style.setProperty("--gx", "50%");
      lightconeCard.style.setProperty("--gy", "42%");
      lightconeCard.style.setProperty("--band", "115deg");
      lightconeCard.style.setProperty("--glow", "0.22");
    }
  });
}

/* ============================================================
   TARGET CURSOR — ABOUT THROUGH CONTACT
   ------------------------------------------------------------
   Scoped to the sections from About through Contact (Home is
   excluded on purpose). The crosshair cursor appears while the
   pointer is anywhere in that range, and .cursor-target elements
   inside those sections get the corner-snap effect.
   ============================================================ */

const cursorZoneSections = [
  "#about",
  "#projects",
  "#experience",
  "#skills",
  "#contact",
]
  .map((selector) => document.querySelector(selector))
  .filter(Boolean);

if (cursorZoneSections.length) {
  createTargetCursor(cursorZoneSections, {
    targetSelector: ".cursor-target",
    spinDuration: 2,
    hoverDuration: 0.2,
    parallaxOn: true,
    cursorColor: "#ffffff",
    cursorColorOnTarget: "#d8c59a",
  });
}
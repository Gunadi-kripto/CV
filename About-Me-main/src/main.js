import "./style.css";
import { createTargetCursor } from "./target-cursor.js";

/* ============================================================
   GUNADI SETIAWAN — PORTFOLIO STAR CHART
   ============================================================ */

const app = document.querySelector("#app");

const SECTIONS = [
  { id: "home", number: "01", label: "Beranda" },
  { id: "about", number: "02", label: "Tentang" },
  { id: "projects", number: "03", label: "Proyek" },
  { id: "experience", number: "04", label: "Pengalaman" },
  { id: "skills", number: "05", label: "Keahlian" },
  { id: "contact", number: "06", label: "Kontak" },
];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const PROJECTS = [
  {
    id: "ponti-jaya-motor",
    index: "01",
    title: "E-commerce Ponti Jaya Motor",
    category: "Aplikasi Web Full-Stack",
    status: "Aktif",
    role: "Full-Stack Developer",
    stack: ["Next.js", "Node.js", "Express.js", "MongoDB", "Vercel"],
    summary:
      "Aplikasi web e-commerce full-stack lengkap dengan rute REST API, tampilan katalog, dan sistem keranjang belanja.",
    details:
      "Membangun platform e-commerce menyeluruh yang menangani antarmuka frontend dengan Next.js serta operasi backend menggunakan Node.js dan Express.js, terhubung ke basis data MongoDB serta di-deploy menggunakan Vercel.",
    github: "https://github.com/Gunadi-kripto",
    demo: "#",
  },
  {
    id: "codequest",
    index: "02",
    title: "CodeQuest",
    category: "Aplikasi Web & Mobile",
    status: "Selesai",
    role: "Full-Stack Developer",
    stack: ["Flutter", "Dart", "Node.js", "MongoDB"],
    summary:
      "Platform pembelajaran coding gamifikasi yang dilengkapi kuis interaktif, alur belajar, dan pelacakan papan peringkat (leaderboard).",
    details:
      "Mengembangkan aplikasi mobile dan web secara bersamaan. Merancang antarmuka pengguna, mengintegrasikan titik akhir API, dan mengelola basis data untuk menciptakan pengalaman belajar yang menarik bagi pemula.",
    github: "https://github.com/Gunadi-kripto/CodeQuest-",
    demo: "#",
  },
  {
    id: "spotify-api",
    index: "03",
    title: "Replikasi Spotify API",
    category: "Aplikasi Backend",
    status: "Selesai",
    role: "Backend Developer",
    stack: ["JavaScript", "MongoDB", "REST API"],
    summary:
      "Layanan backend yang mereplikasi fungsionalitas inti dari API Spotify.",
    details:
      "Membangun REST API menggunakan JavaScript dan MongoDB untuk mengelola data musik, daftar putar (playlist), serta permintaan pengguna, guna menunjukkan kemampuan arsitektur backend yang kuat.",
    github: "https://github.com/Gunadi-kripto",
    demo: "",
  },
];

const SKILL_GROUPS = [
  {
    title: "Frontend",
    note: "Membangun antarmuka pengguna interaktif",
    tags: ["React", "Next.js", "Flutter", "Tailwind CSS", "Bootstrap", "JavaScript", "TypeScript"],
  },
  {
    title: "Backend & Database",
    note: "Logika sisi server dan manajemen data",
    tags: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "Prisma",
      "SQLite",
      "PHP"
    ],
  },
  {
    title: "Bahasa & Alat",
    note: "Pemrograman inti dan infrastruktur",
    tags: ["Python", "Java", "C#", "Dart", "Git", "Vercel"],
  },
  {
    title: "Domain Lainnya",
    note: "Pengalaman teknis lintas bidang",
    tags: ["Unity 3D", "MATLAB", "IoT (BH1750)", "Jaringan (GNS3, Cisco)"],
  },
];

const EXPERIENCE = [
  {
    period: "2024 - Sekarang",
    org: "Universitas Tarumanagara",
    role: "Mahasiswa Teknik Informatika",
    body: "Menempuh studi di program studi Teknik Informatika dengan pencapaian akademik yang solid (IPK 3.90). Aktif mendalami perkuliahan seputar pengembangan full-stack, sistem basis data, dan sistem cerdas.",
  },
  {
    period: "Mei 2026",
    org: "Neon 2026",
    role: "Panitia Acara",
    body: "Mengoordinasikan kegiatan organisasi kampus untuk kompetisi English Spelling Bee. Mengelola undangan juri, jadwal operasional, serta naskah jalannya acara.",
  },
  {
    period: "Juni 2026",
    org: "I/O Festival 2026",
    role: "Panitia Logistik",
    body: "Mengelola koordinasi pasokan dan logistik untuk acara kampus. Merinci kebutuhan infrastruktur Kelampuan serta berkomunikasi langsung dengan vendor perlengkapan untuk kelancaran acara.",
  },
];

let activeSection = "home";
let isMobileNavOpen = false;

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

function renderHome() {
  return `
    <section id="home" class="world home-world" aria-label="Beranda">
      <div class="home-background-word" aria-hidden="true"></div>

      <div class="home-grid">

        <div class="home-copy">
          <p class="eyebrow">Portofolio</p>

          <h1>Gunadi<br />Setiawan</h1>

          <p class="hero-title">Full-Stack Engineer</p>

          <p class="discipline">Pengembangan Perangkat Lunak <span>×</span> Sistem Cerdas</p>

          <p class="intro">
            Mahasiswa Teknik Informatika Universitas Tarumanagara yang berfokus membangun aplikasi web & mobile full-stack serta antusias mendalami sistem cerdas dan IoT.
          </p>

          <a class="cta-button" href="#projects" data-section="projects">
            <span>Lihat Karya</span>
            <span class="cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <div class="character" aria-hidden="true">
          <div class="lightcone-stage">
            <div class="lightcone-aura"></div>
            
            <div class="lightcone" data-lightcone>
              <div class="lightcone-depth"></div>
              <div class="lightcone-shadow-2"></div>

              <div class="lightcone-card" data-lightcone-card>
              <div class="lightcone-art-placeholder" style="padding: 0; overflow: hidden; background: none;">
                  <img src="/Gunadi.png" alt="Foto Gunadi" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div class="lightcone-rim"></div>
                <div class="lightcone-shine" style="z-index: 10; pointer-events: none;"></div>
                <div class="lightcone-inner-frame"></div>
                <div class="lightcone-frame"></div>
                
                <div class="lightcone-emblem">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 8 L23.5 17 L32 20 L23.5 23 L20 32 L16.5 23 L8 20 L16.5 17 Z" stroke="currentColor" stroke-width="1.4" fill="none"/>
                  </svg>
                </div>

                <div class="lightcone-rarity">
                  <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
                </div>
              </div>

              <div class="lightcone-reflection"></div>
              <div class="lightcone-floor-light"></div>
            </div>

            <div class="lightcone-particles">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <aside class="profile" aria-label="Ringkasan Singkat">
          <h2>Sekilas</h2>
          <div class="profile-divider"></div>

          <div class="profile-item">
            <span>Universitas</span>
            <strong>Universitas Tarumanagara</strong>
          </div>
          <div class="profile-item">
            <span>Program Studi</span>
            <strong>Teknik Informatika (IPK 3.90)</strong>
          </div>
          <div class="profile-item">
            <span>Fokus Utama</span>
            <strong>Full-Stack & Sistem Cerdas</strong>
          </div>
          <div class="profile-item">
            <span>Status</span>
            <strong>Terbuka untuk magang & kolaborasi</strong>
          </div>
        </aside>

      </div>

      <div class="scroll-hint" aria-hidden="true">
        <span>Gulir</span>
        <span class="scroll-line"></span>
      </div>
    </section>
  `;
}

function renderAbout() {
  return `
    <section id="about" class="world about-world" aria-label="Tentang">
      <div class="section-header">
        <p class="eyebrow">02 — Tentang</p>
        <h2>Siapa Saya</h2>
      </div>

      <div class="about-grid">
        <p class="lead">
          Membangun aplikasi dari dasar: <em>dari rancangan basis data</em> hingga
          <em>antarmuka pengguna yang interaktif.</em>
        </p>

        <div class="about-body">
          <p>
            Saya adalah mahasiswa Teknik Informatika di Universitas Tarumanagara dengan fondasi kuat dalam pengembangan perangkat lunak full-stack. Saya menikmati proses memecahkan masalah kompleks, baik itu menyusun frontend Next.js, mengoptimalkan backend MongoDB, maupun mengelola alur deployment aplikasi.
          </p>
          <p>
            Selain pengembangan web konvensional, saya memiliki minat besar pada irisan antara perangkat keras (hardware) dan lunak (software)—mulai dari analisis data sensor hingga konfigurasi topologi jaringan. Saya adalah pembelajar cepat yang senang bekerja dalam tim untuk menghasilkan produk digital yang fungsional dan berdampak.
          </p>

          <div class="fact-grid">
            <div class="cursor-target">
              <span>Pendekatan</span>
              <strong>Praktis & Analitis</strong>
            </div>
            <div class="cursor-target">
              <span>Keahlian Utama</span>
              <strong>Full-Stack Engineering</strong>
            </div>
            <div class="cursor-target">
              <span>Fokus Saat Ini</span>
              <strong>Eksplorasi IoT & Sistem</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderProjects() {
  return `
    <section id="projects" class="world projects-world" aria-label="Proyek">
      <div class="section-header">
        <p class="eyebrow">03 — Proyek</p>
        <h2>Karya Pilihan</h2>
        <p class="section-note">Klik pada proyek untuk membaca detailnya.</p>
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
      ? `<a href="${project.demo}" class="project-link">Demo Langsung ↗</a>`
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
            <span><strong>Peran:</strong> ${project.role}</span>${project.stack.length ? `<span class="project-tags">${project.stack.map(tag).join("")}</span>` : ""}
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
    <section id="experience" class="world experience-world" aria-label="Pengalaman">
      <div class="section-header">
        <p class="eyebrow">04 — Pengalaman</p>
        <h2>Jejak Aktivitas</h2>
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
    <section id="skills" class="world skills-world" aria-label="Keahlian">
      <div class="section-header">
        <p class="eyebrow">05 — Keahlian</p>
        <h2>Teknologi & Alat</h2>
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
    <section id="contact" class="world contact-world" aria-label="Kontak">
      <div class="contact-layout">
        <div class="contact-intro">
          <p class="eyebrow">06 — Kontak</p>
          <h2>Mari Terhubung</h2>
          <p>
            Cara tercepat untuk menghubungi saya adalah melalui email. Saya terbuka untuk kesempatan magang, diskusi proyek, dan kolaborasi menarik lainnya.
          </p>
        </div>

        <div class="contact-card">
          <a class="email cursor-target" href="mailto:edward.stiawan28@gmail.com" style="font-size: clamp(18px, 4vw, 28px);">edward.stiawan28@gmail.com</a>
          <p class="contact-note">Berbasis di Jakarta, Indonesia.</p>

          <div class="contact-links">
            <a class="cursor-target" href="https://www.linkedin.com/in/gunadi-setiawan-a89505382" aria-label="LinkedIn">LinkedIn ↗</a>
            <a class="cursor-target" href="https://github.com/Gunadi-kripto" aria-label="GitHub">GitHub ↗</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

app.innerHTML = `
  <a class="skip-link" href="#main">Langsung ke konten</a>

  <div class="portfolio">
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
          <span class="logo-name">Gunadi</span>
          <span class="logo-subtitle">Setiawan</span>
        </span>
      </a>

      <button
        class="menu-button"
        id="menuButton"
        aria-label="Buka menu navigasi"
        aria-expanded="false"
        aria-controls="mobileNav"
      >
        <span></span><span></span><span></span>
      </button>
    </header>

    <nav class="side-navigation" aria-label="Navigasi bagian">
      <div class="side-navigation-line" aria-hidden="true"></div>
      <div class="side-navigation-progress" id="navProgress" aria-hidden="true"></div>
      ${SECTIONS.map((s) => navLink(s)).join("")}
    </nav>

    <nav
      class="mobile-nav"
      id="mobileNav"
      aria-label="Navigasi bagian seluler"
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

const menuButton = document.querySelector("#menuButton");
const mobileNav = document.querySelector("#mobileNav");
const allNavLinks = document.querySelectorAll("[data-section]");
const allSections = document.querySelectorAll("main > section");

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

if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) {
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }
}

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

  updateProgress();
}

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
  allSections.forEach((section) => section.classList.add("is-visible"));
}

function openMobileNav() {
  isMobileNavOpen = true;
  mobileNav.classList.add("is-open");
  menuButton.classList.add("is-open");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Tutup menu navigasi");
}

function closeMobileNav() {
  if (!isMobileNavOpen) return;
  isMobileNavOpen = false;
  mobileNav.classList.remove("is-open");
  menuButton.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Buka menu navigasi");
}

menuButton.addEventListener("click", () => {
  isMobileNavOpen ? closeMobileNav() : openMobileNav();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileNav();
});

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

const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
const starLayers = document.querySelectorAll(".star-layer");
const comet = document.querySelector(".comet");

if (!prefersReducedMotion && hasFinePointer && starLayers.length) {
  const DEPTHS = [6, 14, 26];
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  window.addEventListener(
    "mousemove",
    (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;

      if (rafId === null) {
        rafId = requestAnimationFrame(updateParallax);
      }
    },
    { passive: true },
  );

  function updateParallax() {
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
  const delay = 9000 + Math.random() * 12000;
  setTimeout(fireComet, delay);
}

function fireComet() {
  const startX = Math.random() * 70;
  const startY = Math.random() * 40;
  const angle = 18 + Math.random() * 10;

  comet.style.setProperty("--comet-x", `${startX}vw`);
  comet.style.setProperty("--comet-y", `${startY}vh`);
  comet.style.setProperty("--comet-angle", `${angle}deg`);

  comet.classList.remove("is-active");
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

const lightconeStage = document.querySelector(".lightcone-stage");
const lightconeEl = document.querySelector("[data-lightcone]");
const lightconeCard = document.querySelector("[data-lightcone-card]");

if (!prefersReducedMotion && hasFinePointer && lightconeStage && lightconeEl) {
  const MAX_ROTATE_X = 8;
  const MAX_ROTATE_Y = 12;

  let lcTargetX = 0;
  let lcTargetY = 0;
  let lcCurrentX = 0;
  let lcCurrentY = 0;
  let lcRafId = null;
  let lcActive = false;

  const setTilt = (nx, ny) => {
    lcTargetY = nx * MAX_ROTATE_Y;
    lcTargetX = -ny * MAX_ROTATE_X;
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
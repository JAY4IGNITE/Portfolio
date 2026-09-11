# 🚀 Jaya Sai Krishna Vasamsetti — Developer Portfolio

A modern, high-performance web developer portfolio built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and interactive 3D WebGL animations via **GSAP**, **Lenis**, **Three.js**, and **OGL**.

---

## 🌟 Key Highlights & Features

- **Multi-Layer 3D Hero Parallax**: Custom scroll-driven depth layers, floating ambient particles, dynamic viewport vignette, and sliced interactive portrait reveal.
- **Buttery Smooth Momentum Scrolling**: Integrated **Lenis** synchronized with **GSAP ScrollTrigger** and unified animation tickers for 60+ FPS performance.
- **3D Interactive Gradient Carousel**: WebGL-accelerated interactive certificate showcase with realistic depth distortion, lighting, and preview modal.
- **Live Coding Statistics**: Real-time integration with LeetCode & CodeChef stats with client-side caching and stale-while-revalidate fallback strategies.
- **GitHub Activity & Contribution Heatmap**: Live GitHub API statistics, top repositories, and interactive commit calendar visualization.
- **Responsive & Accessible**: Fully optimized layouts across mobile, tablet, and widescreen viewports with reduced-motion support and touch-device detection.
- **Zero-Lint Health**: Clean codebase adhering to React 19 rules and strict TypeScript typing.

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Framework & Core** | [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) |
| **3D & Graphics** | [Three.js](https://threejs.org/), [OGL](https://github.com/oframe/ogl) |
| **Motion & Scroll** | [GSAP](https://greensock.com/gsap/), [ScrollTrigger](https://greensock.com/scrolltrigger/), [Lenis](https://lenis.darkroom.engineering/), [Framer Motion](https://www.framer.com/motion/) |
| **Typography** | [Kanit (Google Fonts)](https://fonts.google.com/specimen/Kanit) |
| **API & Backend** | Vercel Serverless Functions (`/api/codechef.js`) |

---

## 📂 Aligned Directory Structure

```text
Portfolio/
├── api/                           # Serverless API routes (Vercel)
│   └── codechef.js                # CodeChef statistics proxy handler
├── public/                        # Static assets & public files
│   ├── assets/
│   │   ├── Certificates/          # Certification images & PDF documents
│   │   ├── decorative/            # 3D decorative assets
│   │   ├── Krishna.png            # Main portrait asset
│   │   └── Resume.pdf             # Printable resume document
│   ├── favicon.svg                # Scalable favicon
│   └── sitemap.xml                # Search engine indexing
├── src/
│   ├── components/                # Reusable UI & WebGL components
│   │   ├── CustomCursor.tsx       # Custom mouse cursor with trail particles
│   │   ├── FadeIn.tsx             # Scroll-driven opacity/slide reveal
│   │   ├── FloatingParallaxElements.tsx # 3D background elements
│   │   ├── GitHubHeatmap.tsx      # Interactive contribution matrix
│   │   ├── GradientCarousel.tsx   # 3D interactive WebGL certificate carousel
│   │   ├── ParticleField.tsx      # Three.js particle constellation canvas
│   │   ├── Preloader.tsx          # Initial brand entrance preloader
│   │   ├── ScrollRevealText.tsx   # SplitType scrubbed text reveal
│   │   ├── ScrollToTop.tsx        # Scroll-to-top floating action
│   │   ├── SlicedParallaxPortrait.tsx # Dual-layer slice hover portrait
│   │   ├── SmoothScrollProvider.tsx # Lenis + GSAP RAF synchronization provider
│   │   └── WarpText.tsx           # OGL shader liquid text distortion
│   ├── config/                    # Contact provider configurations & fallbacks
│   │   ├── contact.ts             # EmailJS / Formspree service config
│   │   └── githubContributionsFallback.json # Cached GitHub fallback data
│   ├── data/                      # Structured domain data & content
│   │   ├── certifications.ts      # Professional certification items
│   │   ├── decorations.ts         # About section floating elements
│   │   ├── journey.ts             # Timeline milestones & career highlights
│   │   ├── navigation.ts          # Header navigation links
│   │   ├── projects.ts            # Featured technical projects
│   │   └── services.ts            # Professional offerings
│   ├── hooks/                     # Custom React hooks
│   │   ├── useActiveSection.ts    # Viewport section tracker for navigation
│   │   └── useScrollReveal.ts     # GSAP ScrollTrigger intersection hook
│   ├── sections/                  # Page sections
│   │   ├── AboutSection.tsx       # Bio & quick resume overview
│   │   ├── CertificationsSection.tsx # 3D carousel credential display
│   │   ├── CodingStatsSection.tsx # LeetCode & CodeChef metrics
│   │   ├── ContactSection.tsx     # Interactive message form
│   │   ├── GitHubActivitySection.tsx # Open-source activity & repos
│   │   ├── HeroSection.tsx        # Multi-layer parallax introduction
│   │   ├── JourneySection.tsx     # Interactive career roadmap
│   │   ├── MarqueeSection.tsx     # Infinite scroll text ribbon
│   │   ├── ProjectsSection.tsx    # Technical case studies
│   │   ├── ServicesSection.tsx    # Technical capabilities
│   │   └── TechStackSection.tsx   # Interactive skill matrix
│   ├── types/                     # Shared TypeScript interfaces & types
│   │   ├── github.ts              # GitHub profile & repository types
│   │   └── portfolio.ts           # Project, Certification, Journey, Service types
│   ├── App.tsx                    # Main application orchestration & theme shifts
│   ├── index.css                  # Tailwind styles, custom typography & CSS variables
│   └── main.tsx                   # Application bootstrap entry point
├── eslint.config.js               # ESLint 9 flat configuration
├── package.json                   # Dependencies & npm scripts
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS tokens & theme
├── tsconfig.app.json              # TypeScript client configuration with @/* alias
├── tsconfig.json                  # Root TypeScript configuration
└── vite.config.ts                 # Vite bundler configuration & proxy
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JAY4IGNITE/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
   *(Optionally update your GitHub, LeetCode, CodeChef, and EmailJS details in `.env`)*

4. Start the local development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with HMR |
| `npm run build` | Compiles TypeScript types (`tsc -b`) and bundles production assets with Vite |
| `npm run lint` | Runs project-wide ESLint checks with zero tolerance for errors |
| `npm run preview` | Runs a local server previewing the production build bundle |

---

## 🔒 Environment Configuration

The following environment variables can be configured in your `.env` file:

```env
# Personal Details
VITE_PERSONAL_EMAIL=jayasaikrishnavasamsetti@gmail.com
VITE_PERSONAL_PHONE=+91 9030649777

# Coding Profiles
VITE_LEETCODE_USERNAME=krishna_0409
VITE_CODECHEF_USERNAME=jay4ignite

# Contact Form Provider ('emailjs' | 'formspree')
VITE_CONTACT_PROVIDER=emailjs

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## 🌐 Production Build & Deployment

To generate an optimized production bundle:

```bash
npm run build
```

The output bundle is generated inside the `dist/` directory, ready to be hosted on **Vercel**, **Netlify**, **GitHub Pages**, or **Cloudflare Pages**.

---

## 👤 Author

**Jaya Sai Krishna Vasamsetti**
- GitHub: [@JAY4IGNITE](https://github.com/JAY4IGNITE)
- Portfolio: [nandu.work.gd](https://nandu.work.gd)

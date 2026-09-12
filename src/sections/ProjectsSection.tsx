import { useRef, useState, useEffect, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import ScrollRevealText from '../components/ScrollRevealText';

import type { ProjectData } from '@/types/portfolio';
import { projects } from '@/data/projects';

export type { ProjectData };

/* ─── Project Detail Modal ─── */
interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal Card */}
      <motion.div
        className="relative bg-[#0F1117] border border-white/15 rounded-[28px] sm:rounded-[36px] max-w-4xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] custom-scrollbar"
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 240 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-[#D7E2EA] hover:text-white flex items-center justify-center text-lg cursor-pointer transition-colors z-30 border border-white/10"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          aria-label="Close modal"
        >
          ✕
        </motion.button>

        {/* Project Preview with Browser Header */}
        {project.images.length > 0 && (
          <div className="mb-8 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#161822] shadow-xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-[#1A1C29] border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              <span className="mx-auto text-[11px] font-mono text-white/50 px-4 py-0.5 rounded-full bg-black/40 border border-white/5">
                {project.name.toLowerCase()}.preview
              </span>
            </div>
            <img
              src={
                project.images[0].startsWith('/')
                  ? `${import.meta.env.BASE_URL}${project.images[0].slice(1)}`
                  : project.images[0]
              }
              alt={project.name}
              className="w-full h-auto max-h-[380px] object-cover"
            />
          </div>
        )}

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="text-xs font-mono font-bold tracking-wider text-[#B600A8] bg-[#B600A8]/10 border border-[#B600A8]/30 px-3 py-1 rounded-full uppercase">
            {project.number} / {project.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-medium px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active Platform
          </span>
        </div>

        {/* Title */}
        <motion.h3
          className="hero-heading font-black uppercase tracking-tight text-white mb-4"
          style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)' }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {project.name}
        </motion.h3>

        {/* Tech Stack Chips */}
        <motion.div
          className="flex flex-wrap gap-2 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {project.tech.map((t, i) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/[0.06] border border-white/10 text-[#D7E2EA]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {t}
            </span>
          ))}
        </motion.div>

        {/* Description */}
        <div className="mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-[#B600A8] mb-2">
            Overview
          </h4>
          <p className="text-[#D7E2EA]/85 font-light leading-relaxed text-sm sm:text-base">
            {project.description}
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-[#B600A8] mb-3">
            Core Features & Capabilities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[#D7E2EA]/80 text-xs sm:text-sm font-light"
              >
                <span className="text-[#B600A8] text-base leading-none mt-0.5">✦</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges & Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-[#D7E2EA]/50 mb-2">
              Engineering Challenges
            </h4>
            <p className="text-[#D7E2EA]/75 font-light leading-relaxed text-xs sm:text-sm">
              {project.challenges}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-widest text-[#D7E2EA]/50 mb-2">
              Key Technical Learnings
            </h4>
            <p className="text-[#D7E2EA]/75 font-light leading-relaxed text-xs sm:text-sm">
              {project.learnings}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        {project.link && project.link !== '#' && (
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white px-7 py-3 text-xs sm:text-sm font-medium tracking-wider uppercase hover:brightness-110 transition-all duration-200 shadow-[0_4px_20px_rgba(182,0,168,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{project.link.includes('github.com') ? 'View on GitHub' : 'Live Demo'}</span>
                <span>↗</span>
              </a>
            </div>
            <button
              onClick={onClose}
              className="text-xs font-mono uppercase tracking-widest text-[#D7E2EA]/50 hover:text-white cursor-pointer transition-colors px-4 py-2"
            >
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

/* ─── Single Card ─── */
interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onViewDetails: (p: ProjectData) => void;
}

const ProjectCard = memo(({ project, index, onViewDetails }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardContentRef, { once: true, margin: '-60px' });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (projects.length - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  // Pick representative images for the showcase
  const rawGridImages =
    project.images.length >= 3
      ? [project.images[0], project.images[5] || project.images[1], project.images[9] || project.images[project.images.length - 1]]
      : project.images.length >= 2
        ? [project.images[0], project.images[1], project.images[0]]
        : project.images.length === 1
          ? [project.images[0]]
          : [];

  const gridImages = rawGridImages.map((img) =>
    img.startsWith('/') ? `${import.meta.env.BASE_URL}${img.slice(1)}` : img
  );

  const isVideo = project.images.length === 0;

  return (
    <motion.div
      ref={cardRef}
      className="sticky mb-12 sm:mb-16 lg:mb-24 origin-top h-auto w-full"
      style={{
        scale,
        top: `calc(5rem + ${index * 2.5}rem)`,
      }}
    >
      <div
        ref={cardContentRef}
        data-cursor="view"
        className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[44px] border border-white/[0.12] bg-[#0E0F15]/95 backdrop-blur-2xl p-6 sm:p-8 md:p-12 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.7)] group"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#B600A8]/20 to-[#7621B0]/10 blur-[90px] pointer-events-none" />

        {/* Card Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10">
          <div className="flex flex-col gap-3 max-w-2xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-mono font-bold tracking-wider text-[#B600A8] bg-[#B600A8]/10 border border-[#B600A8]/30 px-3 py-1 rounded-full uppercase">
                {project.number} / {project.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Featured Project
              </span>
            </div>

            {/* Title */}
            <motion.h3
              className="hero-heading font-black uppercase text-white tracking-tight leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-white group-hover:to-[#B600A8] transition-all duration-300"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {project.name}
            </motion.h3>

            {/* Concise Description */}
            <p className="text-[#D7E2EA]/75 font-light leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>

            {/* Tech Chips */}
            <div className="flex flex-wrap gap-2 mt-1">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium bg-white/[0.05] border border-white/10 text-[#D7E2EA]/80 hover:border-white/20 hover:text-white transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 lg:self-start pt-2">
            <motion.button
              onClick={() => onViewDetails(project)}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white font-medium uppercase tracking-wider px-6 py-3 text-xs sm:text-sm cursor-pointer shadow-[0_4px_20px_rgba(182,0,168,0.35)] hover:brightness-110 active:scale-95 transition-all duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>View Details</span>
              <span>→</span>
            </motion.button>
            {project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 text-[#D7E2EA] font-medium uppercase tracking-wider px-6 py-3 text-xs sm:text-sm hover:bg-white/10 hover:border-white/30 transition-all duration-200"
              >
                <span>{project.link.includes('github.com') ? 'GitHub' : 'Live Project'}</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Interactive Application Window Frame */}
        {isVideo ? (
          <motion.div
            className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full object-cover"
              style={{ height: 'clamp(220px, 42vw, 600px)' }}
            >
              <source src={`${import.meta.env.BASE_URL}assets/Projects/flappy_bird/fap.mp4`} type="video/mp4" />
            </video>
          </motion.div>
        ) : gridImages.length >= 3 ? (
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="w-full md:w-[40%] flex flex-row md:flex-col gap-3 sm:gap-4">
              <div className="w-1/2 md:w-full overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={gridImages[0]}
                  alt={`${project.name} 1`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="w-1/2 md:w-full overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={gridImages[1]}
                  alt={`${project.name} 2`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="w-full md:w-[60%] overflow-hidden rounded-2xl border border-white/10">
              <img
                src={gridImages[2]}
                alt={`${project.name} 3`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ) : gridImages.length >= 1 ? (
          <motion.div
            onClick={() => onViewDetails(project)}
            className="mt-4 rounded-2xl sm:rounded-3xl border border-white/15 bg-[#141620] shadow-2xl overflow-hidden cursor-pointer group/frame relative"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* macOS-style Window Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#1A1C28] border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm inline-block" />
              </div>
              <div className="flex items-center gap-2 px-4 sm:px-6 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] sm:text-xs text-white/60 font-mono">
                <span className="text-emerald-400">🔒</span>
                <span>smartapply.studio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B600A8] bg-[#B600A8]/10 px-2.5 py-0.5 rounded-full border border-[#B600A8]/20 hidden sm:inline-block">
                  Live Preview
                </span>
              </div>
            </div>

            {/* High-Resolution Screenshot */}
            <div className="overflow-hidden bg-[#0C0D12]">
              <motion.img
                src={gridImages[0]}
                alt={`${project.name} application preview`}
                className="w-full h-auto object-cover max-h-[620px] transition-transform duration-700 ease-out group-hover/frame:scale-[1.015]"
                loading="lazy"
              />
            </div>

            {/* Subtle Hover Callout */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/frame:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end justify-center pb-6">
              <span className="text-xs font-mono uppercase tracking-widest text-white px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 shadow-xl">
                Click to explore details & architecture ↗
              </span>
            </div>
          </motion.div>
        ) : null}

        {/* Feature Highlights Ribbon */}
        <div className="mt-6 pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
            <span className="text-base">🎯</span>
            <span className="text-xs font-medium text-[#D7E2EA]/85">AI Resume Tailor</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
            <span className="text-base">🎙️</span>
            <span className="text-xs font-medium text-[#D7E2EA]/85">Live Voice Studio</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
            <span className="text-base">⚡</span>
            <span className="text-xs font-medium text-[#D7E2EA]/85">Judge0 Sandbox</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
            <span className="text-base">📄</span>
            <span className="text-xs font-medium text-[#D7E2EA]/85">LaTeX & PDF Maker</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/* ─── Projects Section ─── */
const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Body scroll lock + Escape key handler for modal
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedProject(null);
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedProject]);

  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
        className="bg-[#0C0C0C] section-panel px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      >
        <motion.div style={{ y: headerY }}>
          <ScrollRevealText
            text="Projects"
            as="h2"
            splitBy="chars"
            className="text-[#D7E2EA] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 text-[clamp(3rem,8vw,110px)] leading-none"
            delay={0.03}
          />
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {projects.length > 0 ? (
            projects.map((project, i) => (
              <ProjectCard
                key={project.number}
                project={project}
                index={i}
                onViewDetails={setSelectedProject}
              />
            ))
          ) : (
            <div className="text-center py-20 px-6 border border-dashed border-[#D7E2EA]/20 rounded-[30px]">
              <p className="text-[#D7E2EA]/40 text-base sm:text-lg uppercase tracking-widest font-light">
                No projects added yet
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsSection;

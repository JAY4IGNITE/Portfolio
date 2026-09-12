import { useRef, useState, useEffect, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import ScrollRevealText from '../components/ScrollRevealText';
import { stopLenis, startLenis } from '@/utils/lenis';

import type { ProjectData } from '@/types/portfolio';
import { projects } from '@/data/projects';

export type { ProjectData };

/* ─── Project Detail Modal ─── */
interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Isolate mouse wheel events inside the modal so they never leak to window/Lenis
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

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
      data-lenis-prevent
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-lenis-prevent
      />

      {/* Modal Card */}
      <motion.div
        ref={cardRef}
        className="relative bg-[#0F1117] border border-white/15 rounded-[28px] sm:rounded-[36px] max-w-4xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 md:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] custom-scrollbar overscroll-contain"
        style={{ overscrollBehavior: 'contain' }}
        data-lenis-prevent
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
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-auto text-[11px] font-mono text-white/70 hover:text-white px-4 py-0.5 rounded-full bg-black/40 border border-white/10 hover:border-white/25 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  <span className="text-[10px] text-white/40">↗</span>
                </a>
              ) : (
                <span className="mx-auto text-[11px] font-mono text-white/50 px-4 py-0.5 rounded-full bg-black/40 border border-white/5">
                  {project.name.toLowerCase().replace(/\s+/g, '')}.preview
                </span>
              )}
            </div>
            <img
              src={
                project.images[0].startsWith('/')
                  ? `${import.meta.env.BASE_URL}${project.images[0].slice(1)}`
                  : project.images[0]
              }
              alt={project.name}
              className="w-full h-auto aspect-[1024/504] object-contain bg-[#0A0B0F] max-h-[460px]"
            />
          </div>
        )}

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="text-xs font-mono font-bold tracking-wider text-[#B600A8] bg-[#B600A8]/10 border border-[#B600A8]/30 px-3 py-1 rounded-full uppercase">
            {project.number} / {project.category}
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
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white px-7 py-3 text-xs sm:text-sm font-medium tracking-wider uppercase hover:brightness-110 transition-all duration-200 shadow-[0_4px_20px_rgba(182,0,168,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Live Project</span>
              </a>
            )}
            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 text-[#D7E2EA] hover:text-white hover:bg-white/10 px-6 py-3 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{project.link.includes('github.com') ? 'View on GitHub' : 'Source Code'}</span>
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xs font-mono uppercase tracking-widest text-[#D7E2EA]/50 hover:text-white cursor-pointer transition-colors px-4 py-2"
          >
            Close
          </button>
        </div>
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
      className="sticky mb-8 sm:mb-12 origin-top h-auto w-full"
      style={{
        scale,
        top: `calc(4rem + ${index * 2}rem)`,
      }}
    >
      <div
        ref={cardContentRef}
        className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0E0F14]/95 backdrop-blur-xl p-5 sm:p-7 md:p-8 overflow-hidden shadow-xl"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#B600A8]/15 to-[#7621B0]/10 blur-[80px] pointer-events-none" />

        {/* Minimalist 2-Column Split: Info on left, resized image preview on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          {/* Left Column: Project Meta & Content */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {/* Category Tag */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-[#B600A8] bg-[#B600A8]/10 border border-[#B600A8]/25 px-2.5 py-0.5 rounded-full uppercase">
                {project.number} / {project.category}
              </span>
            </div>

            {/* Project Title */}
            <motion.h3
              className="text-xl sm:text-2xl md:text-3xl font-black uppercase text-white tracking-tight leading-tight"
              initial={{ opacity: 0, x: -15 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {project.name}
            </motion.h3>

            {/* Concise Description */}
            <p className="text-[#D7E2EA]/70 font-light text-xs sm:text-sm leading-relaxed line-clamp-3">
              {project.description}
            </p>

            {/* Compact Tech Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-medium bg-white/[0.04] border border-white/[0.08] text-[#D7E2EA]/75"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <motion.button
                onClick={() => onViewDetails(project)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 text-[#D7E2EA]/90 hover:text-white hover:bg-white/10 font-medium uppercase tracking-wider px-3.5 py-2 text-xs cursor-pointer transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Details</span>
                <span>→</span>
              </motion.button>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white font-medium uppercase tracking-wider px-4 py-2 text-xs cursor-pointer shadow-md hover:brightness-110 active:scale-95 transition-all duration-200"
                >
                  <span>Live Project</span>
                  <span>↗</span>
                </a>
              )}
              {project.link !== '#' && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 text-[#D7E2EA]/85 hover:text-white font-medium uppercase tracking-wider px-3.5 py-2 text-xs hover:bg-white/10 hover:border-white/25 transition-all duration-200"
                >
                  <span>{project.link.includes('github.com') ? 'GitHub' : 'Code'}</span>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Resized Dynamic Preview Frame */}
          <div className="lg:col-span-7 w-full">
            {isVideo ? (
              <motion.div
                className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full object-cover"
                  style={{ height: 'clamp(180px, 25vw, 320px)' }}
                >
                  <source src={`${import.meta.env.BASE_URL}assets/Projects/flappy_bird/fap.mp4`} type="video/mp4" />
                </video>
              </motion.div>
            ) : gridImages.length >= 3 ? (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="w-full sm:w-[40%] flex flex-row sm:flex-col gap-2.5">
                  <div className="w-1/2 sm:w-full overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={gridImages[0]}
                      alt={`${project.name} 1`}
                      className="w-full h-24 sm:h-28 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-1/2 sm:w-full overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={gridImages[1]}
                      alt={`${project.name} 2`}
                      className="w-full h-24 sm:h-28 object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-[60%] overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={gridImages[2]}
                    alt={`${project.name} 3`}
                    className="w-full h-full object-cover min-h-[140px]"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : gridImages.length >= 1 ? (
              <motion.div
                className="rounded-xl sm:rounded-2xl border border-white/10 bg-[#12141C] shadow-lg overflow-hidden relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
              >
                {/* Minimalist Browser Bar */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#171924] border-b border-white/[0.08]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
                  </div>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40 border border-white/10 hover:border-emerald-400/40 text-[10px] sm:text-[11px] text-white/70 hover:text-white font-mono transition-colors"
                    >
                      <span className="text-emerald-400">🔒</span>
                      <span>{project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                      <span className="text-emerald-400/80">↗</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 border border-white/5 text-[10px] sm:text-[11px] text-white/50 font-mono">
                      <span className="text-emerald-400/80">🔒</span>
                      <span>{project.name.toLowerCase().replace(/\s+/g, '')}.app</span>
                    </div>
                  )}
                  <div className="w-8" />
                </div>

                {/* Resized Dynamic Image with exact aspect ratio - zero crop, completely responsive */}
                <div className="overflow-hidden bg-[#0A0B0F]">
                  <img
                    src={gridImages[0]}
                    alt={`${project.name} preview`}
                    className="w-full h-auto aspect-[1024/504] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ) : null}
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

  // Body & Lenis scroll lock + Escape key handler for modal
  useEffect(() => {
    if (selectedProject) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      stopLenis();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedProject(null);
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        startLenis();
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      startLenis();
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

        <div className="max-w-6xl mx-auto">
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

import { useRef, useState, useEffect, memo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import ScrollRevealText from '../components/ScrollRevealText';

export interface ProjectData {
  number: string;
  name: string;
  category: string;
  tech: string[];
  description: string;
  features: string[];
  challenges: string;
  learnings: string;
  link: string;
  images: string[];
}

const projects: ProjectData[] = [
  // Add your projects here. Example format:
  // {
  //   number: '01',
  //   name: 'Project Title',
  //   category: 'Web / App / AI',
  //   tech: ['React', 'TypeScript', 'Tailwind'],
  //   description: 'Description of your project...',
  //   features: ['Feature 1', 'Feature 2'],
  //   challenges: 'Challenges faced and solutions...',
  //   learnings: 'What you learned...',
  //   link: 'https://github.com/...',
  //   images: ['/assets/Projects/...'],
  // },
];



/* ─── Project Detail Modal ─── */
interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative bg-[#111111] border border-[#D7E2EA]/10 rounded-[30px] max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 md:p-10"
        initial={{ scale: 0.85, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-5 text-[#D7E2EA]/50 hover:text-[#D7E2EA] text-2xl cursor-pointer transition-colors"
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          ✕
        </motion.button>

        {/* Title + Tech */}
        <motion.h3
          className="hero-heading font-black uppercase tracking-tight mb-4"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {project.name}
        </motion.h3>

        <motion.div
          className="flex flex-wrap gap-2 mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          {project.tech.map((t, i) => (
            <motion.span
              key={t}
              className="px-3 py-1 rounded-full text-xs uppercase tracking-widest font-medium border border-[#D7E2EA]/20 text-[#D7E2EA]/80"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 300 }}
            >
              {t}
            </motion.span>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <h4 className="text-[#D7E2EA]/50 uppercase tracking-widest text-xs font-medium mb-2">
            Description
          </h4>
          <p className="text-[#D7E2EA]/80 font-light leading-relaxed text-sm sm:text-base">
            {project.description}
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <h4 className="text-[#D7E2EA]/50 uppercase tracking-widest text-xs font-medium mb-2">
            Key Features
          </h4>
          <ul className="space-y-1">
            {project.features.map((f, i) => (
              <motion.li
                key={i}
                className="text-[#D7E2EA]/70 font-light text-sm flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
              >
                <motion.span
                  className="text-[#B600A8] mt-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05, type: 'spring', stiffness: 500 }}
                >
                  ●
                </motion.span>
                {f}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Challenges */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <h4 className="text-[#D7E2EA]/50 uppercase tracking-widest text-xs font-medium mb-2">
            Challenges & Solutions
          </h4>
          <p className="text-[#D7E2EA]/70 font-light leading-relaxed text-sm">
            {project.challenges}
          </p>
        </motion.div>

        {/* Learnings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <h4 className="text-[#D7E2EA]/50 uppercase tracking-widest text-xs font-medium mb-2">
            Key Learnings
          </h4>
          <p className="text-[#D7E2EA]/70 font-light leading-relaxed text-sm">
            {project.learnings}
          </p>
        </motion.div>
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

  // Pick 3 representative images for the grid
  const rawGridImages =
    project.images.length >= 3
      ? [project.images[0], project.images[5] || project.images[1], project.images[9] || project.images[project.images.length - 1]]
      : project.images.length >= 2
        ? [project.images[0], project.images[1], project.images[0]]
        : [];

  const gridImages = rawGridImages.map(img => img.startsWith('/') ? `${import.meta.env.BASE_URL}${img.slice(1)}` : img);

  const isVideo = project.images.length === 0; // Flappy Bird has video

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
        className="rounded-[30px] sm:rounded-[45px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 overflow-hidden"
      >
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
            {/* Animated project number */}
            <motion.span
              className="hero-heading font-black leading-none"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {project.number}
            </motion.span>
            <div className="flex flex-col gap-1">
              <motion.span
                className="text-[#D7E2EA]/60 text-sm sm:text-base uppercase tracking-widest font-light"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                {project.category}
              </motion.span>
              <motion.span
                className="text-[#D7E2EA] font-medium uppercase"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                {project.name}
              </motion.span>
              <motion.div
                className="flex flex-wrap gap-1.5 mt-1"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                {project.tech.map((t, i) => (
                  <motion.span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium border border-[#D7E2EA]/20 text-[#D7E2EA]/60"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      delay: 0.4 + i * 0.08,
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Buttons with hover effects */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <motion.button
              onClick={() => onViewDetails(project)}
              className="inline-block rounded-full border-2 border-[#B600A8] text-[#D7E2EA] font-medium uppercase tracking-widest px-6 py-2.5 sm:px-10 sm:py-3.5 text-xs sm:text-sm md:text-base cursor-pointer relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {/* Button hover fill effect */}
              <motion.div
                className="absolute inset-0 bg-[#B600A8]/10"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">View Details</span>
            </motion.button>
            {project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200"
              >
                Live Project
              </a>
            )}
          </motion.div>
        </div>

        {/* Bottom row - Image grid with staggered reveal */}
        {isVideo ? (
          <motion.div
            className="rounded-[24px] sm:rounded-[36px] md:rounded-[50px] overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full object-cover"
              style={{ height: 'clamp(200px, 40vw, 580px)' }}
            >
              <source src={`${import.meta.env.BASE_URL}assets/Projects/flappy_bird/fap.mp4`} type="video/mp4" />
            </video>
          </motion.div>
        ) : gridImages.length >= 3 ? (
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            {/* Left column - w-full on mobile, w-[40%] on desktop. Rows on mobile, columns on desktop */}
            <div className="w-full md:w-[40%] flex flex-row md:flex-col gap-3 sm:gap-4">
              <motion.div
                className="w-1/2 md:w-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px]"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.img
                  src={gridImages[0]}
                  alt={`${project.name} preview 1`}
                  className="w-full h-[90px] xs:h-[110px] sm:h-[140px] md:h-[180px] lg:h-[160px] xl:h-[230px] object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
              <motion.div
                className="w-1/2 md:w-full overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px]"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.img
                  src={gridImages[1]}
                  alt={`${project.name} preview 2`}
                  className="w-full h-[90px] xs:h-[110px] sm:h-[140px] md:h-[240px] lg:h-[240px] xl:h-[340px] object-cover"
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            </div>
            {/* Right column - w-full on mobile, w-[60%] on desktop */}
            <motion.div
              className="w-full md:w-[60%] overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px]"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.img
                src={gridImages[2]}
                alt={`${project.name} preview 3`}
                className="w-full h-[150px] sm:h-[220px] md:h-full object-cover"
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
});

/* ─── Projects Section ─── */
const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
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
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectsSection;

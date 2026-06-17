import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import EducationSection from './sections/EducationSection';
import { lazy, Suspense, useState } from 'react';
import { useScroll, useSpring, motion, useTransform } from 'framer-motion';

const TechStackSection = lazy(() => import('./sections/TechStackSection'));
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'));
const CertificationsSection = lazy(() => import('./sections/CertificationsSection'));

const CodingStatsSection = lazy(() =>
  import('./sections/CodingStatsSection').then(m => ({ default: m.CodingStatsSection }))
);
const GitHubActivitySection = lazy(() =>
  import('./sections/GitHubActivitySection').then(m => ({ default: m.GitHubActivitySection }))
);
import ContactSection from './sections/ContactSection';
import ScrollToTop from './components/ScrollToTop';
import Preloader from './components/Preloader';

const StatsSkeleton = () => (
  <div className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 section-panel overflow-hidden">
    <div className="max-w-6xl mx-auto animate-pulse flex flex-col items-center">
      <div className="h-16 w-64 bg-white/10 rounded-3xl mb-4" />
      <div className="h-4 w-48 bg-white/5 rounded-full mb-16" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 w-full">
        <div className="rounded-[40px] border border-[#D7E2EA]/10 bg-[#111111]/85 p-8 h-[450px]" />
        <div className="rounded-[40px] border border-[#D7E2EA]/10 bg-[#111111]/85 p-8 h-[450px]" />
      </div>
    </div>
  </div>
);

const GitHubSkeleton = () => (
  <div className="bg-white text-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 section-panel overflow-hidden">
    <div className="max-w-6xl mx-auto animate-pulse flex flex-col items-center">
      <div className="h-16 w-72 bg-black/10 rounded-3xl mb-4" />
      <div className="h-4 w-48 bg-black/5 rounded-full mb-16" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 items-start w-full">
        <div className="lg:col-span-1 rounded-[40px] border border-black/10 bg-[#F8F9FA] p-8 h-[380px]" />
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[30px] border border-black/10 bg-[#F8F9FA]/75 p-6 h-[180px]" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SectionSkeleton = ({ bg = '#FFFFFF' }: { bg?: string }) => (
  <div className="section-panel px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 overflow-hidden" style={{ backgroundColor: bg }}>
    <div className="max-w-6xl mx-auto animate-pulse flex flex-col items-center">
      <div className="h-16 w-64 rounded-3xl mb-4" style={{ backgroundColor: bg === '#FFFFFF' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }} />
      <div className="h-4 w-48 rounded-full mb-16" style={{ backgroundColor: bg === '#FFFFFF' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }} />
    </div>
  </div>
);

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomingOut, setIsZoomingOut] = useState(false);

  // Map approximate scroll positions to colors
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.12, 0.15, 0.25, 0.3, 0.45, 0.5, 0.6, 0.65, 0.75, 0.8, 1],
    [
      "#0C0C0C", // Hero + Marquee
      "#0C0C0C", // About start
      "#FFFFFF", // Services
      "#FFFFFF", // Services end
      "#0C0C0C", // Education
      "#0C0C0C", // Education end
      "#FFFFFF", // TechStack / Certs
      "#FFFFFF", // TechStack / Certs end
      "#0C0C0C", // Projects
      "#0C0C0C", // Projects end
      "#FFFFFF", // GitHub Activity
      "#0C0C0C"  // Contact
    ]
  );

  return (
    <motion.div className="min-h-screen text-[#D7E2EA] overflow-x-clip font-kanit" style={{ backgroundColor }}>
      {isLoading && (
        <Preloader 
          onComplete={() => setIsLoading(false)} 
          onStartZoomOut={() => setIsZoomingOut(true)}
        />
      )}
      
      <ScrollToTop />
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#B600A8] origin-left z-50"
        style={{ scaleX }}
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isZoomingOut ? 1 : 0.8, opacity: isZoomingOut ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
        style={{ transformOrigin: "50% 50vh" }}
      >
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ServicesSection />
        <EducationSection />
        <Suspense fallback={<SectionSkeleton bg="#FFFFFF" />}>
          <TechStackSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton bg="#0C0C0C" />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton bg="#FFFFFF" />}>
          <CertificationsSection />
        </Suspense>
        <Suspense fallback={<StatsSkeleton />}>
          <CodingStatsSection />
        </Suspense>
        <Suspense fallback={<GitHubSkeleton />}>
          <GitHubActivitySection />
        </Suspense>
        <ContactSection />
      </motion.div>
    </motion.div>
  );
}

export default App;

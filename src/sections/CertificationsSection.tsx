import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import GradientCarousel, { type GradientCarouselItem } from '../components/GradientCarousel';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, ShieldCheck } from 'lucide-react';

export const certificationsData: GradientCarouselItem[] = [
  {
    id: 'cisco-cpp-adv',
    title: 'C++ Advanced',
    issuer: 'Cisco Networking Academy',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '04 Jan 2026',
    image: '/assets/certificates/Cisco_CPP_Advanced.png',
    pdf: '/assets/certificates/Cisco_CPP_Advanced.pdf',
    verifyUrl: 'https://www.netacad.com',
    tags: ['C++', 'Advanced OOP', 'STL', 'Aditya University'],
    gradient: {
      primary: '#00BCEB',
      secondary: '#10B981',
      ambient: 'rgba(0, 188, 235, 0.4)',
      accentGlow: '#00BCEB',
    },
  },
  {
    id: 'coursera-ai',
    title: 'Artificial Intelligence',
    issuer: 'Aditya University / Coursera',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'Mar 3, 2026',
    image: '/assets/certificates/Coursera_Artificial_Intelligence.png',
    pdf: '/assets/certificates/Coursera_Artificial_Intelligence.pdf',
    verifyUrl: 'https://coursera.org/verify/8TVUA38G057O',
    tags: ['Artificial Intelligence', 'Coursera', 'Aditya University', 'ML Algorithms'],
    gradient: {
      primary: '#0056D2',
      secondary: '#A855F7',
      ambient: 'rgba(0, 86, 210, 0.4)',
      accentGlow: '#A855F7',
    },
  },
  {
    id: 'infosys-python',
    title: 'Basics of Python',
    issuer: 'Infosys Springboard',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'Nov 12, 2025',
    image: '/assets/certificates/Infosys_Basics_of_Python.png',
    pdf: '/assets/certificates/Infosys_Basics_of_Python.pdf',
    verifyUrl: 'https://verify.onwingspan.com',
    tags: ['Python', 'Problem Solving', 'Infosys Springboard', 'Syntax & OOP'],
    gradient: {
      primary: '#387EB8',
      secondary: '#F59E0B',
      ambient: 'rgba(56, 126, 184, 0.4)',
      accentGlow: '#F59E0B',
    },
  },
  {
    id: 'infosys-cpp',
    title: 'Programming Using C++',
    issuer: 'Infosys Springboard',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'Nov 12, 2025',
    image: '/assets/certificates/Infosys_Programming_Using_CPP.png',
    pdf: '/assets/certificates/Infosys_Programming_Using_CPP.pdf',
    verifyUrl: 'https://verify.onwingspan.com',
    tags: ['C++', 'Memory Management', 'Algorithms', 'Wingspan Certified'],
    gradient: {
      primary: '#007CC3',
      secondary: '#00C0F3',
      ambient: 'rgba(0, 124, 195, 0.4)',
      accentGlow: '#00C0F3',
    },
  },
];

const CertificationsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="bg-[#0C0C0C] section-panel px-4 sm:px-8 md:px-12 py-24 sm:py-32 relative z-20 overflow-hidden text-white transition-colors duration-700"
    >
      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div style={{ y: headerY }} className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <FadeIn delay={0.1} y={20}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-4">
              <ShieldCheck className="w-4 h-4 text-[#B600A8]" />
              <span className="text-[#D7E2EA]/70 text-xs sm:text-sm font-mono tracking-widest uppercase">
                Verified Credentials
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} y={30}>
            <ScrollRevealText
              text="Certifications"
              as="h2"
              splitBy="chars"
              className="text-[#D7E2EA] font-black uppercase text-center mb-4 text-[clamp(2.8rem,7vw,90px)] leading-none tracking-tight"
              delay={0.03}
            />
          </FadeIn>

          <FadeIn delay={0.3} y={20}>
            <p className="text-[#D7E2EA]/70 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Global and institutional certifications validating expertise in modern C++, Python, Artificial Intelligence, and scalable system architectures.
            </p>
          </FadeIn>
        </motion.div>

        {/* ─── 3D GRADIENT CAROUSEL ─── */}
        <FadeIn delay={0.35} y={30}>
          <GradientCarousel
            items={certificationsData}
            cardWidth={420}
            cardHeight={530}
            showControls={true}
            showIndicators={true}
          />
        </FadeIn>

        {/* Bottom Verification Footer Note */}
        <FadeIn delay={0.4} y={20}>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/[0.06] text-xs sm:text-sm text-[#D7E2EA]/45 font-mono">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#B600A8]" />
              4 Authenticated Certifications
            </span>
            <span>•</span>
            <span>Issued by Cisco, Coursera & Infosys</span>
            <span>•</span>
            <span className="text-white/60">Drag or swipe to explore in 3D</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CertificationsSection;

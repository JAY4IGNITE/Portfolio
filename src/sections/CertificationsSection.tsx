import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import GradientCarousel from '../components/GradientCarousel';
import { motion, useScroll, useTransform } from 'framer-motion';
import { certificationsData } from '@/data/certifications';

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
      {/* Subtle Background Matrix */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Block */}
        <motion.div style={{ y: headerY }} className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <FadeIn delay={0.2} y={30}>
            <ScrollRevealText
              text="Certifications"
              as="h2"
              splitBy="chars"
              className="text-white font-black uppercase text-center mb-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-none tracking-tight"
              delay={0.03}
            />
          </FadeIn>

          <FadeIn delay={0.3} y={20}>
            <p className="text-[#D7E2EA]/70 text-base sm:text-lg md:text-xl font-light leading-relaxed">
              Official industry certifications validating competencies in Generative AI, Full-Stack Development, Red Hat System Administration, Cloud Architecture, and Advanced Systems Programming.
            </p>
          </FadeIn>
        </motion.div>

        {/* ─── 3D GRADIENT CAROUSEL ─── */}
        <FadeIn delay={0.36} y={30}>
          <GradientCarousel 
            items={certificationsData}
            cardWidth={430}
            cardHeight={540}
            showControls={false}
            showIndicators={false}
            autoScroll={true}
            autoScrollInterval={3800}
            pauseOnHover={true}
          />
        </FadeIn>
      </div>
    </section>
  );
};

export default CertificationsSection;

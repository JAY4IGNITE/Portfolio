import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import { motion, useScroll, useTransform } from 'framer-motion';

const services = [
  {
    number: '01',
    name: 'Web & Frontend Development',
    description:
      'Building responsive, highly interactive, and pixel-perfect user interfaces using modern technologies like React, JavaScript, and advanced CSS.',
  },
  {
    number: '02',
    name: 'Backend & API Engineering',
    description:
      'Developing secure, scalable server-side logic and robust RESTful APIs utilizing Java, Python, and SQL database management systems.',
  },
  {
    number: '03',
    name: 'UI/UX & Interactive Design',
    description:
      'Designing intuitive user journeys, wireframes, and modern layouts with close attention to typography, branding, and delightful animations.',
  },
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-white section-panel px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <motion.div style={{ y: headerY }}>
        <ScrollRevealText
          text="Services"
          as="h2"
          splitBy="chars"
          className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 text-[clamp(3rem,8vw,110px)] leading-none"
          delay={0.03}
        />
      </motion.div>

      <div className="max-w-5xl mx-auto">
        {services.map((service, i) => (
          <FadeIn key={service.number} delay={i * 0.1} y={30}>
            <motion.div
              className="flex flex-col xs:flex-row items-start gap-3 xs:gap-6 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12 relative cursor-pointer group"
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              {/* Animated border-bottom */}
              <motion.div
                className="absolute bottom-0 left-0 h-[1px] bg-[#B600A8]"
                variants={{
                  rest: { width: '0%', opacity: 0 },
                  hover: { width: '100%', opacity: 1 },
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              />
              {/* Static border (default) */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#0C0C0C]/15 group-hover:opacity-0 transition-opacity duration-300"
              />

              {/* Number — slides right + glows on hover */}
              <motion.span
                className="font-black text-[#0C0C0C] leading-none flex-shrink-0 transition-all duration-300"
                style={{ fontSize: 'clamp(2rem, 10vw, 140px)' }}
                variants={{
                  rest: { x: 0, textShadow: '0 0 0px transparent' },
                  hover: { x: 12, textShadow: '0 0 20px rgba(182, 0, 168, 0.3)' },
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                {service.number}
              </motion.span>

              {/* Name + Description */}
              <div className="flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-4 md:pt-6">
                <motion.h3
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                  variants={{
                    rest: { color: '#0C0C0C' },
                    hover: { color: '#B600A8' },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {service.name}
                </motion.h3>
                <p
                  className="font-light leading-relaxed text-[#0C0C0C] opacity-60 max-w-2xl"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
                >
                  {service.description}
                </p>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;

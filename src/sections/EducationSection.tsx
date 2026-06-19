import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import { motion, useScroll, useTransform } from 'framer-motion';

interface EducationItem {
  period: string;
  title: string;
  institution: string;
  description: string;
  score: string;
}

const education: EducationItem[] = [
  {
    period: '2024 - 2028',
    title: 'B.Tech in Computer Science',
    institution: 'Aditya University',
    description:
      'Currently pursuing Bachelor\'s degree with focus on web development, data structures, and algorithms. Active participant in coding competitions and technical events.',
    score: 'Currently Pursuing',
  },
  {
    period: '2022 - 2024',
    title: 'Intermediate Education',
    institution: 'Sasi New Gen Junior College',
    description:
      'Completed intermediate with strong foundation in mathematics and physics, which enhanced problem-solving abilities.',
    score: '96.9%',
  },
  {
    period: '2021 - 2022',
    title: 'SSC Examination',
    institution: "G.B.R E.M School",
    description:
      'Completed SSC. First exposure to computer science which sparked interest in programming.',
    score: '92.17%',
  },
];

const EducationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={sectionRef} className="bg-[#0C0C0C] section-panel px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <motion.div style={{ y: headerY }}>
        <ScrollRevealText
          text="Education"
          as="h2"
          splitBy="chars"
          className="text-[#D7E2EA] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 text-[clamp(3rem,8vw,110px)] leading-none"
          delay={0.03}
        />
      </motion.div>

      <div className="max-w-4xl mx-auto relative">
        {/* Timeline line */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#B600A8] via-[#7621B0] to-[#BE4C00] rounded-full" />

        {education.map((item, i) => (
          <FadeIn key={i} delay={i * 0.12} y={30}>
            <div className="relative pl-12 sm:pl-16 pb-12 sm:pb-16 last:pb-0 group">
              {/* Timeline dot */}
              <div
                className="absolute left-[9px] sm:left-[17px] top-[6px] sm:top-[8px] w-[14px] h-[14px] rounded-full border-[3px] border-[#B600A8] bg-[#0C0C0C] group-hover:bg-[#B600A8] transition-colors duration-300"
              />

              {/* Title */}
              <h3
                className="text-[#D7E2EA] font-bold uppercase mb-1"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}
              >
                {item.title}
              </h3>

              {/* Institution & Period */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                <span className="text-[#B600A8] font-medium text-sm sm:text-base">
                  {item.institution}
                </span>
                <span className="text-[#D7E2EA]/30 text-xs sm:text-sm">•</span>
                <span className="text-[#D7E2EA]/60 text-xs sm:text-sm font-light uppercase tracking-wider">
                  {item.period}
                </span>
              </div>

              {/* Description */}
              <p className="text-[#D7E2EA]/70 font-light leading-relaxed text-sm sm:text-base max-w-xl">
                {item.description}
              </p>

              {/* Score */}
              {item.score && (
                <span className="inline-block mt-3 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-medium border border-[#D7E2EA]/10 text-[#D7E2EA]/70 bg-white/5">
                  {item.score}
                </span>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;

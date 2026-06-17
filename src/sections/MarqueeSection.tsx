import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

interface TechItem {
  name: string;
  category: string;
  color: string;
  glowColor: string;
}

const row1Tech: TechItem[] = [
  { name: 'HTML5', category: 'Frontend', color: '#E34F26', glowColor: 'rgba(227, 79, 38, 0.15)' },
  { name: 'CSS3', category: 'Frontend', color: '#1572B6', glowColor: 'rgba(21, 114, 182, 0.15)' },
  { name: 'JavaScript', category: 'Frontend', color: '#F7DF1E', glowColor: 'rgba(247, 223, 30, 0.15)' },
  { name: 'Java', category: 'Backend', color: '#007396', glowColor: 'rgba(0, 115, 150, 0.15)' },
  { name: 'Python', category: 'Backend', color: '#3776AB', glowColor: 'rgba(55, 118, 171, 0.15)' },
  { name: 'C Language', category: 'Backend', color: '#A8B9CC', glowColor: 'rgba(168, 185, 204, 0.15)' },
  { name: 'React', category: 'Frontend', color: '#61DAFB', glowColor: 'rgba(97, 218, 251, 0.15)' },
];

const row2Tech: TechItem[] = [
  { name: 'MySQL', category: 'Database', color: '#4479A1', glowColor: 'rgba(68, 121, 161, 0.15)' },
  { name: 'Git', category: 'Tools', color: '#F05032', glowColor: 'rgba(240, 80, 50, 0.15)' },
  { name: 'LaTeX', category: 'Tools', color: '#008080', glowColor: 'rgba(0, 128, 128, 0.15)' },
  { name: 'Tailwind CSS', category: 'Frontend', color: '#06B6D4', glowColor: 'rgba(6, 182, 212, 0.15)' },
  { name: 'Node.js', category: 'Backend', color: '#339933', glowColor: 'rgba(51, 153, 51, 0.15)' },
  { name: 'Vite', category: 'Tools', color: '#646CFF', glowColor: 'rgba(100, 108, 255, 0.15)' },
  { name: 'Red Hat Linux', category: 'OS', color: '#EE0000', glowColor: 'rgba(238, 0, 0, 0.15)' },
];

// Double lists to enable seamless loop
const row1Doubled = [...row1Tech, ...row1Tech, ...row1Tech];
const row2Doubled = [...row2Tech, ...row2Tech, ...row2Tech];

const MarqueeSection = () => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const rawSkewY = useTransform(scrollVelocity, [-3000, 3000], ["-3deg", "3deg"]);
  const skewY = useSpring(rawSkewY, { stiffness: 400, damping: 40 });

  return (
    <section className="bg-[#0C0C0C] pt-20 sm:pt-28 md:pt-36 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 mb-10 sm:mb-12">
        <p className="text-[#D7E2EA]/40 text-center uppercase tracking-widest text-xs font-semibold">
          Interactive Technologies
        </p>
      </div>

      {/* Row 1 - moves right */}
      <motion.div className="flex gap-4 mb-5 group overflow-hidden w-full relative marquee-row" style={{ skewY }}>
        <div
          className="flex gap-4 shrink-0 min-w-full"
          style={{
            animation: 'marquee-right 30s linear infinite',
            animationPlayState: 'running',
          }}
        >
          {row1Doubled.map((tech, i) => (
            <div
              key={`r1-${i}`}
              className="flex flex-col justify-center px-8 py-5 h-[90px] w-[210px] sm:w-[250px] sm:h-[105px] rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex-shrink-0 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:-translate-y-1"
              style={{
                boxShadow: `inset 0 0 20px ${tech.glowColor}, 0 4px 30px rgba(0, 0, 0, 0.5)`,
              }}
            >
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/40 mb-1">
                {tech.category}
              </span>
              <span 
                className="text-base sm:text-lg font-black uppercase tracking-wider"
                style={{ color: tech.color }}
              >
                {tech.name}
              </span>
              <div 
                className="absolute right-4 bottom-4 w-1.5 h-1.5 rounded-full"
                style={{ 
                  backgroundColor: tech.color,
                  boxShadow: `0 0 8px ${tech.color}` 
                }} 
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Row 2 - moves left */}
      <motion.div className="flex gap-4 group overflow-hidden w-full relative marquee-row" style={{ skewY }}>
        <div
          className="flex gap-4 shrink-0 min-w-full"
          style={{
            animation: 'marquee-left 32s linear infinite',
            animationPlayState: 'running',
          }}
        >
          {row2Doubled.map((tech, i) => (
            <div
              key={`r2-${i}`}
              className="flex flex-col justify-center px-8 py-5 h-[90px] w-[210px] sm:w-[250px] sm:h-[105px] rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md flex-shrink-0 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:-translate-y-1"
              style={{
                boxShadow: `inset 0 0 20px ${tech.glowColor}, 0 4px 30px rgba(0, 0, 0, 0.5)`,
              }}
            >
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-[#D7E2EA]/40 mb-1">
                {tech.category}
              </span>
              <span 
                className="text-base sm:text-lg font-black uppercase tracking-wider"
                style={{ color: tech.color }}
              >
                {tech.name}
              </span>
              <div 
                className="absolute right-4 bottom-4 w-1.5 h-1.5 rounded-full"
                style={{ 
                  backgroundColor: tech.color,
                  boxShadow: `0 0 8px ${tech.color}` 
                }} 
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default MarqueeSection;

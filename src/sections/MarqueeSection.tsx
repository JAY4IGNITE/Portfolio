import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

interface TechItem {
  name: string;
  category: string;
  color: string;
  glowColor: string;
}

const row1Tech: TechItem[] = [
  { name: 'React.js', category: 'Frontend', color: '#61DAFB', glowColor: 'rgba(97, 218, 251, 0.2)' },
  { name: 'TypeScript', category: 'Language', color: '#3178C6', glowColor: 'rgba(49, 120, 198, 0.2)' },
  { name: 'JavaScript', category: 'Frontend', color: '#F7DF1E', glowColor: 'rgba(247, 223, 30, 0.2)' },
  { name: 'Python', category: 'AI & Backend', color: '#38BDF8', glowColor: 'rgba(56, 189, 248, 0.2)' },
  { name: 'C++', category: 'Algorithms', color: '#00599C', glowColor: 'rgba(0, 89, 156, 0.2)' },
  { name: 'Java', category: 'OOP & Systems', color: '#F97316', glowColor: 'rgba(249, 115, 22, 0.2)' },
  { name: 'FastAPI', category: 'Backend', color: '#059669', glowColor: 'rgba(5, 150, 105, 0.2)' },
  { name: 'Node.js', category: 'Runtime', color: '#22C55E', glowColor: 'rgba(34, 197, 94, 0.2)' },
];

const row2Tech: TechItem[] = [
  { name: 'MongoDB', category: 'Database', color: '#10B981', glowColor: 'rgba(16, 185, 129, 0.2)' },
  { name: 'Express.js', category: 'Backend', color: '#E2E8F0', glowColor: 'rgba(226, 232, 240, 0.15)' },
  { name: 'PostgreSQL', category: 'Database', color: '#38BDF8', glowColor: 'rgba(56, 189, 248, 0.2)' },
  { name: 'Supabase', category: 'Backend & Auth', color: '#3ECF8E', glowColor: 'rgba(62, 207, 142, 0.2)' },
  { name: 'Tailwind CSS', category: 'Styling', color: '#06B6D4', glowColor: 'rgba(6, 182, 212, 0.2)' },
  { name: 'OCI GenAI', category: 'Cloud & AI', color: '#C74634', glowColor: 'rgba(199, 70, 52, 0.2)' },
  { name: 'MySQL', category: 'Database', color: '#0284C7', glowColor: 'rgba(2, 132, 199, 0.2)' },
  { name: 'Red Hat Linux', category: 'SysAdmin', color: '#EE0000', glowColor: 'rgba(238, 0, 0, 0.2)' },
  { name: 'Git & GitHub', category: 'Tooling', color: '#F05032', glowColor: 'rgba(240, 80, 50, 0.2)' },
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
      <div className="max-w-7xl mx-auto px-5 mb-10 sm:mb-14 flex items-center justify-center gap-4">
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-white/10" />
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-sm">
          <span className="text-[#D7E2EA]/75 text-xs font-mono tracking-widest uppercase font-semibold">
            Core Technologies & Frameworks
          </span>
        </div>
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-white/10" />
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

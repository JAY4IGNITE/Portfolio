import { useRef, useState, useEffect } from 'react';
import FadeIn from '../components/FadeIn';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Palette, Server, Wrench } from 'lucide-react';

interface Skill {
  name: string;
  percentage: number;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: <Palette className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: '#B600A8',
    skills: [
      { name: 'HTML5', percentage: 90 },
      { name: 'CSS3', percentage: 85 },
      { name: 'JavaScript', percentage: 75 },
    ],
  },
  {
    title: 'Backend & Languages',
    icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: '#7621B0',
    skills: [
      { name: 'Java', percentage: 80 },
      { name: 'Python', percentage: 75 },
      { name: 'C', percentage: 70 },
    ],
  },
  {
    title: 'Database & Tools',
    icon: <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: '#BE4C00',
    skills: [
      { name: 'MySQL', percentage: 75 },
      { name: 'Git', percentage: 70 },
      { name: 'LaTeX', percentage: 65 },
    ],
  },
];

// Coordinate calculations for Heptagon SVG Radar Chart
const radarSkills = [
  { label: 'HTML5', value: 90, years: '3 yrs' },
  { label: 'CSS3', value: 85, years: '3 yrs' },
  { label: 'JavaScript', value: 75, years: '2 yrs' },
  { label: 'Java', value: 80, years: '3 yrs' },
  { label: 'Python', value: 75, years: '2 yrs' },
  { label: 'C', value: 70, years: '2 yrs' },
  { label: 'MySQL', value: 75, years: '2 yrs' },
];

/* Animated percentage counter */
const AnimatedPercentage = ({ value, delay }: { value: number; delay: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ delay, duration: 0.4 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
      >
        {value}%
      </motion.span>
    </motion.span>
  );
};

const TechStackSection = () => {
  const center = 160;
  const radius = 100;
  const sides = radarSkills.length;
  const chartRef = useRef<HTMLDivElement>(null);
  const isChartInView = useInView(chartRef, { once: true, margin: '-80px' });
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);

  const getCoordinates = (index: number, valPercent: number) => {
    const angle = (index * 2 * Math.PI) / sides - Math.PI / 2;
    const currentRadius = (valPercent / 100) * radius;
    const x = center + currentRadius * Math.cos(angle);
    const y = center + currentRadius * Math.sin(angle);
    return { x, y };
  };

  // Generate grid heptagons
  const gridLevels = [20, 40, 60, 80, 100];
  const gridPolygons = gridLevels.map((level) => {
    const points = Array.from({ length: sides }, (_, i) => {
      const coord = getCoordinates(i, level);
      return `${coord.x},${coord.y}`;
    }).join(' ');
    return points;
  });

  // Build SVG path string for the skill polygon (for path-draw animation)
  const skillPathCoords = radarSkills.map((s, i) => getCoordinates(i, s.value));


  const skillPath = skillPathCoords
    .map((coord, i) => `${i === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`)
    .join(' ') + ' Z';

  // Generate axes lines
  const axesLines = Array.from({ length: sides }, (_, i) => {
    const coord = getCoordinates(i, 100);
    return { x1: center, y1: center, x2: coord.x, y2: coord.y };
  });

  const [labelDistanceMultiplier, setLabelDistanceMultiplier] = useState(1.4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setLabelDistanceMultiplier(1.4);
      } else {
        setLabelDistanceMultiplier(1.25);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const labelPositions = radarSkills.map((s, i) => {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = center + radius * labelDistanceMultiplier * Math.cos(angle);
    const y = center + radius * labelDistanceMultiplier * Math.sin(angle);
    return { label: s.label, x, y };
  });

  // Calculate total path length for stroke-dasharray animation
  const calcPathLength = () => {
    let total = 0;
    for (let i = 0; i < skillPathCoords.length; i++) {
      const next = skillPathCoords[(i + 1) % skillPathCoords.length];
      const dx = next.x - skillPathCoords[i].x;
      const dy = next.y - skillPathCoords[i].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  };
  const pathLength = calcPathLength();

  return (
    <section
      id="tech-stack"
      className="bg-white section-panel px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-20"
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn delay={0} y={40}>
          <h2
            className="text-[#0C0C0C] font-black uppercase text-center mb-4"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 120px)' }}
          >
            Tech Stack
          </h2>
          <p className="text-[#0C0C0C]/60 text-center uppercase tracking-widest text-xs sm:text-sm font-medium mb-16 sm:mb-20">
            Technologies I work with
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Custom SVG Radar Chart */}
          <FadeIn delay={0.15} y={40} className="flex justify-center items-center">
            <div
              ref={chartRef}
              className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] aspect-square p-0 sm:p-2 mx-auto"
            >
              {/* Subtle rotating glow behind the chart */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0"
                style={{
                  background: 'radial-gradient(circle, rgba(182,0,168,0.08) 0%, transparent 70%)',
                }}
                animate={isChartInView ? { opacity: 1, rotate: 360 } : {}}
                transition={{ opacity: { duration: 1.5 }, rotate: { duration: 30, repeat: Infinity, ease: 'linear' } }}
              />

              <svg
                viewBox="0 0 320 320"
                className="w-full h-full relative z-10"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <clipPath id="radar-clip">
                    <motion.circle
                      cx={center}
                      cy={center}
                      initial={{ r: 0 }}
                      animate={isChartInView ? { r: 160 } : {}}
                      transition={{ delay: 1.5, duration: 1.2, type: 'spring', bounce: 0.35 }}
                    />
                  </clipPath>
                </defs>

                {/* Background Grid Lines (Heptagons) — staggered fade-in */}
                {gridPolygons.map((points, index) => (
                  <motion.polygon
                    key={index}
                    points={points}
                    className="fill-none stroke-[#0c0c0c]/10 stroke-[1px]"
                    initial={{ opacity: 0 }}
                    animate={isChartInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                  />
                ))}

                {/* Axes Lines — staggered draw-in */}
                {axesLines.map((line, index) => (
                  <motion.line
                    key={index}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    className="stroke-[#0c0c0c]/10 stroke-[1px]"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isChartInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.3 + index * 0.06, duration: 0.6, ease: 'easeOut' }}
                  />
                ))}

                {/* Animated Skill Polygon — path draw-in effect */}
                <motion.path
                  d={skillPath}
                  className="fill-none stroke-[#B600A8] stroke-[2px]"
                  initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
                  animate={isChartInView ? { strokeDashoffset: 0 } : {}}
                  transition={{ delay: 0.8, duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                />
                
                {/* Fill grows from center outward using clipPath */}
                <motion.path
                  d={skillPath}
                  className="stroke-none"
                  style={{ fill: 'rgba(182,0,168,0.15)' }}
                  clipPath="url(#radar-clip)"
                  initial={{ opacity: 0 }}
                  animate={isChartInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5, duration: 0.2 }}
                />

                {/* Skill Nodes / Circles — staggered spring pop-in */}
                {radarSkills.map((s, i) => {
                  const coord = getCoordinates(i, s.value);
                  return (
                    <g 
                      key={i}
                      onMouseEnter={() => setHoveredSkill(i)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      onFocus={() => setHoveredSkill(i)}
                      onBlur={() => setHoveredSkill(null)}
                      className="cursor-pointer outline-none"
                      tabIndex={0}
                    >
                      {/* Invisible larger hover target */}
                      <circle cx={coord.x} cy={coord.y} r="20" fill="transparent" />
                      
                      {/* Outer glow ring */}
                      <motion.circle
                        cx={coord.x}
                        cy={coord.y}
                        r="10"
                        className="fill-[#B600A8]/10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isChartInView ? { scale: 1, opacity: 1 } : {}}
                        whileHover={{ scale: 1.5, opacity: 1, fill: 'rgba(182,0,168,0.2)' }}
                        transition={{
                          delay: isChartInView && hoveredSkill === null ? 1.2 + i * 0.12 : 0,
                          type: 'spring',
                          stiffness: 300,
                          damping: 15,
                        }}
                      />
                      {/* Main dot */}
                      <motion.circle
                        cx={coord.x}
                        cy={coord.y}
                        r="4.5"
                        className="fill-[#B600A8] stroke-white stroke-[2px]"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={isChartInView ? { scale: 1, opacity: 1 } : {}}
                        whileHover={{ scale: 1.2 }}
                        transition={{
                          delay: isChartInView && hoveredSkill === null ? 1.2 + i * 0.12 : 0,
                          type: 'spring',
                          stiffness: 400,
                          damping: 12,
                        }}
                      />
                    </g>
                  );
                })}

                {/* Text Labels — staggered fade-in */}
                {labelPositions.map((pos, i) => {
                  let textAnchor: "middle" | "end" | "start" = 'middle';
                  if (pos.x < center - 10) textAnchor = 'end';
                  else if (pos.x > center + 10) textAnchor = 'start';

                  return (
                    <motion.text
                      key={i}
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor={textAnchor}
                      className="fill-[#0C0C0C] font-semibold uppercase tracking-wide"
                      style={{ fontSize: '9px' }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={isChartInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.8 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                    >
                      {pos.label}
                    </motion.text>
                  );
                })}
              </svg>

              {/* Tooltips */}
              <AnimatePresence>
                {hoveredSkill !== null && (
                  <motion.div
                    className="absolute z-50 bg-[#0C0C0C] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8, y: -15, x: '-50%' }}
                    animate={{ opacity: 1, scale: 1, y: -25, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.8, y: -15, x: '-50%' }}
                    transition={{ duration: 0.15 }}
                    style={{
                      left: `${(getCoordinates(hoveredSkill, radarSkills[hoveredSkill].value).x / 320) * 100}%`,
                      top: `${(getCoordinates(hoveredSkill, radarSkills[hoveredSkill].value).y / 320) * 100}%`,
                    }}
                  >
                    {radarSkills[hoveredSkill].years} Exp
                    
                    {/* Tooltip caret */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-[#0C0C0C]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>

          {/* Skill Progress Bars Grid */}
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
            {skillCategories.map((category, catIdx) => (
              <FadeIn key={category.title} delay={catIdx * 0.15} y={30}>
                {/* Category header with icon color pop */}
                <motion.div
                  className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.1, duration: 0.5, ease: 'easeOut' }}
                >
                  <motion.div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${category.color}15` }}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div style={{ color: category.color }}>{category.icon}</div>
                  </motion.div>
                  <h3 className="font-bold text-[#0C0C0C] uppercase tracking-wider text-sm sm:text-base md:text-lg">
                    {category.title}
                  </h3>
                </motion.div>

                <div className="space-y-4 sm:space-y-5">
                  {category.skills.map((skill, skillIdx) => {
                    const globalDelay = catIdx * 0.2 + skillIdx * 0.12;
                    return (
                      <motion.div
                        key={skill.name}
                        className="flex flex-col gap-2 group"
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: globalDelay, duration: 0.4, ease: 'easeOut' }}
                      >
                        <div className="flex justify-between items-center text-xs sm:text-sm font-semibold uppercase text-[#0C0C0C]/80 tracking-wide">
                          <span className="transition-colors duration-300 group-hover:text-[#0C0C0C]">
                            {skill.name}
                          </span>
                          <AnimatedPercentage value={skill.percentage} delay={globalDelay + 0.3} />
                        </div>

                        {/* Progress Bar Track */}
                        <div className="h-1.5 sm:h-2 w-full bg-[#0C0C0C]/5 rounded-full overflow-hidden relative">
                          {/* Progress Fill */}
                          <motion.div
                            className="h-full rounded-full relative overflow-hidden"
                            style={{
                              background: `linear-gradient(90deg, ${category.color}, ${category.color}cc)`,
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{
                              delay: globalDelay + 0.15,
                              duration: 1,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                          >
                            {/* Shimmer sweep effect */}
                            <motion.div
                              className="absolute inset-0"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                              }}
                              initial={{ x: '-100%' }}
                              whileInView={{ x: '200%' }}
                              viewport={{ once: true }}
                              transition={{
                                delay: globalDelay + 1,
                                duration: 0.8,
                                ease: 'easeInOut',
                              }}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Currently Learning Section */}
        <FadeIn delay={0.4} y={30} className="mt-16 sm:mt-20 md:mt-24 pt-10 border-t border-[#0C0C0C]/10 text-center">
          <h3 className="font-bold text-[#0C0C0C] uppercase tracking-wider text-base sm:text-lg mb-6">
            Currently Learning & Next Up
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'React', progress: 'In Progress' },
              { name: 'TypeScript', progress: 'In Progress' },
              { name: 'Node.js', progress: 'Up Next' },
              { name: 'Next.js', progress: 'Up Next' }
            ].map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#0C0C0C]/10 bg-white hover:border-[#B600A8] hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#B600A8] animate-pulse" style={{ boxShadow: '0 0 8px #B600A8' }} />
                <span className="font-semibold text-sm uppercase text-[#0C0C0C]/80 group-hover:text-black">
                  {skill.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#B600A8]/10 text-[#B600A8]">
                  {skill.progress}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TechStackSection;

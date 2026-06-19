import FadeIn from '../components/FadeIn';
import { motion } from 'framer-motion';
import { Palette, Server, Wrench, Database, Cpu, Gamepad2 } from 'lucide-react';

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    icon: <Palette className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: '#B600A8',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'Vite'],
  },
  {
    title: 'Programming Languages',
    icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: '#7621B0',
    skills: ['Java', 'Python', 'C', 'C++'],
  },
  {
    title: 'Backend & Frameworks',
    icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: '#2563EB',
    skills: ['Node.js', 'Next.js', 'Java Swing', 'AWT', 'JDBC', 'OOP'],
  },
  {
    title: 'Databases',
    icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: '#059669',
    skills: ['MySQL', 'SQL'],
  },
  {
    title: 'Tools & Platforms',
    icon: <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: '#BE4C00',
    skills: ['Git', 'GitHub', 'VS Code', 'Red Hat Linux', 'LaTeX'],
  },
  {
    title: 'Python & Game Dev',
    icon: <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />,
    color: '#D97706',
    skills: ['Pygame', 'OOP Design', 'Game Physics'],
  },
];

const TechStackSection = () => {
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

        {/* Skill Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillCategories.map((category, catIdx) => (
            <FadeIn key={category.title} delay={catIdx * 0.1} y={30}>
              <div className="rounded-[24px] border border-[#0C0C0C]/8 bg-[#F8F9FA]/60 p-6 sm:p-7 hover:shadow-xl hover:border-[#0C0C0C]/15 transition-all duration-300 h-full">
                {/* Category header */}
                <motion.div
                  className="flex items-center gap-3 mb-5"
                  initial={{ x: -15, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.08, duration: 0.5, ease: 'easeOut' }}
                >
                  <motion.div
                    className="p-2.5 rounded-xl"
                    style={{ backgroundColor: `${category.color}15` }}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div style={{ color: category.color }}>{category.icon}</div>
                  </motion.div>
                  <h3 className="font-bold text-[#0C0C0C] uppercase tracking-wider text-xs sm:text-sm">
                    {category.title}
                  </h3>
                </motion.div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIdx) => (
                    <motion.span
                      key={skill}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border cursor-default"
                      style={{
                        borderColor: `${category.color}25`,
                        color: category.color,
                        backgroundColor: `${category.color}08`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{
                        scale: 1.08,
                        backgroundColor: `${category.color}18`,
                        borderColor: category.color,
                      }}
                      transition={{
                        delay: catIdx * 0.1 + skillIdx * 0.05,
                        type: 'spring',
                        stiffness: 350,
                        damping: 18,
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>


      </div>
    </section>
  );
};

export default TechStackSection;

import { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Rocket, 
  Sparkles, 
  Trophy, 
  Briefcase, 
  Award,
  Terminal,
  Flame
} from 'lucide-react';
import FadeIn from '../components/FadeIn';

interface JourneyMilestone {
  id: string;
  year: string;
  category: string;
  title: string;
  description: string;
  badge?: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string; // Tailwind hex or class helper
  theme: {
    border: string;
    text: string;
    glow: string;
    pillBg: string;
    gradient: string;
  };
}

const milestones: JourneyMilestone[] = [
  {
    id: 'btech',
    year: '2024',
    category: 'Academic Foundation',
    title: 'Started B.Tech CSE',
    description:
      'Joined Aditya University (AUS), building an uncompromising foundation in computer science fundamentals, data structures, algorithms, and core computing systems.',
    badge: 'GPA 8.78 / 10',
    tags: ['Data Structures', 'Algorithms', 'OOP', 'C++', 'Java'],
    icon: GraduationCap,
    accentColor: '#A855F7',
    theme: {
      border: 'border-purple-500/40 group-hover:border-purple-500/80',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]',
      pillBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      gradient: 'from-purple-500/20 via-transparent to-transparent',
    },
  },
  {
    id: 'desktop',
    year: '2024',
    category: 'Systems & Desktop Software',
    title: 'Architected Desktop Software Suite',
    description:
      'Engineered Java Calculator, ATM Banking System, and Hospital Appointment Management System — mastering event-driven UI, JDBC connectivity, and relational data architecture.',
    badge: '3 Deployed Apps',
    tags: ['Core Java', 'Swing GUI', 'JDBC', 'MySQL', 'RBAC'],
    icon: Rocket,
    accentColor: '#10B981',
    theme: {
      border: 'border-emerald-500/40 group-hover:border-emerald-500/80',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      pillBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      gradient: 'from-emerald-500/20 via-transparent to-transparent',
    },
  },
  {
    id: 'ai-smartapply',
    year: '2025',
    category: 'AI & Automation Ecosystem',
    title: 'AI & Automation Deep Dive: SmartApply',
    description:
      'Built SmartApply — an automated job application platform combining React, FastAPI, NVIDIA NIM (Llama 3), and custom Chrome extensions for automated resume matching and ATS optimization.',
    badge: 'NVIDIA NIM Powered',
    tags: ['React', 'FastAPI', 'Llama 3', 'Chrome Extension', 'MongoDB'],
    icon: Sparkles,
    accentColor: '#06B6D4',
    theme: {
      border: 'border-cyan-500/40 group-hover:border-cyan-500/80',
      text: 'text-cyan-400',
      glow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]',
      pillBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      gradient: 'from-cyan-500/20 via-transparent to-transparent',
    },
  },
  {
    id: 'hackathon',
    year: '2025',
    category: 'National Competitions',
    title: '2nd Place at ProjectSpace 8.0 & Google Hacksprint',
    description:
      'Awarded 2nd place out of 160 competing national teams for SmartApply. Led frontend architecture and backend REST API integration for CollabX at Google Hacksprint 2K25.',
    badge: '2nd / 160 Teams',
    tags: ['ProjectSpace 8.0', 'Google Hacksprint', 'Supabase', 'Leadership'],
    icon: Trophy,
    accentColor: '#F97316',
    theme: {
      border: 'border-orange-500/40 group-hover:border-orange-500/80',
      text: 'text-orange-400',
      glow: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]',
      pillBg: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
      gradient: 'from-orange-500/20 via-transparent to-transparent',
    },
  },
  {
    id: 'technical-hub',
    year: '2026',
    category: 'Full Stack Internship',
    title: 'Full Stack Developer Intern at Technical Hub',
    description:
      'Selected as Full Stack Development Intern at Technical Hub Private Limited, focusing on practical, real-time implementation of scalable web applications, REST APIs, and full-stack solutions.',
    badge: 'Technical Hub Intern',
    tags: ['Full Stack Development', 'React.js', 'Node.js', 'REST APIs', 'Real-time Implementation'],
    icon: Briefcase,
    accentColor: '#3B82F6',
    theme: {
      border: 'border-blue-500/40 group-hover:border-blue-500/80',
      text: 'text-blue-400',
      glow: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]',
      pillBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      gradient: 'from-blue-500/20 via-transparent to-transparent',
    },
  },
  {
    id: 'dsa',
    year: '2026',
    category: 'Problem Solving & Scale',
    title: '350+ DSA Solved & Scalable Systems',
    description:
      'Conquered 350+ LeetCode algorithmic challenges, achieved 2-Star rating on CodeChef (1400+), and delivered real-world event platforms serving 500+ active users with sub-200ms response times.',
    badge: 'LeetCode 350+ • 2★ CodeChef',
    tags: ['LeetCode', 'CodeChef', 'System Design', 'Scale', 'MongoDB'],
    icon: Award,
    accentColor: '#EAB308',
    theme: {
      border: 'border-yellow-500/40 group-hover:border-yellow-500/80',
      text: 'text-yellow-400',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.2)]',
      pillBg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
      gradient: 'from-yellow-500/20 via-transparent to-transparent',
    },
  },
];

const highlights = [
  { label: 'Academic Standing', value: '8.78 GPA', icon: GraduationCap, color: 'text-purple-400' },
  { label: 'Hackathon Rank', value: '2nd / 160', icon: Trophy, color: 'text-orange-400' },
  { label: 'DSA Solved', value: '350+ Problems', icon: Terminal, color: 'text-yellow-400' },
  { label: 'Production Scale', value: '500+ Users', icon: Flame, color: 'text-cyan-400' },
];

const JourneySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const beamHeight = useTransform(scrollYProgress, [0.08, 0.85], ['0%', '100%']);

  const filteredMilestones = milestones;

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="bg-[#0C0C0C] section-panel px-5 sm:px-8 md:px-12 py-24 sm:py-32 md:py-40 relative z-20 overflow-hidden"
    >
      {/* Background Matrix / Grid Accent */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#A855F7]/8 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute top-3/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-[#06B6D4]/8 blur-[170px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">

          <FadeIn delay={0.2} y={25}>
            <h2
              className="text-[#D7E2EA] font-black tracking-tight leading-[1.08] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}
            >
              From foundations to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B600A8] via-[#A855F7] to-[#06B6D4]">
                production.
              </span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.3} y={20}>
            <p className="text-[#D7E2EA]/70 text-base sm:text-lg md:text-xl font-light leading-relaxed">
              Every milestone marked a leap in software craftsmanship — engineering real systems, winning hackathons, and shipping code that scales.
            </p>
          </FadeIn>
        </div>

        {/* Highlights HUD Strip */}
        <FadeIn delay={0.35} y={20}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16 sm:mb-20">
            {highlights.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/[0.08] bg-[#121214]/60 backdrop-blur-md p-4 sm:p-5 flex items-center gap-3.5 hover:border-white/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                    <StatIcon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs text-[#D7E2EA]/50 font-light">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>


        {/* Timeline Stream */}
        <div className="relative">
          {/* Desktop Central Spine Track */}
          <div className="hidden md:block absolute left-1/2 top-6 bottom-6 -translate-x-1/2 w-[2px] bg-white/[0.08]" />

          {/* Desktop Central Illuminated Laser Line (Scroll-driven) */}
          <motion.div
            style={{ height: beamHeight }}
            className="hidden md:block absolute left-1/2 top-6 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#B600A8] via-[#A855F7] to-[#06B6D4] shadow-[0_0_12px_#A855F7] origin-top z-0"
          />

          {/* Mobile Left Spine Track */}
          <div className="block md:hidden absolute left-[26px] sm:left-[30px] top-6 bottom-6 w-[2px] bg-white/[0.08]" />

          {/* Mobile Left Illuminated Laser Line */}
          <motion.div
            style={{ height: beamHeight }}
            className="block md:hidden absolute left-[26px] sm:left-[30px] top-6 w-[2px] bg-gradient-to-b from-[#B600A8] via-[#A855F7] to-[#06B6D4] shadow-[0_0_12px_#A855F7] origin-top z-0"
          />

          {/* Milestone Items */}
          <div className="space-y-12 sm:space-y-16 md:space-y-24">
            <AnimatePresence mode="popLayout">
              {filteredMilestones.map((milestone, index) => {
                const isEven = index % 2 === 1; // Left or Right on desktop
                const Icon = milestone.icon;
                const itemIndexStr = String(index + 1).padStart(2, '0');

                return (
                  <motion.div
                    key={milestone.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col md:flex-row items-start md:items-center group"
                  >
                    {/* Left Column (Desktop: Odd index items) */}
                    <div className="hidden md:block w-1/2 pr-12 lg:pr-16 text-right">
                      {!isEven && (
                        <div className="relative rounded-[28px] border border-white/[0.08] bg-[#111114]/85 backdrop-blur-xl p-7 lg:p-8 hover:border-white/25 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden">
                          {/* Ambient Card Corner Glow */}
                          <div
                            className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${milestone.theme.gradient}`}
                          />

                          {/* Watermark Number */}
                          <div className="absolute right-4 bottom-2 text-white/[0.03] font-mono font-black text-7xl select-none pointer-events-none">
                            {itemIndexStr}
                          </div>

                          {/* Top Meta Bar */}
                          <div className="flex items-center justify-end gap-3 mb-4">
                            <span className="text-xs font-mono font-bold tracking-widest text-[#D7E2EA]/50 uppercase">
                              {milestone.category}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${milestone.theme.pillBg}`}
                            >
                              {milestone.year}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl lg:text-2xl font-bold text-[#D7E2EA] group-hover:text-white transition-colors mb-3">
                            {milestone.title}
                          </h3>

                          {/* Description */}
                          <p className="text-[#D7E2EA]/70 font-light text-sm lg:text-base leading-relaxed mb-5">
                            {milestone.description}
                          </p>

                          {/* Footer Tags & Badges */}
                          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                            {milestone.badge && (
                              <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold uppercase bg-white/10 text-white border border-white/10 mr-auto">
                                {milestone.badge}
                              </span>
                            )}
                            {milestone.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-0.5 rounded-lg text-xs font-light text-[#D7E2EA]/60 bg-white/[0.03] border border-white/[0.06]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Central Glowing Icon Node */}
                    <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 -translate-y-0 md:-translate-y-1/2 md:-translate-x-1/2 z-20">
                      <div className="relative">
                        {/* Concentric Pulse Ring */}
                        <div
                          className={`absolute inset-0 rounded-full ${milestone.theme.glow} opacity-60 animate-ping group-hover:opacity-100 duration-1000`}
                        />

                        {/* Outer Hub */}
                        <div
                          className={`w-[52px] h-[52px] sm:w-[64px] sm:h-[64px] rounded-full flex items-center justify-center bg-[#0C0C0C] border-2 ${milestone.theme.border} ${milestone.theme.glow} transition-all duration-500 group-hover:scale-115 group-hover:bg-[#151518] shadow-2xl relative z-10`}
                        >
                          <div
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center ${milestone.theme.pillBg} transition-transform duration-300 group-hover:rotate-12`}
                          >
                            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${milestone.theme.text}`} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column (Desktop: Even index items, Mobile: All items) */}
                    <div className="w-full md:w-1/2 pl-18 sm:pl-20 md:pl-12 lg:pl-16 text-left">
                      {/* Desktop Even Items */}
                      <div className="hidden md:block">
                        {isEven && (
                          <div className="relative rounded-[28px] border border-white/[0.08] bg-[#111114]/85 backdrop-blur-xl p-7 lg:p-8 hover:border-white/25 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden">
                            {/* Ambient Card Corner Glow */}
                            <div
                              className={`absolute -top-16 -left-16 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${milestone.theme.gradient}`}
                            />

                            {/* Watermark Number */}
                            <div className="absolute left-4 bottom-2 text-white/[0.03] font-mono font-black text-7xl select-none pointer-events-none">
                              {itemIndexStr}
                            </div>

                            {/* Top Meta Bar */}
                            <div className="flex items-center justify-start gap-3 mb-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${milestone.theme.pillBg}`}
                              >
                                {milestone.year}
                              </span>
                              <span className="text-xs font-mono font-bold tracking-widest text-[#D7E2EA]/50 uppercase">
                                {milestone.category}
                              </span>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl lg:text-2xl font-bold text-[#D7E2EA] group-hover:text-white transition-colors mb-3">
                              {milestone.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[#D7E2EA]/70 font-light text-sm lg:text-base leading-relaxed mb-5">
                              {milestone.description}
                            </p>

                            {/* Footer Tags & Badges */}
                            <div className="flex flex-wrap items-center justify-start gap-2 pt-2 border-t border-white/[0.05]">
                              {milestone.badge && (
                                <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold uppercase bg-white/10 text-white border border-white/10 mr-auto">
                                  {milestone.badge}
                                </span>
                              )}
                              {milestone.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2.5 py-0.5 rounded-lg text-xs font-light text-[#D7E2EA]/60 bg-white/[0.03] border border-white/[0.06]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mobile Render for All Items */}
                      <div className="block md:hidden">
                        <div className="relative rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#111114]/90 backdrop-blur-xl p-5 sm:p-6 overflow-hidden">
                          {/* Top Meta */}
                          <div className="flex flex-wrap items-center gap-2 mb-2.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border ${milestone.theme.pillBg}`}
                            >
                              {milestone.year}
                            </span>
                            <span className="text-[11px] font-mono font-medium tracking-wider text-[#D7E2EA]/50 uppercase">
                              {milestone.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg sm:text-xl font-bold text-[#D7E2EA] mb-2 leading-snug">
                            {milestone.title}
                          </h3>

                          {/* Description */}
                          <p className="text-[#D7E2EA]/70 font-light text-xs sm:text-sm leading-relaxed mb-4">
                            {milestone.description}
                          </p>

                          {/* Footer Tags & Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.05]">
                            {milestone.badge && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase bg-white/10 text-white border border-white/10">
                                {milestone.badge}
                              </span>
                            )}
                            {milestone.tags.slice(0, 3).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded-md text-[11px] font-light text-[#D7E2EA]/60 bg-white/[0.03] border border-white/[0.06]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySection;

import { useRef, useState } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import GradientCarousel, { type GradientCarouselItem } from '../components/GradientCarousel';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

export const certificationsData: GradientCarouselItem[] = [
  {
    id: 'oracle-genai-pro',
    title: 'OCI 2025 Generative AI Certified Professional',
    issuer: 'Oracle',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'AI & LLMs',
    image: '/certificates/OCI25GAIOCP.jpg',
    pdf: '/certificates/oracle_pro.pdf',
    verifyUrl: 'https://catalog-education.oracle.com',
    tags: ['Generative AI', 'LLMs', 'Oracle Cloud', 'Professional'],
    gradient: {
      primary: '#C74634',
      secondary: '#F97316',
      ambient: 'rgba(199, 70, 52, 0.4)',
      accentGlow: '#C74634',
    },
  },
  {
    id: 'oracle-ai-foundations',
    title: 'OCI 2025 AI Certified Foundations Associate',
    issuer: 'Oracle',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'AI & LLMs',
    image: '/certificates/OCI25AICFA.jpeg',
    pdf: '/certificates/oracle.pdf',
    verifyUrl: 'https://catalog-education.oracle.com',
    tags: ['AI Foundations', 'Machine Learning', 'OCI Cloud', 'Associate'],
    gradient: {
      primary: '#EA580C',
      secondary: '#D97706',
      ambient: 'rgba(234, 88, 12, 0.4)',
      accentGlow: '#EA580C',
    },
  },
  {
    id: 'anthropic-claude-api',
    title: 'Building with Claude API',
    issuer: 'Anthropic',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'AI & LLMs',
    image: '/assets/certificates/Building_With_Claude_Api.png',
    pdf: '/assets/certificates/Building_With_Claude_Api.pdf',
    tags: ['Claude API', 'LLM Agents', 'Anthropic', 'Prompt Engineering'],
    gradient: {
      primary: '#D97706',
      secondary: '#9333EA',
      ambient: 'rgba(217, 119, 6, 0.4)',
      accentGlow: '#D97706',
    },
  },
  {
    id: 'anthropic-claude-code',
    title: 'Claude Code in Action',
    issuer: 'Anthropic',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'AI & LLMs',
    image: '/assets/certificates/Claude_Code_In_Action.png',
    pdf: '/assets/certificates/Claude_Code_In_Action.pdf',
    tags: ['Claude Code', 'AI Assisted Coding', 'Anthropic'],
    gradient: {
      primary: '#8B5CF6',
      secondary: '#D97706',
      ambient: 'rgba(139, 92, 246, 0.4)',
      accentGlow: '#8B5CF6',
    },
  },
  {
    id: 'anthropic-mcp',
    title: 'Introduction to Model Context Protocol (MCP)',
    issuer: 'Anthropic',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'AI & LLMs',
    image: '/assets/certificates/Introduction_To_Model_Context_Protocol.png',
    pdf: '/assets/certificates/Introduction_To_Model_Context_Protocol.pdf',
    tags: ['MCP Protocol', 'Agent Tooling', 'Anthropic', 'Context Architecture'],
    gradient: {
      primary: '#7C3AED',
      secondary: '#06B6D4',
      ambient: 'rgba(124, 58, 237, 0.4)',
      accentGlow: '#7C3AED',
    },
  },
  {
    id: 'anthropic-agent-skills',
    title: 'Introduction to Agent Skills',
    issuer: 'Anthropic',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'AI & LLMs',
    image: '/assets/certificates/Introduction_To_Agent_Skills.png',
    pdf: '/assets/certificates/Introduction_To_Agent_Skills.pdf',
    tags: ['AI Agent Skills', 'Workflows', 'Anthropic'],
    gradient: {
      primary: '#9333EA',
      secondary: '#EC4899',
      ambient: 'rgba(147, 51, 234, 0.4)',
      accentGlow: '#9333EA',
    },
  },
  {
    id: 'coursera-ai',
    title: 'Artificial Intelligence',
    issuer: 'Aditya University / Coursera',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'Mar 3, 2026',
    category: 'AI & LLMs',
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
    id: 'cisco-cpp-adv',
    title: 'C++ Advanced',
    issuer: 'Cisco Networking Academy',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '04 Jan 2026',
    category: 'Programming',
    image: '/assets/certificates/Cisco_CPP_Advanced.png',
    pdf: '/assets/certificates/Cisco_CPP_Advanced.pdf',
    verifyUrl: 'https://www.netacad.com',
    tags: ['C++', 'Advanced OOP', 'STL', 'Cisco NetAcad'],
    gradient: {
      primary: '#00BCEB',
      secondary: '#10B981',
      ambient: 'rgba(0, 188, 235, 0.4)',
      accentGlow: '#00BCEB',
    },
  },
  {
    id: 'infosys-cpp',
    title: 'Programming Using C++',
    issuer: 'Infosys Springboard',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'Nov 12, 2025',
    category: 'Programming',
    image: '/assets/certificates/Infosys_Programming_Using_CPP.png',
    pdf: '/assets/certificates/Infosys_Programming_Using_CPP.pdf',
    verifyUrl: 'https://verify.onwingspan.com',
    tags: ['C++', 'Memory Management', 'Algorithms', 'Infosys'],
    gradient: {
      primary: '#007CC3',
      secondary: '#00C0F3',
      ambient: 'rgba(0, 124, 195, 0.4)',
      accentGlow: '#00C0F3',
    },
  },
  {
    id: 'infosys-python',
    title: 'Basics of Python',
    issuer: 'Infosys Springboard',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'Nov 12, 2025',
    category: 'Programming',
    image: '/assets/certificates/Infosys_Basics_of_Python.png',
    pdf: '/assets/certificates/Infosys_Basics_of_Python.pdf',
    verifyUrl: 'https://verify.onwingspan.com',
    tags: ['Python', 'Problem Solving', 'Data Structures', 'Infosys'],
    gradient: {
      primary: '#387EB8',
      secondary: '#F59E0B',
      ambient: 'rgba(56, 126, 184, 0.4)',
      accentGlow: '#F59E0B',
    },
  },
  {
    id: 'cisco-c-essentials',
    title: 'C Essentials 1',
    issuer: 'Cisco / C++ Institute',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'Programming',
    image: '/assets/certificates/C_Essentials_1_certificate.png',
    pdf: '/assets/certificates/C_Essentials_1_certificate.pdf',
    tags: ['C Programming', 'Pointers', 'Cisco', 'C++ Institute'],
    gradient: {
      primary: '#0284C7',
      secondary: '#38BDF8',
      ambient: 'rgba(2, 132, 199, 0.4)',
      accentGlow: '#38BDF8',
    },
  },
  {
    id: 'sql-basic',
    title: 'SQL Basic Certificate',
    issuer: 'HackerRank / Technical Hub',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'Programming',
    image: '/assets/certificates/sql_basic_certificate.png',
    pdf: '/assets/certificates/sql_basic_certificate.pdf',
    tags: ['SQL', 'Relational Databases', 'Queries', 'Joins'],
    gradient: {
      primary: '#059669',
      secondary: '#10B981',
      ambient: 'rgba(5, 150, 105, 0.4)',
      accentGlow: '#10B981',
    },
  },
  {
    id: 'redhat-sysadmin',
    title: 'Red Hat System Administration (RHA Basic)',
    issuer: 'Red Hat Academy',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'Systems & Cloud',
    image: '/assets/certificates/RHA_Basic.png',
    pdf: '/assets/certificates/RHA_Basic.pdf',
    tags: ['Red Hat Linux', 'SysAdmin', 'Bash', 'RHA'],
    gradient: {
      primary: '#EE0000',
      secondary: '#831843',
      ambient: 'rgba(238, 0, 0, 0.4)',
      accentGlow: '#EE0000',
    },
  },
  {
    id: 'css-certificate',
    title: 'CSS Certificate',
    issuer: 'HackerRank / Technical Hub',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'Systems & Cloud',
    image: '/assets/certificates/css_certificate.png',
    pdf: '/assets/certificates/css_certificate.pdf',
    tags: ['CSS3', 'Responsive Design', 'Flexbox', 'Grid'],
    gradient: {
      primary: '#2563EB',
      secondary: '#7C3AED',
      ambient: 'rgba(37, 99, 235, 0.4)',
      accentGlow: '#7C3AED',
    },
  },
];

const categories = ['ALL', 'AI & LLMs', 'Programming', 'Systems & Cloud'];

const CertificationsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const filteredCertifications = selectedCategory === 'ALL'
    ? certificationsData
    : certificationsData.filter((c) => c.category === selectedCategory);

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
        <motion.div style={{ y: headerY }} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <FadeIn delay={0.1} y={20}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#B600A8]" />
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
              className="text-white font-black uppercase text-center mb-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-none tracking-tight"
              delay={0.03}
            />
          </FadeIn>

          <FadeIn delay={0.3} y={20}>
            <p className="text-[#D7E2EA]/70 text-base sm:text-lg md:text-xl font-light leading-relaxed">
              Global credentials validating expertise in Generative AI, LLMs, Advanced Algorithms, Systems Programming, and Cloud Architecture.
            </p>
          </FadeIn>
        </motion.div>

        {/* Category Filter Pills */}
        <FadeIn delay={0.35} y={20}>
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full border border-white/10 bg-[#121214]/80 backdrop-blur-xl">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = cat === 'ALL'
                  ? certificationsData.length
                  : certificationsData.filter((c) => c.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-mono tracking-wider font-semibold transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'text-white'
                        : 'text-[#D7E2EA]/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCertPill"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#B600A8] to-[#7621B0] shadow-[0_0_20px_rgba(182,0,168,0.4)] -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span>{cat}</span>
                    <span className="ml-1.5 text-[11px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* ─── 3D GRADIENT CAROUSEL ─── */}
        <FadeIn delay={0.4} y={30}>
          <GradientCarousel 
            items={filteredCertifications}
            cardWidth={420}
            cardHeight={530}
            showControls={true}
            showIndicators={true}
          />
        </FadeIn>

        {/* Trust Badges Footer */}
        <FadeIn delay={0.5} y={20}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#D7E2EA]/50 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cryptographically Verified</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Official Global Issuers</span>
            </div>
            <span>•</span>
            <div>
              <span>Drag / Swipe & Keyboard Navigation Supported</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CertificationsSection;

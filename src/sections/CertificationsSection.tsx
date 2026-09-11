import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import ScrollRevealText from '../components/ScrollRevealText';
import GradientCarousel, { type GradientCarouselItem } from '../components/GradientCarousel';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

export const certificationsData: GradientCarouselItem[] = [
  // ─── 1. Oracle Generative AI Professional ───
  {
    id: 'oracle-genai-pro',
    title: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    issuer: 'Oracle',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'October 29, 2025',
    category: 'AI & Cloud',
    image: '/certificates/OCI25GAIOCP.jpg',
    pdf: '/certificates/oracle_pro.pdf',
    verifyUrl: 'https://catalog-education.oracle.com',
    tags: ['Generative AI', 'LLMs', 'OCI Cloud', 'Cert ID: 102936271OCI25GAIOCP'],
    gradient: {
      primary: '#C74634',
      secondary: '#F97316',
      ambient: 'rgba(199, 70, 52, 0.4)',
      accentGlow: '#C74634',
    },
  },

  // ─── 2. Oracle AI Foundations Associate ───
  {
    id: 'oracle-ai-foundations',
    title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    issuer: 'Oracle',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'October 19, 2025',
    category: 'AI & Cloud',
    image: '/certificates/OCI25AICFA.jpeg',
    pdf: '/certificates/oracle.pdf',
    verifyUrl: 'https://catalog-education.oracle.com',
    tags: ['AI Foundations', 'Machine Learning', 'OCI Cloud', 'Cert ID: 102936271OCI25AICFA'],
    gradient: {
      primary: '#EA580C',
      secondary: '#D97706',
      ambient: 'rgba(234, 88, 12, 0.4)',
      accentGlow: '#EA580C',
    },
  },

  // ─── 3. Oracle Database Foundations Associate ───
  {
    id: 'oracle-dbms-associate',
    title: 'Oracle Certified Foundations Associate, Database',
    issuer: 'Oracle',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'July 21, 2026',
    category: 'Databases',
    image: '/certificates/previews/DBMS_eCertificate.png',
    pdf: '/certificates/DBMS_eCertificate.pdf',
    tags: ['Oracle Database', 'SQL', 'Relational Models', 'Cert ID: 102936271ODB12COJA'],
    gradient: {
      primary: '#DC2626',
      secondary: '#F97316',
      ambient: 'rgba(220, 38, 38, 0.4)',
      accentGlow: '#DC2626',
    },
  },

  // ─── 4. Red Hat Certified System Administrator (RHCSA) ───
  {
    id: 'redhat-rhcsa',
    title: 'Red Hat Certified System Administrator (RHCSA)',
    issuer: 'Red Hat',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: 'July 13, 2026',
    category: 'DevOps & Systems',
    image: '/certificates/previews/ProfessionalCertificationDigitalCredentials20260721-8-ngckpa.png',
    pdf: '/certificates/ProfessionalCertificationDigitalCredentials20260721-8-ngckpa.pdf',
    verifyUrl: 'https://www.credly.com/badges/14d00882-70c2-4248-b799-c37d154cd8cb',
    tags: ['RHCSA', 'Red Hat Linux', 'SysAdmin', 'Credly Verified'],
    gradient: {
      primary: '#EE0000',
      secondary: '#990000',
      ambient: 'rgba(238, 0, 0, 0.4)',
      accentGlow: '#EE0000',
    },
  },

  // ─── 5. Summer Internship - Technical Hub ───
  {
    id: 'technical-hub-internship',
    title: 'Full Stack Summer Internship Certificate',
    issuer: 'Technical Hub Private Limited',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: 'June 26, 2026',
    category: 'Web & Full Stack',
    image: '/certificates/previews/24B11CS514_Internship_certificate.png',
    pdf: '/certificates/24B11CS514_Internship_certificate.pdf',
    tags: ['Full Stack Development', 'Technical Hub', 'Summer Internship', 'Web Engineering'],
    gradient: {
      primary: '#2563EB',
      secondary: '#06B6D4',
      ambient: 'rgba(37, 99, 235, 0.4)',
      accentGlow: '#2563EB',
    },
  },

  // ─── 6. ReactJS ───
  {
    id: 'infosys-reactjs',
    title: 'ReactJS Frontend Certification',
    issuer: 'Infosys Springboard',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'March 16, 2026',
    category: 'Web & Full Stack',
    image: '/certificates/previews/ReactJS.png',
    pdf: '/certificates/ReactJS.pdf',
    tags: ['React.js', 'Components', 'Virtual DOM', 'Frontend Architecture'],
    gradient: {
      primary: '#06B6D4',
      secondary: '#3B82F6',
      ambient: 'rgba(6, 182, 212, 0.4)',
      accentGlow: '#06B6D4',
    },
  },

  // ─── 7. MongoDB ───
  {
    id: 'infosys-mongodb',
    title: 'MongoDB Database Certification',
    issuer: 'Infosys Springboard',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'March 9, 2026',
    category: 'Databases',
    image: '/certificates/previews/MongoDB.png',
    pdf: '/certificates/MongoDB.pdf',
    tags: ['MongoDB', 'NoSQL', 'Aggregation', 'Document Schema'],
    gradient: {
      primary: '#10B981',
      secondary: '#059669',
      ambient: 'rgba(16, 185, 129, 0.4)',
      accentGlow: '#10B981',
    },
  },

  // ─── 8. ExpressJS Essential Training ───
  {
    id: 'infosys-expressjs',
    title: 'ExpressJS Essential Training',
    issuer: 'Infosys Springboard',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'February 20, 2026',
    category: 'Web & Full Stack',
    image: '/certificates/previews/ExpressJS.png',
    pdf: '/certificates/ExpressJS.pdf',
    tags: ['Express.js', 'Node.js', 'REST APIs', 'Middleware'],
    gradient: {
      primary: '#64748B',
      secondary: '#0F172A',
      ambient: 'rgba(100, 116, 139, 0.4)',
      accentGlow: '#64748B',
    },
  },

  // ─── 10. Artificial Intelligence ───
  {
    id: 'coursera-ai',
    title: 'Artificial Intelligence',
    issuer: 'Coursera / Aditya University',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'March 3, 2026',
    category: 'AI & Cloud',
    image: '/certificates/previews/artificial-intelligence.png',
    pdf: '/certificates/artificial-intelligence.pdf',
    tags: ['Artificial Intelligence', 'Coursera', 'Aditya University', 'Search & Logic'],
    gradient: {
      primary: '#0056D2',
      secondary: '#A855F7',
      ambient: 'rgba(0, 86, 210, 0.4)',
      accentGlow: '#A855F7',
    },
  },

  // ─── 11. Cisco C++ Advanced ───
  {
    id: 'cisco-cpp-advanced',
    title: 'C++ Advanced',
    issuer: 'Cisco Networking Academy',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2026',
    category: 'Programming & DSA',
    image: '/certificates/previews/C--_Advanced_certificate_24b11cs514-adityauniversity-in_cbeeff7e-6be0-410d-8f91-5ab1abdb162f.png',
    pdf: '/certificates/C--_Advanced_certificate_24b11cs514-adityauniversity-in_cbeeff7e-6be0-410d-8f91-5ab1abdb162f.pdf',
    verifyUrl: 'https://www.netacad.com',
    tags: ['C++', 'Advanced OOP', 'STL', 'Aditya University'],
    gradient: {
      primary: '#00BCEB',
      secondary: '#10B981',
      ambient: 'rgba(0, 188, 235, 0.4)',
      accentGlow: '#00BCEB',
    },
  },

  // ─── 12. Cisco C++ Essentials 1 ───
  {
    id: 'cisco-cpp-essentials-1',
    title: 'C++ Essentials 1',
    issuer: 'Cisco / C++ Institute',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'Programming & DSA',
    image: '/certificates/previews/C--_Essentials_1_certificate_24b11cs514-adityauniversity-in_0bafd690-d349-4844-8f94-463d2cac6ac3.png',
    pdf: '/certificates/C--_Essentials_1_certificate_24b11cs514-adityauniversity-in_0bafd690-d349-4844-8f94-463d2cac6ac3.pdf',
    tags: ['C++', 'Basics', 'Cisco NetAcad', 'Algorithms'],
    gradient: {
      primary: '#0284C7',
      secondary: '#38BDF8',
      ambient: 'rgba(2, 132, 199, 0.4)',
      accentGlow: '#38BDF8',
    },
  },

  // ─── 13. Cisco C++ Essentials 2 ───
  {
    id: 'cisco-cpp-essentials-2',
    title: 'C++ Essentials 2',
    issuer: 'Cisco / C++ Institute',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'Programming & DSA',
    image: '/certificates/previews/C--_Essentials_2_certificate_24b11cs514-adityauniversity-in_df07c4d8-879d-47d0-9473-f0a085b8001f.png',
    pdf: '/certificates/C--_Essentials_2_certificate_24b11cs514-adityauniversity-in_df07c4d8-879d-47d0-9473-f0a085b8001f.pdf',
    tags: ['C++', 'OOP Architecture', 'Inheritance', 'Polymorphism'],
    gradient: {
      primary: '#0369A1',
      secondary: '#0284C7',
      ambient: 'rgba(3, 105, 161, 0.4)',
      accentGlow: '#0369A1',
    },
  },

  // ─── 14. Cisco C Essentials 1 ───
  {
    id: 'cisco-c-essentials-1',
    title: 'C Essentials 1',
    issuer: 'Cisco / C++ Institute',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'Programming & DSA',
    image: '/certificates/previews/C_Essentials_1_certificate_24b11cs514-adityauniversity-in_048e4435-0a91-4746-bbe4-95f6f6de58fc (1).png',
    pdf: '/certificates/C_Essentials_1_certificate_24b11cs514-adityauniversity-in_048e4435-0a91-4746-bbe4-95f6f6de58fc (1).pdf',
    tags: ['C Programming', 'Pointers', 'Memory Allocation', 'Cisco'],
    gradient: {
      primary: '#0284C7',
      secondary: '#06B6D4',
      ambient: 'rgba(2, 132, 199, 0.4)',
      accentGlow: '#06B6D4',
    },
  },

  // ─── 15. Ethical Hacker ───
  {
    id: 'cisco-ethical-hacker',
    title: 'Ethical Hacker Certification',
    issuer: 'Cisco Networking Academy',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'DevOps & Systems',
    image: '/certificates/previews/Ethical_Hacker_certificate_24b11cs514-adityauniversity-in_ff34ca68-e19b-4cfc-b237-5960de6d2797.png',
    pdf: '/certificates/Ethical_Hacker_certificate_24b11cs514-adityauniversity-in_ff34ca68-e19b-4cfc-b237-5960de6d2797.pdf',
    tags: ['Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Cisco'],
    gradient: {
      primary: '#10B981',
      secondary: '#1E293B',
      ambient: 'rgba(16, 185, 129, 0.4)',
      accentGlow: '#10B981',
    },
  },

  // ─── 16. Database Foundations - Oracle Academy ───
  {
    id: 'oracle-dbms-foundations',
    title: 'Database Foundations — English',
    issuer: 'Oracle Academy',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: 'October 10, 2025',
    category: 'Databases',
    image: '/certificates/previews/DBMS_certi.png',
    pdf: '/certificates/DBMS_certi.pdf',
    tags: ['Database Foundations', 'Oracle Academy', 'SQL Queries'],
    gradient: {
      primary: '#D97706',
      secondary: '#B45309',
      ambient: 'rgba(217, 119, 6, 0.4)',
      accentGlow: '#D97706',
    },
  },

  // ─── 17. Operating Systems ───
  {
    id: 'coursera-os',
    title: 'Operating Systems',
    issuer: 'Coursera / Aditya University',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'March 8, 2026',
    category: 'DevOps & Systems',
    image: '/certificates/previews/OScerti.png',
    pdf: '/certificates/OScerti.pdf',
    tags: ['Operating Systems', 'Concurrency', 'Process Scheduling', 'Aditya University'],
    gradient: {
      primary: '#475569',
      secondary: '#0F172A',
      ambient: 'rgba(71, 85, 105, 0.4)',
      accentGlow: '#475569',
    },
  },

  // ─── 18. Quantum Computing For Everyone ───
  {
    id: 'coursera-quantum',
    title: 'Quantum Computing For Everyone',
    issuer: 'Coursera / Aditya University',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'March 8, 2026',
    category: 'AI & Cloud',
    image: '/certificates/previews/QuantumComputing.png',
    pdf: '/certificates/QuantumComputing.pdf',
    tags: ['Quantum Computing', 'Qubits', 'Quantum Circuits', 'Coursera'],
    gradient: {
      primary: '#7C3AED',
      secondary: '#2563EB',
      ambient: 'rgba(124, 58, 237, 0.4)',
      accentGlow: '#7C3AED',
    },
  },

  // ─── 19. Data Analysis with Python ───
  {
    id: 'ibm-python-data-analysis',
    title: 'Data Analysis with Python',
    issuer: 'IBM / Coursera',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'October 21, 2025',
    category: 'AI & Cloud',
    image: '/certificates/previews/pythonCerti.png',
    pdf: '/certificates/pythonCerti.pdf',
    tags: ['IBM', 'Python', 'Pandas', 'NumPy', 'Data Analysis'],
    gradient: {
      primary: '#006699',
      secondary: '#1F70C1',
      ambient: 'rgba(0, 102, 153, 0.4)',
      accentGlow: '#006699',
    },
  },

  // ─── 20. Python (Basic) ───
  {
    id: 'hackerrank-python-basic',
    title: 'Python (Basic) Certificate',
    issuer: 'HackerRank / Technical Hub',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'Programming & DSA',
    image: '/certificates/previews/python_basic certificate.png',
    pdf: '/certificates/python_basic certificate.pdf',
    tags: ['Python', 'Problem Solving', 'HackerRank Verified'],
    gradient: {
      primary: '#22C55E',
      secondary: '#15803D',
      ambient: 'rgba(34, 197, 94, 0.4)',
      accentGlow: '#22C55E',
    },
  },

  // ─── 21. Infosys Programming Using C++ ───
  {
    id: 'infosys-cpp-springboard',
    title: 'Programming Using C++',
    issuer: 'Infosys Springboard',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'November 12, 2025',
    category: 'Programming & DSA',
    image: '/certificates/previews/1-22dbc95c-5546-49d6-8de7-d85859431ec8.png',
    pdf: '/certificates/1-22dbc95c-5546-49d6-8de7-d85859431ec8.pdf',
    tags: ['C++', 'Memory Management', 'Algorithms', 'Infosys'],
    gradient: {
      primary: '#007CC3',
      secondary: '#00C0F3',
      ambient: 'rgba(0, 124, 195, 0.4)',
      accentGlow: '#00C0F3',
    },
  },

  // ─── 22. Infosys Basics of Python ───
  {
    id: 'infosys-python-springboard',
    title: 'Basics of Python',
    issuer: 'Infosys Springboard',
    recipient: 'Jaya Sai Krishna Vasamsetti',
    date: 'November 12, 2025',
    category: 'Programming & DSA',
    image: '/certificates/previews/1-f603ce3f-364e-4dc0-aeb7-9753a05daee5.png',
    pdf: '/certificates/1-f603ce3f-364e-4dc0-aeb7-9753a05daee5.pdf',
    tags: ['Python', 'Data Structures', 'Infosys Springboard'],
    gradient: {
      primary: '#387EB8',
      secondary: '#F59E0B',
      ambient: 'rgba(56, 126, 184, 0.4)',
      accentGlow: '#F59E0B',
    },
  },

  // ─── 23. Building with Claude API ───
  {
    id: 'anthropic-claude-api',
    title: 'Building with Claude API',
    issuer: 'Anthropic',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'AI & Cloud',
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

  // ─── 24. Introduction to Model Context Protocol ───
  {
    id: 'anthropic-mcp-protocol',
    title: 'Introduction to Model Context Protocol (MCP)',
    issuer: 'Anthropic',
    recipient: 'Vasamsetti Jaya Sai Krishna',
    date: '2025',
    category: 'AI & Cloud',
    image: '/assets/certificates/Introduction_To_Model_Context_Protocol.png',
    pdf: '/assets/certificates/Introduction_To_Model_Context_Protocol.pdf',
    tags: ['MCP Protocol', 'Agent Tooling', 'Anthropic'],
    gradient: {
      primary: '#7C3AED',
      secondary: '#06B6D4',
      ambient: 'rgba(124, 58, 237, 0.4)',
      accentGlow: '#7C3AED',
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
                Verified Credentials ({certificationsData.length} Certifications)
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
              Official industry certifications validating competencies in Generative AI, Full-Stack Development, Red Hat System Administration, Cloud Architecture, and Advanced Systems Programming.
            </p>
          </FadeIn>
        </motion.div>

        {/* ─── 3D GRADIENT CAROUSEL ─── */}
        <FadeIn delay={0.35} y={30}>
          <GradientCarousel 
            items={certificationsData}
            cardWidth={430}
            cardHeight={540}
            showControls={true}
            showIndicators={true}
            autoScroll={true}
            autoScrollInterval={1800}
            pauseOnHover={true}
          />
        </FadeIn>

        {/* Trust Badges Footer */}
        <FadeIn delay={0.5} y={20}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#D7E2EA]/50 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Institutional Credentials</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Oracle • Red Hat • Cisco • Infosys • Google</span>
            </div>
            <span>•</span>
            <div>
              <span>Interactive 3D Carousel with Drag, Swipe & Fullscreen PDF View</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CertificationsSection;

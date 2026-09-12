import { useState, useEffect, useMemo, useCallback } from 'react';
import { Home, User, Briefcase, Cpu, FolderGit2, Award, Mail } from 'lucide-react';
import Dock, { type DockItemData } from './Dock';
import useActiveSection from '../hooks/useActiveSection';
import { getLenis } from '@/utils/lenis';
import { motion } from 'framer-motion';

export default function TopNavbar() {
  const activeSection = useActiveSection();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = useCallback((targetHref: string) => {
    if (!targetHref || targetHref === '#' || targetHref === '#hero') {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const cleanId = targetHref.replace(/^#/, '');
    const element = document.getElementById(cleanId);
    if (element) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(element, { offset: -60, duration: 1.1 });
      } else {
        const top = element.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, []);

  const iconSize = isMobile ? 11 : 13;

  const navItems: DockItemData[] = useMemo(
    () => [
      {
        icon: <Home size={iconSize} strokeWidth={2.2} />,
        label: 'Home',
        isActive: activeSection === '#',
        onClick: () => handleNavigate('#'),
      },
      {
        icon: <User size={iconSize} strokeWidth={2.2} />,
        label: 'About',
        isActive: activeSection === '#about',
        onClick: () => handleNavigate('#about'),
      },
      {
        icon: <Briefcase size={iconSize} strokeWidth={2.2} />,
        label: 'Services',
        isActive: activeSection === '#services',
        onClick: () => handleNavigate('#services'),
      },
      {
        icon: <Cpu size={iconSize} strokeWidth={2.2} />,
        label: 'Tech Stack',
        isActive: activeSection === '#tech-stack',
        onClick: () => handleNavigate('#tech-stack'),
      },
      {
        icon: <FolderGit2 size={iconSize} strokeWidth={2.2} />,
        label: 'Projects',
        isActive: activeSection === '#projects',
        onClick: () => handleNavigate('#projects'),
      },
      {
        icon: <Award size={iconSize} strokeWidth={2.2} />,
        label: 'Certifications',
        isActive: activeSection === '#certifications',
        onClick: () => handleNavigate('#certifications'),
      },
      {
        icon: <Mail size={iconSize} strokeWidth={2.2} />,
        label: 'Contact',
        isActive: activeSection === '#contact',
        onClick: () => handleNavigate('#contact'),
      },
    ],
    [activeSection, iconSize, handleNavigate]
  );

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-3 sm:top-4 right-3 sm:right-5 md:right-7 z-40 max-w-[95vw] pointer-events-none"
      aria-label="Top Navigation Menu"
    >
      <div className="pointer-events-auto">
        <Dock
          items={navItems}
          panelHeight={isMobile ? 30 : 34}
          baseItemSize={isMobile ? 22 : 26}
          magnification={isMobile ? 30 : 36}
          distance={isMobile ? 70 : 90}
        />
      </div>
    </motion.header>
  );
}

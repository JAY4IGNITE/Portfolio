import { useState, useEffect } from 'react';

const sectionIds = [
  '', // Home (top of page)
  'about',
  'services',
  'education',
  'tech-stack',
  'projects',
  'certifications',
  'coding-stats',
  'github-activity',
  'contact',
];

/**
 * Observes all major sections and returns the href of the currently visible one.
 * Returns '#' for home, '#about' for about, etc.
 */
const useActiveSection = (): string => {
  const [activeSection, setActiveSection] = useState('#');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    sectionIds.forEach((id) => {
      const el = id ? document.getElementById(id) : null;

      if (!id) {
        // For "Home", track scroll position at top
        const handleScroll = () => {
          if (window.scrollY < 200) {
            setActiveSection('#');
          }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        observers.push({
          disconnect: () => window.removeEventListener('scroll', handleScroll),
        } as unknown as IntersectionObserver);
        return;
      }

      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleSections.set(id, entry.intersectionRatio);
            } else {
              visibleSections.delete(id);
            }

            // Find the section with the highest intersection ratio
            let maxRatio = 0;
            let maxId = '';
            visibleSections.forEach((ratio, sectionId) => {
              if (ratio > maxRatio) {
                maxRatio = ratio;
                maxId = sectionId;
              }
            });

            if (maxId) {
              setActiveSection(`#${maxId}`);
            }
          });
        },
        {
          threshold: [0, 0.1, 0.2, 0.3, 0.5],
          rootMargin: '-10% 0px -40% 0px',
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return activeSection;
};

export default useActiveSection;

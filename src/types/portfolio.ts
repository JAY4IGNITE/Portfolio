import type { ComponentType } from 'react';

export interface ProjectData {
  number: string;
  name: string;
  category: string;
  tech: string[];
  description: string;
  features: string[];
  challenges: string;
  learnings: string;
  link: string;
  images: string[];
}

export interface CertificationGradient {
  primary: string;
  secondary: string;
  ambient: string;
  accentGlow: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  recipient?: string;
  date: string;
  category: string;
  image: string;
  pdf?: string;
  verifyUrl?: string;
  tags: string[];
  gradient: CertificationGradient;
}

export interface JourneyTheme {
  border: string;
  text: string;
  glow: string;
  pillBg: string;
  gradient: string;
}

export interface JourneyMilestone {
  id: string;
  year: string;
  category: string;
  title: string;
  description: string;
  badge?: string;
  tags: string[];
  icon: ComponentType<{ className?: string }>;
  accentColor: string;
  theme: JourneyTheme;
}

export interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface DecorativeImage {
  src: string;
  alt: string;
  className: string;
  fadeProps: {
    delay: number;
    x: number;
    y: number;
    duration: number;
  };
}

import { 
  GraduationCap, 
  Rocket, 
  Sparkles, 
  Trophy, 
  Briefcase, 
  Award,
  Terminal,
  Flame,
} from 'lucide-react';
import type { JourneyMilestone } from '@/types/portfolio';

export interface JourneyHighlight {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const milestones: JourneyMilestone[] = [
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

export const highlights: JourneyHighlight[] = [
  { label: 'Academic Standing', value: '8.78 GPA', icon: GraduationCap, color: 'text-purple-400' },
  { label: 'Hackathon Rank', value: '2nd / 160', icon: Trophy, color: 'text-orange-400' },
  { label: 'DSA Solved', value: '350+ Problems', icon: Terminal, color: 'text-yellow-400' },
  { label: 'Production Scale', value: '500+ Users', icon: Flame, color: 'text-cyan-400' },
];

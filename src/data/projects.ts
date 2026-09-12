import type { ProjectData } from '@/types/portfolio';

export const projects: ProjectData[] = [
  {
    number: '01',
    name: 'SmartApply',
    category: 'AI Career Platform / Full-Stack',
    tech: [
      'React',
      'TypeScript',
      'FastAPI',
      'Python',
      'MongoDB',
      'Judge0 API',
      'WebSockets',
      'NVIDIA NIM',
      'Cloudflare R2',
    ],
    description:
      'A unified technical career engineering platform for software professionals. Tailors resumes to job descriptions with ATS keyword scoring, conducts real-time voice AI mock interviews with sandboxed code execution, and compiles native LaTeX and PDF documents.',
    features: [
      'AI Resume Tailor: Automatically aligns resumes to target job specifications with intelligent keyword density',
      'ATS Compatibility Checker: Evaluates compatibility scores and highlights missing technical skills',
      'Live Voice Mock Interview: Real-time interactive AI recruiter interviews with voice synthesis and feedback',
      'Judge0 Code Sandbox: In-browser live coding environment with isolated execution and test validation',
      'LaTeX & PDF Maker: Native LaTeX template compilation and high-fidelity PDF export',
      'Idea Prompt Studio: Recommends curated engineering portfolio projects tailored to candidate skills',
      'Privacy-First Architecture: Zero training on candidate data with secure telemetry controls',
    ],
    challenges:
      'Achieving sub-second latency across simultaneous audio streaming, speech-to-text, and LLM reasoning during live mock interviews. Solved by decoupling WebSocket audio channels from background inference and implementing FastAPI streaming pipelines.',
    learnings:
      'Engineered scalable microservice communication between a Python FastAPI backend and a Vite React frontend, integrated sandboxed code runners with Judge0, and built browser-based facial vision telemetry.',
    link: 'https://github.com/JAY4IGNITE/Smart-Apply',
    images: ['/assets/Projects/smartapply/smartapply-hero.png'],
  },
];
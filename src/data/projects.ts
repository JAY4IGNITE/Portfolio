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
    liveUrl: 'https://smartapplies.app',
    images: ['/assets/Projects/smartapply/smartapply-hero.png'],
  },
  {
    number: '02',
    name: 'MindVault AI',
    category: 'Zero-Trust AI Second Brain / Full-Stack',
    tech: [
      'React',
      'TypeScript',
      'Fastify',
      'Google Gemini',
      'WebSockets',
      'Firebase Auth',
      'Cloud Firestore',
      'Google Cloud Run',
      'Tailwind CSS',
    ],
    description:
      'A cryptographically secure, privacy-first personal intelligence platform and AI second brain. Engages in reflective dialogue, progressively streams responses with in-flight cancellation via WebSockets, and automatically synthesizes unstructured reflections into interconnected knowledge graphs bound by a Non-Negotiable Security Constitution.',
    features: [
      'Reflective AI Dialogue: Engages with finely-tuned Google Gemini models designed to prompt introspection and untangle thoughts',
      'Real-Time Token Streaming: Low-latency progressive token generation (<350ms TTFT) with in-flight stream cancellation over WebSockets',
      'Live Pipeline Telemetry: Real-time multi-stage progress tracking during session synthesis and entity extraction',
      'Dynamic Memory Graph: Maps extracted core facts, decisions, and goals into an interconnected visual knowledge network',
      'Zero-Trust Security Constitution: Strict server-side UID data isolation, prompt injection protection, and zero training on candidate data',
      'Hybrid REST + WebSocket Architecture: Fastify REST API for authoritative auth/CRUD and user-scoped WebSockets for streaming',
      'Multi-Tab Sync: Real-time cache invalidation and connection state synchronization across browser tabs',
    ],
    challenges:
      'Implementing a zero-trust streaming pipeline that verifies Firebase Admin JWTs on persistent WebSocket connections while sustaining sub-350ms time-to-first-token generation from Google Gemini. Solved using Fastify WebSocket connection managers and atomic batch Firestore commits.',
    learnings:
      'Architected user-scoped real-time WebSocket gateways with heartbeat monitoring, engineered prompt injection defenses, and deployed containerized Node.js microservices to Google Cloud Run.',
    link: 'https://github.com/JAY4IGNITE/MindVault',
    liveUrl: 'https://mindvault-39809.web.app',
    images: ['/assets/Projects/mindvault/mindvault-hero.png'],
  },
];
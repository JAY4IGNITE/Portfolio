import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';
import { Download, Printer } from 'lucide-react';

const decorativeImages = [
  {
    src: '/assets/decorative/moon_icon.png',
    alt: 'Moon icon',
    className: 'hidden sm:block w-[120px] sm:w-[160px] md:w-[210px] absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]',
    fadeProps: { delay: 0.1, x: -80, y: 0, duration: 0.9 },
  },
  {
    src: '/assets/decorative/3d_object.png',
    alt: '3D object',
    className: 'hidden sm:block w-[100px] sm:w-[140px] md:w-[180px] absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]',
    fadeProps: { delay: 0.25, x: -80, y: 0, duration: 0.9 },
  },
  {
    src: '/assets/decorative/lego_icon.png',
    alt: 'Lego icon',
    className: 'hidden sm:block w-[120px] sm:w-[160px] md:w-[210px] absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]',
    fadeProps: { delay: 0.15, x: 80, y: 0, duration: 0.9 },
  },
  {
    src: '/assets/decorative/3d_group.png',
    alt: '3D group',
    className: 'hidden sm:block w-[130px] sm:w-[170px] md:w-[220px] absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]',
    fadeProps: { delay: 0.3, x: 80, y: 0, duration: 0.9 },
  },
];

const AboutSection = () => {
  const printResume = () => {
    window.open(`${import.meta.env.BASE_URL}assets/Resume.pdf`, '_blank');
  };

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-5 sm:px-8 md:px-10 py-20 relative bg-[#0C0C0C]"
    >
      {/* Decorative 3D images */}
      {decorativeImages.map((img, i) => (
        <FadeIn key={i} {...img.fadeProps} className={img.className}>
          <img
            src={`${import.meta.env.BASE_URL}${img.src.slice(1)}`}
            alt={img.alt}
            className="w-full pointer-events-none select-none"
            draggable={false}
          />
        </FadeIn>
      ))}

      {/* Content */}
      <div className="flex flex-col items-center max-w-5xl w-full z-10 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start w-full">
          {/* Left Column - Heading & Tag */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <FadeIn delay={0.1} y={30}>
              <span className="text-[#B600A8] uppercase tracking-[0.25em] text-sm sm:text-base md:text-lg font-bold">
                / About Me
              </span>
            </FadeIn>
            <FadeIn delay={0.2} y={30}>
              <h3 
                className="text-[#D7E2EA] font-black uppercase tracking-tight leading-[1.15]"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)' }}
              >
                Building smooth, high-impact web experiences.
              </h3>
            </FadeIn>
          </div>
          
          {/* Right Column - Descriptive Paragraphs */}
          <div className="md:col-span-7 flex flex-col gap-6 text-[#D7E2EA]/80 font-light text-sm sm:text-base md:text-lg leading-relaxed">
            <FadeIn delay={0.3} y={30}>
              <p>
                I am a passionate Computer Science student and web developer dedicated to crafting highly interactive, modern, and pixel-perfect websites. I enjoy bridging the gap between functional logic and creative user interface design to build interfaces that feel alive and engaging.
              </p>
            </FadeIn>
            <FadeIn delay={0.4} y={30}>
              <p>
                Whether designing responsive frontends with smooth animations or developing robust, secure backends using Java and Python, my focus is always on writing clean, efficient code that solves real-world challenges. Let's work together to bring your ideas to life.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Resume & Contact Actions */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-4 sm:gap-6 w-full">
          <FadeIn delay={0.5} y={20}>
            <ContactButton />
          </FadeIn>
          
          <FadeIn delay={0.6} y={20}>
            <a
              href={`${import.meta.env.BASE_URL}assets/Resume.pdf`}
              download="Krishna_Resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D7E2EA]/20 hover:border-[#B600A8] bg-[#0C0C0C] text-[#D7E2EA]/90 hover:text-white transition-all duration-300 font-medium uppercase tracking-widest text-[11px] hover:shadow-[0_0_20px_rgba(182,0,168,0.15)]"
            >
              <Download className="w-4 h-4 text-[#B600A8]" />
              Download Resume
            </a>
          </FadeIn>

          <FadeIn delay={0.7} y={20}>
            <button
              onClick={printResume}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D7E2EA]/20 hover:border-[#7621B0] bg-[#0C0C0C] text-[#D7E2EA]/90 hover:text-white transition-all duration-300 font-medium uppercase tracking-widest text-[11px] hover:shadow-[0_0_20px_rgba(118,33,176,0.15)] cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#7621B0]" />
              Print Resume
            </button>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

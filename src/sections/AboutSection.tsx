import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
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

const aboutText =
  "I'm a passionate and detail-oriented web developer with a strong interest in building clean, responsive, and user-friendly websites. As a B.Tech student in Computer Science, I enjoy turning ideas into functional digital experiences using modern web technologies. I believe in writing efficient code, solving real-world problems, and creating designs that are both visually appealing and technically strong. Let's build something incredible together!";

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
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2
              className="text-[#D7E2EA] font-semibold text-center uppercase tracking-widest text-[14px]"
            >
              / About Me
            </h2>
          </FadeIn>

          <AnimatedText
            text={aboutText}
            className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
          />
        </div>

        {/* Resume & Contact Actions */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-4 sm:gap-6 z-20">
          <FadeIn delay={0.2} y={20}>
            <ContactButton />
          </FadeIn>
          
          <FadeIn delay={0.3} y={20}>
            <a
              href={`${import.meta.env.BASE_URL}assets/Resume.pdf`}
              download="Nandu_Resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D7E2EA]/20 hover:border-[#B600A8] bg-[#0C0C0C] text-[#D7E2EA]/90 hover:text-white transition-all duration-300 font-medium uppercase tracking-widest text-[11px] hover:shadow-[0_0_20px_rgba(182,0,168,0.15)]"
            >
              <Download className="w-4 h-4 text-[#B600A8]" />
              Download Resume
            </a>
          </FadeIn>

          <FadeIn delay={0.4} y={20}>
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

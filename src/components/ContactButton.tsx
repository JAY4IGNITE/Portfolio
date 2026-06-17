import { motion } from 'framer-motion';

interface ContactButtonProps {
  className?: string;
}

const ContactButton = ({ className = '' }: ContactButtonProps) => {
  const handleClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = 'mailto:kovvurinandivardhanreddy2007@gmail.com';
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{
        repeat: Infinity,
        duration: 2.5,
        ease: 'easeInOut',
      }}
      className={`
        relative rounded-full font-medium uppercase tracking-widest text-white
        px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
        text-xs sm:text-sm md:text-base
        cursor-pointer
        ${className}
      `}
      style={{
        background:
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow:
          '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      {/* Pulsing dot indicator */}
      <motion.span
        className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#B600A8]"
        animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        style={{
          boxShadow: '0 0 8px rgba(182, 0, 168, 0.6)',
        }}
      />
      Contact Me
    </motion.button>
  );
};

export default ContactButton;

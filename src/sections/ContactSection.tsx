import { useState, useEffect, useRef } from 'react';
import FadeIn from '../components/FadeIn';
import { motion } from 'framer-motion';
import { Mail, Phone, Send } from 'lucide-react';
import { CONTACT_CONFIG } from '../config/contact';

const MESSAGE_MAX = 500;

/* Animated focus underline component */
const FocusUnderline = ({ isFocused, color }: { isFocused: boolean; color: string }) => (
  <motion.div
    className="absolute bottom-0 left-1/2 h-[2px] rounded-full"
    style={{ backgroundColor: color, x: '-50%' }}
    initial={{ width: 0, opacity: 0 }}
    animate={isFocused ? { width: '100%', opacity: 1 } : { width: 0, opacity: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
  />
);

/* Floating label input group */
const FloatingInput = ({
  id,
  type = 'text',
  value,
  onChange,
  label,
  accentColor,
  required = true,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  label: string;
  accentColor: string;
  required?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;

  return (
    <div className="relative pt-5">
      {/* Floating label */}
      <motion.label
        htmlFor={id}
        className="absolute left-4 pointer-events-none text-[#D7E2EA]/50 font-medium uppercase tracking-widest origin-left"
        animate={{
          y: isFloating ? -20 : 0,
          scale: isFloating ? 0.75 : 1,
          color: isFocused ? accentColor : 'rgba(215, 226, 234, 0.5)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ fontSize: '12px', top: '28px' }}
      >
        {label}
      </motion.label>

      <input
        type={type}
        id={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/10 rounded-xl px-4 py-3 text-[#D7E2EA] focus:outline-none transition-all duration-300"
        style={{
          borderColor: isFocused ? accentColor : undefined,
          boxShadow: isFocused ? `0 0 0 3px ${accentColor}15, 0 0 20px ${accentColor}08` : undefined,
        }}
      />

      <FocusUnderline isFocused={isFocused} color={accentColor} />
    </div>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageFocused, setMessageFocused] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const personalEmail = import.meta.env.VITE_PERSONAL_EMAIL || 'jayasaikrishnavasamsetti@gmail.com';
  const personalPhone = import.meta.env.VITE_PERSONAL_PHONE || '+91 9030649777';
  const whatsappUrl = 'https://wa.me/919030649777';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (status === 'success' || status === 'error') {
      timer = setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('sending');
    setErrorMessage('');
    
    try {
      const { provider, googleScriptUrl, formspreeId, emailjs } = CONTACT_CONFIG;

      if (provider === 'dev_log') {
        if (import.meta.env.DEV) {
          console.log('--- Submitting Form (Dev Mode Logging) ---');
          console.log('Name:', formData.name);
          console.log('Email:', formData.email);
          console.log('Message:', formData.message);
        }
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        return;
      }


      if (provider === 'google_script') {
        if (!googleScriptUrl) {
          throw new Error('Google Apps Script URL is not configured. Add VITE_GOOGLE_SCRIPT_URL to your environment variables.');
        }

        const formBody = new FormData();
        formBody.append('name', formData.name);
        formBody.append('email', formData.email);
        formBody.append('message', formData.message);

        // Google Apps Script redirects with 302, mode: 'no-cors' allows the POST to complete seamlessly
        await fetch(googleScriptUrl, {
          method: 'POST',
          body: formBody,
          mode: 'no-cors',
        });
      } else if (provider === 'formspree') {
        if (!formspreeId) {
          throw new Error('Formspree ID is not configured. Add VITE_FORMSPREE_ID to your environment variables.');
        }

        const endpoint = formspreeId.startsWith('http')
          ? formspreeId
          : `https://formspree.io/f/${formspreeId}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: `Portfolio Message from ${formData.name}`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMsg = Array.isArray(errorData?.errors)
            ? errorData.errors.map((err: { message: string }) => err.message).join(', ')
            : errorData?.error || 'Failed to send message via Formspree. Please verify your Form ID.';
          throw new Error(errorMsg);
        }
      } else if (provider === 'emailjs') {
        const { serviceId, templateId, publicKey } = emailjs;
        if (!serviceId || !templateId || !publicKey) {
          throw new Error('EmailJS configurations (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) are missing in environment variables.');
        }

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: formData.name,
              from_email: formData.email,
              message: formData.message,
              reply_to: formData.email,
            },
          }),
        });

        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(`EmailJS failed: ${errorMsg || response.statusText}`);
        }
      } else {
        throw new Error(`Unknown provider: ${provider}`);
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: unknown) {
      console.error('Contact submission error:', error);
      setStatus('error');
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setErrorMessage(message);
    }
  };

  const isMessageFloating = messageFocused || formData.message.length > 0;

  return (
    <section
      id="contact"
      className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
        
        {/* Left Column: Info & Socials */}
        <div className="flex flex-col justify-between">
          <div>
            <FadeIn delay={0} y={30}>
              <h2
                className="hero-heading font-black uppercase leading-none tracking-tight mb-8"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
              >
                Contact Me
              </h2>
            </FadeIn>
            
            <FadeIn delay={0.1} y={20}>
              <p className="text-[#D7E2EA]/70 text-lg font-light leading-relaxed mb-8 max-w-md">
                Have a project in mind or want to say hello? Drop me a message, and let&apos;s build something remarkable together.
              </p>
            </FadeIn>

            <div className="flex flex-col gap-6">
              <FadeIn delay={0.2} y={20}>
                <a
                  href={`mailto:${personalEmail}`}
                  className="flex items-center gap-4 text-base sm:text-lg hover:text-[#B600A8] transition-colors duration-300 group"
                >
                  <div className="p-3 rounded-full bg-[#D7E2EA]/5 group-hover:bg-[#B600A8]/10 transition-colors duration-300">
                    <Mail className="w-6 h-6 text-[#D7E2EA] group-hover:text-[#B600A8] transition-colors duration-300" />
                  </div>
                  <span>{personalEmail}</span>
                </a>
              </FadeIn>

              <FadeIn delay={0.3} y={20}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-base sm:text-lg hover:text-[#25D366] transition-colors duration-300 group"
                  title="Chat on WhatsApp"
                >
                  <div className="p-3 rounded-full bg-[#D7E2EA]/5 group-hover:bg-[#25D366]/10 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-[#D7E2EA] group-hover:text-[#25D366] transition-colors duration-300" />
                  </div>
                  <span>{personalPhone}</span>
                </a>
              </FadeIn>
            </div>
          </div>

          {/* Social Icons */}
          <div className="mt-12 sm:mt-16">
            <FadeIn delay={0.4} y={20}>
              <h4 className="text-[#D7E2EA]/50 uppercase tracking-widest text-sm font-medium mb-4">Follow Me</h4>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {[
                  {
                    name: 'Instagram',
                    element: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    ),
                    href: 'https://www.instagram.com/krishnaaw_14/',
                    color: 'hover:text-[#E1306C] hover:bg-[#E1306C]/10',
                  },
                  {
                    name: 'GitHub',
                    element: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    ),
                    href: 'https://github.com/JAY4IGNITE',
                    color: 'hover:text-white hover:bg-white/10',
                  },
                  {
                    name: 'LinkedIn',
                    element: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                    href: 'https://www.linkedin.com/in/jay4ignite/',
                    color: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10',
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`p-3 rounded-full bg-[#D7E2EA]/5 text-[#D7E2EA] transition-all duration-300 ${social.color}`}
                  >
                    {social.element}
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-[#111111] rounded-[30px] border border-[#D7E2EA]/10 p-6 sm:p-8 md:p-10 relative">
          <FadeIn delay={0.2} y={30}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FloatingInput
                id="name"
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                label="Name"
                accentColor="#B600A8"
              />

              <FloatingInput
                id="email"
                type="email"
                value={formData.email}
                onChange={(val) => setFormData({ ...formData, email: val })}
                label="Email"
                accentColor="#7621B0"
              />

              {/* Message textarea with floating label + character counter */}
              <div className="relative pt-5">
                <motion.label
                  htmlFor="message"
                  className="absolute left-4 pointer-events-none text-[#D7E2EA]/50 font-medium uppercase tracking-widest origin-left"
                  animate={{
                    y: isMessageFloating ? -20 : 0,
                    scale: isMessageFloating ? 0.75 : 1,
                    color: messageFocused ? '#BE4C00' : 'rgba(215, 226, 234, 0.5)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{ fontSize: '12px', top: '28px' }}
                >
                  Message
                </motion.label>

                <textarea
                  ref={messageRef}
                  id="message"
                  required
                  rows={5}
                  maxLength={MESSAGE_MAX}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onFocus={() => setMessageFocused(true)}
                  onBlur={() => setMessageFocused(false)}
                  className="w-full bg-[#0C0C0C] border border-[#D7E2EA]/10 rounded-xl px-4 py-3 text-[#D7E2EA] focus:outline-none transition-all duration-300 resize-none"
                  style={{
                    borderColor: messageFocused ? '#BE4C00' : undefined,
                    boxShadow: messageFocused ? '0 0 0 3px rgba(190, 76, 0, 0.08), 0 0 20px rgba(190, 76, 0, 0.05)' : undefined,
                  }}
                />

                <FocusUnderline isFocused={messageFocused} color="#BE4C00" />

                {/* Character counter */}
                <motion.span
                  className="absolute bottom-3 right-4 text-[10px] uppercase tracking-widest font-medium"
                  animate={{
                    color: formData.message.length > MESSAGE_MAX * 0.9
                      ? '#ef4444'
                      : messageFocused
                        ? '#BE4C00'
                        : 'rgba(215, 226, 234, 0.3)',
                  }}
                >
                  {formData.message.length}/{MESSAGE_MAX}
                </motion.span>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-full font-medium uppercase tracking-widest text-white py-4 mt-2 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                  boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                  outline: '2px solid white',
                  outlineOffset: '-3px',
                }}
              >
                {status === 'sending' ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : status === 'success' ? (
                  <span>Message Sent!</span>
                ) : (
                  <>
                    <span>Submit</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              {status === 'success' && (
                <p className="text-emerald-400 text-sm text-center font-light uppercase tracking-wider">
                  Thank you! Your message has been sent successfully.
                </p>
              )}
              {status === 'error' && (
                <p className="text-rose-400 text-sm text-center font-light uppercase tracking-wider">
                  {errorMessage || 'Something went wrong. Please try again.'}
                </p>
              )}
            </form>
          </FadeIn>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="border-t border-[#D7E2EA]/10 mt-20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#D7E2EA]/40 uppercase tracking-widest font-light">
          © {new Date().getFullYear()} Krishna. All Rights Reserved.
        </p>
        <p className="text-xs text-[#D7E2EA]/40 uppercase tracking-widest font-light flex items-center gap-1">
          Made with <span className="text-[#B600A8]">❤</span> by Krishna
        </p>
      </div>
    </section>
  );
};

export default ContactSection;

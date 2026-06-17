export const CONTACT_CONFIG = {
  // Active email integration provider: 'emailjs' | 'formspree' | 'google_script' | 'dev_log'
  // Fallback defaults to 'google_script' as the user's Google Sheets endpoint is already set up.
  provider: (import.meta.env.VITE_CONTACT_PROVIDER || 'google_script') as 'emailjs' | 'formspree' | 'google_script' | 'dev_log',

  // 1. Google Apps Script Configuration
  googleScriptUrl: import.meta.env.VITE_GOOGLE_SCRIPT_URL || '',

  // 2. Formspree Configuration (Form ID from Formspree Dashboard)
  formspreeId: import.meta.env.VITE_FORMSPREE_ID || '',

  // 3. EmailJS Configuration
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '', // matches user_id
  }
};

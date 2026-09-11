import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import App from './App.tsx';
import './index.css';

// Lando Norris inspired browser console Easter egg signature for Krishna
console.log(
  `%c
██╗  ██╗██████╗ ██╗███████╗██╗  ██╗███╗   ██╗███████╗
██║ ██╔╝██╔══██╗██║██╔════╝██║  ██║████╗  ██║██╔════╝
█████╔╝ ██████╔╝██║███████╗███████║██╔██╗ ██║█████╗  
██╔═██╗ ██╔══██╗██║╚════██║██╔══██║██║╚██╗██║██╔══╝  
██║  ██╗██║  ██║██║███████║██║  ██║██║ ╚████║███████╗
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝
%c%c`,
  'color: #d2ff00; font: 400 1em monospace;',
  '',
  'background-color: #d2ff00; color: black; font: 400 1em monospace; padding: 0.5em 0; font-weight: bold;',
  ''
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScrollProvider>
      <App />
    </SmoothScrollProvider>
  </StrictMode>
);


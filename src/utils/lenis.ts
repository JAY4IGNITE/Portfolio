import type Lenis from 'lenis';

let globalLenis: Lenis | null = null;

export const setGlobalLenis = (lenis: Lenis | null) => {
  globalLenis = lenis;
};

export const getLenis = (): Lenis | null => globalLenis;

export const stopLenis = () => {
  globalLenis?.stop();
};

export const startLenis = () => {
  globalLenis?.start();
};

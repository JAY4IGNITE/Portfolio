import type { DecorativeImage } from '@/types/portfolio';

export const aboutDecorativeImages: DecorativeImage[] = [
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

/**
 * ParticleField — Three.js WebGL particle constellation
 * ──────────────────────────────────────────────────────
 * A background effect that:
 *  1. Forms the given text from particles on load
 *  2. After a delay, particles explode outward into ambient drift
 *  3. Mouse movement repels nearby particles
 *  4. Faint constellation lines connect nearby particles, fading with distance
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  /** Text to form with particles on load */
  text?: string;
  className?: string;
}

export default function ParticleField({ text = 'NANDU', className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    document.fonts.ready.then(() => {
      if (disposed || !el.isConnected) return;
      cleanup = initScene(el, text);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };

    // ─── Scene initialisation ───────────────────────────────────────
    function initScene(container: HTMLDivElement, label: string): () => void {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const isMobile = w < 768;
      const PARTICLE_COUNT = isMobile ? 1000 : 2000;
      const MAX_PAIRS = isMobile ? 200 : 400;

      /* ─── Sample text pixel positions from an offscreen canvas ─── */
      const offCanvas = document.createElement('canvas');
      const ctx = offCanvas.getContext('2d')!;
      offCanvas.width = 1024;
      offCanvas.height = 256;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 1024, 256);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 160px Kanit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 512, 128);

      const imgData = ctx.getImageData(0, 0, 1024, 256);
      const textPx: [number, number][] = [];
      const sampleStep = isMobile ? 3 : 2;
      for (let y = 0; y < 256; y += sampleStep) {
        for (let x = 0; x < 1024; x += sampleStep) {
          if (imgData.data[(y * 1024 + x) * 4] > 128) {
            textPx.push([
              (x / 1024 - 0.5) * 12,
              -(y / 256 - 0.5) * 3,
            ]);
          }
        }
      }
      // Fallback if font wasn't rendered
      if (textPx.length === 0) {
        for (let i = 0; i < 500; i++) {
          textPx.push([(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 2]);
        }
      }

      /* ─── Generate text + drift positions ─────────────────────── */
      const textPos = new Float32Array(PARTICLE_COUNT * 3);
      const driftPos = new Float32Array(PARTICLE_COUNT * 3);
      const curPos = new Float32Array(PARTICLE_COUNT * 3);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const px = textPx[Math.floor(Math.random() * textPx.length)];
        const i3 = i * 3;
        textPos[i3] = px[0] + (Math.random() - 0.5) * 0.06;
        textPos[i3 + 1] = px[1] + (Math.random() - 0.5) * 0.06;
        textPos[i3 + 2] = (Math.random() - 0.5) * 0.4;

        driftPos[i3] = (Math.random() - 0.5) * 18;
        driftPos[i3 + 1] = (Math.random() - 0.5) * 10;
        driftPos[i3 + 2] = (Math.random() - 0.5) * 6;

        curPos[i3] = textPos[i3];
        curPos[i3 + 1] = textPos[i3 + 1];
        curPos[i3 + 2] = textPos[i3 + 2];
      }

      /* ─── Pre-compute constellation line pairs (text-proximity) ── */
      const pairs: [number, number][] = [];
      const TH_SQ = 0.36; // 0.6²
      for (let i = 0; i < PARTICLE_COUNT && pairs.length < MAX_PAIRS; i += 2) {
        for (
          let j = i + 1;
          j < Math.min(i + 25, PARTICLE_COUNT) && pairs.length < MAX_PAIRS;
          j++
        ) {
          const dx = textPos[i * 3] - textPos[j * 3];
          const dy = textPos[i * 3 + 1] - textPos[j * 3 + 1];
          if (dx * dx + dy * dy < TH_SQ) pairs.push([i, j]);
        }
      }

      /* ─── Three.js core ───────────────────────────────────────── */
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
      camera.position.z = 6;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      /* ─── Particle attributes ─────────────────────────────────── */
      const sizes = new Float32Array(PARTICLE_COUNT);
      const colors = new Float32Array(PARTICLE_COUNT * 3);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        sizes[i] = Math.random() * 2.5 + 0.8;
        const t = Math.random();
        if (t < 0.12) {
          // White sparkle
          colors[i * 3] = 0.9;
          colors[i * 3 + 1] = 0.95;
          colors[i * 3 + 2] = 1.0;
        } else if (t < 0.5) {
          // Magenta #B600A8
          colors[i * 3] = 0.71 + Math.random() * 0.1;
          colors[i * 3 + 1] = Math.random() * 0.12;
          colors[i * 3 + 2] = 0.66 + Math.random() * 0.1;
        } else {
          // Chartreuse #DFFF00
          colors[i * 3] = 0.87 + Math.random() * 0.06;
          colors[i * 3 + 1] = 0.92 + Math.random() * 0.08;
          colors[i * 3 + 2] = Math.random() * 0.08;
        }
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(curPos, 3));
      pGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      pGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

      const pMat = new THREE.ShaderMaterial({
        uniforms: {
          uPR: { value: Math.min(window.devicePixelRatio, 2) },
          uTime: { value: 0 },
        },
        vertexShader: /* glsl */ `
          attribute float aSize;
          attribute vec3 aColor;
          varying vec3 vC;
          varying float vA;
          uniform float uPR;
          uniform float uTime;
          void main() {
            vC = aColor;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            float hash = position.x * 73.1 + position.y * 157.3 + position.z * 217.7;
            float pulse = 1.0 + sin(uTime * 2.0 + hash) * 0.18;
            gl_PointSize = aSize * pulse * uPR * (5.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
            vA = smoothstep(25.0, 1.0, length(mv.xyz));
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vC;
          varying float vA;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float glow = exp(-d * 5.5);
            float core = smoothstep(0.5, 0.02, d);
            float a = (glow * 0.45 + core * 0.65) * vA;
            gl_FragColor = vec4(vC, a);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      scene.add(new THREE.Points(pGeo, pMat));

      /* ─── Constellation line geometry ─────────────────────────── */
      const lPositions = new Float32Array(pairs.length * 6);
      const lOpacities = new Float32Array(pairs.length * 2);
      const lGeo = new THREE.BufferGeometry();
      lGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(lPositions, 3),
      );
      lGeo.setAttribute('aOp', new THREE.BufferAttribute(lOpacities, 1));

      const lMat = new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
          attribute float aOp;
          varying float vOp;
          void main() {
            vOp = aOp;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vOp;
          void main() {
            gl_FragColor = vec4(0.75, 0.35, 0.85, vOp * 0.13);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      scene.add(new THREE.LineSegments(lGeo, lMat));

      /* ─── Animation state ─────────────────────────────────────── */
      let phase: 'text' | 'exploding' | 'drifting' = 'text';
      let phaseT = 0;
      const clock = new THREE.Clock();
      const mouse = { x: 0, y: 0 };

      const explodeTimer = setTimeout(() => {
        phase = 'exploding';
        phaseT = 0;
      }, 2800);

      /* ─── Mouse tracking ──────────────────────────────────────── */
      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', onMouseMove);

      /* ─── Render loop ─────────────────────────────────────────── */
      let raf = 0;
      const p = curPos; // alias

      const loop = () => {
        if (disposed) return;

        const dt = clock.getDelta();
        const t = clock.getElapsedTime();
        pMat.uniforms.uTime.value = t;

        /* ── Update particle positions per phase ── */
        if (phase === 'text') {
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            p[i3] = textPos[i3] + Math.sin(t * 0.5 + i * 0.013) * 0.03;
            p[i3 + 1] =
              textPos[i3 + 1] + Math.cos(t * 0.4 + i * 0.017) * 0.03;
            p[i3 + 2] =
              textPos[i3 + 2] + Math.sin(t * 0.6 + i * 0.019) * 0.02;
          }
        } else if (phase === 'exploding') {
          phaseT += dt;
          const prog = Math.min(phaseT / 3, 1);
          const ease = 1 - Math.pow(1 - prog, 4); // ease-out quartic
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            p[i3] = THREE.MathUtils.lerp(textPos[i3], driftPos[i3], ease);
            p[i3 + 1] = THREE.MathUtils.lerp(
              textPos[i3 + 1],
              driftPos[i3 + 1],
              ease,
            );
            p[i3 + 2] = THREE.MathUtils.lerp(
              textPos[i3 + 2],
              driftPos[i3 + 2],
              ease,
            );
          }
          if (prog >= 1) phase = 'drifting';
        } else {
          // Drifting — ambient sway + mouse repulsion + return to target
          const mx = mouse.x * 6;
          const my = mouse.y * 4;
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Ambient sway
            p[i3] += Math.sin(t * 0.08 + i * 0.1) * 0.003;
            p[i3 + 1] += Math.cos(t * 0.1 + i * 0.1) * 0.003;
            p[i3 + 2] += Math.sin(t * 0.12 + i * 0.07) * 0.001;

            // Mouse repulsion
            const dx = p[i3] - mx;
            const dy = p[i3 + 1] - my;
            const dSq = dx * dx + dy * dy;
            if (dSq < 4 && dSq > 0.001) {
              const d = Math.sqrt(dSq);
              const force = ((2 - d) / 2) * 0.04;
              p[i3] += (dx / d) * force;
              p[i3 + 1] += (dy / d) * force;
            }

            // Slowly return toward drift target
            p[i3] += (driftPos[i3] - p[i3]) * 0.002;
            p[i3 + 1] += (driftPos[i3 + 1] - p[i3 + 1]) * 0.002;
            p[i3 + 2] += (driftPos[i3 + 2] - p[i3 + 2]) * 0.002;
          }
        }

        (pGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

        /* ── Update constellation lines ── */
        for (let k = 0; k < pairs.length; k++) {
          const [a, b] = pairs[k];
          const a3 = a * 3;
          const b3 = b * 3;
          const k6 = k * 6;
          const k2 = k * 2;

          lPositions[k6] = p[a3];
          lPositions[k6 + 1] = p[a3 + 1];
          lPositions[k6 + 2] = p[a3 + 2];
          lPositions[k6 + 3] = p[b3];
          lPositions[k6 + 4] = p[b3 + 1];
          lPositions[k6 + 5] = p[b3 + 2];

          const ddx = p[a3] - p[b3];
          const ddy = p[a3 + 1] - p[b3 + 1];
          const ddz = p[a3 + 2] - p[b3 + 2];
          const dist = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
          const op = Math.max(0, 1 - dist / 3.5);
          lOpacities[k2] = op;
          lOpacities[k2 + 1] = op;
        }

        (lGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        (lGeo.attributes.aOp as THREE.BufferAttribute).needsUpdate = true;

        /* ── Camera parallax following mouse ── */
        camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03;
        camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };

      loop();

      /* ─── Handle resize ───────────────────────────────────────── */
      const onResize = () => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        if (nw === 0 || nh === 0) return;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', onResize);

      /* ─── Return cleanup function ─────────────────────────────── */
      return () => {
        clearTimeout(explodeTimer);
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        pGeo.dispose();
        pMat.dispose();
        lGeo.dispose();
        lMat.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

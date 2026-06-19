/**
 * WebGLImageReveal — Lando Norris-inspired mouse-driven image reveal
 * ────────────────────────────────────────────────────────────────────
 * 2-pass WebGL shader pipeline:
 *  Pass 1: Accumulate a gaussian brush trail on an offscreen FBO
 *           - Direct mouse tracking (zero lag)
 *           - Frame-over-frame decay for fluid trail fade
 *           - Interpolated brush stamps between frames (no gaps at speed)
 *  Pass 2: Composite base image + reveal image using the mask
 *
 * The result: moving your mouse instantly reveals the colour portrait
 * with a fast, fluid, organic brush — inspired by landonorris.com
 */

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface Props {
  /** URL for the base (greyscale/default) portrait */
  baseSrc: string;
  /** URL for the reveal (colour) portrait */
  revealSrc: string;
  /** CSS class for the container */
  className?: string;
  /** Parallax offset X for the base layer (pixels) */
  offsetBaseX?: number;
  /** Parallax offset Y for the base layer (pixels) */
  offsetBaseY?: number;
  /** Parallax offset X for the reveal layer (pixels) */
  offsetRevealX?: number;
  /** Parallax offset Y for the reveal layer (pixels) */
  offsetRevealY?: number;
}

// ─── Shader sources ──────────────────────────────────────────────────────────

const BRUSH_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BRUSH_FRAGMENT = /* glsl */ `
  uniform sampler2D uPrevMask;
  uniform vec2 uBrushPositions[32];   // interpolated brush positions this frame
  uniform int uBrushCount;            // how many brush stamps this frame
  uniform float uBrushSize;           // radius in UV space
  uniform float uDecay;               // trail fade per frame (~0.985)
  uniform float uBrushStrength;       // brush opacity per stamp
  uniform float uAspect;              // container width/height aspect ratio
  varying vec2 vUv;

  void main() {
    // Start from decayed previous frame
    float prev = texture2D(uPrevMask, vUv).r * uDecay;

    // Accumulate brush stamps
    float brush = 0.0;
    for (int i = 0; i < 32; i++) {
      if (i >= uBrushCount) break;
      vec2 pos = uBrushPositions[i];
      // Skip if brush hasn't been placed yet (sentinel = -99)
      if (pos.x < -90.0) continue;
      // Correct for aspect ratio so brush appears circular
      vec2 diff = vUv - pos;
      diff.x *= uAspect;
      float dist = length(diff);
      float normalizedDist = dist / uBrushSize;
      // Soft gaussian brush with sharp core
      float stamp = exp(-normalizedDist * normalizedDist * 2.5) * uBrushStrength;
      brush = max(brush, stamp);
    }

    // Combine: max of decayed previous + new brush
    float mask = max(prev, brush);
    gl_FragColor = vec4(vec3(mask), 1.0);
  }
`;

const COMPOSITE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const COMPOSITE_FRAGMENT = /* glsl */ `
  uniform sampler2D uTexBase;
  uniform sampler2D uTexReveal;
  uniform sampler2D uMask;
  uniform vec2 uOffsetBase;       // parallax offset for base (in UV space)
  uniform vec2 uOffsetReveal;     // parallax offset for reveal (in UV space)
  uniform float uImgAspect;       // image natural width / height
  uniform float uContainerAspect; // container width / height
  varying vec2 vUv;

  // Remap UVs to implement object-fit:contain + object-position:center
  vec2 containCenterUV(vec2 uv) {
    vec2 result;
    if (uImgAspect > uContainerAspect) {
      // Image is wider than container: fit width, letterbox vertically
      float scale = uContainerAspect / uImgAspect;
      result.x = uv.x;
      result.y = (uv.y - 0.5) / scale + 0.5; // center vertically
    } else {
      // Image is taller than container: fit height, pillarbox horizontally
      float scale = uImgAspect / uContainerAspect;
      result.x = (uv.x - 0.5) / scale + 0.5; // center horizontally
      result.y = uv.y;
    }
    return result;
  }

  void main() {
    vec2 mappedUv = containCenterUV(vUv);
    vec2 baseUv = mappedUv + uOffsetBase;
    vec2 revealUv = mappedUv + uOffsetReveal;

    // Discard pixels outside image bounds (transparent)
    if (mappedUv.x < 0.0 || mappedUv.x > 1.0 || mappedUv.y < 0.0 || mappedUv.y > 1.0) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec4 base = texture2D(uTexBase, baseUv);
    vec4 reveal = texture2D(uTexReveal, revealUv);
    float mask = texture2D(uMask, vUv).r;

    // Smooth the mask edges — threshold at 0.15 so zero-mask shows NO reveal
    mask = smoothstep(0.15, 0.6, mask);

    // Mix base → reveal using mask
    gl_FragColor = mix(base, reveal, mask);

    // Preserve alpha from whichever texture is dominant
    gl_FragColor.a = mix(base.a, reveal.a, mask);
  }
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function WebGLImageReveal({
  baseSrc,
  revealSrc,
  className = '',
  offsetBaseX = 0,
  offsetBaseY = 0,
  offsetRevealX = 0,
  offsetRevealY = 0,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -99, y: -99, prevX: -99, prevY: -99 });
  const offsetsRef = useRef({ bx: 0, by: 0, rx: 0, ry: 0 });
  const hasEnteredRef = useRef(false);

  // Keep offsets ref in sync
  useEffect(() => {
    offsetsRef.current = {
      bx: offsetBaseX,
      by: offsetBaseY,
      rx: offsetRevealX,
      ry: offsetRevealY,
    };
  }, [offsetBaseX, offsetBaseY, offsetRevealX, offsetRevealY]);

  // Mouse handler — direct tracking, zero lag
  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Convert to UV space [0, 1]
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height; // flip Y for GL
    mouseRef.current.x = x;
    mouseRef.current.y = y;
    hasEnteredRef.current = true;
  }, []);

  const onMouseLeave = useCallback(() => {
    // Don't reset — let the trail decay naturally
    // Just stop adding new strokes
    mouseRef.current.x = -99;
    mouseRef.current.y = -99;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let disposed = false;
    let animId = 0;

    // ─── Setup Three.js ──────────────────────────────────────────────
    const w = el.clientWidth || 800;
    const h = el.clientHeight || 1000;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';

    // ─── Load textures ───────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    let imgAspect = 1; // will be updated once image loads

    const texBase = loader.load(baseSrc, (tex) => {
      imgAspect = tex.image.width / tex.image.height;
      compMat.uniforms.uImgAspect.value = imgAspect;
    });
    const texReveal = loader.load(revealSrc);
    [texBase, texReveal].forEach((t) => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });

    // ─── Offscreen FBO for brush mask (half-res for performance) ─────
    const fboSize = 512;
    const fboA = new THREE.WebGLRenderTarget(fboSize, fboSize, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });
    const fboB = new THREE.WebGLRenderTarget(fboSize, fboSize, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
    });
    let readFBO = fboA;
    let writeFBO = fboB;

    // ─── Clear both FBOs to black so mask starts at zero ─────────────
    renderer.setRenderTarget(fboA);
    renderer.clear();
    renderer.setRenderTarget(fboB);
    renderer.clear();
    renderer.setRenderTarget(null);

    // ─── Fullscreen quad scene for brush pass ────────────────────────
    const brushCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const brushScene = new THREE.Scene();
    const brushGeo = new THREE.PlaneGeometry(2, 2);

    // Sentinel positions: -99 means "no brush"
    const brushPositions: number[] = [];
    for (let i = 0; i < 64; i++) brushPositions.push(-99);

    const brushMat = new THREE.ShaderMaterial({
      uniforms: {
        uPrevMask: { value: null },
        uBrushPositions: { value: [] as THREE.Vector2[] },
        uBrushCount: { value: 0 },
        uBrushSize: { value: 0.12 },
        uDecay: { value: 0.982 },
        uBrushStrength: { value: 1.0 },
        uAspect: { value: w / h },
      },
      vertexShader: BRUSH_VERTEX,
      fragmentShader: BRUSH_FRAGMENT,
      depthTest: false,
      depthWrite: false,
    });
    brushScene.add(new THREE.Mesh(brushGeo, brushMat));

    // ─── Fullscreen quad scene for composite pass ────────────────────
    const compCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const compScene = new THREE.Scene();
    const compGeo = new THREE.PlaneGeometry(2, 2);
    const compMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexBase: { value: texBase },
        uTexReveal: { value: texReveal },
        uMask: { value: null },
        uOffsetBase: { value: new THREE.Vector2(0, 0) },
        uOffsetReveal: { value: new THREE.Vector2(0, 0) },
        uImgAspect: { value: 1.0 },
        uContainerAspect: { value: w / h },
      },
      vertexShader: COMPOSITE_VERTEX,
      fragmentShader: COMPOSITE_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    compScene.add(new THREE.Mesh(compGeo, compMat));

    // ─── Render loop ─────────────────────────────────────────────────
    const loop = () => {
      if (disposed) return;

      const m = mouseRef.current;
      const offsets = offsetsRef.current;

      // ── Pass 1: Brush accumulation ──────────────────────────────
      // Interpolate between previous and current mouse position
      // to fill gaps during fast movement
      const stamps: THREE.Vector2[] = [];

      if (m.x > -90 && m.y > -90) {
        if (m.prevX > -90 && m.prevY > -90) {
          const dx = m.x - m.prevX;
          const dy = m.y - m.prevY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // More stamps for larger distances — ensures continuous trail
          const count = Math.max(1, Math.ceil(dist / 0.005));
          const capped = Math.min(count, 30); // cap at 30 stamps per frame
          for (let i = 0; i < capped; i++) {
            const t = i / capped;
            stamps.push(
              new THREE.Vector2(
                m.prevX + dx * t,
                m.prevY + dy * t,
              ),
            );
          }
        } else {
          stamps.push(new THREE.Vector2(m.x, m.y));
        }
        m.prevX = m.x;
        m.prevY = m.y;
      } else {
        // Mouse left — just decay, no new stamps
        m.prevX = -99;
        m.prevY = -99;
      }

      // Pad stamps array to uniform size
      while (stamps.length < 32) {
        stamps.push(new THREE.Vector2(-99, -99));
      }

      brushMat.uniforms.uPrevMask.value = readFBO.texture;
      brushMat.uniforms.uBrushPositions.value = stamps.slice(0, 32);
      brushMat.uniforms.uBrushCount.value = Math.min(stamps.length, 32);

      renderer.setRenderTarget(writeFBO);
      renderer.render(brushScene, brushCamera);

      // Swap FBOs
      [readFBO, writeFBO] = [writeFBO, readFBO];

      // ── Pass 2: Composite to screen ─────────────────────────────
      compMat.uniforms.uMask.value = readFBO.texture;

      // Convert pixel offsets to UV space
      const containerW = el.clientWidth || 800;
      const containerH = el.clientHeight || 1000;
      compMat.uniforms.uOffsetBase.value.set(
        offsets.bx / containerW,
        -offsets.by / containerH,
      );
      compMat.uniforms.uOffsetReveal.value.set(
        offsets.rx / containerW,
        -offsets.ry / containerH,
      );

      renderer.setRenderTarget(null);
      renderer.render(compScene, compCamera);

      animId = requestAnimationFrame(loop);
    };

    // ─── Attach events ────────────────────────────────────────────
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    // Start render loop
    loop();

    // ─── Handle resize ────────────────────────────────────────────
    const onResize = () => {
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      if (nw === 0 || nh === 0) return;
      renderer.setSize(nw, nh);
      brushMat.uniforms.uAspect.value = nw / nh;
      compMat.uniforms.uContainerAspect.value = nw / nh;
    };
    window.addEventListener('resize', onResize);

    // ─── Cleanup ──────────────────────────────────────────────────
    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      fboA.dispose();
      fboB.dispose();
      brushGeo.dispose();
      brushMat.dispose();
      compGeo.dispose();
      compMat.dispose();
      texBase.dispose();
      texReveal.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [baseSrc, revealSrc, onMouseMove, onMouseLeave]);

  return (
    <div
      ref={containerRef}
      className={className}
    />
  );
}

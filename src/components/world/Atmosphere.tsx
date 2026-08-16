"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
} from "three";

/**
 * Organic gravitational particle vortex — suggested spiral arms, dense core,
 * volumetric depth. Not a literal / geometric galaxy.
 */
const FIELD = {
  count: 55_000,
  radius: 160,
  coreRadius: 28,
  coreFraction: 0.42,
  branches: 4,
  spin: 0.07,
} as const;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uDim;
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = aColor * mix(1.0, 0.55, uDim);
  vec3 pos = position;

  // Slow living drift — stronger near the core (gravitational swirl).
  float dist = length(pos.xz);
  float swirl = (1.0 / (1.0 + dist * 0.035)) * 0.55;
  float ang = uTime * (0.035 + swirl * 0.12) + aPhase;
  float c = cos(ang * swirl);
  float s = sin(ang * swirl);
  float nx = pos.x * c - pos.z * s;
  float nz = pos.x * s + pos.z * c;
  pos.x = nx;
  pos.z = nz;
  pos.y += sin(uTime * 0.22 + aPhase * 6.0 + dist * 0.04) * (0.35 + swirl * 1.8);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float atten = 200.0 / max(10.0, -mv.z);
  gl_PointSize = aSize * uPixelRatio * atten * mix(1.0, 0.9, uDim);
  gl_PointSize = clamp(gl_PointSize, 0.5, 9.0);

  // Fade distant / tiny particles into the void.
  vAlpha = smoothstep(900.0, 40.0, -mv.z) * mix(0.55, 1.0, clamp(aSize / 1.4, 0.0, 1.0)) * mix(1.0, 0.55, uDim);
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float d = length(uv);
  if (d > 0.5) discard;
  float soft = smoothstep(0.5, 0.0, d);
  float core = smoothstep(0.28, 0.0, d);
  float alpha = (soft * 0.7 + core * 0.85) * vAlpha;
  gl_FragColor = vec4(vColor, alpha);
}
`;

function seeded(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

/** Cheap value-noise for organic arm distortion (no extra deps). */
function noise3(x: number, y: number, z: number, random: () => number) {
  // Deterministic-ish hash from coords using the seeded PRNG state snapshot.
  const n =
    Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453 +
    Math.sin(x * 269.5 + y * 183.3 + z * 246.1) * 23421.631;
  return n - Math.floor(n) || random() * 0.0001;
}

function buildVortexGeometry() {
  const random = seeded(91);
  const positions = new Float32Array(FIELD.count * 3);
  const colors = new Float32Array(FIELD.count * 3);
  const sizes = new Float32Array(FIELD.count);
  const phases = new Float32Array(FIELD.count);

  const cCore = new Color("#fff4d8");
  const cPink = new Color("#ffe2b0");
  const cLav = new Color("#f0d4a8");
  const cViolet = new Color("#d8c4a0");
  const cIndigo = new Color("#9eb0d8");
  const cBlue = new Color("#7a9ad4");
  const mixed = new Color();

  const coreCount = Math.floor(FIELD.count * FIELD.coreFraction);

  for (let i = 0; i < FIELD.count; i++) {
    const i3 = i * 3;
    phases[i] = random();

    if (i < coreCount) {
      // Dense luminous core cloud — turbulent, not a hard sphere.
      const r = Math.pow(random(), 2.8) * FIELD.coreRadius;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const turb = 0.65 + noise3(theta * 3, phi * 3, r * 0.2, random) * 0.7;
      const rr = r * turb;
      const flatten = 0.55 + random() * 0.25;
      positions[i3] = rr * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = rr * Math.sin(phi) * Math.sin(theta) * flatten;
      positions[i3 + 2] = rr * Math.cos(phi);

      const t = Math.min(1, rr / FIELD.coreRadius);
      // Warm stellar bulge: pale gold → soft amber
      if (t < 0.4) mixed.copy(cCore).lerp(cPink, t / 0.4);
      else mixed.copy(cPink).lerp(cLav, (t - 0.4) / 0.6);

      // Brighter / slightly larger near core — still delicate.
      sizes[i] = 0.55 + (1 - t) * 0.75 + random() * 0.28;
      if (random() < 0.04) sizes[i] *= 1.4;
      mixed.multiplyScalar(0.72 + (1 - t) * 0.28);
    } else {
      // Organic spiral-like arms with heavy noise — suggested, not perfect.
      const radius = Math.pow(random(), 1.65) * FIELD.radius;
      const branch = i % FIELD.branches;
      const branchAngle = (branch / FIELD.branches) * Math.PI * 2;
      // Asymmetric branch strength so arms aren't identical.
      const branchBias = 0.75 + ((branch * 37) % 10) * 0.04;

      const n1 = noise3(radius * 0.05, branch * 2.1, 1.7, random);
      const n2 = noise3(radius * 0.08, branch * 4.3, 3.1, random);
      const n3 = noise3(radius * 0.03, branch * 1.2, 8.4, random);

      const angle =
        branchAngle +
        radius * FIELD.spin * branchBias +
        (n1 - 0.5) * 0.9 +
        (n2 - 0.5) * 0.45;

      const armWidth =
        (6 + radius * 0.28) * (0.35 + n3) * (0.4 + random() * 0.9);
      const side = random() < 0.5 ? -1 : 1;
      const width = Math.pow(random(), 2.2) * armWidth * side;
      const radialJitter = (n2 - 0.5) * radius * 0.12;

      // Strong volumetric depth — not a flat disk.
      const depthScale = 8 + radius * 0.18;
      const height =
        (Math.pow(random(), 2.4) * (random() < 0.5 ? 1 : -1) * depthScale +
          (n1 - 0.5) * depthScale * 0.6) *
        (0.55 + random() * 0.7);

      // Occasional stray particles drifting off the structure.
      const stray = random() < 0.06 ? (10 + random() * 40) * (random() < 0.5 ? 1 : -1) : 0;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      positions[i3] = cos * (radius + radialJitter) - sin * width + stray * 0.35;
      positions[i3 + 1] = height;
      positions[i3 + 2] = sin * (radius + radialJitter) + cos * width + stray * 0.35;

      const t = Math.min(1, radius / FIELD.radius);
      // Dust lanes → cooler blue-white outer stars (Milky Way feel)
      if (t < 0.3) mixed.copy(cLav).lerp(cViolet, t / 0.3);
      else if (t < 0.65) mixed.copy(cViolet).lerp(cIndigo, (t - 0.3) / 0.35);
      else mixed.copy(cIndigo).lerp(cBlue, (t - 0.65) / 0.35);

      // Most particles subtle; a few brighter "memory dust" nodes.
      const bright = random() < 0.045;
      sizes[i] = bright ? 0.85 + random() * 0.45 : 0.22 + random() * 0.32;
      if (!bright) mixed.multiplyScalar(0.55 + random() * 0.4);
      else mixed.lerp(cCore, 0.45).multiplyScalar(1.15);
    }

    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new BufferAttribute(phases, 1));
  return geometry;
}

function buildDistantStars(count: number, spread: number) {
  const random = seeded(3);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (random() - 0.5) * spread;
    positions[i * 3 + 1] = (random() - 0.5) * spread * 0.7;
    positions[i * 3 + 2] = (random() - 0.5) * spread;
      const b = 0.45 + random() * 0.4;
      // Cool faint background stars
      colors[i * 3] = 0.7 * b;
      colors[i * 3 + 1] = 0.75 * b;
      colors[i * 3 + 2] = 0.9 * b;
    sizes[i] = 0.14 + random() * 0.16;
    phases[i] = random();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new BufferAttribute(phases, 1));
  return geometry;
}

function VortexPoints({
  geometry,
  drift = true,
  dimmed = false,
}: {
  geometry: BufferGeometry;
  drift?: boolean;
  dimmed?: boolean;
}) {
  const points = useRef<Points>(null);
  const dimRef = useRef(0);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uDim: { value: 0 },
          uPixelRatio: {
            value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
          },
        },
      }),
    [],
  );

  useFrame((state, delta) => {
    material.uniforms.uTime!.value = state.clock.elapsedTime;
    const target = dimmed ? 1 : 0;
    dimRef.current += (target - dimRef.current) * Math.min(1, delta * 4);
    material.uniforms.uDim!.value = dimRef.current;
    if (drift && points.current) {
      points.current.rotation.y += delta * 0.008;
    }
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

export function Atmosphere({ dimmed = false }: { dimmed?: boolean }) {
  const vortex = useMemo(() => buildVortexGeometry(), []);
  const stars = useMemo(() => buildDistantStars(1600, 2200), []);

  return (
    <group>
      {/* Sparse distant void stars — never compete with the vortex */}
      <VortexPoints geometry={stars} drift={false} dimmed={dimmed} />
      <VortexPoints geometry={vortex} dimmed={dimmed} />
      {/* Soft core energy — particle cloud does the look; lights only support */}
      <pointLight
        position={[0, 2, 0]}
        intensity={dimmed ? 14 : 22}
        distance={45}
        color="#ffe8c8"
      />
      <pointLight
        position={[0, -1, 0]}
        intensity={dimmed ? 7 : 10}
        distance={32}
        color="#c8d4f0"
      />
    </group>
  );
}

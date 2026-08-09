import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, Points } from "three";

import { PALETTE } from "@/lib/atlas/palette";

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function usePointCloud(count: number, spread: number, height: number, seed: number) {
  return useMemo(() => {
    const random = seeded(seed);
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index++) {
      positions[index * 3] = (random() - 0.5) * spread;
      positions[index * 3 + 1] = (random() - 0.35) * height;
      positions[index * 3 + 2] = (random() - 0.5) * spread;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geometry;
  }, [count, spread, height, seed]);
}

/** Distant stars, drifting dust and soft floating terrain shelves. */
export function Atmosphere() {
  const stars = usePointCloud(2600, 1400, 700, 7);
  const dust = usePointCloud(900, 260, 90, 99);
  const dustRef = useRef<Points>(null);
  const shelvesRef = useRef<Group>(null);

  const shelves = useMemo(() => {
    const random = seeded(31);
    return Array.from({ length: 26 }, () => ({
      position: [
        (random() - 0.5) * 340,
        -6 - random() * 26,
        (random() - 0.5) * 340,
      ] as [number, number, number],
      radius: 12 + random() * 40,
      rotation: random() * Math.PI,
      tilt: (random() - 0.5) * 0.22,
    }));
  }, []);

  useFrame((state, delta) => {
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.012;
      dustRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.08) * 1.6;
    }
    if (shelvesRef.current) {
      shelvesRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.6;
    }
  });

  return (
    <group>
      <points geometry={stars}>
        <pointsMaterial
          color={PALETTE.star}
          size={1.1}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>

      <points ref={dustRef} geometry={dust}>
        <pointsMaterial
          color={PALETTE.ice}
          size={0.5}
          sizeAttenuation
          transparent
          opacity={0.35}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <group ref={shelvesRef}>
        {shelves.map((shelf, index) => (
          <mesh
            key={index}
            position={shelf.position}
            rotation={[Math.PI / 2 + shelf.tilt, 0, shelf.rotation]}
          >
            <circleGeometry args={[shelf.radius, 6]} />
            <meshStandardMaterial
              color={PALETTE.terrain}
              roughness={0.95}
              metalness={0.05}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Faint horizon ring to give the world a sense of edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -42, 0]}>
        <ringGeometry args={[300, 460, 96]} />
        <meshBasicMaterial color={PALETTE.terrainEdge} transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  DoubleSide,
  Group,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";


import { PALETTE } from "@/lib/atlas/palette";
import type { SongLocation } from "@/lib/atlas/types";

const NEAR_DISTANCE = 95;
const LABEL_DISTANCE = 26;

/**
 * A song left in the world. Artwork resolves only when the camera is close
 * enough to see it, so the world can hold thousands of these.
 */
export function SongObject({
  song,
  selected,
  onSelect,
}: {
  song: SongLocation;
  selected: boolean;
  onSelect: (song: SongLocation) => void;
}) {
  const group = useRef<Group>(null);
  const [near, setNear] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<Texture | null>(null);
  const scaleRef = useRef(1);
  const phase = useRef(Math.random() * Math.PI * 2);

  useEffect(() => {
    if (!near || texture || !song.artworkUrl) return;
    let cancelled = false;
    const loader = new TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      song.artworkUrl,
      (loaded) => {
        loaded.colorSpace = SRGBColorSpace;
        if (!cancelled) setTexture(loaded);
      },

      undefined,
      () => undefined,
    );
    return () => {
      cancelled = true;
    };
  }, [near, texture, song.artworkUrl]);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;
    const distance = state.camera.position.distanceTo(node.position);
    const shouldBeNear = distance < NEAR_DISTANCE;
    if (shouldBeNear !== near) setNear(shouldBeNear);

    const wanted = selected ? 1.28 : hovered ? 1.12 : 1;
    scaleRef.current += (wanted - scaleRef.current) * Math.min(1, delta * 6);
    node.scale.setScalar(scaleRef.current);
    node.position.y =
      song.position[1] + Math.sin(state.clock.elapsedTime * 0.5 + phase.current) * 0.35;
  });

  const showLabel = selected || hovered;

  return (
    <group
      ref={group}
      position={song.position}
      rotation={[0, song.rotationY, 0]}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(song);
      }}
    >
      {/* Halo */}
      <mesh position={[0, 0, -0.2]}>
        <ringGeometry args={[selected ? 3.6 : 3.2, selected ? 5.2 : 4.2, 64]} />
        <meshBasicMaterial
          color={selected || hovered ? PALETTE.ember : PALETTE.ice}
          transparent
          opacity={selected ? 0.28 : hovered ? 0.2 : 0.1}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>

      {near ? (
        <>
          <mesh>
            <boxGeometry args={[4.4, 4.4, 0.16]} />
            <meshStandardMaterial
              color={PALETTE.frame}
              roughness={0.45}
              metalness={0.35}
              emissive={PALETTE.frame}
              emissiveIntensity={0.35}
            />
          </mesh>

          <mesh position={[0, 0, 0.1]}>
            <planeGeometry args={[3.9, 3.9]} />
            {texture ? (
              <meshBasicMaterial map={texture} toneMapped={false} side={DoubleSide} />
            ) : (
              <meshBasicMaterial color={PALETTE.haze} side={DoubleSide} />
            )}
          </mesh>
          <mesh position={[0, 0, -0.1]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[3.9, 3.9]} />
            {texture ? (
              <meshBasicMaterial map={texture} toneMapped={false} opacity={0.55} transparent />
            ) : (
              <meshBasicMaterial color={PALETTE.haze} />
            )}
          </mesh>
          {/* Small note marker above the artwork */}
          <mesh position={[0, 3.1, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshBasicMaterial color={PALETTE.ember} />
          </mesh>
        </>
      ) : (
        <mesh>
          <sphereGeometry args={[0.9, 10, 10]} />
          <meshBasicMaterial
            color={PALETTE.ember}
            transparent
            opacity={0.7}
            blending={AdditiveBlending}
          />
        </mesh>
      )}

      {showLabel ? (
        <Html center distanceFactor={LABEL_DISTANCE} position={[0, -3.2, 0]} zIndexRange={[20, 0]}>
          <div className="pointer-events-none w-48 text-center">
            <p className="truncate text-sm text-foreground">{song.title}</p>
            <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

"use client";

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

import type { SongLocation } from "@/lib/atlas/types";

const NEAR_DISTANCE = 160;
const LABEL_DISTANCE = 26;

/**
 * Memory / data node embedded in the Abyss — discovered in the particle field,
 * not a planet orbiting a sun.
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
  const billboard = useRef<Group>(null);
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

    const wanted = selected ? 1.22 : hovered ? 1.1 : 1;
    scaleRef.current += (wanted - scaleRef.current) * Math.min(1, delta * 6);
    node.scale.setScalar(scaleRef.current);
    node.position.y =
      song.position[1] + Math.sin(state.clock.elapsedTime * 0.45 + phase.current) * 0.28;

    if (billboard.current) {
      billboard.current.lookAt(state.camera.position);
    }
  });

  const showLabel = selected || hovered;
  const glow = selected || hovered ? 0.28 : 0.14;

  return (
    <group
      ref={group}
      position={song.position}
      rotation={[0, song.rotationY, 0]}
      renderOrder={10}
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
      <group ref={billboard}>
        {near ? (
          <>
            <mesh position={[0, 0, -0.06]} renderOrder={11}>
              <planeGeometry args={[5.6, 5.6]} />
              <meshBasicMaterial
                color="#f0e8ff"
                transparent
                opacity={glow}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0, -0.02]} renderOrder={12}>
              <planeGeometry args={[4.4, 4.4]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={glow * 0.9}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh renderOrder={13}>
              <boxGeometry args={[3.4, 3.4, 0.1]} />
              <meshStandardMaterial
                color="#100e16"
                roughness={0.6}
                metalness={0.2}
                emissive="#c9a0ff"
                emissiveIntensity={selected || hovered ? 0.2 : 0.06}
              />
            </mesh>
            <mesh position={[0, 0, 0.08]} renderOrder={14}>
              <planeGeometry args={[3.1, 3.1]} />
              {texture ? (
                <meshBasicMaterial map={texture} toneMapped={false} side={DoubleSide} />
              ) : (
                <meshBasicMaterial color="#2a2038" side={DoubleSide} />
              )}
            </mesh>
            <mesh position={[0, 0, -0.08]} rotation={[0, Math.PI, 0]} renderOrder={14}>
              <planeGeometry args={[3.1, 3.1]} />
              {texture ? (
                <meshBasicMaterial map={texture} toneMapped={false} opacity={0.55} transparent />
              ) : (
                <meshBasicMaterial color="#2a2038" />
              )}
            </mesh>
          </>
        ) : (
          <>
            <mesh renderOrder={11}>
              <sphereGeometry args={[1.6, 12, 12]} />
              <meshBasicMaterial
                color="#e8d4ff"
                transparent
                opacity={selected || hovered ? 0.22 : 0.1}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh renderOrder={12}>
              <sphereGeometry args={[0.55, 12, 12]} />
              <meshBasicMaterial
                color={selected || hovered ? "#ffffff" : "#d8c4ff"}
                transparent
                opacity={0.85}
                blending={AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </>
        )}
      </group>

      {showLabel ? (
        <Html center distanceFactor={LABEL_DISTANCE} position={[0, -2.6, 0]} zIndexRange={[40, 0]}>
          <div className="pointer-events-none w-48 rounded-lg border border-white/12 bg-black/65 px-3 py-2 text-center shadow-lg backdrop-blur-md">
            <p className="truncate text-sm font-medium text-white">{song.title}</p>
            <p className="truncate text-xs text-white/60">{song.artist}</p>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

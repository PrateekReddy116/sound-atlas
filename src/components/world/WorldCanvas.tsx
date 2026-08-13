"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";

import { PALETTE } from "@/lib/atlas/palette";
import type { SongLocation } from "@/lib/atlas/types";
import { Atmosphere } from "./Atmosphere";
import { CameraRig, type WorldController } from "./CameraRig";
import { SongObject } from "./SongObject";

function PlacementLayer({
  onPlace,
  ghost,
  setGhost,
}: {
  onPlace: (position: [number, number, number]) => void;
  ghost: [number, number, number] | null;
  setGhost: (position: [number, number, number] | null) => void;
}) {
  const plane = useRef<Mesh>(null);

  return (
    <group>
      <mesh
        ref={plane}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerMove={(event) => {
          setGhost([event.point.x, 1.6, event.point.z]);
        }}
        onPointerOut={() => setGhost(null)}
        onClick={(event) => {
          event.stopPropagation();
          onPlace([event.point.x, 1.6, event.point.z]);
        }}
      >
        <planeGeometry args={[1200, 1200]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {ghost ? (
        <group position={ghost}>
          <mesh>
            <boxGeometry args={[4.4, 4.4, 0.16]} />
            <meshBasicMaterial color={PALETTE.ember} transparent opacity={0.28} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
            <ringGeometry args={[3, 3.4, 48]} />
            <meshBasicMaterial color={PALETTE.ember} transparent opacity={0.5} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

export function WorldCanvas({
  songs,
  selectedId,
  onSelect,
  onDeselect,
  placing,
  onPlace,
  controllerRef,
  reducedMotion,
  onTravelChange,
}: {
  songs: SongLocation[];
  selectedId: string | null;
  onSelect: (song: SongLocation) => void;
  onDeselect: () => void;
  placing: boolean;
  onPlace: (position: [number, number, number]) => void;
  controllerRef: React.RefObject<WorldController | null>;
  reducedMotion: boolean;
  onTravelChange: (travelling: boolean) => void;
}) {
  const [ghost, setGhost] = useState<[number, number, number] | null>(null);

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 2200, position: [0, 6, 30] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={onDeselect}
    >
      <color attach="background" args={[PALETTE.void]} />
      <fogExp2 attach="fog" args={[PALETTE.void, 0.0055]} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[30, 60, 20]} intensity={0.8} color={PALETTE.star} />
      <pointLight position={[-60, 20, -40]} intensity={220} distance={260} color={PALETTE.ice} />
      <pointLight position={[50, 10, 60]} intensity={180} distance={240} color={PALETTE.ember} />

      <Atmosphere />

      {songs.map((song) => (
        <SongObject
          key={song.id}
          song={song}
          selected={song.id === selectedId}
          onSelect={onSelect}
        />
      ))}

      {placing ? (
        <PlacementLayer onPlace={onPlace} ghost={ghost} setGhost={setGhost} />
      ) : null}

      <CameraRig
        controllerRef={controllerRef}
        reducedMotion={reducedMotion}
        onTravelChange={onTravelChange}
      />
    </Canvas>
  );
}

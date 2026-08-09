import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";

export type WorldController = {
  /** Cinematic flight to a point in the world. */
  travelTo: (position: [number, number, number], options?: { close?: number }) => void;
  /** A pleasing point just ahead of the camera — used for "place here". */
  focusPoint: () => [number, number, number];
};

type Pose = { target: Vector3; yaw: number; pitch: number; dist: number };

const MIN_PITCH = -0.5;
const MAX_PITCH = 1.15;
const MIN_DIST = 4.5;
const MAX_DIST = 220;

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function shortestAngle(from: number, to: number) {
  let delta = (to - from) % (Math.PI * 2);
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return from + delta;
}

export function CameraRig({
  controllerRef,
  reducedMotion,
  onTravelChange,
}: {
  controllerRef: React.RefObject<WorldController | null>;
  reducedMotion: boolean;
  onTravelChange?: (travelling: boolean) => void;
}) {
  const { camera, gl } = useThree();
  const cur = useRef<Pose>({ target: new Vector3(0, 1.5, 0), yaw: 0.5, pitch: 0.24, dist: 30 });
  const goal = useRef<Pose>({ target: new Vector3(0, 1.5, 0), yaw: 0.5, pitch: 0.24, dist: 30 });
  const travel = useRef<{ from: Pose; to: Pose; t: number; dur: number; bump: number } | null>(
    null,
  );
  const keys = useRef(new Set<string>());
  const scratch = useMemo(() => new Vector3(), []);

  useEffect(() => {
    const element = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchStart = 0;
    let pinchDist = 0;

    const onDown = (event: PointerEvent) => {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchStart = Math.hypot(a!.x - b!.x, a!.y - b!.y);
        pinchDist = goal.current.dist;
        dragging = false;
        return;
      }
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const onMove = (event: PointerEvent) => {
      if (pointers.has(event.pointerId)) {
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const spread = Math.hypot(a!.x - b!.x, a!.y - b!.y);
        if (pinchStart > 0) {
          goal.current.dist = Math.min(
            MAX_DIST,
            Math.max(MIN_DIST, pinchDist * (pinchStart / Math.max(1, spread))),
          );
        }
        return;
      }
      if (!dragging) return;
      travel.current = null;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      if (event.shiftKey || event.buttons === 4) {
        const scale = goal.current.dist * 0.0016;
        goal.current.target.x -= (Math.cos(goal.current.yaw) * dx - Math.sin(goal.current.yaw) * dy) * scale;
        goal.current.target.z -= (Math.sin(goal.current.yaw) * dx + Math.cos(goal.current.yaw) * dy) * scale;
        return;
      }
      goal.current.yaw -= dx * 0.004;
      goal.current.pitch = Math.min(MAX_PITCH, Math.max(MIN_PITCH, goal.current.pitch + dy * 0.003));
    };

    const onUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinchStart = 0;
      if (pointers.size === 0) dragging = false;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      travel.current = null;
      const dy = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1);
      goal.current.dist = Math.min(
        MAX_DIST,
        Math.max(MIN_DIST, goal.current.dist * Math.exp(dy * 0.0015)),
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      keys.current.add(event.key.toLowerCase());
    };
    const onKeyUp = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());

    element.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    element.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      element.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      element.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gl]);

  useEffect(() => {
    controllerRef.current = {
      travelTo: (position, options) => {
        const to: Pose = {
          target: new Vector3(position[0], position[1], position[2]),
          yaw: shortestAngle(cur.current.yaw, Math.random() * Math.PI * 2),
          pitch: 0.12 + Math.random() * 0.18,
          dist: options?.close ?? 13.5,
        };
        if (reducedMotion) {
          goal.current = {
            target: to.target.clone(),
            yaw: to.yaw,
            pitch: to.pitch,
            dist: to.dist,
          };
          cur.current.target.copy(to.target);
          cur.current.yaw = to.yaw;
          cur.current.pitch = to.pitch;
          cur.current.dist = to.dist;
          onTravelChange?.(false);
          return;
        }
        const span = cur.current.target.distanceTo(to.target);
        travel.current = {
          from: {
            target: cur.current.target.clone(),
            yaw: cur.current.yaw,
            pitch: cur.current.pitch,
            dist: cur.current.dist,
          },
          to,
          t: 0,
          dur: Math.min(3, 1.1 + span / 90),
          bump: Math.min(70, 14 + span * 0.32),
        };
        onTravelChange?.(true);
      },
      focusPoint: () => {
        scratch.set(
          cur.current.target.x,
          cur.current.target.y,
          cur.current.target.z,
        );
        return [scratch.x, scratch.y, scratch.z];
      },
    };
  }, [controllerRef, reducedMotion, onTravelChange, scratch]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const active = travel.current;

    if (active) {
      active.t = Math.min(1, active.t + delta / active.dur);
      const e = easeInOut(active.t);
      cur.current.target.lerpVectors(active.from.target, active.to.target, e);
      cur.current.yaw = active.from.yaw + (active.to.yaw - active.from.yaw) * e;
      cur.current.pitch = active.from.pitch + (active.to.pitch - active.from.pitch) * e;
      cur.current.dist =
        active.from.dist +
        (active.to.dist - active.from.dist) * e +
        Math.sin(e * Math.PI) * active.bump;
      if (active.t >= 1) {
        goal.current = {
          target: active.to.target.clone(),
          yaw: active.to.yaw,
          pitch: active.to.pitch,
          dist: active.to.dist,
        };
        travel.current = null;
        onTravelChange?.(false);
      }
    } else {
      // Keyboard wander
      let forward = 0;
      let strafe = 0;
      if (keys.current.has("w") || keys.current.has("arrowup")) forward += 1;
      if (keys.current.has("s") || keys.current.has("arrowdown")) forward -= 1;
      if (keys.current.has("a") || keys.current.has("arrowleft")) strafe -= 1;
      if (keys.current.has("d") || keys.current.has("arrowright")) strafe += 1;
      if (forward !== 0 || strafe !== 0) {
        const speed = delta * (10 + goal.current.dist * 0.35);
        goal.current.target.x += (Math.sin(goal.current.yaw) * forward + Math.cos(goal.current.yaw) * strafe) * speed;
        goal.current.target.z += (Math.cos(goal.current.yaw) * forward - Math.sin(goal.current.yaw) * strafe) * speed;
      }

      const k = 1 - Math.exp(-delta * (reducedMotion ? 40 : 5));
      cur.current.target.lerp(goal.current.target, k);
      cur.current.yaw += (goal.current.yaw - cur.current.yaw) * k;
      cur.current.pitch += (goal.current.pitch - cur.current.pitch) * k;
      cur.current.dist += (goal.current.dist - cur.current.dist) * k;
    }

    const { target, yaw, pitch, dist } = cur.current;
    camera.position.set(
      target.x + Math.sin(yaw) * Math.cos(pitch) * dist,
      target.y + Math.sin(pitch) * dist + 1.2,
      target.z + Math.cos(yaw) * Math.cos(pitch) * dist,
    );
    camera.lookAt(target);
  });

  return null;
}

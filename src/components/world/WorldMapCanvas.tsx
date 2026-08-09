import { useEffect, useMemo, useRef, useState } from "react";
import type { SongLocation } from "@/lib/atlas/types";
import { GLOBAL_LANDMARKS, latLngTo3D } from "@/lib/atlas/geo";

interface WorldMapCanvasProps {
  songs: SongLocation[];
  selectedId: string | null;
  onSelect: (song: SongLocation) => void;
  onDeselect: () => void;
}

export function WorldMapCanvas({
  songs,
  selectedId,
  onSelect,
  onDeselect,
}: WorldMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasLayerRef = useRef<HTMLDivElement>(null);

  // Single unified array of non-overlapping country vector paths
  const [unifiedMapPaths, setUnifiedMapPaths] = useState<string[]>([]);
  
  const cameraRef = useRef({ x: 0, y: 0, z: 0 });
  const isDraggingRef = useRef(false);
  const totalDragDistanceRef = useRef(0);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const updateTransform = () => {
    if (!canvasLayerRef.current) return;
    const { x, y, z } = cameraRef.current;
    canvasLayerRef.current.style.transform = `scale(1) translate3d(${x}px, ${y}px, ${z}px)`;
    
    if (z > 80) {
      canvasLayerRef.current.classList.add("is-zoomed-in");
    } else {
      canvasLayerRef.current.classList.remove("is-zoomed-in");
    }
  };

  // Smoothly pan camera to selected song when selectedId changes in 2D mode
  useEffect(() => {
    if (!selectedId) return;
    const targetSong = songs.find((s) => s.id === selectedId);
    if (!targetSong) return;

    const lat = targetSong.lat ?? 35.6762;
    const lng = targetSong.lng ?? 139.6503;
    const targetPos = latLngTo3D(lat, lng, 0);

    // Pan map layer center to target coordinates
    cameraRef.current = {
      x: -targetPos.x,
      y: -targetPos.y,
      z: 180, // Zoomed in focus view
    };
    updateTransform();
  }, [selectedId, songs]);

  // Load 100% accurate, non-overlapping world boundaries
  useEffect(() => {
    let isCancelled = false;

    Promise.all([
      // 1. Natural Earth Official Global Admin-0 GeoJSON
      fetch("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson")
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
      // 2. Official DataMeet India Composite GeoJSON
      fetch("https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson")
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ]).then(([worldGeoJson, indiaGeoJson]) => {
      if (isCancelled) return;
      const combinedPaths: string[] = [];

      // Add World Countries (excluding India to prevent overlap)
      if (worldGeoJson && worldGeoJson.features) {
        worldGeoJson.features.forEach((feature: any) => {
          const name = feature.properties?.ADMIN || feature.properties?.NAME || feature.properties?.SOVEREIGNT || feature.properties?.ISO_A3;
          if (name === "India" || name === "IND") return;

          const geom = feature.geometry;
          if (!geom) return;
          if (geom.type === "Polygon") {
            combinedPaths.push(polygonToSvgPath(geom.coordinates));
          } else if (geom.type === "MultiPolygon") {
            geom.coordinates.forEach((poly: any) => {
              combinedPaths.push(polygonToSvgPath(poly));
            });
          }
        });
      }

      // Add Official DataMeet India Composite Boundaries
      if (indiaGeoJson) {
        const features = indiaGeoJson.features || [indiaGeoJson];
        features.forEach((feat: any) => {
          const geom = feat.geometry || feat;
          if (!geom) return;
          if (geom.type === "Polygon") {
            combinedPaths.push(polygonToSvgPath(geom.coordinates));
          } else if (geom.type === "MultiPolygon") {
            geom.coordinates.forEach((poly: any) => {
              combinedPaths.push(polygonToSvgPath(poly));
            });
          }
        });
      }

      if (combinedPaths.length > 0) {
        setUnifiedMapPaths(combinedPaths);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest(".glass") || target.closest("header") || target.closest("nav") || target.closest(".song-node-hitbox")) return;
      isDraggingRef.current = true;
      totalDragDistanceRef.current = 0;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - lastMouseRef.current.x;
      const deltaY = e.clientY - lastMouseRef.current.y;
      totalDragDistanceRef.current += Math.abs(deltaX) + Math.abs(deltaY);

      if (e.ctrlKey || e.metaKey) {
        cameraRef.current.z -= deltaY * 2.5;
      } else {
        cameraRef.current.x += deltaX * 1.25;
        cameraRef.current.y += deltaY * 1.25;
      }

      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      updateTransform();
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        cameraRef.current.z -= e.deltaY * 1.5;
        updateTransform();
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const gridElements = useMemo(() => {
    return (
      <g>
        <line x1="0" y1="1800" x2="7200" y2="1800" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.2" />
        {[-60, -30, 30, 60].map((lat) => (
          <line
            key={`lat-${lat}`}
            x1="0"
            y1={((90 - lat) / 180) * 3600}
            x2="7200"
            y2={((90 - lat) / 180) * 3600}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.8"
            strokeDasharray="4 6"
          />
        ))}
        {[-120, -60, 0, 60, 120].map((lng) => (
          <line
            key={`lng-${lng}`}
            x1={((lng + 180) / 360) * 7200}
            y1="0"
            x2={((lng + 180) / 360) * 7200}
            y2="3600"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.8"
            strokeDasharray="4 6"
          />
        ))}
      </g>
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-[#040406] cursor-grab active:cursor-grabbing"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest(".song-node-hitbox")) return;
        if (totalDragDistanceRef.current < 5) {
          onDeselect();
        }
      }}
      style={{ perspective: "1200px" }}
    >
      {/* 3D Canvas Layer */}
      <div
        ref={canvasLayerRef}
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: "scale(1) translate3d(0px, 0px, 0px)",
        }}
      >
        {/* Crisp Vector Map */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            width: "7200px",
            height: "3600px",
            transform: "translate3d(-3600px, -1800px, -600px)",
            transformStyle: "preserve-3d",
          }}
        >
          <svg className="w-full h-full overflow-visible" viewBox="0 0 7200 3600">
            {gridElements}
            <g>
              {unifiedMapPaths.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </g>
          </svg>
        </div>

        {/* Region & City Landmark Labels */}
        {GLOBAL_LANDMARKS.map((landmark, idx) => {
          const pos = latLngTo3D(landmark.lat, landmark.lng, landmark.isRegion ? -400 : -200);
          return (
            <div
              key={idx}
              className="absolute top-0 left-0 pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`,
              }}
            >
              {landmark.isRegion ? (
                <span className="font-semibold text-4xl tracking-[10px] text-white/20 uppercase whitespace-nowrap">
                  {landmark.name}
                </span>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0e121c]/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/90 shadow-md backdrop-blur-md whitespace-nowrap">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {landmark.name}, {landmark.country}
                </div>
              )}
            </div>
          );
        })}

        {/* Songs Array mapped onto 3D Coordinates */}
        {songs.map((song, idx) => {
          const lat = song.lat ?? 35.6762;
          const lng = song.lng ?? 139.6503;
          const pos = latLngTo3D(lat, lng, (idx % 5) * -120);
          const isSelected = song.id === selectedId;

          return (
            <div
              key={song.id}
              className="absolute top-0 left-0 song-node-hitbox pointer-events-auto"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`,
                zIndex: isSelected ? 100 : 50,
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(song);
                }}
                className="flex items-center justify-center p-4 cursor-pointer -translate-x-1/2 -translate-y-1/2 group"
                style={{ cursor: "pointer" }}
              >
                <div
                  className={`relative transition-all duration-300 ${
                    isSelected
                      ? "w-36 h-36 rounded-xl ring-2 ring-white shadow-2xl"
                      : "w-5 h-5 rounded-full group-hover:w-36 group-hover:h-36 group-hover:rounded-xl"
                  } bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]`}
                  style={{
                    backgroundImage: song.artworkUrl ? `url(${song.artworkUrl})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-[#0a0e18]/90 px-3 py-1 text-center opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                    <span className="block text-xs font-medium text-white">{song.title}</span>
                    <span className="block text-[10px] text-muted-foreground">{song.artist}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Atmospheric Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(4,4,6,0.95)_100%)]" />
    </div>
  );
}

function polygonToSvgPath(coordinates: any[]) {
  let pathStr = "";
  coordinates.forEach((ring: any[]) => {
    if (ring.length < 3) return;
    const pathPoints = ring.map((pt: number[]) => {
      const lng = pt[0];
      const lat = pt[1];
      const x = ((lng + 180) / 360) * 7200;
      const y = ((90 - lat) / 180) * 3600;
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    });
    pathStr += `M ${pathPoints.join(" L ")} Z `;
  });
  return pathStr;
}

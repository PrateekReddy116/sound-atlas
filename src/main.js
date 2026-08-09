// SOUND ATLAS — A 3D World for Music Discovery ("By the world, for the world.")

// 1. Geographic Coordinates & Landmark Cities
const GLOBAL_LANDMARKS = [
  { name: "NORTH AMERICA", lat: 40, lng: -100, isRegion: true },
  { name: "SOUTH AMERICA", lat: -15, lng: -60, isRegion: true },
  { name: "EUROPE", lat: 50, lng: 15, isRegion: true },
  { name: "ASIA", lat: 35, lng: 95, isRegion: true },
  { name: "AFRICA", lat: 0, lng: 20, isRegion: true },
  { name: "OCEANIA", lat: -25, lng: 135, isRegion: true },

  // Landmark Cities
  { name: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { name: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lng: -43.1729 },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357 },
  { name: "Reykjavik", country: "Iceland", lat: 64.1466, lng: -21.9426 },
  { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { name: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.9780 },
  { name: "Buenos Aires", country: "Argentina", lat: -34.6037, lng: -58.3816 }
];

// Seed Songs across the World Map & 3D Abyss
const SEED_SONGS = [
  {
    id: "song-1",
    title: "Space Song",
    artist: "Beach House",
    spotifyId: "78Bwc2ES23WBdLq25CeaBI",
    artwork: "https://i.scdn.co/image/ab67616d0000b2731b790d9f8e81d77a06283b98",
    lat: 40.7128,
    lng: -74.0060,
    abyssPos: { x: -800, y: 200, z: -1200 },
    locationName: "New York, USA",
    creator: "Left by @stranger"
  },
  {
    id: "song-2",
    title: "Sparkle",
    artist: "RADWIMPS",
    spotifyId: "3A4DpFiWPrm9aoZ8qP9Q3d",
    artwork: "https://i.scdn.co/image/ab67616d0000b273b06e8f49618b010c32918880",
    lat: 35.6762,
    lng: 139.6503,
    abyssPos: { x: 1200, y: -300, z: -800 },
    locationName: "Tokyo, Japan",
    creator: "Left by @wanderer"
  },
  {
    id: "song-3",
    title: "Midnight City",
    artist: "M83",
    spotifyId: "11dFghVXANMlKmJXsNCbNl",
    artwork: "https://i.scdn.co/image/ab67616d0000b273f550993077741d8e1f0e4bbf",
    lat: 48.8566,
    lng: 2.3522,
    abyssPos: { x: -300, y: 600, z: -1500 },
    locationName: "Paris, France",
    creator: "Left by @nightowl"
  },
  {
    id: "song-4",
    title: "Starman",
    artist: "David Bowie",
    spotifyId: "0pQskrTITgmHYWCVDwqM8C",
    artwork: "https://i.scdn.co/image/ab67616d0000b27393444007b8b408e06385cfcf",
    lat: 51.5074,
    lng: -0.1278,
    abyssPos: { x: -450, y: -400, z: -600 },
    locationName: "London, UK",
    creator: "Left by @cosmic"
  },
  {
    id: "song-5",
    title: "Kun Faya Kun",
    artist: "A.R. Rahman, Javed Ali",
    spotifyId: "73k1kL5n04o5uGZ7v9rV5e",
    artwork: "https://i.scdn.co/image/ab67616d0000b273ca35d720b080ef8a3d538e13",
    lat: 19.0760,
    lng: 72.8777,
    abyssPos: { x: 750, y: 150, z: -1800 },
    locationName: "Mumbai, India",
    creator: "Left by @soulseeker"
  },
  {
    id: "song-6",
    title: "Resonance",
    artist: "HOME",
    spotifyId: "1TuMV9W9Zgq1aK6n47Jp2y",
    artwork: "https://i.scdn.co/image/ab67616d0000b273d4abf27a6962ed14d1f2bdfb",
    lat: 64.1466,
    lng: -21.9426,
    abyssPos: { x: -1100, y: 500, z: -2000 },
    locationName: "Reykjavik, Iceland",
    creator: "Left by @synthwave"
  },
  {
    id: "song-7",
    title: "The Girl from Ipanema",
    artist: "Stan Getz, Astrud Gilberto",
    spotifyId: "3L8g7iW8vA3eH9L9wGgJ5T",
    artwork: "https://i.scdn.co/image/ab67616d0000b273b5a1ad47a32d16686e088d8b",
    lat: -22.9068,
    lng: -43.1729,
    abyssPos: { x: -600, y: -600, z: -1100 },
    locationName: "Rio de Janeiro, Brazil",
    creator: "Left by @bossa"
  },
  {
    id: "song-8",
    title: "Australia",
    artist: "The Shins",
    spotifyId: "65k6p8W49P208aG1YvLwS1",
    artwork: "https://i.scdn.co/image/ab67616d0000b2736e4f3a7fa83c65c2b04f7b24",
    lat: -33.8688,
    lng: 151.2093,
    abyssPos: { x: 1400, y: -500, z: -1400 },
    locationName: "Sydney, Australia",
    creator: "Left by @oceania"
  }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function latLngTo3D(lat, lng, zOffset = 0) {
  const x = lng * 20;
  const y = -lat * 20;
  const z = zOffset;
  return { x, y, z };
}

function latLngToSvg(lat, lng) {
  const x = ((lng + 180) / 360) * 7200;
  const y = ((90 - lat) / 180) * 3600;
  return { x, y };
}

// Active State Variables
let currentMode = "map"; // "map" or "abyss"
let currentSongs = [];
let cameraState = { x: 0, y: 0, z: 0 };
let activeSongId = null;
let detectedCoords = { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" };

// 2. Cinematic Opening Sequence
async function runOpeningSequence() {
  const introOverlay = document.getElementById("intro-overlay");
  const introText = document.getElementById("intro-text");
  const introSubtext = document.getElementById("intro-subtext");
  const atlasContainer = document.getElementById("atlas-container");
  const canvasLayer = document.getElementById("canvas-layer");
  const brandHeader = document.getElementById("brand-header");
  const topNav = document.getElementById("top-nav");

  await sleep(800);

  // Line 1: "A world made of music."
  introText.textContent = "A world made of music.";
  introText.classList.add("visible");
  await sleep(2400);

  introText.classList.remove("visible");
  introText.classList.add("hidden");
  await sleep(1400);

  // Line 2: "By the world, for the world."
  introText.textContent = "By the world, for the world.";
  introSubtext.textContent = "Wander around. Every place contains a song left by a stranger.";
  introText.classList.remove("hidden");
  void introText.offsetWidth;
  introText.classList.add("visible");
  introSubtext.classList.add("visible");
  await sleep(3000);

  introText.classList.remove("visible");
  introSubtext.classList.remove("visible");
  await sleep(1500);

  // Transition into 3D World Map
  introOverlay.classList.add("fade-out");
  atlasContainer.classList.add("visible");
  
  await sleep(400);
  canvasLayer.classList.add("settled");

  // Load World Map Vector Layer + Cities + Songs
  loadWorld();

  await sleep(2500);
  brandHeader.classList.add("visible");
  topNav.classList.add("visible");

  // Init interactive 3D camera & mode switcher
  initNavigation(canvasLayer);
  initModeSwitcher();
}

// 3. Render 3D World (World Map View OR 3D Abyss View)
function loadWorld() {
  const canvasLayer = document.getElementById("canvas-layer");
  canvasLayer.innerHTML = "";

  // A. Build Plain White Vector World Map SVG Layer
  renderNeonMapLayer(canvasLayer);

  // B. Build 3D Abyss Particle Stars Layer
  renderAbyssStarsLayer(canvasLayer);

  // C. Load stored songs or seed songs
  const stored = localStorage.getItem("sound_atlas_songs");
  if (stored) {
    try {
      currentSongs = JSON.parse(stored);
    } catch (e) {
      currentSongs = [...SEED_SONGS];
    }
  } else {
    currentSongs = [...SEED_SONGS];
  }

  // D. Render 3D Region & City Labels (Mapped to Lat/Lng)
  GLOBAL_LANDMARKS.forEach((landmark) => {
    const pos = latLngTo3D(landmark.lat, landmark.lng, landmark.isRegion ? -400 : -200);

    const wrapper = document.createElement("div");
    wrapper.classList.add("spatial-label-wrapper");
    wrapper.style.transform = `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`;

    if (landmark.isRegion) {
      const label = document.createElement("div");
      label.classList.add("continent-label");
      label.textContent = landmark.name;
      wrapper.appendChild(label);
    } else {
      const label = document.createElement("div");
      label.classList.add("city-label");
      label.innerHTML = `<span class="city-node-dot"></span> ${landmark.name}, ${landmark.country}`;
      
      const pulseRing = document.createElement("div");
      pulseRing.classList.add("neon-pulse-ring");
      wrapper.appendChild(pulseRing);

      wrapper.appendChild(label);
    }

    canvasLayer.appendChild(wrapper);
  });

  // E. Render 3D Song Artifact Nodes
  currentSongs.forEach((song, index) => {
    renderSongNode(canvasLayer, song, index);
  });
}

// Mode Switcher Logic (World Map ⟷ 3D Abyss)
function initModeSwitcher() {
  const toggleMap = document.getElementById("toggle-map-mode");
  const toggleAbyss = document.getElementById("toggle-abyss-mode");
  const indicator = document.getElementById("view-mode-indicator");

  toggleMap.addEventListener("click", () => {
    if (currentMode === "map") return;
    currentMode = "map";
    toggleMap.classList.add("active");
    toggleAbyss.classList.remove("active");
    document.body.classList.remove("mode-abyss");
    indicator.textContent = "World Map View";

    updateSongPositions();
    showToast("🗺️ Switched to World Map View");
  });

  toggleAbyss.addEventListener("click", () => {
    if (currentMode === "abyss") return;
    currentMode = "abyss";
    toggleAbyss.classList.add("active");
    toggleMap.classList.remove("active");
    document.body.classList.add("mode-abyss");
    indicator.textContent = "3D Abyss Universe View";

    updateSongPositions();
    showToast("🌌 Switched to 3D Abyss Space View");
  });
}

function updateSongPositions() {
  currentSongs.forEach((song, index) => {
    const wrapper = document.getElementById(`song-wrapper-${song.id}`);
    if (wrapper) {
      let pos;
      if (currentMode === "map") {
        pos = latLngTo3D(song.lat, song.lng, (index % 5) * -120);
      } else {
        pos = getAbyssPosition(song, index);
      }
      wrapper.style.transform = `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`;
    }
  });
}

function getAbyssPosition(song, index) {
  if (song.abyssPos) return song.abyssPos;
  // Generate deterministic pseudo-random 3D abyss coords based on song index/id
  const seed = index * 137.5;
  const x = Math.cos(seed) * (600 + (index * 120));
  const y = Math.sin(seed) * (400 + (index * 80));
  const z = -600 - (index * 150);
  song.abyssPos = { x: Math.round(x), y: Math.round(y), z: Math.round(z) };
  return song.abyssPos;
}

// 3D Abyss Particle Stars Layer
function renderAbyssStarsLayer(container) {
  const starsWrapper = document.createElement("div");
  starsWrapper.classList.add("abyss-stars-wrapper");

  // Create 150 floating 3D particle stars
  for (let i = 0; i < 150; i++) {
    const star = document.createElement("div");
    star.classList.add("abyss-star");

    const x = (Math.random() - 0.5) * 6000;
    const y = (Math.random() - 0.5) * 3000;
    const z = -2500 + Math.random() * 2600;
    const size = 2 + Math.random() * 4;

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    star.style.animationDelay = `-${Math.random() * 8}s`;

    starsWrapper.appendChild(star);
  }

  container.appendChild(starsWrapper);
}

// Render 100% Line-to-Line Exact GeoJSON Vector Continents & Grid
async function renderNeonMapLayer(container) {
  const mapWrapper = document.createElement("div");
  mapWrapper.classList.add("world-map-svg-wrapper");

  let gridLinesHtml = "";

  const equatorY = ((90 - 0) / 180) * 3600;
  gridLinesHtml += `<line class="neon-equator-line" x1="0" y1="${equatorY}" x2="7200" y2="${equatorY}" />`;

  [-60, -30, 30, 60].forEach(lat => {
    const y = ((90 - lat) / 180) * 3600;
    gridLinesHtml += `<line class="neon-grid-line" x1="0" y1="${y}" x2="7200" y2="${y}" />`;
  });

  [-120, -60, 0, 60, 120].forEach(lng => {
    const x = ((lng + 180) / 360) * 7200;
    gridLinesHtml += `<line class="neon-grid-line" x1="${x}" y1="0" x2="${x}" y2="3600" />`;
  });

  [-60, -30, 0, 30, 60].forEach(lat => {
    [-120, -60, 0, 60, 120].forEach(lng => {
      const p = latLngToSvg(lat, lng);
      gridLinesHtml += `<circle class="neon-grid-dot" cx="${p.x}" cy="${p.y}" r="3" />`;
    });
  });

  const fallbackPaths = [
    "M 700 400 Q 1100 200 1900 400 T 2600 700 T 2800 1200 T 2300 1600 T 1600 1800 T 1100 1500 T 800 1100 Z",
    "M 2100 1900 Q 2700 2100 2900 2500 T 2600 3200 T 2200 3500 T 2000 2800 Z",
    "M 3400 400 Q 4000 300 4400 600 T 4200 1100 T 3600 1200 T 3300 800 Z",
    "M 3300 1300 Q 4200 1300 4500 1900 T 4300 2900 T 3800 3300 T 3400 2500 Z",
    "M 4500 400 Q 5600 300 6600 600 T 6800 1500 T 6000 2000 T 5000 1600 T 4400 1000 Z",
    "M 5800 2400 Q 6600 2300 6800 2800 T 6300 3200 T 5700 2900 Z"
  ];
  const initialPathsHtml = fallbackPaths.map(d => `<path class="neon-landmass" d="${d}" />`).join("");

  mapWrapper.innerHTML = `
    <svg class="world-map-svg" viewBox="0 0 7200 3600" xmlns="http://www.w3.org/2000/svg">
      <g class="neon-grid-group">
        ${gridLinesHtml}
      </g>
      <g class="neon-landmass-group" id="neon-landmass-group">
        ${initialPathsHtml}
      </g>
    </svg>
  `;

  container.appendChild(mapWrapper);

  try {
    const res = await fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson");
    if (res.ok) {
      const geoJson = await res.json();
      const landGroup = document.getElementById("neon-landmass-group");
      if (landGroup && geoJson.features) {
        let svgPaths = "";
        geoJson.features.forEach(feature => {
          const geom = feature.geometry;
          if (!geom) return;
          if (geom.type === "Polygon") {
            svgPaths += polygonToSvgPath(geom.coordinates);
          } else if (geom.type === "MultiPolygon") {
            geom.coordinates.forEach(poly => {
              svgPaths += polygonToSvgPath(poly);
            });
          }
        });
        if (svgPaths) {
          landGroup.innerHTML = svgPaths;
        }
      }
    }
  } catch (err) {
    console.warn("Using fallback map vector layer", err);
  }
}

function polygonToSvgPath(coordinates) {
  let pathStr = "";
  coordinates.forEach(ring => {
    if (ring.length < 3) return;
    const pathPoints = ring.map(pt => {
      const lng = pt[0];
      const lat = pt[1];
      const x = ((lng + 180) / 360) * 7200;
      const y = ((90 - lat) / 180) * 3600;
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    });
    pathStr += `M ${pathPoints.join(" L ")} Z `;
  });
  return `<path class="neon-landmass" d="${pathStr}" />`;
}

function renderSongNode(container, song, index = 0) {
  const pos = currentMode === "map"
    ? latLngTo3D(song.lat, song.lng, (index % 5) * -120)
    : getAbyssPosition(song, index);

  const wrapper = document.createElement("div");
  wrapper.classList.add("song-wrapper");
  wrapper.id = `song-wrapper-${song.id}`;
  wrapper.style.transform = `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`;

  const node = document.createElement("div");
  node.classList.add("song-node");
  node.style.backgroundImage = `url('${song.artwork}')`;
  node.style.animationDelay = `-${Math.random() * 8}s`;

  const info = document.createElement("div");
  info.classList.add("song-info-overlay");
  info.innerHTML = `
    <span class="song-title-text">${escapeHtml(song.title)} — ${escapeHtml(song.artist)}</span>
    <span class="song-city-text">📍 ${escapeHtml(song.locationName || 'Earth')}</span>
  `;

  node.appendChild(info);
  wrapper.appendChild(node);
  container.appendChild(wrapper);

  setTimeout(() => {
    node.classList.add("appear");
  }, index * 80);

  node.addEventListener("click", (e) => {
    e.stopPropagation();
    openSongPanel(song, pos);
  });
}

// 4. Floating Spotify Detail Panel
function openSongPanel(song, pos) {
  activeSongId = song.id;
  const panel = document.getElementById("song-panel");
  const locationBadge = document.getElementById("panel-location-badge");
  const creatorBadge = document.getElementById("panel-creator-badge");
  const embedContainer = document.getElementById("spotify-embed-container");

  locationBadge.textContent = `📍 ${song.locationName || 'Earth'}`;
  creatorBadge.textContent = song.creator || "Left by a stranger";

  const cleanId = song.spotifyId.replace("spotify:track:", "");
  embedContainer.innerHTML = `
    <iframe src="https://open.spotify.com/embed/track/${cleanId}?utm_source=generator&theme=0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"></iframe>
  `;

  panel.classList.add("open");

  if (pos) {
    flyCameraTo(-pos.x + (window.innerWidth / 2) - 90, -pos.y + (window.innerHeight / 2) - 90, 200);
  }
}

function closeSongPanel() {
  const panel = document.getElementById("song-panel");
  const embedContainer = document.getElementById("spotify-embed-container");
  panel.classList.remove("open");
  setTimeout(() => {
    embedContainer.innerHTML = "";
  }, 400);
}

// 5. "Take Me Anywhere" Engine (Cinematic Flight)
function takeMeAnywhere() {
  if (currentSongs.length === 0) {
    showToast("The world is quiet. Leave a song behind!");
    return;
  }

  const randomIndex = Math.floor(Math.random() * currentSongs.length);
  const song = currentSongs[randomIndex];
  const pos = currentMode === "map"
    ? latLngTo3D(song.lat, song.lng, (randomIndex % 5) * -120)
    : getAbyssPosition(song, randomIndex);

  showToast(`✦ Flying to ${song.locationName || 'a song in the world'}...`);

  const targetX = -pos.x + (window.innerWidth / 2) - 90;
  const targetY = -pos.y + (window.innerHeight / 2) - 90;
  const targetZ = 200;

  flyCameraTo(targetX, targetY, targetZ, 2500, () => {
    openSongPanel(song, pos);
  });
}

function flyCameraTo(targetX, targetY, targetZ, duration = 2000, onComplete = null) {
  const canvasLayer = document.getElementById("canvas-layer");
  canvasLayer.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

  cameraState.x = targetX;
  cameraState.y = targetY;
  cameraState.z = targetZ;

  updateCameraTransform(canvasLayer);

  setTimeout(() => {
    canvasLayer.style.transition = "transform 0.1s ease-out";
    if (onComplete) onComplete();
  }, duration);
}

function updateCameraTransform(canvasLayer) {
  canvasLayer.style.transform = `scale(1) translate3d(${cameraState.x}px, ${cameraState.y}px, ${cameraState.z}px)`;
  
  if (cameraState.z > 80) {
    canvasLayer.classList.add("is-zoomed-in");
  } else {
    canvasLayer.classList.remove("is-zoomed-in");
  }
}

// 6. Interactive 3D Camera Navigation (Pan, Depth Zoom, Touch)
function initNavigation(canvasLayer) {
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  canvasLayer.style.transition = "transform 0.1s ease-out";

  updateCameraTransform(canvasLayer);

  window.addEventListener("mousedown", (e) => {
    if (e.target.closest("#song-panel") || e.target.closest("#leave-song-modal") || e.target.closest("#top-nav")) return;
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastX;
    const deltaY = e.clientY - lastY;

    if (e.ctrlKey || e.metaKey) {
      cameraState.z -= deltaY * 2.5;
    } else {
      cameraState.x += deltaX * 1.2;
      cameraState.y += deltaY * 1.2;
    }

    lastX = e.clientX;
    lastY = e.clientY;
    updateCameraTransform(canvasLayer);
  });

  window.addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      cameraState.z -= e.deltaY * 1.5;
      updateCameraTransform(canvasLayer);
    }
  }, { passive: false });
}

// 7. "+ Leave a Song" Flow & Location Detection
function initLeaveSongModal() {
  const openBtn = document.getElementById("open-leave-song-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const modal = document.getElementById("leave-song-modal");
  const searchInput = document.getElementById("song-search-input");
  const resultsList = document.getElementById("search-results-list");
  const locationStatus = document.getElementById("detected-location-status");
  const citySelect = document.getElementById("city-select");

  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
    detectUserLocation();
    renderSearchResults("");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  searchInput.addEventListener("input", (e) => {
    renderSearchResults(e.target.value.trim());
  });

  citySelect.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "auto") {
      detectUserLocation();
    } else {
      const cityMap = {
        tokyo: { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
        london: { lat: 51.5074, lng: -0.1278, name: "London, UK" },
        newyork: { lat: 40.7128, lng: -74.0060, name: "New York, USA" },
        paris: { lat: 48.8566, lng: 2.3522, name: "Paris, France" },
        mumbai: { lat: 19.0760, lng: 72.8777, name: "Mumbai, India" },
        sydney: { lat: -33.8688, lng: 151.2093, name: "Sydney, Australia" },
        rio: { lat: -22.9068, lng: -43.1729, name: "Rio de Janeiro, Brazil" },
        cairo: { lat: 30.0444, lng: 31.2357, name: "Cairo, Egypt" },
        reykjavik: { lat: 64.1466, lng: -21.9426, name: "Reykjavik, Iceland" }
      };
      if (cityMap[val]) {
        detectedCoords = cityMap[val];
        locationStatus.textContent = `📍 Pinned at ${detectedCoords.name}`;
      }
    }
  });
}

function detectUserLocation() {
  const locationStatus = document.getElementById("detected-location-status");
  locationStatus.textContent = "📍 Detecting location...";

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        detectedCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: "Your Location"
        };
        locationStatus.textContent = `📍 Pinned at Your Location (${detectedCoords.lat.toFixed(1)}°, ${detectedCoords.lng.toFixed(1)}°)`;
      },
      () => {
        detectedCoords = { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" };
        locationStatus.textContent = "📍 Pinned at Tokyo, Japan";
      },
      { timeout: 5000 }
    );
  } else {
    detectedCoords = { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" };
    locationStatus.textContent = "📍 Pinned at Tokyo, Japan";
  }
}

// Popular search pool for quick discovery & link paste handling
const POPULAR_SEARCH_PRESETS = [
  { title: "Starboy", artist: "The Weeknd", spotifyId: "7MXVClvYAjiSuA1fBxK2Bq", artwork: "https://i.scdn.co/image/ab67616d0000b2734718e241245109ec73ef368d" },
  { title: "Blinding Lights", artist: "The Weeknd", spotifyId: "0VjIjW4GlUZAMYd2vXMi3b", artwork: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5a8636" },
  { title: "As It Was", artist: "Harry Styles", spotifyId: "4DvfB2RdpYfvBxKOioFJvf", artwork: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f35751f617" },
  { title: "Levitating", artist: "Dua Lipa", spotifyId: "54bR1WyoM5mKVZCw5yaQjO", artwork: "https://i.scdn.co/image/ab67616d0000b273299dbb050f2f01f01c801e06" },
  { title: "Sweater Weather", artist: "The Neighbourhood", spotifyId: "2QjOHZ2X2jOK8v9GvF2iP6", artwork: "https://i.scdn.co/image/ab67616d0000b27382ef8f77340b0769cf3be523" }
];

function renderSearchResults(query) {
  const resultsList = document.getElementById("search-results-list");
  resultsList.innerHTML = "";

  const spotifyLinkMatch = query.match(/track[\/:]([a-zA-Z0-9]{22})/);
  if (spotifyLinkMatch) {
    const trackId = spotifyLinkMatch[1];
    const customSong = {
      title: "Spotify Track",
      artist: "Selected Song",
      spotifyId: trackId,
      artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop"
    };
    appendSearchItem(resultsList, customSong);
    return;
  }

  const filtered = query
    ? POPULAR_SEARCH_PRESETS.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase()))
    : POPULAR_SEARCH_PRESETS;

  filtered.forEach(song => {
    appendSearchItem(resultsList, song);
  });
}

function appendSearchItem(container, song) {
  const item = document.createElement("div");
  item.classList.add("search-item");
  item.innerHTML = `
    <img src="${song.artwork}" alt="${escapeHtml(song.title)}" class="search-item-art" />
    <div class="search-item-info">
      <div class="search-item-title">${escapeHtml(song.title)}</div>
      <div class="search-item-artist">${escapeHtml(song.artist)}</div>
    </div>
    <span class="btn-icon" style="color:#fff; font-size:1.2rem;">+</span>
  `;

  item.addEventListener("click", () => {
    addSongToWorld(song);
  });

  container.appendChild(item);
}

function addSongToWorld(songData) {
  const newSong = {
    id: `song-${Date.now()}`,
    title: songData.title,
    artist: songData.artist,
    spotifyId: songData.spotifyId,
    artwork: songData.artwork,
    lat: detectedCoords.lat,
    lng: detectedCoords.lng,
    locationName: detectedCoords.name,
    creator: "Left by You"
  };

  currentSongs.push(newSong);

  try {
    localStorage.setItem("sound_atlas_songs", JSON.stringify(currentSongs));
  } catch (e) {}

  const canvasLayer = document.getElementById("canvas-layer");
  renderSongNode(canvasLayer, newSong, currentSongs.length - 1);

  document.getElementById("leave-song-modal").classList.remove("active");

  showToast(`♪ ${newSong.title} placed in ${newSong.locationName}!`);

  const pos = currentMode === "map"
    ? latLngTo3D(newSong.lat, newSong.lng)
    : getAbyssPosition(newSong, currentSongs.length - 1);

  flyCameraTo(-pos.x + (window.innerWidth / 2) - 90, -pos.y + (window.innerHeight / 2) - 90, 200, 1800, () => {
    openSongPanel(newSong, pos);
  });
}

function showToast(message) {
  const toast = document.getElementById("toast-banner");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// 8. Event Listeners & Entry Point
document.addEventListener("DOMContentLoaded", () => {
  runOpeningSequence();
  initLeaveSongModal();

  document.getElementById("close-song-panel").addEventListener("click", closeSongPanel);
  document.getElementById("take-me-anywhere-btn").addEventListener("click", takeMeAnywhere);
});

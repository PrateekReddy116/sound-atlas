# Echo World

# Build: A 3D World for Music Discovery

Build a polished, production-quality web application based around one simple idea:

> **A world made of music, by the world, for the world.**

People from anywhere can add a song they love to a shared 3D world. Other people can wander through that world, discover songs left by strangers, and listen to them through Spotify's official embedded player.

This should NOT feel like a Spotify clone.

It should feel like **exploring an unknown world where every place contains a song someone loved enough to leave behind.**

---

# 1. CORE PRODUCT IDEA

The application is a persistent shared 3D music world.

Every song is represented as an object/location in the world.

Users can:

* explore the 3D world
* discover songs
* click a song
* see its Spotify information
* play/listen using Spotify's supported embed experience
* add their own favorite song
* place it somewhere in the world
* return later and discover more

The central product loop is:

```text
ENTER WORLD
     ↓
EXPLORE
     ↓
DISCOVER A SONG
     ↓
LISTEN
     ↓
ADD YOUR OWN SONG
     ↓
LEAVE IT IN THE WORLD
     ↓
SOMEONE ELSE DISCOVERS IT
```

The feeling should be:

**curiosity → exploration → discovery → music**

---

# 2. IMPORTANT: USE THE EXISTING 3D EXPERIENCE

There is already a working 3D spatial/canvas environment in the existing project.

If this project contains an existing 3D implementation:

**DO NOT THROW IT AWAY.**

Inspect it first.

Preserve and improve the existing 3D interaction system.

Do not build a second unrelated 3D engine.

The existing spatial environment should become the foundation of this music world.

If the existing implementation is reusable, integrate the new music-world functionality directly into it.

---

# 3. PRODUCT NAME

Use a temporary working title:

# Sound Atlas

Subtitle:

> **By the world, for the world.**

However, structure the code so the name can easily be changed later.

The visual identity should not depend heavily on the name.

---

# 4. OVERALL VISUAL DIRECTION

The website should feel:

* cinematic
* immersive
* mysterious
* spatial
* minimal
* premium
* modern
* slightly experimental
* calm rather than loud

Avoid the typical SaaS aesthetic.

Do NOT create:

* generic dashboards
* excessive cards
* huge navigation bars
* gradients everywhere
* excessive rounded containers
* unnecessary statistics
* social-media style feeds
* excessive text
* cluttered controls

The 3D world should occupy almost the entire screen.

The UI should feel like a thin layer floating over the world.

Think:

**digital art installation + music discovery + interactive 3D world.**

---

# 5. OPENING EXPERIENCE

When the user first opens the website, do NOT immediately show a dashboard.

Start with a minimal cinematic introduction.

Dark/neutral background.

Centered text appears subtly:

> **A world made of music.**

Pause briefly.

Then:

> **By the world, for the world.**

The text should fade away.

The 3D world should slowly emerge behind/after the text.

Then transition into the main experience.

Keep the animation elegant and short.

Do not make it feel like a game loading screen.

---

# 6. MAIN WORLD

After the intro, the user enters the 3D world.

The world should occupy approximately 90–100% of the viewport.

There should be no traditional website layout surrounding it.

The user should immediately feel:

> "I'm somewhere."

The world can be abstract rather than geographically accurate.

Do NOT make this a literal Google Earth-style globe.

Create an artistic 3D environment.

Possible visual elements:

* floating islands
* distant platforms
* soft terrain
* abstract structures
* floating points
* subtle atmospheric particles
* distant lights
* paths
* clusters
* empty spaces
* glowing music objects

Keep it sophisticated.

The environment should support potentially thousands of song locations.

---

# 7. SONG OBJECTS

Every song added to the world becomes a discoverable object.

A song object can be represented by:

* album artwork
* a floating card
* a glowing disc
* a small spatial marker
* album artwork embedded into a 3D frame

Prefer album artwork as the primary visual identity.

Song objects should feel like **artifacts left behind by other people**.

They should not look like conventional HTML cards floating in 3D.

Example:

```text
             ♪

        ┌──────────┐
        │ ALBUM    │
        │ ARTWORK  │
        └──────────┘

        Song Title
        Artist
```

Keep text minimal until the user interacts with it.

---

# 8. SONG DISCOVERY

When the user approaches or clicks a song object:

* subtly enlarge/highlight it
* bring focus toward it
* reveal song information
* show album artwork
* show title
* show artist
* show who/where it was added if appropriate
* provide Spotify playback/action

Do not immediately open a huge modal.

Prefer a beautiful floating detail panel.

Example:

```text
┌──────────────────────────┐
│                          │
│      Album Artwork       │
│                          │
│  Space Song              │
│  Beach House             │
│                          │
│  ▶ Play on Spotify       │
│                          │
└──────────────────────────┘
```

The 3D world should remain visible behind it.

---

# 9. SPOTIFY INTEGRATION

Spotify is the music provider.

Do NOT attempt to recreate Spotify.

Use Spotify's officially supported Embed/Widget functionality wherever appropriate.

The website should allow a discovered song to be listened to through Spotify's supported web embed experience.

Important:

Do NOT download Spotify audio.

Do NOT host Spotify music.

Do NOT create an unofficial streaming system.

Do NOT attempt to bypass Spotify restrictions.

Do NOT build a fake Spotify player.

Use Spotify's official supported embed experience and link users to Spotify where necessary.

The Spotify layer should feel integrated into the experience while respecting Spotify's platform policies.

---

# 10. ADD A SONG

The main action should be:

# + Leave a Song

This should be one of the primary controls.

When clicked, show a minimal search interface.

Example:

```text
┌────────────────────────────────────┐
│                                    │
│  Leave a song behind               │
│                                    │
│  Search Spotify...                 │
│                                    │
│  ────────────────────────────────  │
│                                    │
│  Search results                    │
│                                    │
│  [album]  Song Title               │
│           Artist                   │
│                                    │
│  [album]  Another Song             │
│           Artist                   │
│                                    │
└────────────────────────────────────┘
```

The user searches for a song.

Show:

* album artwork
* title
* artist
* album

Selecting one should prepare the song for placement.

---

# 11. PLACING A SONG

After selecting a song, allow the user to place it into the world.

Possible flow:

```text
Search Spotify
      ↓
Select Song
      ↓
"Place this song"
      ↓
World enters placement mode
      ↓
User chooses location
      ↓
Confirm
      ↓
Song becomes part of the world
```

Make this interaction intuitive.

The placement should feel meaningful.

Do not simply create a database entry with random coordinates without showing the user what happened.

---

# 12. AUTOMATIC PLACEMENT OPTION

Also provide a simple:

> **Place here**

option.

When selected:

* place the song near the user's current position
* choose a visually pleasing position
* avoid overlapping nearby song objects
* preserve enough spacing for discovery

If the user wants more control, they can reposition it.

---

# 13. TAKE ME ANYWHERE

This is one of the most important features.

There should be a persistent, elegant button:

# Take Me Anywhere

This is the discovery engine.

When clicked:

1. Determine a random/interesting song location in the world.
2. Move the camera away from the current position.
3. Create a cinematic travel transition.
4. Navigate toward the selected location.
5. Slowly reveal the new song.
6. Stop at the discovered song.

The experience should feel like being transported somewhere unknown.

Example:

```text
CURRENT LOCATION
       ↓
       ↓
     zoom out
       ↓
     world moves
       ↓
     distant location
       ↓
     zoom in
       ↓
NEW SONG DISCOVERED
```

Do NOT simply teleport instantly.

Use a cinematic camera movement.

The transition can include:

* subtle blur
* depth of field
* world movement
* camera acceleration/deceleration
* subtle soundless visual transition

Keep it elegant.

---

# 14. DISCOVERY SHOULD FEEL RANDOM

The world should not always send the user to the same popular songs.

The discovery system should eventually support:

* random songs
* distant songs
* songs with few interactions
* recently added songs
* unexplored areas

For MVP, start with:

**random valid song location.**

But architect the code so a smarter discovery algorithm can be added later.

---

# 15. WORLD STRUCTURE

The world should be persistent.

Conceptually:

```text
World
│
├── Song Location
│
├── Song Location
│
├── Song Location
│
├── Song Location
│
├── Song Location
│
└── ...
```

Each song should have:

```text
song
├── spotifyTrackId
├── title
├── artist
├── album
├── artwork
├── position
│   ├── x
│   ├── y
│   └── z
├── rotation
├── scale
├── createdAt
└── creatorId
```

The 3D position is part of the identity of the contribution.

---

# 16. DATABASE

Use a clean backend architecture.

If the existing project already uses Supabase, prefer Supabase rather than introducing Firebase unnecessarily.

If no backend exists, use Supabase for:

* authentication
* database
* row-level security

Recommended conceptual structure:

```text
profiles
songs
world_locations
```

Example:

```text
world_locations
----------------
id
spotify_track_id
title
artist
album
artwork_url
position_x
position_y
position_z
rotation_x
rotation_y
rotation_z
created_by
created_at
```

Do NOT store Spotify audio.

Only store the metadata required to identify/render the song and its world position.

---

# 17. AUTHENTICATION

Allow users to explore without creating an account.

This is important.

The first experience should be:

```text
Open website
      ↓
Explore immediately
```

Do not force sign-in before allowing discovery.

Authentication should only become necessary when the user wants to:

> **Leave a Song**

or perform an action that requires attribution/persistence.

When authentication is needed, use a simple:

> Sign in to leave a song

Do not create a complicated onboarding flow.

---

# 18. USER IDENTITY

Users do not need elaborate profiles.

For now, only show a lightweight identity.

A song can say:

> Added by someone

or:

> Added by @username

if the user chooses a username.

Do not build:

* follower systems
* profiles pages
* messaging
* social feeds
* comments

The song itself is the contribution.

---

# 19. CONTRIBUTION PHILOSOPHY

The product should communicate:

> **Leave something you love behind.**

This is more interesting than:

> "Upload music."

The user isn't uploading music.

They are **placing a song into the world.**

Use language such as:

* Leave a song
* Discover a song
* Wander
* Take me anywhere
* Explore
* Listen
* Leave this here

Avoid corporate terminology such as:

* Submit track
* Create listing
* Content item
* Upload media

---

# 20. UI CONTROLS

Keep controls minimal.

Possible bottom UI:

```text
┌────────────────────────────────────────────────────────┐
│                                                        │
│                                                        │
│                     3D WORLD                           │
│                                                        │
│                                                        │
│                                                        │
│                                                        │
│                                                        │
│                                                        │
│        [ + Leave a Song ]     [ Take Me Anywhere ]     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

Top-left:

```text
SOUND ATLAS
By the world, for the world.
```

Top-right:

```text
Explore    About    Sign In
```

But keep these extremely subtle.

If the world works better with even fewer controls, remove them.

---

# 21. MOBILE EXPERIENCE

The application should be responsive.

On mobile:

* simplify controls
* make the 3D experience touch-friendly
* support pinch/zoom
* support touch navigation
* keep Add Song easily accessible
* keep Take Me Anywhere accessible

Do not attempt to replicate desktop controls exactly.

---

# 22. PERFORMANCE

This application may eventually contain thousands of song objects.

Design for scalability.

Do NOT render every possible object at full complexity simultaneously.

Consider:

* instancing
* level of detail
* spatial partitioning
* lazy loading
* frustum culling
* clustering distant song objects
* reduced detail for distant objects

Initially, build for a manageable number of objects but structure the rendering architecture so it can scale.

The world should remain smooth.

---

# 23. VISUAL HIERARCHY

There should be three levels of information.

### Level 1 — World

You see:

```text
lights
objects
album artwork
distant points
```

No text everywhere.

### Level 2 — Discovery

You approach a song.

It becomes visually prominent.

### Level 3 — Interaction

You click it.

Full song information and Spotify interaction appears.

This keeps the world immersive.

---

# 24. EMPTY WORLD

The world should still look beautiful when it has very few songs.

If there are only 1–10 songs:

* don't make it look broken
* use atmospheric elements
* create visual distance
* subtly highlight the available songs
* encourage the user to leave a song

Possible message:

> **The world is still quiet. Leave something behind.**

Do not use fake song data just to make the world look populated.

For development/demo purposes, seed data can be included separately and clearly marked as demo content.

---

# 25. FIRST-TIME USER EXPERIENCE

First visit:

```text
A world made of music.

By the world, for the world.

[ Enter the world ]
```

Then immediately enter the 3D environment.

Do not overwhelm the user with instructions.

A subtle first-time hint can appear:

> **Wander around. You might find something you love.**

Then disappear.

---

# 26. "TAKE ME ANYWHERE" AS THE CORE DISCOVERY LOOP

Make this interaction exceptionally polished.

It should feel like a signature feature.

When clicked:

```text
Take Me Anywhere
      ↓
Camera pulls away
      ↓
World shifts
      ↓
Stars/objects streak subtly
      ↓
Camera approaches destination
      ↓
New song comes into focus
      ↓
Song card appears
```

The transition should take roughly 1–3 seconds depending on distance.

Never make the user wait unnecessarily.

If only one song exists, don't pretend it discovered a random location.

Instead:

> "There's nowhere else to wander yet. Leave a song behind."

---

# 27. SONG DISCOVERY PANEL

When a song is discovered, display:

```text
[Album Artwork]

Song Title
Artist

▶ Listen on Spotify

Added by @user
```

Optional:

```text
"Left here 3 days ago"
```

Keep metadata subtle.

The focus is the music.

---

# 28. SONG OBJECT INTERACTIONS

Hover:

* subtle scale
* glow
* slight movement

Click:

* focus camera
* reveal details

Double click:

* optionally open/play Spotify interaction

But avoid requiring complex gestures.

On mobile:

* tap once to reveal
* tap again to interact

---

# 29. WORLD ATMOSPHERE

Create a distinctive environment.

Do not use generic Three.js demo aesthetics.

Avoid:

* default grids
* generic neon cyberpunk
* excessive purple/blue gradients
* random cubes
* obvious sci-fi UI

Instead create something closer to:

**a dreamlike digital landscape where music exists as physical landmarks.**

Potential visual direction:

* deep neutral background
* soft atmospheric haze
* subtle stars
* floating terrain
* distant glowing objects
* album artwork appearing as visual anchors
* soft depth
* elegant camera motion

The environment should feel timeless.

---

# 30. CREDIT / INSPIRATION

Add a tiny attribution in the bottom-right corner.

Use exactly:

> Inspired by odeta (father of three) on Reddit.

Make it:

* very small
* subtle
* low visual priority
* fixed to the bottom-right
* visible but unobtrusive

Do not create a large credits section.

This is important because the core idea was inspired by a Reddit post.

---

# 31. NO PHOTOS

The previous concept involved photos and Google Photos.

That concept is now completely removed.

Do NOT implement:

* Google Photos
* photo uploads
* photo storage
* Firebase Storage for photos
* image galleries
* photo Atlas
* camera capture

The product is now **entirely about music discovery**.

Album artwork may be displayed as part of Spotify metadata, but users are NOT uploading personal photographs.

---

# 32. NO MEMORY ATLAS CONCEPT

Do not retain the previous "Memory Atlas" functionality.

The application is no longer a personal memory archive.

It is a shared music discovery world.

Use terminology related to:

* music
* songs
* discovery
* wandering
* world
* sound
* exploration

---

# 33. DATA SECURITY

Implement proper authorization.

Users should not be able to modify arbitrary songs/locations belonging to other users unless that behavior is intentionally supported.

Use backend authorization / Row Level Security.

For example:

A user can:

* create their own song location
* edit their own location
* delete their own location

A user cannot:

* modify another user's location
* impersonate another user
* modify arbitrary database records

Do not expose service-role keys or backend secrets in the frontend.

Use environment variables appropriately.

---

# 34. SPOTIFY API SECURITY

Do not expose private Spotify credentials.

If Spotify API credentials are required for search:

* use the correct OAuth/client-credentials architecture
* keep secrets server-side
* never expose client secrets in frontend code

Use only the minimum Spotify functionality required.

The application should use official Spotify APIs and embeds.

---

# 35. SEARCH

The Add Song search should feel fast.

User enters:

```text
Space Song
```

Results should appear with:

```text
Album artwork
Title
Artist
```

Selecting the result creates the song contribution.

Do not make users manually paste Spotify URLs unless necessary.

However, support pasting a Spotify track URL as a fallback if useful.

---

# 36. RESPONSIVE STATES

Implement:

### Loading

Minimal animated indicator.

### Searching

Subtle loading state.

### Adding

Show:

> Leaving this song behind...

### Discovery

Smooth camera transition.

### Error

Use unobtrusive toast/banner.

Example:

> Couldn't find that song. Try another search.

---

# 37. ACCESSIBILITY

Even though the experience is highly visual:

* buttons must have labels
* keyboard navigation should work for UI controls
* sufficient contrast
* screen-reader labels for controls
* reduced-motion preference should be respected

If a user prefers reduced motion:

* remove cinematic camera transitions
* use shorter/instant transitions
* retain functionality

---

# 38. CODE QUALITY

Before implementing:

1. Inspect the existing project.
2. Identify the current 3D implementation.
3. Preserve reusable components.
4. Remove obsolete photo-related logic if present.
5. Remove old Memory Atlas logic.
6. Establish clean music-oriented architecture.
7. Avoid duplicate systems.

Do not rewrite working infrastructure unnecessarily.

---

# 39. IMPLEMENTATION ORDER

Build in this order:

## Phase 1

Audit existing codebase.

Preserve existing 3D world.

Clean obsolete functionality.

## Phase 2

Create new visual identity:

* opening animation
* Sound Atlas branding
* world UI
* Take Me Anywhere
* Leave a Song

## Phase 3

Implement song objects.

Use mock song data initially to prove:

* placement
* selection
* camera movement
* discovery
* world interaction

## Phase 4

Implement Spotify search/integration.

## Phase 5

Implement backend.

* songs
* locations
* users
* authentication
* authorization

## Phase 6

Implement persistent shared world.

## Phase 7

Polish:

* camera movement
* animations
* performance
* mobile
* accessibility
* loading/error states

---

# 40. IMPORTANT DEVELOPMENT RULE

Do NOT build a giant backend before the core experience works.

First make this loop perfect:

```text
OPEN
 ↓
ENTER WORLD
 ↓
WANDER
 ↓
FIND SONG
 ↓
OPEN SONG
 ↓
LISTEN
 ↓
TAKE ME ANYWHERE
 ↓
FIND ANOTHER
```

Then build:

```text
LEAVE A SONG
```

Then persistence.

The emotional experience is more important than the infrastructure.

---

# 41. MVP ACCEPTANCE CRITERIA

The MVP is successful if a new visitor can:

1. Open the website.
2. See the cinematic intro.
3. Enter the 3D world.
4. Understand that objects represent songs without needing a tutorial.
5. Explore the world.
6. Click a song.
7. See its artwork/title/artist.
8. Listen through Spotify's supported embed/action.
9. Press "Take Me Anywhere."
10. Be smoothly transported to another song.
11. Search for a song.
12. Select a song.
13. Place it in the world.
14. See it immediately appear.
15. Refresh the page.
16. See persistent song locations remain.
17. Return later and discover songs added by other people.

---

# 42. THE FEELING WE ARE TRYING TO CREATE

This is the most important part.

Do not think:

> "Build a 3D music website."

Think:

> **"Build a world that people leave songs inside."**

The user should feel like they are wandering through a giant invisible map of human taste.

Every song means:

> Someone somewhere loved this enough to leave it here.

And every discovery means:

> Someone somewhere introduced me to this.

The product is:

**not the player.**

**not the database.**

**not Spotify.**

The product is the **act of discovering music spatially.**

---

# FINAL TAGLINE

Use:

> **By the world, for the world.**

Secondary copy:

> **Leave a song behind. Discover one somewhere else.**

Build the experience around that idea.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f938a961-14b2-4687-a4d5-eda1a956c83f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

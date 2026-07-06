'use client';
import { useState } from "react";
import { ChevronRight, ChevronDown, Code2, Lightbulb, Star, Clock, CheckCircle2, Circle, BookOpen, Zap, Trophy, Layers, Cpu, Eye, Camera, Box, Globe, Palette, Building2 } from "lucide-react";

// ── SYNTAX HIGHLIGHTER ─────────────────────────────────────────────────
function highlight(code: any) {
    if (!code) return "";
    return code
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/(\/\/[^\n]*)/g, '<b style="color:#6B7280;font-weight:normal;font-style:italic">$1</b>')
        .replace(/(`(?:[^`\\]|\\.)*`)/g, '<b style="color:#86EFAC;font-weight:normal">$1</b>')
        .replace(/("(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')/g, '<b style="color:#86EFAC;font-weight:normal">$1</b>')
        .replace(/\b(useFrame|useThree|useRef|useState|useEffect|useMemo|useLoader|useGLTF|useTexture|useScroll|useHelper|useCursor)\b/g, '<b style="color:#FCD34D;font-weight:normal">$1</b>')
        .replace(/\b(import|export|from|const|let|var|function|return|default|async|await|new|class|true|false|null|undefined)\b/g, '<b style="color:#C084FC;font-weight:normal">$1</b>')
        .replace(/(?<![a-zA-Z#-])(\b\d+\.?\d*)\b/g, '<b style="color:#FB923C;font-weight:normal">$1</b>');
}

// ── TYPES ─────────────────────────────────────────────────────────────────
type Concept = { name: string; desc: string };
type Topic = {
  id: number; title: string; duration: string; tag: string; intro: string;
  code?: string; awwwards?: string; tips?: string[];
  why?: string; concepts?: Concept[]; install?: string;
};

// ── CURRICULUM DATA ─────────────────────────────────────────────────────
const PHASES = [
    {
        id: 1, title: "Core Foundations", color: "#06B6D4", bg: "rgba(6,182,212,0.08)", icon: Box,
        topics: [
            {
                id: 1, title: "What is R3F?", duration: "15 min", tag: "Concept",
                intro: "React Three Fiber (R3F) is a React renderer for Three.js. Instead of writing imperative Three.js code, you write declarative JSX that React manages. Every JSX tag like <mesh> becomes a THREE.Mesh automatically.",
                why: "Awwwards sites use R3F because it merges 3D seamlessly with React's component model — scroll state, animations, interactions, and 3D all live in one unified tree.",
                concepts: [
                    { name: "Three.js", desc: "WebGL abstraction library. Handles cameras, geometry, materials, lights, and the render loop at a low level." },
                    { name: "R3F", desc: "React renderer for Three.js. Converts JSX like <mesh> into THREE.Mesh under the hood. You never call new THREE.X() manually." },
                    { name: "Drei", desc: "Helper library for R3F — 100+ pre-built components: OrbitControls, useGLTF, Environment, Stars, Text3D, and more." },
                    { name: "GSAP", desc: "GreenSock Animation Platform. Pairs with R3F for timeline-based, scroll-triggered 3D animations. Core of the Awwwards stack." },
                ],
                code: `// ❌ Raw Three.js — imperative, hard to manage in React
const scene = new THREE.Scene()
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 'hotpink' })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
renderer.render(scene, camera)

// ✅ R3F — declarative JSX, lives inside React
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </Canvas>
  )
}`,
                install: "npm install three @react-three/fiber @react-three/drei gsap",
                awwwards: "Every Awwwards Winner using WebGL uses a declarative renderer like R3F. Raw Three.js at scale becomes unmaintainable.",
                tips: [
                    "R3F auto-creates THREE objects from JSX — <mesh> = new THREE.Mesh(). No manual instantiation.",
                    "All Three.js objects work as JSX tags. camelCase property names map directly to Three.js properties.",
                    "Canvas auto-creates WebGLRenderer, default PerspectiveCamera, and the render loop.",
                ]
            },
            {
                id: 2, title: "Canvas", duration: "20 min", tag: "Foundation",
                intro: "The <Canvas> component is the entry point for all R3F scenes. It sets up WebGLRenderer, a default PerspectiveCamera, and the render loop automatically.",
                why: "Understanding Canvas props lets you control pixel ratio, antialiasing, shadows, and tone mapping — all critical for high-quality Awwwards visuals.",
                concepts: [
                    { name: "dpr", desc: "Device pixel ratio. Use [1, 2] to cap at 2x — prevents performance issues on high-density screens while keeping sharpness." },
                    { name: "gl props", desc: "Pass renderer configuration: antialias, toneMapping, outputColorSpace. These define your scene's visual quality ceiling." },
                    { name: "camera prop", desc: "Set default PerspectiveCamera FOV, near/far clipping planes, and starting position directly on Canvas." },
                    { name: "frameloop", desc: "'always' (continuous), 'demand' (render on state change only), 'never' (fully manual). Use 'demand' for static scenes." },
                    { name: "shadows", desc: "Boolean prop that enables shadow maps on the renderer. Also need castShadow + receiveShadow on individual meshes." },
                ],
                code: `import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

// ── Minimal Canvas ─────────────────────────────────────
<Canvas>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="hotpink" />
  </mesh>
</Canvas>

// ── Production / Awwwards-level Canvas ─────────────────
<Canvas
  dpr={[1, 2]}               // Pixel ratio: min 1x, max 2x
  shadows                     // Enable shadow maps
  gl={{
    antialias: true,           // Smooth edges
    toneMapping: THREE.ACESFilmicToneMapping,   // Cinematic look
    outputColorSpace: THREE.SRGBColorSpace,     // Correct colors
  }}
  camera={{
    fov: 45,                  // Field of view (45° = natural)
    near: 0.1,                // Near clipping plane
    far: 200,                 // Far clipping plane
    position: [0, 0, 5],      // Starting camera position [x,y,z]
  }}
  style={{ width: '100vw', height: '100vh' }}
>
  <Scene />
</Canvas>`,
                awwwards: "Awwwards sites always use ACESFilmicToneMapping and SRGBColorSpace for that cinematic, high-fidelity look. These two settings alone are a huge visual upgrade.",
                tips: [
                    "Canvas fills its container — set parent to width: 100vw, height: 100vh for fullscreen.",
                    "Always cap dpr at 2. Beyond 2x pixel ratio is wasteful — imperceptible but costly.",
                    "ACESFilmicToneMapping gives S-curve contrast that makes scenes look cinematic.",
                    "Canvas auto-resizes on window resize — no ResizeObserver needed.",
                ]
            },
            {
                id: 3, title: "Mesh (Geometry + Material)", duration: "25 min", tag: "Core",
                intro: "A Mesh is the fundamental visible 3D object. It combines Geometry (the shape's form — vertices, faces) with Material (the surface appearance — color, texture, shading).",
                why: "Everything you see in 3D is a mesh. Product models, abstract hero shapes, terrain — all are meshes. This is the atom of 3D.",
                concepts: [
                    { name: "Mesh", desc: "THREE.Mesh = Geometry + Material in a container object. Can be positioned, rotated, scaled in 3D space." },
                    { name: "Geometry", desc: "Defines the shape via vertices and faces. BoxGeometry, SphereGeometry, PlaneGeometry, TorusGeometry, etc." },
                    { name: "Material", desc: "Defines surface appearance: color, texture, metalness, roughness, transparency, emissive glow." },
                    { name: "args prop", desc: "Pass constructor arguments to Three.js geometry classes: <boxGeometry args={[w, h, d]} />." },
                    { name: "position/rotation/scale", desc: "Core transforms. position={[x,y,z]}, rotation={[x,y,z]} in radians, scale={[x,y,z]} or single number." },
                ],
                code: `// Basic mesh structure
<mesh
  position={[0, 0, 0]}           // x, y, z
  rotation={[0, Math.PI / 4, 0]} // radians — Math.PI/2 = 90°
  scale={[1, 1, 1]}              // or scale={1.5} for uniform
>
  <boxGeometry args={[1, 1, 1]} />        // width, height, depth
  <meshStandardMaterial
    color="#ff6b6b"
    metalness={0.5}
    roughness={0.3}
  />
</mesh>

// Multiple meshes in a scene
function Scene() {
  return (
    <>
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>

      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color="hotpink"
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
    </>
  )
}`,
                awwwards: "Awwwards sites use custom geometries and precisely tuned materials. Master the basics — then combine to create premium visuals.",
                tips: [
                    "rotation uses radians: Math.PI/2 = 90°, Math.PI = 180°, Math.PI*2 = full circle.",
                    "args={[]} maps directly to Three.js constructor arguments.",
                    "meshStandardMaterial is physically-based (PBR) — use it for realistic surfaces.",
                    "meshBasicMaterial ignores all lights — good for flat/stylized/neon looks.",
                ]
            },
            {
                id: 4, title: "Basic Shapes", duration: "20 min", tag: "Core",
                intro: "R3F exposes all Three.js built-in geometry primitives as JSX. These are your building blocks — from rapid prototyping to building hero elements.",
                why: "Knowing all primitives lets you prototype ideas instantly. Complex Awwwards shapes are often built by combining, distorting, or animating simple geometries.",
                concepts: [
                    { name: "BoxGeometry", desc: "args={[width, height, depth, widthSegs, heightSegs, depthSegs]}" },
                    { name: "SphereGeometry", desc: "args={[radius, widthSegs, heightSegs]}  — more segments = smoother" },
                    { name: "PlaneGeometry", desc: "args={[width, height, widthSegs, heightSegs]} — flat 2D surface in 3D space" },
                    { name: "TorusGeometry", desc: "args={[radius, tube, radialSegs, tubularSegs]} — donut shape" },
                    { name: "TorusKnotGeometry", desc: "args={[radius, tube, tubularSegs, radialSegs, p, q]} — complex decorative knot" },
                    { name: "CylinderGeometry", desc: "args={[radiusTop, radiusBottom, height, segments]}" },
                ],
                code: `function BasicShapes() {
  return (
    <>
      {/* BOX — cube or rectangular prism */}
      <mesh position={[-3, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#06B6D4" />
      </mesh>

      {/* SPHERE — 32 segments = smooth */}
      <mesh position={[-1.5, 0, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#8B5CF6" />
      </mesh>

      {/* TORUS — donut */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.2, 16, 100]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>

      {/* TORUS KNOT — complex decorative shape */}
      <mesh position={[1.5, 0, 0]}>
        <torusKnotGeometry args={[0.5, 0.15, 100, 16]} />
        <meshStandardMaterial
          color="#10B981"
          metalness={0.7}
          roughness={0.1}
        />
      </mesh>

      {/* PLANE — floor/wall (rotate for floor) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
    </>
  )
}`,
                awwwards: "TorusKnot is the classic 'I know 3D' shape on Awwwards. High-segment spheres and custom BufferGeometry are used for hero visuals.",
                tips: [
                    "More segments = smoother but heavier. SphereGeometry [r, 8, 8] is blocky. [r, 64, 64] is smooth.",
                    "PlaneGeometry needs rotation for a floor: rotation={[-Math.PI/2, 0, 0]}.",
                    "Drei's <RoundedBox> gives boxes with rounded corners — common in modern 3D UI hybrids.",
                    "torusKnotGeometry args p and q values (5th and 6th) change the knot topology — experiment!",
                ]
            },
            {
                id: 5, title: "Lights (Necessary)", duration: "30 min", tag: "Core",
                intro: "Lights define what you see and the mood of the scene. Without lights, meshStandardMaterial renders as black. Lighting is arguably the single biggest quality factor.",
                why: "Lighting is what separates amateur 3D from Awwwards-level work. Proper key/fill/rim lighting creates depth, drama, and premium cinematic feel.",
                concepts: [
                    { name: "AmbientLight", desc: "Illuminates everything equally from all directions. No shadows. Acts as base fill — keeps shadows from being 100% black." },
                    { name: "DirectionalLight", desc: "Parallel rays like sunlight from infinite distance. Casts sharp shadows. Main light source in most scenes." },
                    { name: "PointLight", desc: "Radiates from a single point in all directions like a bulb. Has distance and decay falloff." },
                    { name: "SpotLight", desc: "Cone-shaped beam from a point toward a target. For dramatic product highlights and area focus." },
                    { name: "HemisphereLight", desc: "Gradient from sky color (above) to ground color (below). Great for outdoor ambient base." },
                ],
                code: `// ── Minimum viable lighting ──────────────────────────
<ambientLight intensity={0.3} />
<directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />

// ── Cinematic 3-point lighting (Awwwards standard) ───
function Lights() {
  return (
    <>
      {/* Key light — main illumination from upper-right */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}  // Higher = sharper shadows
      />

      {/* Fill light — soften shadows, cool blue tint */}
      <directionalLight
        position={[-5, 2, -5]}
        intensity={0.3}
        color="#4488FF"
      />

      {/* Rim light — separate object from background */}
      <pointLight
        position={[0, 5, -5]}
        intensity={1}
        color="#FF6B6B"
        distance={20}
        decay={2}
      />

      {/* Ambient base — prevent total black shadows */}
      <ambientLight intensity={0.1} />
    </>
  )
}`,
                awwwards: "Awwwards sites use 3-point lighting: Key (main), Fill (shadow softener), Rim (separation from bg). Add colored fill/rim lights for mood.",
                tips: [
                    "meshBasicMaterial is NOT affected by lights. Use meshStandardMaterial for PBR lighting.",
                    "shadow-mapSize={[2048, 2048]} = crisp shadows but expensive. Use 512 for mobile.",
                    "Colored lights create cinematic mood. Blue fill + warm key = classic studio look.",
                    "HDRI environments from Drei replace manual lighting for photorealistic image-based lighting.",
                    "intensity is not capped at 1 — high values (5–20) create dramatic blown-out highlights.",
                ]
            },
            {
                id: 6, title: "Camera Basics", duration: "20 min", tag: "Core",
                intro: "The camera defines what you see. R3F creates a PerspectiveCamera by default. Understanding camera properties gives you control over FOV, depth, and composition.",
                why: "Camera work is cinematography. The right FOV, position, and focal point are what separate basic 3D from cinematic interactive experiences.",
                concepts: [
                    { name: "PerspectiveCamera", desc: "Objects farther away appear smaller — mimics human vision. Defined by FOV, aspect ratio, near, and far planes." },
                    { name: "FOV (Field of View)", desc: "Angle of the viewing cone in degrees. 45° = natural, 75° = wide/dynamic, 20–30° = telephoto/compressed." },
                    { name: "near / far", desc: "Clipping planes. Objects outside this range are invisible. near=0.1, far=1000 is typical for most scenes." },
                    { name: "position", desc: "Where the camera sits in 3D space [x, y, z]. Positive Z moves away from scene (toward viewer)." },
                    { name: "useThree()", desc: "Hook to access the live camera object. Lets you read or modify camera properties in component code." },
                ],
                code: `// ── Set camera via Canvas prop ────────────────────────
<Canvas
  camera={{
    fov: 45,              // Field of view in degrees
    near: 0.1,            // Near clipping plane
    far: 1000,            // Far clipping plane
    position: [0, 2, 8],  // Starting position [x, y, z]
  }}
>

// ── FOV visual guide ──────────────────────────────────
// fov: 20–30  → telephoto: compressed, premium, object fills frame
// fov: 45     → natural: how humans perceive, good default
// fov: 75–90  → wide: dynamic, shows environment, edge distortion

// ── Custom camera with Drei (more control) ────────────
import { PerspectiveCamera } from '@react-three/drei'

function Scene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault          // Replace the Canvas default camera
        fov={45}
        position={[0, 2, 8]}
      />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  )
}

// ── Access camera via hook ────────────────────────────
import { useThree } from '@react-three/fiber'

function CameraInfo() {
  const { camera } = useThree()
  // camera.position, camera.rotation, camera.fov
  // Modify directly: camera.position.z = 10
  return null
}`,
                awwwards: "Awwwards sites often use low FOV (25–45°) for a compressed, premium telephoto look. Wide FOV (75+) reads as amateur unless intentional.",
                tips: [
                    "fov={45} is the sweet spot for most product/hero scenes. Go lower (25–35) for telephoto shots.",
                    "Camera Z-axis: positive Z = toward the viewer. Camera at position [0,0,5] looks toward origin.",
                    "useThree() gives you live camera access anywhere inside Canvas.",
                    "Drei's PerspectiveCamera with makeDefault replaces the Canvas default camera entirely.",
                ]
            },
        ]
    },
    {
        id: 2, title: "Animation System", color: "#8B5CF6", bg: "rgba(139,92,246,0.08)", icon: Zap,
        topics: [
            { id: 7, title: "useFrame (state, delta)", duration: "25 min", tag: "Animation", intro: "useFrame runs a callback every rendered frame. It's your animation loop — the heartbeat of R3F. You receive full scene state and delta time on each call.", code: `import { useFrame } from '@react-three/fiber'\nimport { useRef } from 'react'\n\nfunction RotatingBox() {\n  const meshRef = useRef()\n\n  useFrame((state, delta) => {\n    // state = { camera, scene, clock, pointer, gl, ... }\n    // delta = seconds since last frame (~0.016 at 60fps)\n    meshRef.current.rotation.y += delta\n  })\n\n  return (\n    <mesh ref={meshRef}>\n      <boxGeometry />\n      <meshStandardMaterial color="hotpink" />\n    </mesh>\n  )\n}\n\n// Access elapsed time for oscillation\nuseFrame(({ clock }) => {\n  const t = clock.elapsedTime     // Total seconds since start\n  mesh.position.y = Math.sin(t)   // Oscillate vertically\n})`, awwwards: "useFrame is the heartbeat of every animated R3F scene. Always use delta — never hardcode values.", tips: ["Never setState inside useFrame — it triggers re-renders every frame and destroys performance.", "Use useRef mutations for animation. Direct property mutation bypasses React entirely."] },
            { id: 8, title: "Delta Time", duration: "15 min", tag: "Animation", intro: "Delta is the elapsed seconds since the last frame. Using it makes animations run at the exact same speed on 60Hz, 120Hz, and 144Hz screens.", code: `useFrame((state, delta) => {\n  // ❌ Frame-rate dependent (144Hz runs 2.4x faster than 60Hz!)\n  meshRef.current.rotation.y += 0.01\n\n  // ✅ Frame-rate independent (same speed on all screens)\n  meshRef.current.rotation.y += delta * 1.0  // 1 radian/second\n\n  // Slow rotation\n  meshRef.current.rotation.y += delta * 0.5  // 0.5 rad/second\n\n  // Fast spin\n  meshRef.current.rotation.y += delta * 3.0  // 3 rad/second\n\n  // Oscillate using total elapsed time\n  const t = state.clock.elapsedTime\n  meshRef.current.position.y = Math.sin(t * 0.8) * 0.5\n})`, awwwards: "Frame-rate independence is professional standard. A 144Hz monitor should not make your animation 2.4x faster.", tips: ["delta * speed = consistent motion. Tune 'speed' until it feels right.", "state.clock.elapsedTime gives total seconds since Canvas mounted — great for sinusoidal motion."] },
            { id: 9, title: "Lerp (Smooth Animations)", duration: "20 min", tag: "Animation", intro: "Linear interpolation (lerp) smoothly transitions a value toward a target over time. It creates organic-feeling, fluid motion — the signature of Awwwards sites.", code: `import { MathUtils } from 'three'\n\n// MathUtils.lerp(current, target, factor)\n// factor: 0 = no movement, 1 = instant snap\n// 0.05 = very smooth/laggy, 0.1 = medium, 0.25 = snappy\n\nconst mouse = { x: 0, y: 0 }\nconst target = { x: 0, y: 0 }\n\nuseFrame((state, delta) => {\n  // Simple lerp — frame-rate dependent\n  target.x = MathUtils.lerp(target.x, mouse.x, 0.05)\n  target.y = MathUtils.lerp(target.y, mouse.y, 0.05)\n\n  // ✅ Delta-corrected lerp — frame-rate independent\n  const factor = 1 - Math.pow(0.001, delta)\n  target.x = MathUtils.lerp(target.x, mouse.x, factor)\n\n  meshRef.current.rotation.y = target.x * 0.5\n  meshRef.current.rotation.x = target.y * 0.3\n})`, awwwards: "Lerp is in EVERY Awwwards site — mouse-follow effects, camera lag, scroll easing. It's the smoothness that makes 3D feel alive.", tips: ["Lower factor = more lag = dreamier feel. Higher = snappier = responsive feel.", "Lerp never fully reaches target — it approaches asymptotically. That's what creates natural deceleration."] },
            { id: 10, title: "useRef()", duration: "20 min", tag: "Core", intro: "useRef gives you a direct reference to Three.js objects. Mutations through refs bypass React's state system, making them suitable for frame-level animation.", code: `import { useRef, useEffect } from 'react'\nimport { useFrame } from '@react-three/fiber'\n\nfunction AnimatedSphere() {\n  const meshRef = useRef()      // ref → THREE.Mesh\n  const matRef = useRef()       // ref → THREE.MeshStandardMaterial\n\n  // Log the actual Three.js object on mount\n  useEffect(() => {\n    console.log(meshRef.current)  // Full THREE.Mesh\n  }, [])\n\n  useFrame(({ clock }) => {\n    const t = clock.elapsedTime\n\n    // Direct mutations — zero re-renders, maximum performance\n    meshRef.current.position.y = Math.sin(t * 0.8) * 0.5\n    meshRef.current.rotation.x = t * 0.3\n    meshRef.current.rotation.y = t * 0.5\n\n    // Animate material properties directly\n    matRef.current.color.setHSL(t * 0.1 % 1, 0.8, 0.5)\n  })\n\n  return (\n    <mesh ref={meshRef}>\n      <sphereGeometry args={[1, 32, 32]} />\n      <meshStandardMaterial ref={matRef} />\n    </mesh>\n  )\n}`, awwwards: "useRef is how you animate without performance overhead. Every animated R3F object on Awwwards sites uses refs, not state.", tips: ["useRef returns { current: null } initially. Check meshRef.current before accessing in useEffect.", "You can ref geometries, materials, groups, lights — any Three.js object in the scene."] },
            { id: 11, title: "Orbit Controls", duration: "15 min", tag: "Controls", intro: "OrbitControls from Drei gives you mouse-driven camera orbit, pan, and zoom instantly. Essential for interactive product viewers.", code: `import { OrbitControls } from '@react-three/drei'\n\n<Canvas>\n  <OrbitControls\n    enableZoom={true}           // Scroll to zoom\n    enablePan={false}           // Disable pan for product views\n    autoRotate={true}           // Auto spin\n    autoRotateSpeed={0.5}       // Gentle auto-rotation\n    enableDamping={true}        // Smooth inertia (default: true)\n    dampingFactor={0.05}        // Lower = more lag/inertia\n    minPolarAngle={Math.PI / 4} // Limit — can't go fully above\n    maxPolarAngle={Math.PI / 2} // Limit — can't go below floor\n    minDistance={2}             // Minimum zoom\n    maxDistance={20}            // Maximum zoom\n  />\n\n  <mesh>\n    <torusKnotGeometry />\n    <meshStandardMaterial metalness={0.8} roughness={0.1} />\n  </mesh>\n</Canvas>`, awwwards: "Product showcases on Awwwards always use OrbitControls with damping enabled — that smooth inertia is the signature of premium interactive 3D.", tips: ["enableDamping={true} is default. It creates the smooth, inertia-based feel.", "autoRotate pauses when the user interacts and resumes on release."] },
            { id: 12, title: "Basic Animations", duration: "25 min", tag: "Animation", intro: "Combine useFrame + useRef to build smooth continuous animations: rotation, floating, scaling, color shifts.", code: `function FloatingOrb() {\n  const ref = useRef()\n\n  useFrame(({ clock }) => {\n    const t = clock.elapsedTime\n    ref.current.position.y = Math.sin(t * 0.8) * 0.3     // Float\n    ref.current.rotation.y = t * 0.5                     // Spin\n    ref.current.rotation.z = Math.sin(t * 0.3) * 0.1    // Gentle wobble\n    ref.current.scale.x = 1 + Math.sin(t * 1.5) * 0.05  // Breathe\n  })\n\n  return (\n    <mesh ref={ref}>\n      <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />\n      <meshStandardMaterial\n        color="#8B5CF6"\n        metalness={0.9}\n        roughness={0.1}\n        emissive="#8B5CF6"\n        emissiveIntensity={0.1}\n      />\n    </mesh>\n  )\n}`, awwwards: "Subtle floating + slow rotation + gentle breathe = premium product presentation. Avoid fast, jerky motion.", tips: ["Layer multiple animations (float + spin + wobble) for organic richness.", "emissive color makes materials self-illuminate — use for sci-fi/neon looks."] },
            { id: 13, title: "Multiple Animations", duration: "25 min", tag: "Animation", intro: "Compose multiple animated components, use offset delays, and synchronize timing to create layered, orchestrated scenes.", code: `// Each component manages its own animation logic\nfunction Scene() {\n  return (\n    <>\n      <FloatingSphere delay={0} color="#06B6D4" position={[-2, 0, 0]} />\n      <FloatingSphere delay={1} color="#8B5CF6" position={[0, 0, 0]} />\n      <FloatingSphere delay={2} color="#EF4444" position={[2, 0, 0]} />\n    </>\n  )\n}\n\nfunction FloatingSphere({ delay, color, position }) {\n  const ref = useRef()\n\n  useFrame(({ clock }) => {\n    const t = clock.elapsedTime + delay  // Offset creates stagger\n    ref.current.position.y = Math.sin(t * 0.6) * 0.5\n    ref.current.position.x = Math.cos(t * 0.4) * 0.2\n    ref.current.rotation.y = t * 0.3\n  })\n\n  return (\n    <mesh ref={ref} position={position}>\n      <sphereGeometry args={[0.4, 32, 32]} />\n      <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />\n    </mesh>\n  )\n}`, awwwards: "Offset delay values create organic wave-like group animations. Identical timing = robotic and cheap-looking.", tips: ["Each component has its own useFrame — no need for centralized animation managers.", "The delay prop shifts the phase of the sin wave — creating stagger with one variable."] },
            { id: 14, title: "Pointer Events (Click, Hover)", duration: "20 min", tag: "Interaction", intro: "R3F maps React-style pointer events directly onto 3D meshes via automatic raycasting. Click, hover, and move events work natively on any mesh.", code: `import { useState } from 'react'\n\nfunction InteractiveMesh() {\n  const [hovered, setHovered] = useState(false)\n  const [clicked, setClicked] = useState(false)\n\n  return (\n    <mesh\n      onClick={(e) => {\n        e.stopPropagation()         // Prevent click-through\n        setClicked(!clicked)\n      }}\n      onPointerOver={() => setHovered(true)}\n      onPointerOut={() => setHovered(false)}\n      onPointerMove={(e) => console.log(e.point)}  // 3D cursor position\n      scale={clicked ? 1.3 : 1}\n    >\n      <boxGeometry args={[1, 1, 1]} />\n      <meshStandardMaterial\n        color={hovered ? '#FF6B6B' : '#06B6D4'}\n        emissive={hovered ? '#FF3333' : '#000000'}\n        emissiveIntensity={0.2}\n      />\n    </mesh>\n  )\n}`, awwwards: "onClick/onPointerOver on 3D objects creates interactive product experiences. This is what separates static 3D from interactive 3D.", tips: ["event.point gives the 3D intersection point in world space.", "event.stopPropagation() prevents clicks from passing through to objects behind.", "Combine with useState for color/scale changes, or useRef mutations for smooth animated responses."] },
        ]
    },
    {
        id: 3, title: "Interaction & UX", color: "#F59E0B", bg: "rgba(245,158,11,0.08)", icon: Eye,
        topics: [
            { id: 15, title: "Cursor Change", duration: "10 min", tag: "UX", intro: "Change the browser cursor when hovering 3D objects using Drei's useCursor hook.", code: `import { useCursor } from '@react-three/drei'\nimport { useState } from 'react'\n\nfunction Hoverable() {\n  const [hovered, set] = useState(false)\n  useCursor(hovered)  // ← Sets cursor to 'pointer' when true\n\n  return (\n    <mesh\n      onPointerOver={() => set(true)}\n      onPointerOut={() => set(false)}\n    >\n      <boxGeometry />\n      <meshStandardMaterial color="hotpink" />\n    </mesh>\n  )\n}\n\n// Custom cursor style\nuseCursor(hovered, 'grab', 'auto')  // (active, hovered, default)`, awwwards: "Cursor feedback is a micro-interaction detail. Top-tier sites always get this right — it signals interactivity clearly.", tips: [] },
            { id: 16, title: "Raycasting", duration: "20 min", tag: "Core", intro: "Raycasting is how R3F determines which 3D object your mouse intersects. R3F handles it automatically for pointer events, but understanding it enables advanced interactions.", code: `// R3F handles raycasting automatically for pointer events.\n// The event object gives you full intersection data:\n\n<mesh onClick={(event) => {\n  event.point       // THREE.Vector3 — 3D hit point\n  event.distance    // Distance from camera to hit\n  event.face        // Clicked face normal\n  event.object      // The THREE.Mesh that was hit\n  event.uv          // UV coordinates at hit point\n}}>\n\n// Manual raycasting via useThree\nimport { useThree } from '@react-three/fiber'\n\nfunction ManualRaycast() {\n  const { raycaster, camera, scene } = useThree()\n\n  const checkIntersections = () => {\n    const intersects = raycaster.intersectObjects(scene.children)\n    if (intersects.length > 0) {\n      console.log('First hit:', intersects[0])\n    }\n  }\n}`, awwwards: "Custom raycasting enables mouse-position tracking in 3D space — used for cursor distortion effects on Awwwards sites.", tips: [] },
            { id: 17, title: "Drei Introduction", duration: "20 min", tag: "Library", intro: "Drei is a collection of 100+ helpers for R3F. Think of it as the standard library for Awwwards-level 3D development.", code: `import {\n  // Controls\n  OrbitControls, PresentationControls, ScrollControls,\n\n  // Camera\n  PerspectiveCamera, CameraShake,\n\n  // Lighting & Environment\n  Environment, Sky, Stars, Sparkles,\n\n  // Loading\n  useGLTF, useTexture, Loader,\n\n  // Materials (Awwwards special sauce)\n  MeshTransmissionMaterial,  // Glass/crystal\n  MeshReflectorMaterial,     // Mirror floor\n  MeshDistortMaterial,       // Distorted blob\n  MeshWobbleMaterial,        // Wobbling surface\n\n  // Staging\n  ContactShadows, AccumulativeShadows, Float,\n\n  // Performance\n  AdaptiveDpr, Instances, Preload, BakeShadows,\n\n  // Text\n  Text, Text3D,\n\n  // Helpers\n  useCursor, useHelper, Stats,\n} from '@react-three/drei'\n\n// Install\n// npm install @react-three/drei`, awwwards: "MeshTransmissionMaterial, Environment, ContactShadows, and Float from Drei are directly responsible for that premium glass/chrome look on Awwwards sites.", tips: [] },
        ]
    },
    {
        id: 4, title: "Assets & Environment", color: "#10B981", bg: "rgba(16,185,129,0.08)", icon: Globe,
        topics: [
            { id: 18, title: "useGLTF()", duration: "30 min", tag: "Assets", intro: "Load 3D models in GLB/GLTF format. The industry standard for web 3D.", code: `import { useGLTF } from '@react-three/drei'\nimport { Suspense } from 'react'\n\nfunction Model() {\n  const { scene, nodes, materials } = useGLTF('/model.glb')\n\n  // Option 1: Use full scene\n  return <primitive object={scene} />\n\n  // Option 2: Use specific nodes\n  return (\n    <mesh\n      geometry={nodes.Body.geometry}\n      material={materials.Chrome}\n    />\n  )\n}\n\n// Always wrap in Suspense\nfunction App() {\n  return (\n    <Suspense fallback={null}>\n      <Model />\n    </Suspense>\n  )\n}\n\n// Preload before component mounts\nuseGLTF.preload('/model.glb')`, awwwards: "All Awwwards 3D sites use custom GLB models. Create in Blender → export as GLB → load with useGLTF.", tips: [] },
            { id: 19, title: "Model Scaling & Positioning", duration: "20 min", tag: "Assets", intro: "Correctly position and scale imported 3D models — they often come in wrong scale from Blender/other tools.", code: `// Models from Blender (meters) are often huge\n<primitive\n  object={scene}\n  scale={[0.01, 0.01, 0.01]}  // Meters → scene units\n  position={[0, -1, 0]}        // Lower to sit on floor\n  rotation={[0, Math.PI, 0]}   // Face camera\n/>\n\n// Or use Drei's Center + Resize for auto-fit\nimport { Center } from '@react-three/drei'\n\n<Center>\n  <primitive object={scene} />\n</Center>`, awwwards: "Automatic centering and scaling with Drei's Center saves time on every model import.", tips: [] },
            { id: 20, title: "useTexture", duration: "20 min", tag: "Assets", intro: "Load image textures to apply to mesh surfaces for detailed, realistic appearances.", code: `import { useTexture } from '@react-three/drei'\nimport * as THREE from 'three'\n\nfunction TexturedMesh() {\n  const texture = useTexture('/textures/color.jpg')\n\n  // Ensure correct color space\n  texture.colorSpace = THREE.SRGBColorSpace\n\n  // Tile the texture\n  texture.repeat.set(2, 2)\n  texture.wrapS = texture.wrapT = THREE.RepeatWrapping\n\n  return (\n    <mesh>\n      <planeGeometry args={[4, 4]} />\n      <meshStandardMaterial map={texture} />\n    </mesh>\n  )\n}`, awwwards: "High-res textures (2K–4K) bring hero objects to life. Always set SRGBColorSpace on color maps.", tips: [] },
            { id: 21, title: "Multiple Textures", duration: "20 min", tag: "Assets", intro: "Load full PBR texture sets simultaneously for photorealistic surfaces.", code: `const [colorMap, normalMap, roughnessMap, metalnessMap, aoMap] =\n  useTexture([\n    '/textures/color.jpg',\n    '/textures/normal.jpg',\n    '/textures/roughness.jpg',\n    '/textures/metalness.jpg',\n    '/textures/ao.jpg',\n  ])\n\n<meshStandardMaterial\n  map={colorMap}\n  normalMap={normalMap}\n  roughnessMap={roughnessMap}\n  metalnessMap={metalnessMap}\n  aoMap={aoMap}\n  aoMapIntensity={1}\n/>`, awwwards: "Full PBR texture sets = photorealistic surfaces seen on every premium Awwwards product showcase.", tips: [] },
            { id: 22, title: "Lighting Types (Deep Dive)", duration: "30 min", tag: "Lighting", intro: "Master all Five.js light types and how to combine them for cinematic results.", code: `// 5 light types — each with a unique role\n<ambientLight intensity={0.2} color="#FFFFFF" />\n\n<directionalLight\n  position={[10, 20, 5]}\n  intensity={2}\n  castShadow\n/>\n\n<pointLight position={[0, 5, 0]} intensity={3} color="#FF8800" />\n\n<spotLight\n  position={[0, 10, 5]}\n  angle={0.3}       // Cone width\n  penumbra={0.5}    // Edge softness (0=sharp, 1=soft)\n  intensity={5}\n  castShadow\n/>\n\n<hemisphereLight\n  skyColor="#87CEEB"    // Upper color\n  groundColor="#8B4513" // Lower color\n  intensity={0.5}\n/>`, awwwards: "Layer 3–4 lights of different types. Single lights = flat. Multiple strategic lights = depth and drama.", tips: [] },
            { id: 23, title: "Shadows", duration: "25 min", tag: "Lighting", intro: "Enable shadow casting and receiving for depth and realism.", code: `// Enable on Canvas\n<Canvas shadows>\n\n  {/* Light must castShadow */}\n  <directionalLight\n    castShadow\n    position={[5, 10, 5]}\n    shadow-mapSize={[2048, 2048]}\n    shadow-camera-far={50}\n    shadow-camera-left={-10}\n    shadow-camera-right={10}\n  />\n\n  {/* Object casts shadow */}\n  <mesh castShadow position={[0, 1, 0]}>\n    <boxGeometry />\n    <meshStandardMaterial color="hotpink" />\n  </mesh>\n\n  {/* Floor receives shadow */}\n  <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>\n    <planeGeometry args={[20, 20]} />\n    <meshStandardMaterial color="#1a1a2e" />\n  </mesh>\n\n</Canvas>\n\n// Soft fake shadows (Drei) — much cheaper!\nimport { ContactShadows } from '@react-three/drei'\n<ContactShadows\n  opacity={0.4}\n  blur={2}\n  far={10}\n/>`, awwwards: "ContactShadows from Drei look photorealistic for products without the performance cost of shadow maps.", tips: [] },
            { id: 24, title: "HDRI Environments", duration: "20 min", tag: "Lighting", intro: "HDRI environments provide image-based lighting — photorealistic illumination from a 360° photo.", code: `import { Environment } from '@react-three/drei'\n\n// Built-in presets\n<Environment preset="studio" />    // Clean studio look\n<Environment preset="city" />      // Urban blue-grey\n<Environment preset="sunset" />    // Warm golden tones\n<Environment preset="warehouse" /> // Industrial\n<Environment preset="forest" />    // Green ambient\n\n// With background\n<Environment preset="studio" background blur={0.5} />\n\n// Custom HDRI file\n<Environment files="/hdri/studio_small.hdr" />\n\n// All presets:\n// apartment, city, dawn, forest, lobby,\n// night, park, studio, sunset, warehouse`, awwwards: "'studio' preset + MeshTransmissionMaterial = the glass/chrome look on 90% of top Awwwards sites.", tips: [] },
        ]
    },
    {
        id: 5, title: "Materials Deep Dive", color: "#EF4444", bg: "rgba(239,68,68,0.08)", icon: Palette,
        topics: [
            { id: 25, title: "Light Helpers", duration: "15 min", tag: "Debug", intro: "Visualize light positions and directions in development with Three.js helpers.", code: `import { useHelper } from '@react-three/drei'\nimport { useRef } from 'react'\nimport { DirectionalLightHelper, PointLightHelper } from 'three'\n\nfunction DebugLights() {\n  const dirLight = useRef()\n  const ptLight = useRef()\n\n  useHelper(dirLight, DirectionalLightHelper, 1)  // Size 1\n  useHelper(ptLight, PointLightHelper, 0.5)\n\n  return (\n    <>\n      <directionalLight ref={dirLight} position={[5, 10, 5]} />\n      <pointLight ref={ptLight} position={[-3, 2, 0]} />\n    </>\n  )\n}`, awwwards: "Essential for debugging lighting setups before the final quality pass.", tips: [] },
            { id: 26, title: "Basic vs Standard Material", duration: "20 min", tag: "Materials", intro: "Three material types cover 95% of use cases. Know when to use each.", code: `// meshBasicMaterial — IGNORES all lights\n// → Use for: wireframes, UI overlay, neon/emissive objects, debug\n<meshBasicMaterial color="#FF0080" wireframe={false} />\n\n// meshStandardMaterial — PBR, responds to lights\n// → Use for: everything realistic\n<meshStandardMaterial\n  color="#CCCCCC"\n  metalness={0.5}\n  roughness={0.3}\n/>\n\n// meshPhysicalMaterial — extends standard, adds advanced effects\n// → Use for: glass, car paint, skin, fabric\n<meshPhysicalMaterial\n  color="white"\n  transmission={1}      // 0 = opaque, 1 = fully transparent glass\n  thickness={0.5}       // Refraction depth\n  roughness={0}\n  ior={1.5}             // Index of refraction (glass = 1.5)\n  iridescence={0.3}     // Rainbow sheen\n/>`, awwwards: "meshPhysicalMaterial with transmission=1 creates the glass/crystal look that dominates Awwwards right now.", tips: [] },
            { id: 27, title: "Roughness / Metalness", duration: "20 min", tag: "Materials", intro: "The two PBR properties that define how a surface looks and feels.", code: `// roughness: 0 = perfect mirror, 1 = chalk matte\n// metalness: 0 = plastic/dielectric, 1 = pure metal\n\n// Mirror chrome\n<meshStandardMaterial metalness={1.0} roughness={0.0} />\n\n// Brushed aluminum\n<meshStandardMaterial metalness={0.9} roughness={0.4} />\n\n// Satin plastic\n<meshStandardMaterial metalness={0.0} roughness={0.3} />\n\n// Rubber matte\n<meshStandardMaterial metalness={0.0} roughness={0.9} />\n\n// Gold (warm tint)\n<meshStandardMaterial\n  metalness={1.0}\n  roughness={0.1}\n  color="#FFD700"\n/>`, awwwards: "metalness=1, roughness=0.05–0.15 = the chrome look everywhere on Awwwards. The HDRI reflection makes it premium.", tips: [] },
            { id: 28, title: "Color Map", duration: "15 min", tag: "Textures", intro: "The base color (albedo/diffuse) texture map defines the surface color.", code: `const colorMap = useTexture('/textures/color.jpg')\n\n// Critical: set correct color space\ncolorMap.colorSpace = THREE.SRGBColorSpace\n\n<meshStandardMaterial\n  map={colorMap}\n  // Color + map combine multiplicatively\n  // color="white" = pure map color\n  // color="gray" = darkened map\n  color="white"\n/>`, awwwards: "Always set SRGBColorSpace on color maps. Without it, colors look washed out or oversaturated.", tips: [] },
            { id: 29, title: "Normal Map", duration: "20 min", tag: "Textures", intro: "Normal maps simulate surface detail (bumps, scratches, weave) without adding polygons.", code: `const normalMap = useTexture('/textures/normal.jpg')\n\n<meshStandardMaterial\n  normalMap={normalMap}\n  normalScale={[1, 1]}  // Intensity vector [x, y]\n  // Higher values = more pronounced bumps\n  // [0.5, 0.5] = subtle, [2, 2] = exaggerated\n/>\n\n// Normal maps stay in LINEAR color space\n// (Don't set SRGBColorSpace on normal maps!)`, awwwards: "Normal maps give surfaces tactile quality — skin pores, metal scratches, fabric weave. Essential for photorealism.", tips: [] },
            { id: 30, title: "Roughness Map", duration: "15 min", tag: "Textures", intro: "Roughness and ambient occlusion maps add surface variation — shiny patches alongside matte areas.", code: `// Full PBR texture set in one useTexture call\nconst [colorMap, normalMap, roughnessMap, metalnessMap, aoMap] =\n  useTexture([\n    '/textures/diffuse.jpg',\n    '/textures/normal.jpg',\n    '/textures/roughness.jpg',\n    '/textures/metalness.jpg',\n    '/textures/ao.jpg',\n  ])\n\ncolorMap.colorSpace = THREE.SRGBColorSpace\n\n<meshStandardMaterial\n  map={colorMap}\n  normalMap={normalMap}\n  roughnessMap={roughnessMap}\n  metalnessMap={metalnessMap}\n  aoMap={aoMap}\n  aoMapIntensity={1.5}\n/>`, awwwards: "Full PBR texture sets from sites like Poly Haven create photorealistic surfaces seen on premium Awwwards product showcases.", tips: [] },
        ]
    },
    {
        id: 6, title: "Architecture", color: "#06B6D4", bg: "rgba(6,182,212,0.08)", icon: Building2,
        topics: [
            { id: 31, title: "Grouping Objects", duration: "20 min", tag: "Architecture", intro: "Groups let you transform multiple 3D objects as a single unit — like a folder in 3D space.", code: `// <group> = THREE.Group — transform container\n<group\n  position={[0, 1, 0]}\n  rotation={[0, Math.PI / 4, 0]}\n  scale={1.5}\n>\n  {/* All children move/rotate/scale with group */}\n  <mesh position={[0.5, 0, 0]}>\n    <boxGeometry />\n    <meshStandardMaterial color="#06B6D4" />\n  </mesh>\n  <mesh position={[-0.5, 0, 0]}>\n    <sphereGeometry args={[0.4, 32, 32]} />\n    <meshStandardMaterial color="#8B5CF6" />\n  </mesh>\n</group>`, awwwards: "Groups enable modular scene composition. Complex Awwwards scenes are always a hierarchy of groups.", tips: [] },
            { id: 32, title: "Nested Objects", duration: "20 min", tag: "Architecture", intro: "Child objects inherit parent transforms — enabling hierarchical orbital animations.", code: `// Planet + Moon system\nfunction PlanetSystem() {\n  const systemRef = useRef()\n  const moonRef = useRef()\n\n  useFrame(({ clock }) => {\n    const t = clock.elapsedTime\n    systemRef.current.rotation.y = t * 0.3   // System orbits\n    moonRef.current.rotation.y = t * 1.2     // Moon orbits faster\n  })\n\n  return (\n    <group ref={systemRef}>\n      {/* Planet */}\n      <mesh>\n        <sphereGeometry args={[1, 32, 32]} />\n        <meshStandardMaterial color="#4488FF" />\n      </mesh>\n      {/* Moon offset from planet */}\n      <group position={[3, 0, 0]} ref={moonRef}>\n        <mesh>\n          <sphereGeometry args={[0.3, 16, 16]} />\n          <meshStandardMaterial color="#AAAAAA" />\n        </mesh>\n      </group>\n    </group>\n  )\n}`, awwwards: "Nested hierarchies create complex orbital/mechanical animations used in Awwwards data visualizations.", tips: [] },
            { id: 33, title: "Reusable Components", duration: "20 min", tag: "Architecture", intro: "Extract repeated 3D elements into parametric React components — the key to maintaining complex scenes.", code: `// Generic reusable 3D component\nfunction MetalOrb({ position, color, size = 0.5 }) {\n  return (\n    <mesh position={position}>\n      <sphereGeometry args={[size, 32, 32]} />\n      <meshStandardMaterial\n        color={color}\n        metalness={0.9}\n        roughness={0.1}\n      />\n    </mesh>\n  )\n}\n\n// Data-driven scene — clean, maintainable\nconst orbs = [\n  { position: [-2, 0, 0], color: '#06B6D4' },\n  { position: [0, 0, 0],  color: '#8B5CF6', size: 0.8 },\n  { position: [2, 0, 0],  color: '#EF4444' },\n]\n\nfunction Scene() {\n  return orbs.map((props, i) => (\n    <MetalOrb key={i} {...props} />\n  ))\n}`, awwwards: "Component architecture is what enables complex Awwwards scenes to be maintained and iterated on quickly.", tips: [] },
            { id: 34, title: "Props-Driven Components", duration: "20 min", tag: "Architecture", intro: "Drive 3D animation behavior entirely through props — for data-driven, easily customizable scenes.", code: `function AnimatedOrb({ color, speed = 1, radius = 0.5, offset = 0 }) {\n  const ref = useRef()\n\n  useFrame(({ clock }) => {\n    const t = clock.elapsedTime * speed + offset\n    ref.current.position.y = Math.sin(t) * 0.5\n    ref.current.rotation.y = t\n  })\n\n  return (\n    <mesh ref={ref}>\n      <sphereGeometry args={[radius, 32, 32]} />\n      <meshStandardMaterial\n        color={color}\n        metalness={0.8}\n        roughness={0.1}\n        emissive={color}\n        emissiveIntensity={0.15}\n      />\n    </mesh>\n  )\n}\n\n// Scene driven entirely by data\nconst CONFIG = [\n  { color: '#06B6D4', speed: 1.0, offset: 0 },\n  { color: '#8B5CF6', speed: 0.7, offset: 2 },\n  { color: '#EF4444', speed: 1.3, offset: 4 },\n]\n\n{CONFIG.map((p, i) => <AnimatedOrb key={i} {...p} />)}`, awwwards: "Props-driven components = maintainable Awwwards scenes. 50–200+ objects all component-driven, config-tweakable.", tips: [] },
            { id: 35, title: "Perspective Camera", duration: "20 min", tag: "Camera", intro: "Drei's PerspectiveCamera replaces the Canvas default — enabling explicit, scriptable camera control.", code: `import { PerspectiveCamera } from '@react-three/drei'\n\nfunction Scene() {\n  return (\n    <>\n      <PerspectiveCamera\n        makeDefault        // Replace R3F's default camera\n        fov={45}\n        near={0.1}\n        far={1000}\n        position={[0, 2, 8]}\n      />\n      {/* Scene objects */}\n    </>\n  )\n}`, awwwards: "Explicit camera control is the foundation of cinematic camera work on Awwwards sites.", tips: [] },
            { id: 36, title: "LookAt", duration: "15 min", tag: "Camera", intro: "Point cameras or 3D objects toward a specific coordinate in space.", code: `import { useThree, useFrame } from '@react-three/fiber'\n\n// Point camera at a target\nfunction CameraLookAt() {\n  const { camera } = useThree()\n\n  useFrame(() => {\n    camera.lookAt(0, 0, 0)  // Always look at origin\n  })\n  return null\n}\n\n// Billboard: object always faces camera\nfunction Billboard() {\n  const ref = useRef()\n  const { camera } = useThree()\n\n  useFrame(() => {\n    ref.current.lookAt(camera.position)\n  })\n\n  return (\n    <mesh ref={ref}>\n      <planeGeometry args={[1, 1]} />\n      <meshBasicMaterial map={texture} transparent />\n    </mesh>\n  )\n}`, awwwards: "Billboard effects (objects facing camera) are used for particle sprites and floating labels on Awwwards sites.", tips: [] },
            { id: 37, title: "Camera Transitions", duration: "30 min", tag: "Camera", intro: "Animate the camera between positions for cinematic scene transitions.", code: `import gsap from 'gsap'\nimport { useThree } from '@react-three/fiber'\n\nfunction CameraController() {\n  const { camera } = useThree()\n\n  // Smooth camera fly-to\n  function flyToProduct() {\n    gsap.to(camera.position, {\n      x: 2, y: 1, z: 3,\n      duration: 1.8,\n      ease: 'power3.inOut',\n      onUpdate: () => camera.lookAt(0, 0, 0)\n    })\n  }\n\n  // Camera orbit path\n  function orbitReveal() {\n    const tl = gsap.timeline()\n    tl.to(camera.position, { z: 8, y: 3, duration: 1 })\n      .to(camera.position, { x: 3, z: 5, duration: 1.5 })\n      .to(camera.position, { x: 0, z: 5, duration: 1 })\n  }\n\n  return <mesh onClick={flyToProduct}><boxGeometry /><meshStandardMaterial /></mesh>\n}`, awwwards: "Camera fly-throughs on scroll or click are a defining feature of Awwwards-winning interactive experiences.", tips: [] },
            { id: 38, title: "useMemo()", duration: "20 min", tag: "Performance", intro: "useMemo prevents expensive Three.js object creation from running on every React render.", code: `import { useMemo } from 'react'\nimport * as THREE from 'three'\n\nfunction OptimizedScene() {\n  // ❌ Created on EVERY render\n  // const geometry = new THREE.TorusKnotGeometry(...)\n\n  // ✅ Created ONCE, then reused\n  const geometry = useMemo(\n    () => new THREE.TorusKnotGeometry(1, 0.3, 200, 20),\n    []  // No deps = create once\n  )\n\n  // Shared material across many instances\n  const material = useMemo(\n    () => new THREE.MeshStandardMaterial({ color: 'hotpink' }),\n    []\n  )\n\n  // Recompute only when color changes\n  const dynamicMaterial = useMemo(\n    () => new THREE.MeshStandardMaterial({ color: activeColor }),\n    [activeColor]\n  )\n\n  return <mesh geometry={geometry} material={material} />\n}`, awwwards: "Performance optimization starts with useMemo. A 60fps Awwwards scene never recreates Three.js objects unnecessarily.", tips: [] },
        ]
    },
    {
        id: 7, title: "Performance & Advanced", color: "#F59E0B", bg: "rgba(245,158,11,0.08)", icon: Cpu,
        topics: [
            { id: 39, title: "Avoid Re-renders", duration: "20 min", tag: "Performance", intro: "React re-renders kill 3D performance. Learn to isolate state and prevent unnecessary updates.", code: `// ❌ Parent state re-renders entire scene\nfunction BadScene() {\n  const [count, setCount] = useState(0)\n  return (\n    <Canvas>\n      {/* Entire 3D scene re-renders on count change! */}\n      <ExpensiveMesh />\n      <button onClick={() => setCount(c => c + 1)} />\n    </Canvas>\n  )\n}\n\n// ✅ Isolate state to smallest scope\nfunction GoodScene() {\n  return (\n    <Canvas>\n      <ExpensiveMesh />         {/* Never re-renders */}\n      <InteractiveMesh />       {/* Only this re-renders */}\n    </Canvas>\n  )\n}\n\n// ✅ React.memo for stable components\nconst StableMesh = React.memo(({ color }) => (\n  <mesh>\n    <boxGeometry />\n    <meshStandardMaterial color={color} />\n  </mesh>\n))`, awwwards: "60fps requires zero unnecessary re-renders. The 3D loop runs in useFrame, completely outside React.", tips: [] },
            { id: 40, title: "Instancing (Basics)", duration: "25 min", tag: "Performance", intro: "Render thousands of identical objects in a single GPU draw call using Drei's Instances.", code: `import { Instances, Instance } from '@react-three/drei'\n\n// 1000 boxes = 1 draw call (vs 1000 without instancing)\nconst positions = Array.from({ length: 1000 }, () => ([\n  (Math.random() - 0.5) * 20,\n  (Math.random() - 0.5) * 20,\n  (Math.random() - 0.5) * 20,\n]))\n\nfunction ParticleField() {\n  return (\n    <Instances limit={1000}>\n      <boxGeometry args={[0.1, 0.1, 0.1]} />\n      <meshStandardMaterial color="#06B6D4" />\n\n      {positions.map((pos, i) => (\n        <Instance key={i} position={pos} />\n      ))}\n    </Instances>\n  )\n}`, awwwards: "Particle fields and space backgrounds on Awwwards use instancing. Without it, 500 objects = 500 draw calls = laggy.", tips: [] },
            { id: 41, title: "Lazy Loading Models", duration: "20 min", tag: "Performance", intro: "Load 3D models asynchronously with Suspense to prevent blocking initial page render.", code: `import { Suspense } from 'react'\nimport { useGLTF } from '@react-three/drei'\n\nfunction HeavyModel() {\n  const { scene } = useGLTF('/model.glb')\n  return <primitive object={scene} />\n}\n\n// Model loads asynchronously — doesn't block UI\nfunction App() {\n  return (\n    <Canvas>\n      <Suspense\n        fallback={<LoadingSpinner />}  // Show while loading\n      >\n        <HeavyModel />\n      </Suspense>\n    </Canvas>\n  )\n}\n\n// Pre-warm the cache before mounting\nuseGLTF.preload('/model.glb')  // Call in global scope`, awwwards: "Perceived performance matters. Show a loader → transition to 3D = professional UX.", tips: [] },
            { id: 42, title: "Drei Performance Helpers", duration: "20 min", tag: "Performance", intro: "Drei provides drop-in performance helpers that automatically optimize your scene.", code: `import {\n  AdaptiveDpr,    // Lower resolution when framerate drops\n  AdaptiveEvents, // Disable raycasting when busy\n  Preload,        // Preload all assets in Suspense\n  BakeShadows,    // Freeze shadow maps (for static scenes)\n  PerformanceMonitor  // Detect and respond to GPU load\n} from '@react-three/drei'\n\n<Canvas>\n  <AdaptiveDpr pixelated />    // Auto: 1x when fps < 60\n  <AdaptiveEvents />           // Disables events during heavy frames\n  <Preload all />              // Kicks off asset loading early\n  <BakeShadows />              // For static shadow scenes only\n\n  <PerformanceMonitor\n    onDecline={() => setQuality('low')}\n    onIncline={() => setQuality('high')}\n  />\n</Canvas>`, awwwards: "AdaptiveDpr is critical for mobile. Awwwards sites serve global audiences on all devices.", tips: [] },
            { id: 43, title: "Environment & Sky", duration: "20 min", tag: "Environment", intro: "HDRI environments and sky shaders for background and image-based lighting.", code: `// HDRI environment lighting\n<Environment preset="studio" />\n<Environment preset="city" background blur={0.3} />\n<Environment files="/hdri/custom.hdr" />\n\n// Procedural sky\nimport { Sky } from '@react-three/drei'\n<Sky\n  distance={450000}\n  sunPosition={[0, 1, 0]}   // [x, y, z] = sun direction\n  inclination={0.31}         // Sun height (0=horizon, 0.5=zenith)\n  azimuth={0.25}             // Sun compass direction\n/>\n\n// Starfield\nimport { Stars } from '@react-three/drei'\n<Stars\n  radius={300}\n  depth={60}\n  count={5000}\n  factor={4}\n  saturation={0}\n  fade\n/>`, awwwards: "Dark starfield + fog + Environment preset = the immersive space aesthetic on dozens of Awwwards sites.", tips: [] },
            { id: 44, title: "Fog", duration: "15 min", tag: "Environment", intro: "Fog adds atmospheric depth and hides scene edges naturally.", code: `// Attach fog directly to scene\n\n// Exponential fog — natural density falloff\n<fogExp2 attach="fog" color="#030712" density={0.05} />\n\n// Linear fog — exact start and end distance\n<fog attach="fog" color="#030712" near={5} far={30} />\n\n// Fog in Canvas camera z-direction\n// Objects at far distance fade into the fog color\n// Match fog color to Canvas background for seamlessness`, awwwards: "Exponential fog on a dark background creates that deep, volumetric feel used on immersive Awwwards sites.", tips: [] },
        ]
    },
    {
        id: 8, title: "Awwwards Level", color: "#EC4899", bg: "rgba(236,72,153,0.08)", icon: Trophy,
        topics: [
            { id: 45, title: "Post Processing", duration: "30 min", tag: "VFX", intro: "Post-processing effects applied after rendering: Bloom, Chromatic Aberration, Vignette, SSAO.", code: `import { EffectComposer, Bloom, ChromaticAberration, Vignette, DepthOfField } from '@react-three/postprocessing'\n\n// npm install @react-three/postprocessing\n\n<EffectComposer>\n  {/* Glow on emissive materials */}\n  <Bloom\n    luminanceThreshold={0.85} // Only bloom bright pixels\n    intensity={1.5}\n    mipmapBlur\n  />\n\n  {/* Lens chromatic aberration */}\n  <ChromaticAberration\n    offset={[0.002, 0.002]}\n  />\n\n  {/* Darken edges */}\n  <Vignette\n    offset={0.1}\n    darkness={1.1}\n  />\n\n  {/* Cinematic depth of field */}\n  <DepthOfField\n    focusDistance={0}\n    focalLength={0.02}\n    bokehScale={2}\n  />\n</EffectComposer>`, awwwards: "Bloom is the #1 VFX effect on Awwwards sites. It makes emissive materials glow and transforms good-looking into cinematic.", tips: [] },
            { id: 46, title: "GSAP + R3F", duration: "35 min", tag: "Animation", intro: "GSAP paired with R3F delivers timeline-based, eased, scriptable animations beyond what CSS or spring physics offer.", code: `import gsap from 'gsap'\nimport { useEffect, useRef } from 'react'\n\nfunction GsapMesh() {\n  const ref = useRef()\n\n  useEffect(() => {\n    // Animate Three.js object properties directly\n    gsap.from(ref.current.position, {\n      y: -5,\n      duration: 1.2,\n      ease: 'elastic.out(1, 0.5)',\n      delay: 0.3,\n    })\n\n    gsap.to(ref.current.rotation, {\n      y: Math.PI * 2,\n      duration: 8,\n      ease: 'none',\n      repeat: -1,\n    })\n\n    // Animate material properties\n    gsap.to(ref.current.material, {\n      metalness: 1,\n      duration: 2,\n      ease: 'power2.inOut',\n    })\n  }, [])\n\n  return (\n    <mesh ref={ref}>\n      <torusKnotGeometry args={[1, 0.3, 128, 32]} />\n      <meshStandardMaterial color="#06B6D4" />\n    </mesh>\n  )\n}`, awwwards: "GSAP's elastic, power, and expo easing + Three.js objects = cinematic 3D animations. The definitive Awwwards combination.", tips: [] },
            { id: 47, title: "Scroll-Based Animations", duration: "40 min", tag: "Animation", intro: "Animate 3D objects as the user scrolls using Drei's ScrollControls and useScroll.", code: `import { ScrollControls, useScroll } from '@react-three/drei'\nimport { useFrame } from '@react-three/fiber'\n\nfunction App() {\n  return (\n    <Canvas>\n      <ScrollControls pages={5} damping={0.1}>\n        <ScrollScene />\n      </ScrollControls>\n    </Canvas>\n  )\n}\n\nfunction ScrollScene() {\n  const scroll = useScroll()\n  const ref = useRef()\n\n  useFrame(() => {\n    const t = scroll.offset  // 0 = top, 1 = bottom\n\n    ref.current.rotation.y = t * Math.PI * 4   // Full spins\n    ref.current.position.z = t * -15           // Move back\n    ref.current.position.y = Math.sin(t * Math.PI) * 2\n  })\n\n  return <mesh ref={ref}><torusKnotGeometry /><meshStandardMaterial /></mesh>\n}`, awwwards: "Scroll-driven 3D is THE defining characteristic of Awwwards sites. Mastering this one skill unlocks the entire genre.", tips: [] },
            { id: 48, title: "GSAP Timeline", duration: "30 min", tag: "Animation", intro: "GSAP Timelines coordinate complex multi-step animations with precise, scriptable timing.", code: `import gsap from 'gsap'\nimport { ScrollTrigger } from 'gsap/ScrollTrigger'\n\ngsap.registerPlugin(ScrollTrigger)\n\nfunction TimelineScene() {\n  const ref = useRef()\n\n  useEffect(() => {\n    const tl = gsap.timeline({ paused: true })\n\n    tl.from(ref.current.position, { y: -3, duration: 1, ease: 'power3.out' })\n      .to(ref.current.rotation, { y: Math.PI, duration: 0.8 }, '-=0.3')\n      .to(ref.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.4 }, '<')\n      .to(ref.current.material, { metalness: 1, duration: 0.5 })\n\n    // Trigger on scroll\n    ScrollTrigger.create({\n      trigger: '#section-2',\n      start: 'top center',\n      onEnter: () => tl.play(),\n      onLeaveBack: () => tl.reverse(),\n    })\n  }, [])\n\n  return <mesh ref={ref}><boxGeometry /><meshStandardMaterial /></mesh>\n}`, awwwards: "GSAP ScrollTrigger + R3F is the exact stack used to build the most-awarded interactive sites online.", tips: [] },
            { id: 49, title: "axesHelper / gridHelper", duration: "10 min", tag: "Debug", intro: "Visual development helpers that show axis directions and a 3D grid overlay.", code: `// Built-in Three.js helpers as R3F JSX\n<axesHelper args={[5]} />         // Red=X, Green=Y, Blue=Z\n<gridHelper args={[20, 20, '#333', '#222']} />\n\n// Only show in development\nconst isDev = process.env.NODE_ENV === 'development'\n{\n  isDev && (\n    <>\n      <axesHelper args={[5]} />\n      <gridHelper args={[20, 20]} />\n    </>\n  )\n}\n\n// Stats panel from Drei (FPS monitor)\nimport { Stats } from '@react-three/drei'\n<Stats />  // Shows FPS, memory, draw calls`, awwwards: "Always debug with helpers during development. Ship them removed. Stats overlay is essential for performance work.", tips: [] },
            { id: 50, title: "Common Errors", duration: "20 min", tag: "Debug", intro: "The most common R3F errors and how to fix them instantly.", code: `// ❌ Hook used outside Canvas → crash\n// Fix: move all R3F hooks inside Canvas children\n\n// ❌ Black scene with meshStandardMaterial\n// Fix: add lights! <ambientLight /> minimum\n// OR use meshBasicMaterial (no lights needed)\n\n// ❌ Model invisible — scale issue from Blender\n// Fix: scale={[0.01, 0.01, 0.01]}\n\n// ❌ Texture shows as black\n// Fix: texture.colorSpace = THREE.SRGBColorSpace\n\n// ❌ Jittery/stuttering animation\n// Fix: never setState inside useFrame\n// Use useRef mutations instead\n\n// ❌ Type error: 'args' prop\n// Fix: args must be an array: args={[1, 1, 1]}\n// Not: args={1, 1, 1} or args="1 1 1"\n\n// ❌ Shadow not appearing\n// Fix checklist:\n// 1. <Canvas shadows>\n// 2. castShadow on light\n// 3. castShadow on mesh\n// 4. receiveShadow on floor`, awwwards: "Knowing these 6 errors saves hours. Most beginners hit all of them in the first week.", tips: [] },
            { id: 51, title: "Debugging with Refs & Logs", duration: "15 min", tag: "Debug", intro: "Inspect Three.js objects live using refs, console logs, and the Stats FPS monitor.", code: `// Inspect any Three.js object via ref\nconst ref = useRef()\n\nuseEffect(() => {\n  // Full Three.js object tree\n  console.log(ref.current)\n  // → THREE.Mesh { position: Vector3, rotation: Euler, ... }\n}, [])\n\n// Live inspection during animation\nuseFrame(() => {\n  // Careful: this logs every frame!\n  if (frameCount % 60 === 0) {  // Log once per second\n    console.log('position:', ref.current.position)\n    console.log('rotation:', ref.current.rotation)\n  }\n})\n\n// FPS, memory, draw calls monitoring\nimport { Stats, StatsGl } from '@react-three/drei'\n\n<Stats />      // Three.js r-stats panel\n<StatsGl />    // GPU stats — WebGL draw calls etc\n\n// Target: 60fps, <100 draw calls, <200MB memory`, awwwards: "Always profile FPS with Stats during development. Ship at 60fps. StatsGl reveals expensive draw calls.", tips: [] },
        ]
    }
];

// ── MAIN COMPONENT ─────────────────────────────────────────────────────
export default function R3FCurriculum() {
    const allTopics = PHASES.flatMap(p => p.topics) as Topic[];
    const [selected, setSelected] = useState<Topic>(allTopics[0]);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({ 1: true });
    const [completed, setCompleted] = useState(new Set());

    const phase = PHASES.find(p => p.topics.some(t => t.id === selected.id))!;
    const topicIndex = allTopics.findIndex(t => t.id === selected.id);
    const prev = allTopics[topicIndex - 1];
    const next = allTopics[topicIndex + 1];

    const toggleComplete = (id: number) => {
        setCompleted(c => {
            const n = new Set(c);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };

    const pct = Math.round((completed.size / allTopics.length) * 100);

    return (
        <div style={{
            display: "flex", height: "100vh", overflow: "hidden",
            background: "#030712", color: "#E2E8F0",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: "14px"
        }}>

            {/* ── SIDEBAR ───────────────────────────────────────── */}
            <div style={{
                width: 272, flexShrink: 0, background: "#0D1117",
                borderRight: "1px solid #161B22",
                display: "flex", flexDirection: "column", overflow: "hidden"
            }}>
                {/* Sidebar Header */}
                <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #161B22" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, #06B6D4, #8B5CF6)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
                        }}>✦</div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#F1F5F9", letterSpacing: "-0.02em" }}>R3F Mastery</div>
                            <div style={{ fontSize: 10, color: "#475569" }}>Awwwards-Level 3D</div>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: "#161B22", borderRadius: 4, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #06B6D4, #8B5CF6)", borderRadius: 4, transition: "width 0.5s" }} />
                        </div>
                        <span style={{ fontSize: 10, color: "#6B7280", fontVariantNumeric: "tabular-nums" }}>{completed.size}/{allTopics.length}</span>
                    </div>
                </div>

                {/* Phase list */}
                <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
                    {PHASES.map(ph => {
                        const PhIcon = ph.icon;
                        const phDone = ph.topics.filter(t => completed.has(t.id)).length;
                        const isOpen = expanded[ph.id];
                        return (
                            <div key={ph.id}>
                                <button
                                    onClick={() => setExpanded(e => ({ ...e, [ph.id]: !e[ph.id] }))}
                                    style={{
                                        width: "100%", display: "flex", alignItems: "center", gap: 8,
                                        padding: "7px 16px", background: "none", border: "none",
                                        color: "#94A3B8", cursor: "pointer", textAlign: "left",
                                    }}
                                >
                                    <div style={{
                                        width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                                        background: ph.bg, display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        <PhIcon size={11} color={ph.color} />
                                    </div>
                                    <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                        {ph.title}
                                    </span>
                                    <span style={{ fontSize: 9, color: "#374151", marginRight: 2 }}>{phDone}/{ph.topics.length}</span>
                                    {isOpen ? <ChevronDown size={12} color="#374151" /> : <ChevronRight size={12} color="#374151" />}
                                </button>

                                {isOpen && ph.topics.map(topic => {
                                    const isActive = topic.id === selected.id;
                                    const isDone = completed.has(topic.id);
                                    return (
                                        <button
                                            key={topic.id}
                                            onClick={() => setSelected(topic)}
                                            style={{
                                                width: "100%", display: "flex", alignItems: "center", gap: 8,
                                                padding: "6px 16px 6px 36px", background: isActive ? "rgba(6,182,212,0.06)" : "none",
                                                border: "none", borderLeft: isActive ? `2px solid ${ph.color}` : "2px solid transparent",
                                                cursor: "pointer", textAlign: "left",
                                            }}
                                        >
                                            {isDone
                                                ? <CheckCircle2 size={13} color="#22C55E" style={{ flexShrink: 0 }} />
                                                : <Circle size={13} color={isActive ? ph.color : "#334155"} style={{ flexShrink: 0 }} />
                                            }
                                            <span style={{
                                                fontSize: 12, color: isActive ? "#F1F5F9" : isDone ? "#64748B" : "#94A3B8",
                                                flex: 1, lineHeight: 1.3
                                            }}>
                                                {topic.title}
                                            </span>
                                            <span style={{
                                                fontSize: 9, color: "#374151", background: "#161B22",
                                                padding: "1px 5px", borderRadius: 3, flexShrink: 0
                                            }}>
                                                {topic.duration}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── MAIN CONTENT ──────────────────────────────────── */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 0 40px" }}>

                {/* Topic Header */}
                <div style={{
                    padding: "20px 32px 20px",
                    borderBottom: "1px solid #161B22",
                    background: "#0D1117",
                    position: "sticky", top: 0, zIndex: 10
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                            background: `${phase.color}18`, color: phase.color,
                            border: `1px solid ${phase.color}30`, letterSpacing: "0.05em", textTransform: "uppercase"
                        }}>
                            {selected.tag}
                        </div>
                        <div style={{ flex: 1, fontWeight: 700, fontSize: 17, color: "#F1F5F9", letterSpacing: "-0.02em" }}>
                            {topicIndex + 1}. {selected.title}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <Clock size={12} color="#475569" />
                            <span style={{ fontSize: 11, color: "#475569" }}>{selected.duration}</span>
                        </div>
                        <button
                            onClick={() => toggleComplete(selected.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                                background: completed.has(selected.id) ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)",
                                border: completed.has(selected.id) ? "1px solid rgba(34,197,94,0.3)" : "1px solid #1E293B",
                                color: completed.has(selected.id) ? "#22C55E" : "#64748B",
                                fontSize: 11, fontWeight: 600,
                            }}
                        >
                            <CheckCircle2 size={13} />
                            {completed.has(selected.id) ? "Done" : "Mark Done"}
                        </button>
                    </div>
                </div>

                <div style={{ padding: "24px 32px", maxWidth: 820 }}>

                    {/* Intro */}
                    <div style={{
                        padding: "16px 20px", borderRadius: 8, marginBottom: 24,
                        background: `${phase.color}08`, border: `1px solid ${phase.color}20`,
                    }}>
                        <p style={{ margin: 0, lineHeight: 1.7, color: "#CBD5E1", fontSize: 14 }}>
                            {selected.intro}
                        </p>
                    </div>

                    {/* Why This Matters (Awwwards context) */}
                    {selected.awwwards && (
                        <div style={{
                            display: "flex", gap: 12, padding: "14px 18px", borderRadius: 8, marginBottom: 24,
                            background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)",
                        }}>
                            <Trophy size={16} color="#FBBF24" style={{ flexShrink: 0, marginTop: 1 }} />
                            <p style={{ margin: 0, lineHeight: 1.7, color: "#D4A84B", fontSize: 13 }}>
                                <strong style={{ color: "#FBBF24" }}>Awwwards Context: </strong>{selected.awwwards}
                            </p>
                        </div>
                    )}

                    {/* Why this concept */}
                    {selected.why && (
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                <Lightbulb size={14} color={phase.color} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: phase.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Why This Matters</span>
                            </div>
                            <p style={{ margin: 0, lineHeight: 1.7, color: "#94A3B8", paddingLeft: 22 }}>{selected.why}</p>
                        </div>
                    )}

                    {/* Concepts */}
                    {selected.concepts && selected.concepts.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                <BookOpen size={14} color={phase.color} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: phase.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Key Concepts</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                {selected.concepts.map((c, i) => (
                                    <div key={i} style={{
                                        padding: "12px 14px", borderRadius: 6,
                                        background: "#0D1117", border: "1px solid #1E293B",
                                    }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9", marginBottom: 4, fontFamily: "monospace" }}>
                                            {c.name}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{c.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Code */}
                    {selected.code && (
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                <Code2 size={14} color={phase.color} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: phase.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Code Example</span>
                            </div>
                            <div style={{ position: "relative" }}>
                                <pre style={{
                                    background: "#010409", color: "#E2E8F0",
                                    padding: "20px", borderRadius: 8, fontSize: "12px",
                                    lineHeight: 1.75, overflow: "auto", margin: 0,
                                    border: "1px solid #161B22",
                                    fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                                    maxHeight: 520
                                }}
                                    dangerouslySetInnerHTML={{ __html: highlight(selected.code) }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Install */}
                    {selected.install && (
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                <Zap size={14} color={phase.color} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: phase.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Install</span>
                            </div>
                            <pre style={{
                                background: "#010409", padding: "12px 16px", borderRadius: 6,
                                color: "#86EFAC", fontSize: 12, margin: 0,
                                border: "1px solid #161B22",
                                fontFamily: "'JetBrains Mono', 'Menlo', monospace"
                            }}>$ {selected.install}</pre>
                        </div>
                    )}

                    {/* Tips */}
                    {selected.tips && selected.tips.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                <Star size={14} color={phase.color} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: phase.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pro Tips</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {selected.tips.map((tip, i) => (
                                    <div key={i} style={{
                                        display: "flex", gap: 10, padding: "10px 14px",
                                        borderRadius: 6, background: "#0D1117", border: "1px solid #1E293B",
                                    }}>
                                        <span style={{ color: phase.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                                        <span style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div style={{ display: "flex", gap: 12, marginTop: 32, paddingTop: 20, borderTop: "1px solid #161B22" }}>
                        {prev && (
                            <button
                                onClick={() => setSelected(prev)}
                                style={{
                                    flex: 1, padding: "10px 16px", borderRadius: 6, cursor: "pointer",
                                    background: "#0D1117", border: "1px solid #1E293B",
                                    color: "#94A3B8", fontSize: 12, textAlign: "left",
                                    display: "flex", flexDirection: "column", gap: 2
                                }}
                            >
                                <span style={{ fontSize: 9, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em" }}>← Previous</span>
                                <span style={{ color: "#F1F5F9" }}>{prev.title}</span>
                            </button>
                        )}
                        {next && (
                            <button
                                onClick={() => setSelected(next)}
                                style={{
                                    flex: 1, padding: "10px 16px", borderRadius: 6, cursor: "pointer",
                                    background: `${phase.color}10`, border: `1px solid ${phase.color}25`,
                                    color: "#94A3B8", fontSize: 12, textAlign: "right",
                                    display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end"
                                }}
                            >
                                <span style={{ fontSize: 9, color: phase.color, textTransform: "uppercase", letterSpacing: "0.08em" }}>Next →</span>
                                <span style={{ color: "#F1F5F9" }}>{next.title}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
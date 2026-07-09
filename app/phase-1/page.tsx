'use client'
import { useState } from "react";

// ─── SYNTAX HIGHLIGHTER ─────────────────────────────────────────────────────
function hl(code:any) {
  if (!code) return "";
  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // comments
    .replace(/(\/\/[^\n]*)/g, '<span style="color:#4B5563;font-style:italic">$1</span>')
    // template literals and strings
    .replace(/(`[^`]*`)/g, '<span style="color:#86EFAC">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')/g, '<span style="color:#86EFAC">$1</span>')
    // R3F / drei hooks
    .replace(/\b(useFrame|useThree|useRef|useState|useEffect|useMemo|useLoader|useGLTF|useTexture|useScroll|useHelper|useCursor|useGraph|useAnimations)\b/g, '<span style="color:#FCD34D">$1</span>')
    // keywords
    .replace(/\b(import|export|from|const|let|var|function|return|default|async|await|new|class|extends|true|false|null|undefined|of|if|else)\b/g, '<span style="color:#C084FC">$1</span>')
    // numbers
    .replace(/(?<![a-zA-Z#"'`\-_])(\b\d+\.?\d*)\b/g, '<span style="color:#FB923C">$1</span>')
    // JSX components / Three classes
    .replace(/\b(Canvas|mesh|boxGeometry|sphereGeometry|planeGeometry|torusGeometry|torusKnotGeometry|cylinderGeometry|meshStandardMaterial|meshBasicMaterial|meshPhysicalMaterial|ambientLight|directionalLight|pointLight|spotLight|hemisphereLight|group|primitive|THREE|Math|OrbitControls|Float|Environment|Sparkles|EffectComposer|Bloom|PerspectiveCamera|axesHelper|gridHelper)\b/g, '<span style="color:#38BDF8">$1</span>');
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const TOPICS = [
  {
    id: 1,
    title: "What is R3F?",
    tag: "CONCEPT",
    tagColor: "#06B6D4",
    duration: "15 min",
    sections: [
      {
        type: "explainer",
        title: "The Mental Model",
        content: `React Three Fiber (R3F) is a React renderer for Three.js. That single sentence contains everything you need.

Three.js is a WebGL abstraction — it turns raw GPU instructions into cameras, meshes, lights, and animations you can actually work with. But Three.js is imperative: you write step-by-step instructions — create this, add that, update every frame.

R3F makes Three.js declarative. You write JSX, React handles the lifecycle, and R3F translates it into Three.js objects under the hood. Every <mesh> becomes a new THREE.Mesh(). Every <boxGeometry> becomes a new THREE.BoxGeometry(). You never call those constructors yourself.`
      },
      {
        type: "comparison",
        label1: "❌ Raw Three.js — Imperative",
        label2: "✅ R3F — Declarative JSX",
        code1: `// You manage everything manually
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({
  color: 'hotpink'
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// You write the render loop yourself
function animate() {
  requestAnimationFrame(animate)
  mesh.rotation.y += 0.01 // ❌ frame-rate dependent!
  renderer.render(scene, camera)
}
animate()`,
        code2: `import { Canvas } from '@react-three/fiber'

// R3F creates the renderer, camera,
// and render loop for you automatically.
// JSX = Three.js objects, declared not built.

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
}

// That's it. Same result, 1/3 the code,
// and now it lives in React's component tree.`
      },
      {
        type: "stack",
        title: "The Stack You're Learning",
        items: [
          { name: "Three.js", color: "#F59E0B", desc: "The engine. Handles WebGL, geometry, materials, lights, cameras, and the render loop at the lowest level you'll touch.", badge: "foundation" },
          { name: "React Three Fiber", color: "#06B6D4", desc: "The React renderer. Converts your JSX into Three.js objects. Manages lifecycle, cleanup, and makes 3D fit inside React's component model.", badge: "renderer" },
          { name: "Drei", color: "#8B5CF6", desc: "The helper library. 100+ pre-built components: OrbitControls, useGLTF, Environment, Stars, MeshTransmissionMaterial. Think of it as the standard library for Awwwards-level work.", badge: "utilities" },
          { name: "GSAP", color: "#EC4899", desc: "The animation powerhouse. Timeline-based, scroll-triggered, eased animations. Pairs with R3F for the cinematic motion that defines award-winning sites.", badge: "animation" },
        ]
      },
      {
        type: "install",
        code: `npm install three @react-three/fiber @react-three/drei gsap

# Types for TypeScript projects
npm install --save-dev @types/three`
      },
      {
        type: "awwwards",
        content: "Every Awwwards Winner using WebGL uses a declarative renderer like R3F. Raw Three.js at scale — across 20+ components with scroll state, React routing, and dynamic data — becomes architecturally unmanageable. R3F is not a shortcut; it's the correct tool for this stack."
      },
      {
        type: "traps",
        items: [
          { title: "Hooks outside Canvas", desc: "ALL R3F hooks (useFrame, useThree, etc.) must live inside a Canvas child component. This is the #1 crash beginners hit. The hooks rely on React context provided by Canvas." },
          { title: "JSX ≠ HTML", desc: "Inside Canvas, you're writing JSX that maps to Three.js objects, not HTML. <mesh> is THREE.Mesh, not a DOM element. None of this renders to the DOM — it goes to WebGL." },
          { title: "camelCase props", desc: "Three.js properties map to camelCase JSX props. material.roughness becomes roughness={0.5} on the material tag. position.x becomes position={[x, y, z]}." },
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Canvas",
    tag: "SETUP",
    tagColor: "#8B5CF6",
    duration: "20 min",
    sections: [
      {
        type: "explainer",
        title: "Canvas is Your Scene Container",
        content: `Canvas is the entry point for everything. Mount it, and R3F automatically creates:

→  A WebGLRenderer (the GPU pipeline)
→  A default PerspectiveCamera (fov: 75, near: 0.1, far: 1000, position: [0, 0, 5])
→  A render loop (requestAnimationFrame, running at the monitor's native refresh rate)
→  A resize observer (auto-updates on window resize)

You configure all of these through Canvas props. These settings define the visual quality ceiling of your entire scene — get them right once, and every scene that lives inside benefits.`
      },
      {
        type: "code",
        title: "Canvas — From Minimal to Production",
        code: `import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

// ── 1. Minimal — fine for learning ────────────────────
<Canvas>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="hotpink" />
  </mesh>
</Canvas>


// ── 2. Production / Awwwards-level ────────────────────
<Canvas
  // Pixel ratio: [min, max]. Cap at 2 — beyond that
  // is wasteful and imperceptible, but very expensive.
  dpr={[1, 2]}

  // Enable shadow maps on the renderer
  shadows

  // WebGLRenderer configuration
  gl={{
    antialias: true,

    // ACESFilmicToneMapping: S-curve contrast that makes
    // scenes look cinematic. The single biggest visual
    // upgrade you can make to a basic scene.
    toneMapping: THREE.ACESFilmicToneMapping,

    // SRGBColorSpace: ensures colors are mathematically
    // correct. Without it, colors look washed or wrong.
    outputColorSpace: THREE.SRGBColorSpace,
  }}

  // Default camera configuration
  camera={{
    fov: 45,          // Field of view. 45° = natural.
    near: 0.1,        // Near clip. Objects closer: invisible.
    far: 200,         // Far clip. Objects further: invisible.
    position: [0, 0, 5], // [x, y, z] starting position
  }}

  // frameloop options:
  // 'always'  → continuous render (default, for animation)
  // 'demand'  → only renders on state change (static scenes)
  // 'never'   → fully manual, you call advance()
  frameloop="always"

  // Canvas fills its container — set container to 100vw/100vh
  style={{ width: '100vw', height: '100vh' }}
>
  <Scene />
</Canvas>`
      },
      {
        type: "insight",
        title: "Your Next.js Setup — What to Change",
        content: `Your current app/page.tsx has:  camera={{ position: [0, 0, 5], fov: 75 }}

fov: 75 is wide — fine for learning, but Awwwards-level scenes use 45° or lower for a compressed, premium telephoto feel. Try fov: 45 and notice how it changes the perceived depth.

You also don't have toneMapping or outputColorSpace set. Add those and your scene will visually jump in quality immediately — even the same orange box will look more cinematic.`
      },
      {
        type: "awwwards",
        content: "ACESFilmicToneMapping + SRGBColorSpace is a two-line change that adds the 'filmic' quality to Awwwards scenes. It's why their 3D looks like it belongs in a movie trailer and default Three.js looks flat. These two settings are on every serious production scene."
      },
      {
        type: "traps",
        items: [
          { title: "Canvas needs a sized container", desc: "Canvas fills its parent element. If the parent has no height (like a default div), Canvas is 0px tall and you see nothing. Always set the container or Canvas itself to explicit dimensions." },
          { title: "dpr beyond 2", desc: "On a 3x Retina display, dpr={[1,3]} means rendering at 3x resolution — 9x the pixels of 1x. The visual gain over 2x is imperceptible, but the performance cost is severe. Always cap at 2." },
          { title: "frameloop='demand' gotcha", desc: "If you use demand mode and nothing seems to update, it's because R3F isn't re-rendering. You need to call invalidate() from useThree to request a frame." },
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Mesh = Geometry + Material",
    tag: "CORE",
    tagColor: "#10B981",
    duration: "25 min",
    sections: [
      {
        type: "explainer",
        title: "The Atom of 3D",
        content: `A Mesh is a combination of two things:

GEOMETRY — the shape. Defined by vertices (points in 3D space) and faces (triangles connecting those points). This is what gives the object its form: a box, a sphere, a donut. It exists in mathematical space with no color or surface.

MATERIAL — the surface. Defines how light interacts with the geometry: color, shininess, roughness, transparency, texture. Materials turn raw geometry into something that looks like metal, glass, rubber, or skin.

Together as a Mesh, they become a positioned, rotatable, scalable object in 3D space. This is the fundamental unit. Everything you see in 3D is one or more meshes.`
      },
      {
        type: "code",
        title: "Mesh Anatomy",
        code: `// The three transforms every mesh has:
// position={[x, y, z]}   — where it is in space
// rotation={[x, y, z]}   — orientation, in RADIANS
// scale={[x, y, z]}      — size multiplier, or scale={1.5} for uniform

<mesh
  position={[0, 0, 0]}
  rotation={[0, Math.PI / 4, 0]} // Math.PI/4 = 45°, Math.PI = 180°
  scale={1}
  castShadow    // This mesh casts shadows
  receiveShadow // This mesh receives shadows from others
>
  {/* GEOMETRY — defines the shape */}
  <boxGeometry args={[1, 1, 1]} />
  {/* args maps directly to: new THREE.BoxGeometry(width, height, depth) */}

  {/* MATERIAL — defines the surface */}
  <meshStandardMaterial
    color="#ff6b6b"
    metalness={0.5}   // 0 = plastic, 1 = pure metal
    roughness={0.3}   // 0 = mirror, 1 = chalk
  />
</mesh>


// ── Multiple meshes in a scene ─────────────────────────
function Scene() {
  return (
    <>
      {/* Left: a blue sphere */}
      <mesh position={[-2, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>

      {/* Right: a shiny pink box */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color="hotpink"
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* You always need a light for meshStandardMaterial */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </>
  )
}`
      },
      {
        type: "insight",
        title: "Why Your Box Was Black",
        content: `In your app/page.tsx you had:  <meshStandardMaterial color="orange" />

meshStandardMaterial is physically-based — it simulates how light hits a surface. If there's no light, the surface reflects nothing and appears black. You correctly added <ambientLight intensity={2} />.

Key rule: meshStandardMaterial needs lights. meshBasicMaterial doesn't — it ignores all lights and renders at constant brightness. Use basic for neon/emissive effects; use standard for everything realistic.`
      },
      {
        type: "awwwards",
        content: "Awwwards sites obsess over material properties. The difference between metalness=0.9, roughness=0.05 (chrome) and metalness=0, roughness=0.9 (chalk matte) is enormous visually. We'll spend an entire phase on materials — for now, start experimenting with those two sliders."
      },
      {
        type: "traps",
        items: [
          { title: "Rotation is in radians, not degrees", desc: "Math.PI = 180°. Math.PI/2 = 90°. Math.PI*2 = full 360° rotation. Writing rotation={[0, 90, 0]} gives you 90 radians (~5156°), not 90 degrees." },
          { title: "args must be an array", desc: "The args prop maps to constructor arguments. <boxGeometry args={[1, 1, 1]} /> ✅ — NOT args={1, 1, 1} or args='1 1 1'. Always an array." },
          { title: "One geometry, one material per mesh", desc: "A mesh has exactly one geometry and one material. For multi-material objects (like different parts of a 3D model), you use groups with multiple meshes." },
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Basic Shapes",
    tag: "PRIMITIVES",
    tagColor: "#F59E0B",
    duration: "20 min",
    sections: [
      {
        type: "explainer",
        title: "Your Geometry Toolkit",
        content: `Three.js ships with built-in geometry primitives — every one of them works as a JSX tag in R3F. These are your building blocks for prototyping and hero shapes alike.

The args prop always maps to the Three.js class constructor arguments. The easiest way to know the args: mentally replace the JSX tag with new THREE.[GeometryName]() and check the Three.js docs.

Segment count is the hidden quality dial. More segments = smoother curves but more triangles = more GPU work. A sphere at 8 segments looks blocky. At 32 it looks round. At 128 it's silky but expensive. Choose based on how close the camera gets.`
      },
      {
        type: "code",
        title: "All Core Primitives",
        code: `// ── BOX ───────────────────────────────────────────────
// args: [width, height, depth, widthSegs, heightSegs, depthSegs]
<boxGeometry args={[1, 1, 1]} />

// ── SPHERE ─────────────────────────────────────────────
// args: [radius, widthSegments, heightSegments]
// More segments = smoother. 8=blocky, 32=smooth, 64=silky
<sphereGeometry args={[0.7, 32, 32]} />

// ── PLANE ──────────────────────────────────────────────
// args: [width, height, widthSegments, heightSegments]
// Flat 2D surface. Rotate it to be a floor:
<mesh rotation={[-Math.PI / 2, 0, 0]}>
  <planeGeometry args={[10, 10]} />
</mesh>

// ── TORUS (donut) ──────────────────────────────────────
// args: [radius, tube, radialSegments, tubularSegments]
<torusGeometry args={[0.7, 0.25, 16, 100]} />

// ── TORUS KNOT ─────────────────────────────────────────
// args: [radius, tube, tubularSegs, radialSegs, p, q]
// p and q change the topology — experiment!
// p=2,q=3 (default), p=3,q=5, p=5,q=3 all look different
<torusKnotGeometry args={[0.6, 0.18, 128, 32]} />

// ── CYLINDER ───────────────────────────────────────────
// args: [radiusTop, radiusBottom, height, radialSegments]
// Make radiusTop=0 for a cone
<cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />

// ── CONE ───────────────────────────────────────────────
<coneGeometry args={[0.5, 1.5, 32]} />

// ── RING ───────────────────────────────────────────────
<ringGeometry args={[0.5, 1.0, 32]} />


// ── Full demo scene ────────────────────────────────────
function ShapeDemo() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={2} />

      {/* Torus knot — the classic 'I know 3D' hero shape */}
      <mesh position={[0, 0, 0]}>
        <torusKnotGeometry args={[0.7, 0.2, 200, 32]} />
        <meshStandardMaterial
          color="#8B5CF6"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0D1117" />
      </mesh>
    </>
  )
}`
      },
      {
        type: "insight",
        title: "Segments: The Quality vs Performance Dial",
        content: `This is a decision you make on every curved shape:

- SphereGeometry [r, 8, 8]   → faceted, low-poly, stylized look (intentional or not)
- SphereGeometry [r, 32, 32] → smooth, realistic sphere
- SphereGeometry [r, 128, 128] → extremely smooth, but 16x more triangles than 32/32

Rule of thumb: 32 is the sweet spot for hero objects. Use 16 for secondary shapes. Use 64+ only for ultra-close hero details where you'd actually see the difference.`
      },
      {
        type: "awwwards",
        content: "TorusKnot is the signature shape on dozens of Awwwards WebGL showcases — it's complex enough to look impressive while being a single geometry. High-segment spheres and custom BufferGeometry (built in Blender) are used for hero visuals. The Drei library also has <RoundedBox> which gives boxes with beveled corners — common in modern 3D/UI hybrid sites."
      },
      {
        type: "traps",
        items: [
          { title: "PlaneGeometry faces one direction", desc: "Planes are single-sided by default. If you rotate one to be a floor and the camera looks at it from below, it'll be invisible. Add side={THREE.DoubleSide} to the material to fix this." },
          { title: "TorusKnot's p and q params", desc: "The 5th and 6th args of torusKnotGeometry control the knot topology. Default is p=2, q=3. Changing these creates entirely different shapes — experiment with p=3,q=5 or p=5,q=2." },
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Lights",
    tag: "CRITICAL",
    tagColor: "#EF4444",
    duration: "30 min",
    sections: [
      {
        type: "explainer",
        title: "Lighting is the Biggest Quality Factor in 3D",
        content: `If materials are the surface of an object, lights are what makes them visible. Without lights, meshStandardMaterial renders completely black. But beyond the basics, lighting is what separates amateur 3D from Awwwards-level work.

Look at any Awwwards 3D site. The first thing you notice is depth, drama, and a cinematic feel. That's almost entirely lighting. The right combination of key, fill, and rim lights creates objects that pop from their background, have tangible weight, and exist in a real environment.

Three.js has 5 light types. Each has a distinct role.`
      },
      {
        type: "lights-grid",
        lights: [
          { name: "AmbientLight", color: "#6B7280", tag: "Always use", desc: "Illuminates everything equally from all directions, no shadows. Acts as a base fill — prevents shadows from going 100% black. Use at low intensity (0.1–0.3)." },
          { name: "DirectionalLight", color: "#FCD34D", tag: "Main light", desc: "Parallel rays, like sunlight from infinite distance. Casts hard shadows. Position matters — it determines where shadows fall. Your primary illumination source." },
          { name: "PointLight", color: "#FB923C", tag: "Practical", desc: "Radiates from a single point in all directions, like a light bulb. Has distance and decay. Great for colored accent lights and in-scene light sources." },
          { name: "SpotLight", color: "#60A5FA", tag: "Dramatic", desc: "A cone of light from a point toward a target. angle controls cone width, penumbra controls edge softness. For dramatic product highlights and focused areas." },
          { name: "HemisphereLight", color: "#34D399", tag: "Outdoor base", desc: "Gradient from a sky color (above) to a ground color (below). Mimics outdoor ambient light. Great for replacing AmbientLight in exterior scenes." },
        ]
      },
      {
        type: "code",
        title: "3-Point Lighting — The Awwwards Standard",
        code: `// 3-Point Lighting: the foundation of ALL studio photography
// and the standard setup on Awwwards 3D sites.

function Lights() {
  return (
    <>
      {/* 1. KEY LIGHT — primary illumination, upper-right.
          This is where most of the light comes from.
          Always the brightest. */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}  // Higher = sharper shadows
        shadow-camera-far={50}
      />

      {/* 2. FILL LIGHT — softens shadows on the unlit side.
          Opposite side from key, much less intense.
          Use a cool color (blue) to complement a warm key. */}
      <directionalLight
        position={[-5, 2, -5]}
        intensity={0.4}
        color="#4477FF"  // Cool blue fill
      />

      {/* 3. RIM LIGHT — behind/above the object.
          Creates a highlight edge that separates the
          object from the background. The pro touch. */}
      <pointLight
        position={[0, 5, -5]}
        intensity={1.5}
        color="#FF6B6B"  // Warm pink rim
        distance={20}
        decay={2}
      />

      {/* Ambient: keep black shadows from looking completely dead */}
      <ambientLight intensity={0.08} />
    </>
  )
}

// ── Minimal scene that actually renders ───────────────
function Scene() {
  return (
    <>
      <Lights />
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial metalness={0.8} roughness={0.2} />
      </mesh>
    </>
  )
}`
      },
      {
        type: "insight",
        title: "Colored Lights = Mood",
        content: `Pure white (#ffffff) lights look flat and technical. Colored lights are the mood dial.

Classic cinema: warm amber/orange key + cool blue fill = the "movie" look
Sci-fi: cyan/teal key + violet fill + white rim
Dramatic: single warm key from below + no fill (extreme contrast)
Natural: white key + slight blue ambient (sky simulation)

Your butterfly project uses a white spotLight at the top. Try adding a second directionalLight with color="#330066" at position [-5, 2, -5] and watch how the depth and mood change immediately.`
      },
      {
        type: "awwwards",
        content: "Awwwards sites use 3-point lighting as the baseline, then layer colored fill and rim lights for brand identity. The subtle blue fill on a dark product shot — the barely-visible edge highlight — is what creates that premium depth. You won't see it if you're looking for it; you feel it when it's absent."
      },
      {
        type: "traps",
        items: [
          { title: "shadows need 3 things", desc: "<Canvas shadows> on the Canvas + castShadow on the light + castShadow/receiveShadow on the meshes. Miss any one and shadows won't appear. It's the most common shadow debugging issue." },
          { title: "shadow-mapSize performance", desc: "shadow-mapSize={[2048, 2048]} looks great but is expensive. On mobile, use 512 or 1024. The visual difference between 1024 and 2048 is subtle; the performance cost is real." },
          { title: "PointLight vs SpotLight for shadows", desc: "PointLight shadow casting is expensive (renders 6 faces of a cube map). SpotLight is much cheaper for the same effect. Prefer SpotLight when casting shadows from a 'practical' light source." },
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Camera Basics",
    tag: "CAMERA",
    tagColor: "#A78BFA",
    duration: "20 min",
    sections: [
      {
        type: "explainer",
        title: "The Camera is Your Eye in 3D Space",
        content: `The camera defines what you see — its position, orientation, and field of view determine the entire framing of your scene. R3F creates a PerspectiveCamera by default with sane defaults, but understanding camera properties is the difference between competent 3D and cinematic 3D.

Camera work is cinematography. Directors use lens choice, camera angle, and focal length intentionally to control how viewers feel. Wide lenses (high FOV) create a sense of space and energy. Telephoto lenses (low FOV) compress depth and create intimacy or drama. The same principles apply to your 3D canvas.`
      },
      {
        type: "fov-visual",
        items: [
          { fov: "20–35°", label: "Telephoto", desc: "Compressed depth. Premium, intimate, product-focus. The Awwwards look.", color: "#06B6D4" },
          { fov: "45°", label: "Natural", desc: "How the human eye perceives. Safe, balanced default.", color: "#8B5CF6" },
          { fov: "75–90°", label: "Wide Angle", desc: "Dramatic, environmental. Use intentionally — edges distort.", color: "#F59E0B" },
        ]
      },
      {
        type: "code",
        title: "Camera Setup — Three Ways",
        code: `import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'

// ── 1. Via Canvas props (simplest) ─────────────────────
<Canvas
  camera={{
    fov: 45,          // Field of view in degrees
    near: 0.1,        // Near clipping plane — objects closer: invisible
    far: 1000,        // Far clip — objects further: invisible
    position: [0, 2, 8], // Start position [x, y, z]
  }}
>

// ── 2. Drei's PerspectiveCamera (explicit, scriptable) ─
function Scene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault     // Replaces the Canvas default camera
        fov={45}
        near={0.1}
        far={1000}
        position={[0, 2, 8]}
      />
    </>
  )
}

// ── 3. Via useThree hook (live access anywhere) ────────
function CameraController() {
  const { camera } = useThree()

  // camera IS the THREE.PerspectiveCamera object
  // Modify it directly — changes take effect immediately
  useEffect(() => {
    camera.fov = 35
    camera.updateProjectionMatrix() // Required after changing fov!
    camera.position.set(0, 3, 10)
    camera.lookAt(0, 0, 0)
  }, [])

  return null
}

// ── Camera position and axes ───────────────────────────
// X-axis: left (negative) → right (positive)
// Y-axis: down (negative) → up (positive)
// Z-axis: into screen (negative) → toward viewer (positive)
//
// camera at position=[0, 0, 5] is:
//   - centered horizontally
//   - at ground level vertically
//   - 5 units in front of the origin, facing origin
//
// camera at position=[3, 2, 8]:
//   - slightly right
//   - slightly above
//   - further back — wider view of the scene`
      },
      {
        type: "insight",
        title: "Your Current FOV and Why to Change It",
        content: `Your app/page.tsx has camera={{ position: [0, 0, 5], fov: 75 }}.

fov: 75 is wide — you can see a lot, but everything looks slightly distorted at the edges and the scene feels amateur if not intentional.

Change it to fov: 45 and move the camera back: position: [0, 1, 8]. The box will fill the frame similarly, but the background will compress and the scene will feel more premium and cinematic.

This single change — switching from a wide to a telephoto framing — is visible on almost every Awwwards site. It's a matter of taste, not rules, but the tendency toward lower FOV in premium work is consistent.`
      },
      {
        type: "awwwards",
        content: "Awwwards sites typically use FOV between 25–50°. That compression is subtle but creates a 'lens-like' quality that makes the scene feel designed and intentional rather than defaulted. Study award-winning sites: the camera is almost never at 75° unless they're deliberately using a GoPro/fisheye aesthetic."
      },
      {
        type: "traps",
        items: [
          { title: "updateProjectionMatrix() after fov change", desc: "If you modify camera.fov directly via useThree, you MUST call camera.updateProjectionMatrix() afterward. Without it, the scene renders with the old projection and the change has no effect." },
          { title: "near/far clipping", desc: "Setting near too large (like near: 1) clips objects that are close to the camera. Setting far too small clips distant objects. The range matters — objects outside [near, far] are invisible." },
          { title: "Camera Y is up, not Z", desc: "In Three.js, the Y-axis is up. This is different from some 3D software (like Blender in camera view which uses Z-up). camera.position = [0, 5, 0] puts the camera 5 units above the origin, looking straight down if not corrected with lookAt." },
        ]
      }
    ]
  }
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function CodeBlock({ code, title }: { code: any; title?: any }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div style={{ marginBottom: 28 }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#06B6D4", letterSpacing: "0.1em", textTransform: "uppercase" }}>▸ {title}</span>
        </div>
      )}
      <div style={{ position: "relative" }}>
        <button onClick={copy} style={{
          position: "absolute", top: 10, right: 10,
          background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
          border: copied ? "1px solid rgba(34,197,94,0.3)" : "1px solid #1E293B",
          color: copied ? "#22C55E" : "#475569", borderRadius: 4,
          padding: "3px 10px", fontSize: 10, cursor: "pointer", zIndex: 2
        }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
        <pre style={{
          background: "#010409", margin: 0, padding: "20px 20px 20px 20px",
          borderRadius: 8, fontSize: 12, lineHeight: 1.8, overflowX: "auto",
          border: "1px solid #1a2030", maxHeight: 480,
          fontFamily: "'JetBrains Mono','Menlo','Monaco','Courier New',monospace",
          color: "#CBD5E1",
        }} dangerouslySetInnerHTML={{ __html: hl(code) }} />
      </div>
    </div>
  );
}

function Section({ section, phaseColor }: { section: any; phaseColor: any }) {
  if (section.type === "explainer") return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: phaseColor, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>▸ {section.title}</div>
      <div style={{ lineHeight: 1.85, color: "#94A3B8", fontSize: 14, whiteSpace: "pre-line" }}>{section.content}</div>
    </div>
  );

  if (section.type === "code") return <CodeBlock code={section.code} title={section.title} />;

  if (section.type === "install") return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#22C55E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>▸ Install</div>
      <pre style={{
        background: "#010409", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8,
        padding: "14px 18px", color: "#86EFAC", fontSize: 12, margin: 0,
        fontFamily: "'JetBrains Mono','Menlo',monospace"
      }}>$ {section.code}</pre>
    </div>
  );

  if (section.type === "comparison") return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[{ label: section.label1, code: section.code1, bdr: "rgba(239,68,68,0.2)" }, { label: section.label2, code: section.code2, bdr: "rgba(34,197,94,0.2)" }].map((side, i) => (
          <div key={i}>
            <div style={{ fontSize: 11, fontWeight: 600, color: i === 0 ? "#EF4444" : "#22C55E", marginBottom: 8 }}>{side.label}</div>
            <pre style={{
              background: "#010409", borderRadius: 8, padding: "14px", margin: 0,
              fontSize: 11, lineHeight: 1.75, overflowX: "auto", maxHeight: 360,
              border: `1px solid ${side.bdr}`,
              fontFamily: "'JetBrains Mono','Menlo',monospace", color: "#CBD5E1"
            }} dangerouslySetInnerHTML={{ __html: hl(side.code) }} />
          </div>
        ))}
      </div>
    </div>
  );

  if (section.type === "stack") return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: phaseColor, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>▸ {section.title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {section.items.map((item: any, i: number) => (
          <div key={i} style={{
            display: "flex", gap: 14, padding: "14px 16px", borderRadius: 8,
            background: "#0D1117", border: `1px solid ${item.color}22`,
            borderLeft: `3px solid ${item.color}`,
          }}>
            <div style={{ flexShrink: 0, paddingTop: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: "monospace" }}>{item.name}</span>
              <span style={{ marginLeft: 8, fontSize: 9, color: "#374151", background: "#161B22", padding: "1px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.badge}</span>
            </div>
            <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (section.type === "lights-grid") return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: phaseColor, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>▸ Five Light Types</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {section.lights.map((light: any, i: number) => (
          <div key={i} style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            padding: "12px 16px", borderRadius: 8, background: "#0D1117",
            border: `1px solid ${light.color}22`, borderLeft: `3px solid ${light.color}`,
          }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: light.color, flexShrink: 0, marginTop: 2, boxShadow: `0 0 8px ${light.color}88` }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", fontFamily: "monospace" }}>{light.name}</span>
                <span style={{ fontSize: 9, color: light.color, background: `${light.color}18`, border: `1px solid ${light.color}30`, padding: "1px 6px", borderRadius: 3 }}>{light.tag}</span>
              </div>
              <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{light.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (section.type === "fov-visual") return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: phaseColor, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>▸ Field of View — The Cinematic Dial</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {section.items.map((item: any, i: number) => (
          <div key={i} style={{
            padding: "16px", borderRadius: 8, background: "#0D1117",
            border: `1px solid ${item.color}30`, textAlign: "center"
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: item.color, fontFamily: "monospace", marginBottom: 4 }}>{item.fov}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#E2E8F0", marginBottom: 6 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (section.type === "insight") return (
    <div style={{
      marginBottom: 28, padding: "14px 18px", borderRadius: 8,
      background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)"
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>▸ {section.title}</div>
      <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.75, whiteSpace: "pre-line" }}>{section.content}</div>
    </div>
  );

  if (section.type === "awwwards") return (
    <div style={{
      marginBottom: 28, padding: "14px 18px", borderRadius: 8,
      background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.18)",
      display: "flex", gap: 12, alignItems: "flex-start"
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>🏆</span>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#FBBF24", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Awwwards Context</div>
        <div style={{ fontSize: 13, color: "#B45309", lineHeight: 1.75 }}>{section.content}</div>
      </div>
    </div>
  );

  if (section.type === "traps") return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>▸ Common Traps</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {section.items.map((trap: any, i: number) => (
          <div key={i} style={{
            padding: "12px 16px", borderRadius: 8, background: "#0D1117",
            border: "1px solid rgba(239,68,68,0.15)", display: "flex", gap: 12
          }}>
            <span style={{ color: "#EF4444", fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#FCA5A5", marginBottom: 4 }}>{trap.title}</div>
              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{trap.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function Phase1Foundations() {
  const [activeId, setActiveId] = useState(1);
  const [completed, setCompleted] = useState(new Set());
  const topic = TOPICS.find(t => t.id === activeId)!;
  const idx = TOPICS.findIndex(t => t.id === activeId);
  const prev = TOPICS[idx - 1];
  const next = TOPICS[idx + 1];

  const toggleDone = (id: any) => {
    setCompleted(c => {
      const n = new Set(c); n.has(id) ? n.delete(id) : n.add(id); return n;
    });
  };

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      background: "#050810", color: "#CBD5E1",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <div style={{
        width: 260, flexShrink: 0, background: "#080D18",
        borderRight: "1px solid #111827", display: "flex", flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #111827" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16
            }}>✦</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#F1F5F9", letterSpacing: "-0.03em" }}>Phase 1</div>
              <div style={{ fontSize: 10, color: "#374151", letterSpacing: "0.05em", textTransform: "uppercase" }}>Core Foundations</div>
            </div>
          </div>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, height: 3, background: "#111827", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${(completed.size / TOPICS.length) * 100}%`,
                height: "100%", borderRadius: 3,
                background: "linear-gradient(90deg, #06B6D4, #8B5CF6)",
                transition: "width 0.4s"
              }} />
            </div>
            <span style={{ fontSize: 10, color: "#374151", fontVariantNumeric: "tabular-nums" }}>
              {completed.size}/{TOPICS.length}
            </span>
          </div>
        </div>

        {/* Topic List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {TOPICS.map((t, i) => {
            const isActive = t.id === activeId;
            const isDone = completed.has(t.id);
            return (
              <button key={t.id} onClick={() => setActiveId(t.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 16px", background: isActive ? "rgba(6,182,212,0.07)" : "none",
                border: "none", borderLeft: isActive ? "2px solid #06B6D4" : "2px solid transparent",
                cursor: "pointer", textAlign: "left",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isDone ? "rgba(34,197,94,0.15)" : isActive ? "rgba(6,182,212,0.12)" : "#111827",
                  border: isDone ? "1px solid rgba(34,197,94,0.3)" : isActive ? "1px solid rgba(6,182,212,0.3)" : "1px solid #1E293B",
                  fontSize: 9, fontWeight: 700,
                  color: isDone ? "#22C55E" : isActive ? "#06B6D4" : "#374151",
                }}>
                  {isDone ? "✓" : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: isActive ? "#F1F5F9" : isDone ? "#475569" : "#64748B", fontWeight: isActive ? 600 : 400, lineHeight: 1.3 }}>{t.title}</div>
                  <div style={{ fontSize: 9, color: "#1F2937", marginTop: 2 }}>{t.duration}</div>
                </div>
                <span style={{
                  fontSize: 8, color: t.tagColor, background: `${t.tagColor}15`,
                  border: `1px solid ${t.tagColor}30`, padding: "1px 5px", borderRadius: 3,
                  fontWeight: 700, letterSpacing: "0.05em", flexShrink: 0
                }}>{t.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #111827" }}>
          <div style={{ fontSize: 10, color: "#1F2937", lineHeight: 1.5 }}>
            Topics 1–6 of 51 · R3F → Drei → GSAP → Awwwards
          </div>
        </div>
      </div>

      {/* ── MAIN ────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", scrollBehavior: "smooth" }}>

        {/* Topic Header */}
        <div style={{
          padding: "20px 36px",
          borderBottom: "1px solid #111827",
          background: "#080D18",
          position: "sticky", top: 0, zIndex: 10,
          display: "flex", alignItems: "center", gap: 12
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "4px 10px", borderRadius: 4,
            background: `${topic.tagColor}18`, color: topic.tagColor,
            border: `1px solid ${topic.tagColor}30`
          }}>{topic.tag}</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.03em", flex: 1 }}>
            {idx + 1}. {topic.title}
          </span>
          <span style={{ fontSize: 11, color: "#374151" }}>⏱ {topic.duration}</span>
          <button onClick={() => toggleDone(topic.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
            borderRadius: 6, cursor: "pointer", fontSize: 11, fontWeight: 600,
            background: completed.has(topic.id) ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)",
            border: completed.has(topic.id) ? "1px solid rgba(34,197,94,0.3)" : "1px solid #1E293B",
            color: completed.has(topic.id) ? "#22C55E" : "#475569",
          }}>
            {completed.has(topic.id) ? "✓ Completed" : "Mark Done"}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "32px 36px", maxWidth: 860, margin: "0 auto" }}>
          {topic.sections.map((section, i) => (
            <Section key={i} section={section} phaseColor={topic.tagColor} />
          ))}

          {/* Navigation */}
          <div style={{
            display: "flex", gap: 12, marginTop: 40, paddingTop: 24,
            borderTop: "1px solid #111827"
          }}>
            {prev && (
              <button onClick={() => { setActiveId(prev.id); window.scrollTo(0, 0); }} style={{
                flex: 1, padding: "12px 18px", borderRadius: 8, cursor: "pointer",
                background: "#080D18", border: "1px solid #1E293B",
                color: "#64748B", textAlign: "left", display: "flex", flexDirection: "column", gap: 3
              }}>
                <span style={{ fontSize: 9, color: "#1F2937", textTransform: "uppercase", letterSpacing: "0.08em" }}>← Previous</span>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>{prev.title}</span>
              </button>
            )}
            {next && (
              <button onClick={() => { setActiveId(next.id); window.scrollTo(0, 0); }} style={{
                flex: 1, padding: "12px 18px", borderRadius: 8, cursor: "pointer",
                background: `${topic.tagColor}0C`, border: `1px solid ${topic.tagColor}25`,
                color: "#64748B", textAlign: "right", display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end"
              }}>
                <span style={{ fontSize: 9, color: topic.tagColor, textTransform: "uppercase", letterSpacing: "0.08em" }}>Next →</span>
                <span style={{ fontSize: 13, color: "#F1F5F9" }}>{next.title}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

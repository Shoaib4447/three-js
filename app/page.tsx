'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
// OrbitControls is a component that allows the user to rotate, zoom, and pan the camera around the scene using mouse or touch input. It is part of the @react-three/drei library, which provides useful helpers for react-three-fiber.

const Box = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    console.log('Box clicked');
    ref.current.scale.x *= 1.1;
  };

  const handlePointerOver = () => {
    console.log('Pointer over box');
    (ref.current.material as THREE.MeshStandardMaterial).color.set('blue');
    document.body.style.cursor = 'pointer'; // Change cursor to help when hovering over the box
    setHovered(true);
  };

  const handlePointerOut = () => {
    console.log('Pointer out of box');
    (ref.current.material as THREE.MeshStandardMaterial).color.set('red');
    document.body.style.cursor = 'default'; // Reset cursor when not hovering
    setHovered(false);
  };

  return (
    <mesh
      scale={hovered ? 1.5 : 1}
      ref={ref}
      onClick={handleClick} 
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}>
      <boxGeometry />
      <meshStandardMaterial color="red" roughness={0.1} metalness={0.1} emissive={2} wireframe={true} />
    </mesh>
  );
}


export default function Home() {
  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 5], fov: 15 }}
      style={{ width: '100vw', height: '100vh', display: 'block' }}
    >
      //Install react-three/drei for OrbitControls: npm install @react-three/drei
      <OrbitControls
      // enableZoom={true}           // Scroll to zoom
      // enablePan={true}           // Disable pan for product views
      // autoRotate={true}           // Auto spin
      // autoRotateSpeed={16}       // Gentle auto-rotation
      // enableDamping={true}        // Smooth inertia (default: true)
      // dampingFactor={0.05}        // Lower = more lag/inertia
      // minPolarAngle={Math.PI / 4} // Limit — can't go fully above
      // maxPolarAngle={Math.PI / 2} // Limit — can't go below floor
      // minDistance={10}             // Minimum zoom
      // maxDistance={20}            // Maximum zoom
      // target={[1, 0, 0]}          // Center of rotation
      />

      {/* Pointer Events (Click and drag to rotate, scroll to zoom, right-click and drag to pan) */}



      <ambientLight intensity={1} />
      <Box />
    </Canvas>
  )
}

8
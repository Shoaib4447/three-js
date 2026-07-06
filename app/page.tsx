'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// Raycasting is how R3F determines which 3D object your mouse intersects. R3F handles it automatically for pointer events, but understanding it enables advanced interactions.

const Box = ({ color, position }: { color: string; position: [number, number, number] }) => {
  const ref = useRef<THREE.Mesh>(null!);


  return (
    <mesh position={position} onClick={() => console.log(`${color} Box clicked! position: ${position}`)} >
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.1} emissive={2}  />
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

      />

      {/* Pointer Events (Click and drag to rotate, scroll to zoom, right-click and drag to pan) */}
      <ambientLight intensity={1} />
      <Box color="red" position={[-1, 0, 0]} />
      <Box color="blue" position={[1, 0, 0]} />
    </Canvas>
  )
}

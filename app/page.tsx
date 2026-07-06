'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

// glb vs gltf: glb is a binary format, while gltf is a JSON format. glb is more efficient for transmission and loading, while gltf is more human-readable and easier to edit.

const Model = () => {
  const { scene, nodes, materials } = useGLTF('/models/car.glb', true);
  return <primitive object={scene} scale={[1, 1, 1]} position={[0, -1, 0]} rotation={[0, Math.PI, 0]}/>;
};


const Box = ({ color, position }: { color: string; position: [number, number, number] }) => {
  return (
    <mesh position={position}  >
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.1} metalness={0.1} emissive={2} />
    </mesh>
  );
}


export default function Home() {
  return (
    <Canvas
    >
      //Install react-three/drei for OrbitControls: npm install @react-three/drei
      <OrbitControls />

      <Suspense fallback={null}>
        <Model />
      </Suspense>

      {/* Pointer Events (Click and drag to rotate, scroll to zoom, right-click and drag to pan) */}
      <ambientLight intensity={1} />
    </Canvas>
  )
}

'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

// glb vs gltf: glb is a binary format, while gltf is a JSON format. glb is more efficient for transmission and loading, while gltf is more human-readable and easier to edit.

const Model = () => {
  const { scene } = useGLTF('/models/car.glb', true);
  const [colorMap, normalMap, roughnessMap, metalnessMap, aoMap] = useTexture([
    '/textures/metal/metal_0071_color_1k.jpg',
    '/textures/metal/metal_0071_normal_opengl_1k.png',
    '/textures/metal/metal_0071_roughness_1k.jpg',
    '/textures/metal/metal_0071_metallic_1k.jpg',
    '/textures/metal/metal_0071_ao_1k.jpg',
  ]);

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.material = new THREE.MeshStandardMaterial({
        map: colorMap,
        normalMap: normalMap,
        roughnessMap: roughnessMap,
        metalnessMap: metalnessMap,
        aoMap: aoMap,
        aoMapIntensity: 1,

      });
    }
  });

  return <primitive object={scene} scale={[1, 1, 1]} position={[0, -1, 0]} rotation={[0, Math.PI, 0]} />;
};


const Box = ({ color, position }: { color: string; position: [number, number, number] }) => {
  const texture = useTexture('/textures/metal/metal_0071_color_1k.jpg');
  const texture2 = useTexture('/textures/metal/metal_0071_normal_opengl_1k.png');
  const metalnessMap = useTexture('/textures/metal/metal_0071_metallic_1k.jpg');
  const aoMap = useTexture('/textures/metal/metal_0071_ao_1k.jpg');
  const roughnessMap = useTexture('/textures/metal/metal_0071_roughness_1k.jpg');
  return (
    <mesh position={position}  >
      <boxGeometry />
      <meshStandardMaterial color='red' roughness={0.2} metalness={0.1} map={texture} normalMap={texture2} metalnessMap={metalnessMap} aoMap={aoMap} aoMapIntensity={1} roughnessMap={roughnessMap} />
    </mesh>
  );
}


export default function Home() {
  return (
    <Canvas

    >
      //Install react-three/drei for OrbitControls: npm install @react-three/drei
      <OrbitControls />


      <Box color="red" position={[3, 0, 0]} />

      {/* Pointer Events (Click and drag to rotate, scroll to zoom, right-click and drag to pan) */}
      <ambientLight intensity={2} />
      <directionalLight intensity={0.1} position={[10, 1, 0]} />

    </Canvas>
  )
}

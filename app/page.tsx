'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, Environment } from '@react-three/drei';
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
  // const texture = useTexture('/textures/metal/metal_0071_color_1k.jpg');
  // const texture2 = useTexture('/textures/metal/metal_0071_normal_opengl_1k.png');
  // const metalnessMap = useTexture('/textures/metal/metal_0071_metallic_1k.jpg');
  // const aoMap = useTexture('/textures/metal/metal_0071_ao_1k.jpg');
  // const roughnessMap = useTexture('/textures/metal/metal_0071_roughness_1k.jpg');
  return (
    <mesh position={position} castShadow >
      <sphereGeometry />
      <meshStandardMaterial color={color} roughness={0} metalness={1} />
    </mesh>
  );
}

const Plane = () => {
  return (
    <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}




export default function Home() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      //Install react-three/drei for OrbitControls: npm install @react-three/drei



      <Box color='white' position={[0, 0, 1]} />
      {/* <Plane /> */}

      {/* Pointer Events (Click and drag to rotate, scroll to zoom, right-click and drag to pan) */}
      <ambientLight intensity={0.1} />
      <directionalLight
        intensity={4}
        castShadow
        position={[2, 4, 2]}
      />
      {/* <spotLight intensity={0.1} position={[0, 0, 0]} angle={1}  /> */}
      <OrbitControls />
      <Environment files={'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/modern_evening_street_1k.hdr'} background />
    </Canvas>
  )
}

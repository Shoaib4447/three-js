'use client';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { Suspense } from 'react';

const Model = () => {
  const gltf = useLoader(GLTFLoader, '/models/car.glb');
  return <primitive object={gltf.scene} />;
};


export default function Home() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 75 }}
      >
        <ambientLight intensity={2} />
       
        <OrbitControls />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        
      </Canvas>
    </>
  )
}

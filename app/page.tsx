'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls} from '@react-three/drei';
import React, { useEffect } from 'react';
import * as THREE from 'three';




const InstancingBoxeds = () => {
  console.log('InstancingBoxeds rendered');
  const count = 1000;
  const meshRef = React.useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const temp = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      temp.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      temp.updateMatrix();
      meshRef.current?.setMatrixAt(i, temp.matrix);
    }
    if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color='red' metalness={8}/>
    </instancedMesh>
  )
}
export default function Home() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 75 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <InstancingBoxeds />
        <OrbitControls />
        {/* <Environment files={'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/modern_evening_street_1k.hdr'} blur={0} background /> */}
      </Canvas>
    </>
  )
}

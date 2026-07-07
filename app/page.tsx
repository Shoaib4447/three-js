'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';


const Box = ({ color, position }: { color: string, position: [number, number, number] }) => {

  const geometry = useMemo(() => {
    const geom = new THREE.BoxGeometry(1, 1, 1);
    return geom;
  }, []);
  return (
    <>

      <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />
      <ambientLight intensity={0.1} />
      <mesh position={position} geometry={geometry} >
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  )
}

export default function Home() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      <Box color={'red'} position={[0, 0, 0]} />
      <Box color={'green'} position={[2, 0, 0]} />
      <Box color={'blue'} position={[-2, 0, 0]} />
      {/* <spotLight intensity={0.1} position={[0, 0, 0]} angle={1}  /> */}
      <OrbitControls />
      <Environment files={'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/modern_evening_street_1k.hdr'} background />
    </Canvas>
  )
}

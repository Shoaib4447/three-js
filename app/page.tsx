'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, memo, useState } from 'react';
import * as THREE from 'three';


const Box = memo(function Box({ color }: { color: string }) {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
});

export default function Home() {
  const [count, setCount] = useState(1);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Click me {count}</button>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 75 }}
      >
        <Box color={'red'} />
        <ambientLight intensity={2} />
        {/* <spotLight intensity={0.1} position={[0, 0, 0]} angle={1}  /> */}
        <OrbitControls />
        {/* <Environment files={'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/modern_evening_street_1k.hdr'} blur={0} background /> */}
      </Canvas>
    </>
  )
}

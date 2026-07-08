'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, DepthOfField, BrightnessContrast } from '@react-three/postprocessing';
import React, { useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const Box = () => {
  const boxRef = React.useRef<THREE.Mesh>(null);
  useEffect(() => {
    if (boxRef.current) {
      gsap.to(boxRef.current.position,
        {
          x: 2,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
    }
  }, []);

  return (
    <mesh ref={boxRef} >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};


const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}


export default function Home() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 75 }}
      >
        <ambientLight intensity={2} />
        <OrbitControls />
        <Box />
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={6} mipmapBlur />
          {/* <ChromaticAberration
            offset={[0.002, 0.002]}
          /> */}
          {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}

          {/* <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={0.5}
          /> */}

          {/* List all effects */}
          <BrightnessContrast brightness={0.1} contrast={0.1} />
        </EffectComposer>
      </Canvas>
    </>
  )
}

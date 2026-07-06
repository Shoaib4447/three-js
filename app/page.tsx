'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const Box = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<any>(null);

  {/*
    useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      //  USE SIN FUNCTION TO CREATE A SMOOTH UP AND DOWN MOVEMENT
      meshRef.current.position.y = Math.sin(Date.now() * 0.002) * 1.5; // Rotate around Y-axis
      //  Pulse the scale of the box using a sine function
      const scale = Math.sin(Date.now() * 0.002) * 0.5 + 1; // Scale oscillates between 0.5 and 1.5
      meshRef.current.scale.set(scale, scale, scale);
    }
  });
*/}

  // Lerp animation 1 example: 
  {/* useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate the box around the Y-axis
      // meshRef.current.rotation.y += delta * 5; // Adjust rotation speed as needed
      // console.log('delta', delta);
      const targetX = state.mouse.x * 7; // Scale mouse X position to a suitable range
      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.1; // Smoothly interpolate to target position


    }
  });
  */}

  // Lerp animation 2 example: 
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate the box around the Y-axis
      const t = state.clock.elapsedTime; 
      meshRef.current.rotation.y = t * 0.5; // Rotate at a constant speed

      // Smoothly interpolate the box's position based on mouse movement
      // const targetX = state.mouse.x * 7;
      // meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.1; // Smoothly interpolate to target position
    }
  });



  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}


export default function Home() {
  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 5], fov: 15 }}
    >
      {/* <directionalLight position={[1, 2, 3]} intensity={1.5} /> */}
      <ambientLight intensity={2} />
      <Box position={[0, 0, 0]} />
      <Box position={[2, 0, 0]} />
      <Box position={[-2, 0, 0]} />
    </Canvas>
  )
}

8
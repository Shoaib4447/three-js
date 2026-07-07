'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';


const Scene = () => {
  const cameraRef = useRef([0, 2, 5]);
  useFrame((state, delta) => {
    // You can add animations or interactions here if needed
    const time = state.clock.elapsedTime;

    if (time < 3) {
      cameraRef.current = [0, 2, 5];
    } else if (time < 6) {
      cameraRef.current = [5, 2, 0];
    } else if (time < 9) {
      cameraRef.current = [0, 2, -5];
    } else {
      cameraRef.current = [-5, 2, 0];
    }
    state.camera.position.x += (cameraRef.current[0] - state.camera.position.x) * delta;
    state.camera.position.y += (cameraRef.current[1] - state.camera.position.y) * delta;
    state.camera.position.z += (cameraRef.current[2] - state.camera.position.z) * delta;


    state.camera.lookAt(0, 0, 0);
  });



  return (
    <>

      <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />
      <ambientLight intensity={0.1} />
      <group>
        <mesh position={[1, 0, 0]} >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-1, 0, 2]} >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="purple" />
        </mesh>
      </group>
    </>
  )
}

export default function Home() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      <Scene />
      {/* <spotLight intensity={0.1} position={[0, 0, 0]} angle={1}  /> */}
      <OrbitControls />
      <Environment files={'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/modern_evening_street_1k.hdr'} background />
    </Canvas>
  )
}

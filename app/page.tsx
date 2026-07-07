'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls,Stats , AdaptiveDpr, AdaptiveEvents, BakeShadows} from '@react-three/drei';


const Box = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};


export default function Home() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 4], fov: 75 }}
      >
        <Stats />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <ambientLight intensity={2} />
        <OrbitControls />
        <Box /> 
      </Canvas>
    </>
  )
}

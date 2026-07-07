'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky,Fog} from '@react-three/drei';


const Box = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};


const Plane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="green" />
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
        <color attach="background" args={['#87CEEB']} />
        <Sky sunPosition={[50, 20, 50]} />
       <fog attach="fog" args={['#87CEEB', 1, 10]} />
        <ambientLight intensity={2} />
        <OrbitControls />
        <Box /> 
        <Plane />
      </Canvas>
    </>
  )
}

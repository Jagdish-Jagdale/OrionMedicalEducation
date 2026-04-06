import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
  const earthRef = useRef();
  
  // High-density natural Earth texture
  const texture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
  
  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2.8, 64, 64]} />
      <meshStandardMaterial 
        map={texture} 
        metalness={0} 
        roughness={1}
        // Maximize vibrance to match reference image (Self-Illuminated Atlas)
        emissive={new THREE.Color('#ffffff')}
        emissiveMap={texture}
        emissiveIntensity={0.8}
      />
    </mesh>
  );
};

const LoadMonitor = ({ onLoad }) => {
  React.useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);
  return null;
};

const Globe3D = ({ onLoad }) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8.2]} />
        
        {/* Maximum visibility Lighting */}
        <ambientLight intensity={1.5} /> 
        
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <pointLight position={[-10, 0, 10]} intensity={1} color="#ffffff" />

        <React.Suspense fallback={null}>
          <Earth />
          <LoadMonitor onLoad={onLoad} />
        </React.Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.5} 
        />
      </Canvas>
    </div>
  );
};

export default Globe3D;

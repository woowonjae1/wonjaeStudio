'use client';

import { FC, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";

interface AlbumMeshProps {
  imageSrc: string;
}

const AlbumMesh: FC<AlbumMeshProps> = ({ imageSrc }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imageSrc);

  useFrame(() => {
    if (meshRef.current) {
      // 添加平滑的旋转动画
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[3, 3]} />
      <meshBasicMaterial 
        map={texture} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

interface ThreeJSAlbumRendererProps {
  imageSrc: string;
}

const ThreeJSAlbumRenderer: FC<ThreeJSAlbumRendererProps> = ({ imageSrc }) => {
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={1.0} /> 
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <AlbumMesh imageSrc={imageSrc} />
      </Canvas>
    </div>
  );
};

export default ThreeJSAlbumRenderer;
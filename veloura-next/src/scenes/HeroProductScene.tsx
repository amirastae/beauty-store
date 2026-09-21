"use client";

import { ContactShadows, Environment, Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

function SerumBottle() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    group.current.rotation.x = state.pointer.y * 0.06;
    group.current.rotation.z = -0.04 + state.pointer.x * 0.035;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.18}>
      <group ref={group} rotation={[0, -0.25, -0.04]} position={[0, 0.05, 0]}>
        <mesh position={[0, 1.34, 0]} castShadow>
          <cylinderGeometry args={[0.67, 0.71, 0.75, 64]} />
          <meshPhysicalMaterial color="#302824" roughness={0.24} metalness={0.64} />
        </mesh>

        <mesh position={[0, 0.06, 0]} castShadow>
          <cylinderGeometry args={[0.92, 0.82, 1.95, 64]} />
          <meshPhysicalMaterial
            color="#d89580"
            roughness={0.16}
            metalness={0.05}
            transmission={0.24}
            thickness={1.6}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>

        <mesh position={[0, -0.93, 0]} castShadow>
          <cylinderGeometry args={[0.81, 0.74, 0.16, 64]} />
          <meshPhysicalMaterial color="#8f5547" roughness={0.25} metalness={0.16} />
        </mesh>

        <mesh position={[0, 0.12, 0.91]}>
          <planeGeometry args={[1.05, 0.62]} />
          <meshStandardMaterial color="#f5e7dd" roughness={0.82} />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroProductScene() {
  return (
    <Canvas
      dpr={[1, 1.65]}
      camera={{ position: [0, 0.25, 5.8], fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
      aria-hidden="true"
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={3.2} color="#fff3eb" castShadow />
      <pointLight position={[-4, 1, 3]} intensity={35} color="#d68975" />
      <pointLight position={[3, -2, 2]} intensity={18} color="#f3d0bd" />
      <SerumBottle />
      <ContactShadows position={[0, -1.17, 0]} opacity={0.32} scale={5} blur={2.6} far={3.2} />
      <Environment preset="studio" />
    </Canvas>
  );
}

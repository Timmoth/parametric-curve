import * as THREE from "three";
import { useRef, useMemo } from "react";
import { unmountComponentAtNode } from "react-dom";
import { createRoot, Root } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React from "react";
import fragmentShader from "./fragmentShader.glsl";
import vertexShader from "./vertexShader.glsl";
const ShaderPlane = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 1.0,
      },
      u_size: {
        value: new THREE.Vector2(size.width, size.height),
      },
      u_lines: {
        value: 1.0,
      },
      u_offset: {
        value: 1.0,
      },
    }),
    []
  );

  useThree((state) => {
    uniforms.u_size.value.set(state.size.width, state.size.height);

    if (mesh.current != undefined) {
      mesh.current.scale.x = state.viewport.width;
      mesh.current.scale.y = state.viewport.height;
    }
  });

  useFrame(({ camera, mouse }) => {
    uniforms.u_time.value += 0.01;
  });

  return (
    <mesh
      ref={mesh}
      scale={[viewport.width, viewport.height, 1]}
      onPointerMove={(e) => {
        e.stopPropagation();
        let x = e.x / size.width;
        let y = e.y / size.height;
        uniforms.u_lines.value = (x + 1) * 25 + 1;
        uniforms.u_offset.value = (y + 1) * 25 + 1;
      }}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export function Start() {
  createRoot(document.getElementById("root") as HTMLElement).render(
    <Canvas>
      <ShaderPlane />
    </Canvas>
  );
}

export function Stop() {
  unmountComponentAtNode(document.getElementById("root") as HTMLElement);
}

import { memo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Grid,
  Center,
  GizmoHelper,
  GizmoViewport,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Environment,
  useGLTF,
  Box,
} from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";

import { ComponentProps } from "react";
import { DragControls } from "./DragControls";

export default function App() {
  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });
  return (
    <Canvas
      shadows
      camera={{ position: [10, 12, 12], fov: 25 }}
    >
      <group position={[0, -0.5, 0]}>
        
        <Grid
          position={[0, -0.01, 0]}
          args={gridSize}
          {...gridConfig}
        />
        <DragControlsScene axisLock='x' />
      </group>
      <OrbitControls makeDefault />
      <Environment preset='city' />
      <GizmoHelper
        alignment='bottom-right'
        margin={[80, 80]}
      >
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor='white'
        />
      </GizmoHelper>
    </Canvas>
  );
}


const DragControlsScene = (props: ComponentProps<typeof DragControls>) => {
  const planes = [
    { axis: "x", normal: new THREE.Vector3(1, 0, 0), color: 0xff0000 }, // X-axis
    { axis: "y", normal: new THREE.Vector3(0, 1, 0), color: 0x00ff00 }, // Y-axis
    { axis: "z", normal: new THREE.Vector3(0, 0, 1), color: 0x0000ff }, // Z-axis
  ];
  const planeHelpers = planes
    .filter(({ axis }) => !props.axisLock || axis === props.axisLock)
    .map(({ normal, color }) => new THREE.PlaneHelper(new THREE.Plane(normal, 0), 5, color));

  return (
    <>
      {planeHelpers.map((planeHelper, index) => (
        <primitive
          key={index}
          object={planeHelper}
        />
      ))}
      <DragControls {...props}>
        <Box>
          <meshBasicMaterial
            attach='material'
            wireframe={false}
          />
        </Box>
      </DragControls>
    </>
  );
};

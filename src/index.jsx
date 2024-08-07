import "./css/style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { useControls  } from "leva";

import { getProject } from "@theatre/core";
import Particles from "./Patricles";

import {
  ScrollControls,
  Sky,
  useScroll,
  useGLTF,
  useAnimations,
  Html,
  Scroll,
  Loader,
  OrbitControls,
} from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
const root = ReactDOM.createRoot(document.querySelector("#root"));


    
root.render(
  <>
  
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 3000,
        position: [0,23,-23],
        
      }}
    >
     
      <color args={["#000000"]} attach={"background"} />
      <OrbitControls/>
     <Particles/>
    </Canvas>
  
  </>
);

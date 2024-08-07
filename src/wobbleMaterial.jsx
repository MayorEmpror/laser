import wobbleVertexShader from './shaders/wobble/vertex.glsl.js'
import wobbleFragmentShader from './shaders/wobble/fragment.glsl.js'
import CustomShaderMaterial from "three-custom-shader-material" ;
import { useFrame } from '@react-three/fiber';
import { extend } from "@react-three/fiber";
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { useRef } from "react"
import * as THREE from "three";
export default function WobbleMaterial(props) {
    extend(CustomShaderMaterial)
    const csmesh = useRef()
const colorA = '#120E29'
const colorB = '#120E29'
const Uniforms = {
  uTime: new THREE.Uniform(0),
  uPositionFrequency: new THREE.Uniform(0.8),
  uTimeFrequency: new THREE.Uniform(0.4),
  uStrength: new THREE.Uniform(0.3),
  uWarpPositionFrequency: new THREE.Uniform(0.38),
  uWarpTimeFrequency: new THREE.Uniform(0.12),
  uWarpStrength: new THREE.Uniform(1.7),
  uColorA: new THREE.Uniform(new THREE.Color(colorA)),
  uColorB: new THREE.Uniform(new THREE.Color(colorB))
}
let geometry = new THREE.IcosahedronGeometry(1.5, 100)
geometry = mergeVertices(geometry)
geometry.computeTangents()
useFrame((state,delta)=>{
    csmesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime() 
})
return (
<>
<mesh 
ref={csmesh}
geometry={geometry}
receiveShadow  castShadow
            position={props.position}
             rotation={props.rotation}
             scale={ props.scale }>

              <CustomShaderMaterial
               baseMaterial={ THREE.MeshPhysicalMaterial}
  vertexShader={ wobbleVertexShader}
  fragmentShader={ wobbleFragmentShader}
  uniforms={ Uniforms}
  silent={ true}
  // MeshPhysicalMaterial
  metalness={1}
  roughness={ 5}
  color={ '#ffffff'}
  transmission={ 0}
  ior={ 1.5}
  thickness={ 1.5}
  transparent={ true}
  wireframe={ false}
             ge />
          
            
        </mesh>
</>
)
}
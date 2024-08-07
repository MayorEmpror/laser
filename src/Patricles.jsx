import * as THREE from "three";
import particlesVertexShader from "./shaders/wobble/particles/vertex.glsl.js"
import particlesFragmentShader from "./shaders/wobble/particles/fragment.glsl.js";
import { useThree,useFrame } from "@react-three/fiber";
import { useRef ,forwardRef} from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from '@react-three/fiber'
import { EffectComposer, GodRays } from "@react-three/postprocessing";
import { MeshTransmissionMaterial ,Html} from "@react-three/drei";
import { useEffect, useState } from "react";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { TextureLoader, } from "three";

import { RGBELoader } from 'three/examples/jsm/Addons.js';
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Text,Text3D } from "@react-three/drei";
import { MeshRefractionMaterial } from "@react-three/drei";
import { Environment , MeshReflectorMaterial, useAnimations} from "@react-three/drei";
import gsap from "gsap";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
export default function Particles() {
   const  Transition = useRef(false)
    
    const y = useThree();
    const Light = useLoader(GLTFLoader, '/static/bench.glb')
    const Projector = useLoader(GLTFLoader,'/static/projector.glb')
    Light.scene.scale.set(0.0005,0.0005,0.0005)
    Light.scene.position.set(0,0,0)
    Light.scene.rotation.set(0,Math.PI,0)
    console.log(Light.scene)
    const {actions} = useAnimations(Light.animations, Light.scene)    
    const Map = useLoader(TextureLoader,"/wood/textures/woodD.jpg")
    const dracoLoader = new DRACOLoader();
    const [particles, setParticles] = useState({})
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    
    gltfLoader.setDRACOLoader(dracoLoader);
    useEffect(() => {
      console.log(actions)
      // actions["Take 001"].repetitions = <Infi></Infi>
      actions["Armature|ArmatureAction"].play()
      // actions["Take 001"].fadeIn(0.98).play()
      // actions.loop = 2000
      // actions["Take 001"].getMixer().addEventListener( 'loop', function() { 
      //   actions["Take 001"].fadeIn(0.98).play()
      //} );

      
  // console.log(actions)
    }, [actions]);
    useEffect(()=>{
   
     
    
        const sizes = {
          width: window.innerWidth,
          height: window.innerHeight,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        };
        (async () => {
          // const particles = {};
        
          const gltf = await gltfLoader.loadAsync("/static/models.glb")
 console.log(gltf.scene)
          const geometries = []
        //  for (const child of gltf.scene.children.find(obj => obj.name == "Apple_iMac").children) {
        //      geometries.push(child.geometry)
        //  }
        //  console.log(geometries)
        //  const singleGeometry = mergeGeometries(geometries).scale(5,5,5)
        //  const iMac = new THREE.Mesh(singleGeometry, new THREE.MeshBasicMaterial())
       //   iMac.scale.set(5,5,5)
          //  y.scene.add(iMac)
          const positions = gltf.scene.children.map((child) => {
               
         //  if (!child.isMesh) return (iMac.geometry.attributes.position)
            return child.geometry.attributes.position;
          })
       //   .filter(x=> x)
               
          particles.index = 0;
          particles.maxCount = 0;
         
          particles.morph = (index) => {
            console.log(Transition.current)
          Transition.current = true
          console.log("set to true transition happening" + Transition.current)
            particles.geometry.attributes.position =
              particles.positions[particles.index];
            particles.geometry.attributes.A_position_target =
              particles.positions[index];
            gsap.fromTo(
              particles.material.uniforms.uProgress,
              { value: 0 },
              { value: 1, duration: 3, ease: "linear" } 
            );
             
            particles.index = index;
            setTimeout(()=>{
              Transition.current=false
               console.log(Transition.current)}, 3000);
          console.log(Transition.current)
          };
      
          particles.change0 = () => {
            particles.morph(0);
          };
          particles.change1 = () => {
            particles.morph(1);
          };
          particles.change2 = () => {
            particles.morph(2);
          };
        
      
          for (const position of positions) {
            if (position.count > particles.maxCount) {
              particles.maxCount = position.count;
            }
            particles.positions = [];
          }
          for (const position of positions) {
            const originalArray = position.array;
      
            const newArray = new Float32Array(particles.maxCount * 3);
            for (let i = 0; i < particles.maxCount; i++) {
              const i3 = i * 3;
              if (i3 < originalArray.length) {
                newArray[i3 + 0] = originalArray[i3 + 0];
                newArray[i3 + 1] = originalArray[i3 + 1];
                newArray[i3 + 2] = originalArray[i3 + 2];
              } else {
                const random = Math.floor(Math.random() * position.count) * 3;
                newArray[i3 + 0] = originalArray[random + 0];
                newArray[i3 + 1] = originalArray[random + 1];
                newArray[i3 + 2] = originalArray[random + 2];
              }
            }
            particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3));
          }
      
         
          particles.geometry = new THREE.BufferGeometry();
          particles.geometry.setAttribute(
            "position",
            particles.positions[particles.index]
          );
          particles.geometry.setAttribute(
            "A_position_target",
            particles.positions[3]
          );
         particles.geometry.setIndex(null);
      
          particles.material = new THREE.ShaderMaterial({
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            uniforms: {
              uSize: new THREE.Uniform(0.1),
              uResolution: new THREE.Uniform(
                new THREE.Vector2(
                  sizes.width * sizes.pixelRatio,
                  sizes.height * sizes.pixelRatio
                )
              ),
              uProgress: { value: 0 },
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
         
          particles.points = new THREE.Points(particles.geometry, particles.material);
          particles.points.position.copy( new THREE.Vector3(-5,8,-9 ));
          particles.points.rotation.copy( new THREE.Vector3(0,Math.PI,0));
          console.log(particles.points)
          y.scene.add(particles.points);  
         

        
        })()
       
     
        
        },[])
      const { position } = useControls({
    position:
   
    {     value: { x: 15, y:1, z : 3},
          step: 0.01
    },   })
const { rotation } = useControls({
    rotation : {
        value :{ x: 0,y :-6.34,z: -9.42},
        step: 0.01
    }, 

})
const texture = useLoader(RGBELoader, 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/aerodynamics_workshop_1k.hdr')
  
const { text, shadow, ...config } = useControls("Text3D", {
  
  shadow: "#d88161",
  backside: true,
    backsideThickness: { value: 0.28, min: 0, max: 2 },
    samples: { value: 16, min: 1, max: 32, step: 1 },
    resolution: { value: 512, min: 64, max: 2048, step: 64 },
    transmission: { value: 1, min: 0, max: 1 },
    clearcoat: { value: 0, min: 0.1, max: 1 },
    clearcoatRoughness: { value: 0.0, min: 0, max: 1 },
    thickness: { value: 0.3, min: 0, max: 5 },
    chromaticAberration: { value: 5, min: 0, max: 5 },
    anisotropy: { value: 0.3, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.5, min: 0, max: 4, step: 0.01 },
    distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
   
 
});
console.log(Light)
const sunRef = useRef();
return (
    <>
    {/* <EffectComposer >
    
    </EffectComposer> */}
     
    <Text3D 
    font={"/nike.json"}
    scale={5}
   
    position={[19.11,4.39,5]}
    rotation={[-1.85,0,-9.42]}
    >Laser
   <MeshTransmissionMaterial
        backsideThickness ={0}
        samples= { 30 }
        resolution ={  512 }
        transmission ={  1 }
        clearcoat ={  0 }
        clearcoatRoughness= { 0.0 }
        thickness ={  0.3 }
        chromaticAberration ={  5 }
        anisotropy ={ 0.3 }
        roughness ={  0 }
        distortion ={ 0.5 }
      //  distortionScale= {  0.1 }
        color={"blue"}
     //  background={texture}  
              />
    </Text3D>
    <Text 
     font={"/nike.ttf"}
    scale={7} 
    position={[11.44,4.91,6.81]}
    rotation={[-1.85,0,-9.42]}
    >Laser</Text>


      <Text scale={2} 
      position = {[15,3,5]}
   rotation={[-1.85,0,-9.42]}
    >Cutting</Text>

      <Text scale={2} 
   position = {[9,3,5]}
    rotation={[-1.85,-6.34,-9.42]}>Parts</Text>


     <Text scale={1} 
   position = {[15,1,3]}
    rotation={[-1.85,0,-9.42]}>Access laser cutting </Text>
     <Text scale={1} 
   position = {[15+ 2.5,1,3-2]}
    rotation={[-1.85,0,-9.42]}>online </Text>
    <mesh 
   // rotation-x ={Math.PI}
   rotation={[1.3,-6.26,-9.46]}
    position={[9.42,1,2]}>
      <planeGeometry 
      
      args={[0.1,2.5]}/>
      <meshBasicMaterial color={"white"} side={2}/>
      <Text scale={0.75} 
      
       rotation = {[Math.PI,0,0]}
  position={[3.5,1,-1]}
    >build a part </Text>
    </mesh>
    <mesh 
   // rotation-x ={Math.PI}
   rotation={[1.3,0,-9.46]}
    position={[6,1,2]}>
      <planeGeometry 
      
      args={[4.5,2.5]}/>
    
      <meshBasicMaterial color={"blue"} side={2}/>
     q <Text scale={3} 
        position={[-5,2,2]}
       rotation = {[3.84,0,-6.31]}
 
    >Rapid Crafting </Text>
     <Text scale={0.65}
          
        position={[-5,6,3]}
       rotation = {[3.84,0,-6.31]}
 
    >Custom Parts Crafted and Pormptly deleverd to your door step </Text>
    </mesh>
    <Sun ref={sunRef} />
      {sunRef.current && (
        <EffectComposer multisampling={0}>
          <GodRays
            sun={sunRef.current}
            //    blendFunction={BlendFunction.Screen}
            samples={30}
            density={0.97}  
            decay={0.9}
            weight={0.4}
            exposure={0.4}
            clampMax={1}
            //   width={Resizer.AUTO_SIZE}
            //   height={Resizer.AUTO_SIZE}
            //   kernelSize={KernelSize.SMALL}
            blur={true}
          />
        </EffectComposer>
      )}


    <Perf />
            <Environment preset="sunset" />
<mesh   
position={[-5,0,-9]}
scale={2}
onClick={()=>{
  if(Transition.current===false){
   
    if(particles.index===0 ){
       
        particles.morph(1)
        
    }else if(particles.index===1){
        particles.morph(2)
    }else if(particles.index===2){
        particles.morph(3)
    }else if(particles.index===3){
        particles.morph(7)
    }else if(particles.index===7){
      particles.morph(0)
  }

}
}}>
      <boxGeometry/>
      <meshStandardMaterial map={Map} side={2}/>
</mesh>
  <primitive object={Light.scene}/>

  <mesh rotation={[1.37,3.14,-9.42]}  position={[0,-4,0.5]}>
  
  <planeGeometry args={[85,63.5]} />
     {/* <meshNormalMaterial side={2}/> */}
     <MeshReflectorMaterial
      side={2}
     
    blur={[700, 700]} // Blur ground reflections (width, height), 0 skips blur
    mixBlur={2} // How much blur mixes with surface roughness (default = 1)
   // mixStrength={1} // Strength of the reflections
   // mixContrast={1} // Contrast of the reflections
    resolution={1024*2} // Off-buffer resolution, lower=faster, higher=better quality, slower
    mirror={1} // Mirror environment, 0 = texture colors, 1 = pick up env colors
    //depthScale={0} // Scale the depth factor (0 = no depth, default = 0)
    minDepthThreshold={0.9} // Lower edge for the depthTexture interpolation (default = 0)
    maxDepthThreshold={10} // Upper edge for the depthTexture interpolation (default = 0)
    depthToBlurRatioBias={7} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
    distortion={4} // Amount of distortion based on the distortionMap texture
     // The red channel of this texture is used as the distortion map. Default is null
    debug={0} /* Depending on the assigned value, one of the following channels is shown:
      0 = no debug
      1 = depth channel
      2 = base channel
      3 = distortion channel
      4 = lod channel (based on the roughness)
    
   reflectorOffset={0} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
   */ />
  </mesh>

    </>
)
}



const Sun = forwardRef(function Sun(props, forwardRef) {
  useFrame(({ clock }) => {
    //   forwardRef.current.position.x = Math.sin(clock.getElapsedTime()) * -8;
    //  forwardRef.current.position.y = Math.cos(clock.getElapsedTime()) * -8;
  });
  const { position } = useControls({
    position:
   
    {     value: { x: 0, y:0, z : 0},
          step: 0.01
    },   })
const { rotation } = useControls({
    rotation : {
        value :{ x: 0,y :-6.34,z: -9.42},
        step: 0.01
    },      
})
  return (
    <mesh ref={forwardRef} position={[-5,0.18,-8.45]}>
      <sphereGeometry args={[1, 36, 36]} />
      <meshBasicMaterial color={"#00000"} />
    </mesh>
  );
});
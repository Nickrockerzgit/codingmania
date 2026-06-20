// // ChatBot3D.tsx

// import { Suspense, useEffect, useRef, useState } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { useGLTF, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
// import * as THREE from "three";

// const ChatBotModel = ({ isHovered }: { isHovered: boolean }) => {
//   const { scene } = useGLTF("/model/technobot.glb");
//   const modelRef = useRef<THREE.Group>(null);

//   useFrame(() => {
//     if (modelRef.current && !isHovered) {
//       modelRef.current.rotation.y += 0.01;
//     }
//   });

//   useEffect(() => {
//     scene.traverse((child) => {
//       if ((child as THREE.Mesh).isMesh) {
//         const mesh = child as THREE.Mesh;
//         mesh.castShadow = true;
//         mesh.receiveShadow = true;

//         if (mesh.material instanceof THREE.MeshStandardMaterial) {
//           mesh.material.needsUpdate = true;
//           mesh.material.metalness = 0.2;
//           mesh.material.roughness = 0.6;
//           if (mesh.material.map) {
//             mesh.material.map.colorSpace = THREE.SRGBColorSpace;
//           }
//         }
//       }
//     });

//     scene.position.set(0, -0.3, 0);
//     scene.scale.set(1.3, 1.3, 1.3);
//   }, [scene]);

//   return <primitive ref={modelRef} object={scene} />;
// };

// useGLTF.preload("/model/technobot.glb");

// const ModelFallback = () => (
//   <mesh>
//     <boxGeometry args={[1, 1, 1]} />
//     <meshStandardMaterial color="gray" />
//   </mesh>
// );

// const ChatBot3D = () => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="fixed bottom-4 right-4 w-48 h-48 z-50 group"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <Canvas
//         shadows
//         camera={{ position: [0, 0, 3], fov: 45 }}
//         dpr={[1, 2]}
//         gl={{
//           alpha: true,
//           antialias: true,
//           preserveDrawingBuffer: true,
//           outputColorSpace: THREE.SRGBColorSpace,
//         }}
//         onCreated={({ gl, scene }) => {
//           gl.toneMapping = THREE.ACESFilmicToneMapping;
//           gl.toneMappingExposure = 1.0;
//           gl.shadowMap.enabled = true;
//           gl.shadowMap.type = THREE.PCFSoftShadowMap;
//           scene.background = null;
//         }}
//       >
//         <ambientLight intensity={0.7} />
//         <directionalLight
//           position={[10, 10, 5]}
//           intensity={1.2}
//           castShadow
//         />
//         <Suspense fallback={<ModelFallback />}>
//           <Environment preset="city" />
//           <ChatBotModel isHovered={isHovered} />
//           <ContactShadows
//             position={[0, -1, 0]}
//             opacity={0.4}
//             scale={10}
//             blur={2}
//             far={1}
//           />
//           <OrbitControls enableZoom={false} enablePan={false} />
//         </Suspense>
//       </Canvas>

//       <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 text-black text-xs px-2 py-1 rounded shadow-md">
//         Ask me anything
//       </div>
//     </div>
//   );
// };

// export default ChatBot3D;







import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import ChatWindow from "./ChatWindow"; 

const ChatBotModel = ({ isHovered }: { isHovered: boolean }) => {
  const { scene } = useGLTF("/model/technobot.glb");
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current && !isHovered) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      scene.rotation.set(0, -1.4, 0);
      scene.position.set(0, -0.3, 0);
      scene.scale.set(1.3, 1.3, 1.3);
    }
  }, [scene]);

  return <group ref={modelRef}><primitive object={scene} /></group>;
};

const ChatBot3D = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  return (
    <>
      {/* Chatbot window */}
      {openChat && <ChatWindow onClose={() => setOpenChat(false)} />}

      {/* 3D Model */}
      <div
        className="fixed bottom-4 right-4 w-48 h-48 z-50 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setOpenChat((prev) => !prev)}
      >
        <Canvas shadows camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ChatBotModel isHovered={isHovered} />
            <ContactShadows position={[0, -1, 0]} opacity={0.3} scale={10} blur={2} far={1} />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Suspense>
        </Canvas>
        <div className="absolute top-8 left-(-4) bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs px-2 py-1 rounded shadow-md">
         Ask me anything
       </div>
      </div>
    </>
  );
};

useGLTF.preload("/model/technobot.glb");

export default ChatBot3D;









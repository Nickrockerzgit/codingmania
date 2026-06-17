// import { useEffect, useRef } from "react";
// import NET from "vanta/dist/vanta.net.min";
// import * as THREE from "three";

// function ComingSoon() {
//   const vantaRef = useRef(null);

//   useEffect(() => {
//     const effect = NET({
//       el: vantaRef.current,
//       THREE: THREE,
//       color: 0x8b9cff,
//       backgroundColor: 0x000000,
//       maxDistance: 20,
//       points: 12
//     });

//     return () => {
//       if (effect) effect.destroy();
//     };
//   }, []);

//   return (
//     <div ref={vantaRef} className="min-h-screen flex flex-col items-center justify-center text-center text-white">
//       <h1 className="text-[#8B9CFF] text-[100px] font-bold leading-none select-none">Coming Soon</h1>
//       <p className="text-lg text-gray-300 mt-8">We are working on something amazing. Stay tuned!</p>
//     </div>
//   );
// }

// export default ComingSoon;











function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-black">
      <h1 className="text-[#8B9CFF] text-[100px] font-bold leading-none select-none">
        Coming Soon
      </h1>
      <p className="text-lg text-gray-300 mt-8">
        We are working on something amazing. Stay tuned!
      </p>
    </div>
  );
}

export default ComingSoon;

// import  { useEffect, useRef } from "react";
// import * as THREE from "three";
// import NET from 'vanta/dist/vanta.net.min';

// const TermsAndConditions = () => {
//   const vantaRef = useRef(null);

//   useEffect(() => {
//     const vantaEffect = NET({
//       el: vantaRef.current,
//       THREE: THREE,
//       color: 0xffffff,
//       backgroundColor: 0x111827,
//       points: 10.0,
//       maxDistance: 20.0,
//       spacing: 15.0,
//     });

//     return () => {
//       if (vantaEffect) vantaEffect.destroy();
//     };
//   }, []);

//   return (
//     <div ref={vantaRef} className="min-h-screen flex justify-center items-center text-white px-6">
//       <div className="bg-black bg-opacity-50 p-8 rounded-lg max-w-3xl w-full mt-[40px]">
//         <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
//         <p className="mb-4">
//           Welcome to Technoverse! By accessing our website, you agree to comply with and be bound by the following terms and conditions.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">1. Use of Website</h2>
//         <p className="mb-4">
//           You agree to use this website for lawful purposes only. Any unauthorized use may result in legal action.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">2. Intellectual Property</h2>
//         <p className="mb-4">
//           All content, including text, graphics, and logos, is the property of Technoverse and is protected by copyright laws.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
//         <p className="mb-4">
//           Users must not attempt to compromise the security of this website or misuse any of its features.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">4. Changes to Terms</h2>
//         <p className="mb-4">
//           We reserve the right to modify these terms at any time. Continued use of the site indicates your acceptance of the new terms.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
//         <p>If you have any questions about these terms, please contact us at support@technoverse.com.</p>
//       </div>
//     </div>
//   );
// };

// export default TermsAndConditions;















import { } from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex justify-center items-center text-white px-6 bg-gray-900">
      <div className="bg-black bg-opacity-50 p-8 rounded-lg max-w-3xl w-full mt-[40px]">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p className="mb-4">
          Welcome to Technoverse! By accessing our website, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h2 className="text-xl font-semibold mb-2">1. Use of Website</h2>
        <p className="mb-4">
          You agree to use this website for lawful purposes only. Any unauthorized use may result in legal action.
        </p>

        <h2 className="text-xl font-semibold mb-2">2. Intellectual Property</h2>
        <p className="mb-4">
          All content, including text, graphics, and logos, is the property of Technoverse and is protected by copyright laws.
        </p>

        <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
        <p className="mb-4">
          Users must not attempt to compromise the security of this website or misuse any of its features.
        </p>

        <h2 className="text-xl font-semibold mb-2">4. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these terms at any time. Continued use of the site indicates your acceptance of the new terms.
        </p>

        <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
        <p>
          If you have any questions about these terms, please contact us at support@technoverse.com.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;

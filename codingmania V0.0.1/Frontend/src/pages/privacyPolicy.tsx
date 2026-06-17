// import  { useEffect, useRef } from "react";
// import * as THREE from "three";
// import NET from 'vanta/dist/vanta.net.min';

// const PrivacyPolicy = () => {
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
//       <div className="bg-black bg-opacity-50 p-8 rounded-lg max-w-5xl w-full mt-[68px]">
//         <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
//         <p className="mb-4">
//           Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
//         <p className="mb-4">
//           We may collect personal information, such as your name, email address, and other details you provide while using our website.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
//         <p className="mb-4">
//           We use your information to improve our services, communicate with you, and ensure website security.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">3. Sharing of Information</h2>
//         <p className="mb-4">
//           We do not sell, trade, or rent your personal information to others. However, we may share it with trusted third parties to improve our services.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
//         <p className="mb-4">
//           We implement security measures to protect your personal information from unauthorized access or disclosure.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">5. Changes to This Policy</h2>
//         <p className="mb-4">
//           We may update this Privacy Policy from time to time. Please review it periodically for changes.
//         </p>
//         <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
//         <p>If you have any questions about this Privacy Policy, please contact us at support@technoverse.com.</p>
//       </div>
//     </div>
//   );
// };

// export default PrivacyPolicy;




















const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex justify-center items-center text-white px-6 bg-gray-900">
      <div className="bg-black bg-opacity-50 p-8 rounded-lg max-w-5xl w-full mt-[68px]">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>

        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We may collect personal information, such as your name, email address, and other details you provide while using our website.
        </p>

        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use your information to improve our services, communicate with you, and ensure website security.
        </p>

        <h2 className="text-xl font-semibold mb-2">3. Sharing of Information</h2>
        <p className="mb-4">
          We do not sell, trade, or rent your personal information to others. However, we may share it with trusted third parties to improve our services.
        </p>

        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
        <p className="mb-4">
          We implement security measures to protect your personal information from unauthorized access or disclosure.
        </p>

        <h2 className="text-xl font-semibold mb-2">5. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Please review it periodically for changes.
        </p>

        <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at support@technoverse.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

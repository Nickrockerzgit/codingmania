

// src/components/Landing.tsx

import React from 'react';
import Navbar from '../Navbar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-purple-800 relative overflow-hidden">
      <Navbar />
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-6xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          TECHNOVERSE
        </h1>
        <p className="text-xl md:text-3xl text-white/90 mt-6">
          Welcome to Admin Panel
        </p>
        <div className="mt-6 w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        <p className="mt-4 text-white/60 text-lg tracking-wide">
          Secure • Powerful • Intuitive
        </p>
      </div>
    </div>
  );
};

export default Home;

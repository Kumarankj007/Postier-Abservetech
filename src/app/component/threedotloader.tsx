// src/ThreeDotLoader.js
import React from 'react';

const ThreeDotLoader = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-2 h-2 bg-btncolor rounded-full animate-fade-in-out"></div>
      <div className="w-2 h-2 bg-btncolor rounded-full animate-fade-in-out animation-delay-200"></div>
      <div className="w-2 h-2 bg-btncolor rounded-full animate-fade-in-out animation-delay-400"></div>
    </div>
  );
};

export default ThreeDotLoader;

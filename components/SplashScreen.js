import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Letter = ({ path, width = 5 }) => (
  <motion.path
    d={path}
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
    stroke="#4338ca"
    strokeWidth={width}
    fill="none"
  />
);

const letters = {
  N: "M10 90V10h15l65 65V10h10v80H85L20 25v65H10z",
  O: "M50 10c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40z",
  Q: "M50 10c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40zM70 70l20 20",
  U: "M10 10v60c0 11 9 20 20 20h40c11 0 20-9 20-20V10",
  E: "M10 10h80M10 50h60M10 90h80M10 10v80"
};

export default function SplashScreen() {
  const [loadingText, setLoadingText] = useState('Loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => prev.length < 10 ? prev + '.' : 'Loading');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-100 text-indigo-900">
      <motion.div 
        className="flex mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {Object.entries(letters).map(([letter, path], index) => (
          <motion.div
            key={letter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <svg width="80" height="80" viewBox="0 0 100 100" className="mr-1">
              <Letter path={path} width={letter === 'N' ? 5 : 10} />
            </svg>
          </motion.div>
        ))}
      </motion.div>
      <motion.p
        className="text-2xl md:text-3xl font-light mb-8 text-indigo-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        Next-Gen Queue Management
      </motion.p>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <div className="w-20 h-20 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-r-4 border-purple-600 rounded-full animate-ping"></div>
      </motion.div>
      <motion.p
        className="mt-6 text-lg text-indigo-700 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        {loadingText}
      </motion.p>
    </div>
  );
}
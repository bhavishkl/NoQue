import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LetterN = () => (
  <motion.path
    d="M10 90V10h15l65 65V10h10v80H85L20 25v65H10z"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
    stroke="#fff"
    strokeWidth="5"
    fill="none"
  />
);

const LetterO = () => (
  <motion.path
    d="M50 10c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40z"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
    stroke="#fff"
    strokeWidth="10"
    fill="none"
  />
);

const LetterQ = () => (
  <motion.path
    d="M50 10c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40zM70 70l20 20"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
    stroke="#fff"
    strokeWidth="10"
    fill="none"
  />
);

const LetterU = () => (
  <motion.path
    d="M10 10v60c0 11 9 20 20 20h40c11 0 20-9 20-20V10"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
    stroke="#fff"
    strokeWidth="10"
    fill="none"
  />
);

const LetterE = () => (
  <motion.path
    d="M10 10h80M10 50h60M10 90h80M10 10v80"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
    stroke="#fff"
    strokeWidth="10"
    fill="none"
  />
);

export default function SplashScreen() {
  const [loadingText, setLoadingText] = useState('Loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => prev.length < 10 ? prev + '.' : 'Loading');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="flex mb-8">
        {['N', 'O', 'Q', 'U', 'E'].map((letter, index) => (
          <motion.div
            key={letter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100" className="mr-2">
              {letter === 'N' && <LetterN />}
              {letter === 'O' && <LetterO />}
              {letter === 'Q' && <LetterQ />}
              {letter === 'U' && <LetterU />}
              {letter === 'E' && <LetterE />}
            </svg>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-xl md:text-2xl font-light mb-8 text-indigo-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        Next-Gen Queue Management
      </motion.p>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-400 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-r-4 border-purple-400 rounded-full animate-ping"></div>
      </motion.div>
      <motion.p
        className="mt-4 text-indigo-200 animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.5 }}
      >
        {loadingText}
      </motion.p>
    </div>
  );
}
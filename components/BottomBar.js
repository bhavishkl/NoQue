import React, { useMemo } from 'react';
import Link from 'next/link';
import { FiHome, FiSearch, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useUserName } from '../hooks/useUserName';

const BottomBar = () => {
  const userName = useUserName();
  const router = useRouter();

  const isActive = useMemo(() => (path) => router.pathname === path, [router.pathname]);

  const navItems = [
    { href: '/user/home', icon: FiHome, label: 'Home' },
    { href: '/user/queues', icon: FiSearch, label: 'Queues' },
    { href: '/user/profile', icon: FiUser, label: userName || 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg sm:hidden" aria-label="Bottom navigation">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center w-1/3">
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -3 }}
              className={`flex flex-col items-center ${isActive(href) ? 'text-indigo-600' : 'text-gray-600'} hover:text-indigo-500 transition-colors duration-200`}
            >
              <Icon className={`text-2xl ${isActive(href) ? 'animate-pulse' : ''}`} aria-hidden="true" />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default React.memo(BottomBar);
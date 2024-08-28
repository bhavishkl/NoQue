import { useRouter } from 'next/router'
import Link from "next/link"
import { useState, useEffect } from "react"
import { FiMenu, FiBell, FiHome, FiList, FiBarChart2, FiUser, FiSettings, FiLogOut, FiPlusCircle, FiX } from "react-icons/fi"
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
import { motion } from 'framer-motion';

const Header = () => {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { session, isLoading, logout } = useAuth()
  const supabase = useSupabaseClient()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logout successful');
      router.push('/').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error logging out:', error.message);
      toast.error('Error logging out');
    }
  };

  const navItems = [
    { href: '/user/home', icon: FiHome, label: 'Home' },
    { href: '/user/queues', icon: FiList, label: 'Queues' },
    { href: '/queue/create-queue', icon: FiPlusCircle, label: 'Create Queue' },
    { href: '/user/profile', icon: FiUser, label: 'Profile' },
    { href: '/user/settings', icon: FiSettings, label: 'Settings' },
    { href: '/queue/queue-dashboard', icon: FiBarChart2, label: 'Queue Dashboard' },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isSidebarOpen && !event.target.closest('.sidebar')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  if (isLoading) {
    return null // or a loading spinner if you prefer
  }

  return (
    <>
      {session && (
        <>
          <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm shadow-sm z-40 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link href="/user/home">
                    <span className="text-2xl font-bold text-[#3532a7] cursor-pointer hover:text-[#6f6cd3] transition-colors duration-200">NoQue</span>
                  </Link>
                </div>
                <nav className="hidden lg:flex items-center space-x-1">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          router.pathname === item.href
                            ? 'bg-[#e6e5ff] text-[#3532a7] shadow-sm'
                            : 'text-[#292680] hover:bg-[#f0f0ff] hover:text-[#3532a7]'
                        }`}
                      >
                        <item.icon className="mr-2 text-lg" /> {item.label}
                      </motion.span>
                    </Link>
                  ))}
                </nav>
                <div className="flex items-center space-x-4">
                  <button className="relative p-2 text-[#292680] hover:bg-[#f0f0ff] rounded-full transition-colors duration-200">
                    <FiBell className="text-xl" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
                  </button>
                  <button
                    className="p-2 text-[#292680] hover:bg-[#f0f0ff] rounded-full transition-colors duration-200 lg:hidden"
                    onClick={toggleSidebar}
                  >
                    <FiMenu className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Improved Sidebar */}
          <div className={`sidebar fixed inset-y-0 right-0 z-50 w-80 bg-gradient-to-b from-[#3532a7] to-[#6f6cd3] shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out overflow-hidden`}>
            <div className="flex flex-col h-full text-white">
              <div className="p-6 flex justify-between items-center bg-[#292680]">
                <Link href="/home">
                  <span className="text-2xl font-bold cursor-pointer text-[#f0f0ff] hover:text-white transition-colors duration-200">NoQue</span>
                </Link>
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-full text-[#f0f0ff] hover:bg-[#3532a7] hover:text-white transition-colors duration-200"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-6 px-4 bg-[#3532a7]">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center px-4 py-3 mb-2 rounded-lg text-sm ${
                        router.pathname === item.href
                          ? 'bg-white text-[#3532a7] shadow-md'
                          : 'text-white hover:bg-white hover:bg-opacity-10'
                      } cursor-pointer transition-all duration-200`}
                    >
                      <item.icon className="mr-3 text-xl" /> {item.label}
                    </motion.span>
                  </Link>
                ))}
              </nav>
              <div className="p-6 bg-white bg-opacity-5 rounded-lg">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-6 py-3 text-sm text-white bg-white bg-opacity-10 hover:bg-[#6f6cd3] hover:text-[#ffffff] cursor-pointer rounded transition-colors duration-200"
                >
                  <FiLogOut className="mr-3 text-lg" /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Spacer to push content below the fixed header */}
          <div className="h-16"></div>
        </>
      )}
    </>
  );
};

export default Header;
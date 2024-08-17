import { useRouter } from 'next/router'
import Link from "next/link"
import { useState, useEffect } from "react"
import { FiMenu, FiBell, FiHome, FiList, FiBarChart2, FiUser, FiSettings, FiLogOut, FiPlusCircle, FiX } from "react-icons/fi"
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next';

const Header = () => {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { session, isLoading, logout } = useAuth()
  const supabase = useSupabaseClient()
  const { t } = useTranslation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success(t('logoutSuccess'));
      router.push('/').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error logging out:', error.message);
      toast.error(t('logoutError'));
    }
  };

  const navItems = [
    { href: '/user/home', icon: FiHome, label: 'home' },
    { href: '/user/queues', icon: FiList, label: 'queues' },
    { href: '/queue/create-queue', icon: FiPlusCircle, label: 'createQueue' },
    { href: '/user/profile', icon: FiUser, label: 'profile' },
    { href: '/user/settings', icon: FiSettings, label: 'settings' },
    { href: '/queue/queue-dashboard', icon: FiBarChart2, label: 'queueDashboard' },
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
          <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-30 backdrop-filter backdrop-blur-md shadow-md z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <Link href="/user/home">
                    <span className="text-2xl font-bold text-[#3532a7] cursor-pointer">NoQue</span>
                  </Link>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span className={`flex items-center px-3 py-2 text-sm ${router.pathname === item.href ? 'bg-[#6f6cd3] text-[#ffffff]' : 'text-[#292680] hover:bg-[#6f6cd3] hover:text-[#ffffff]'} cursor-pointer rounded`}>
                        <item.icon className="mr-2" /> {t(item.label)}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center space-x-4">
                  <FiBell className="text-2xl text-[#292680] cursor-pointer" />
                  <FiMenu
                    className="text-2xl text-[#292680] cursor-pointer"
                    onClick={toggleSidebar}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Improved Sidebar */}
          <div className={`sidebar fixed inset-y-0 right-0 z-50 w-64 bg-[#ffffff] shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full">
              <div className="p-4 bg-[#3532a7] flex justify-between items-center">
                <Link href="/home">
                  <span className="text-2xl font-bold text-[#ffffff] cursor-pointer">NoQue</span>
                </Link>
                <FiX
                  className="text-2xl text-[#ffffff] cursor-pointer"
                  onClick={toggleSidebar}
                />
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className={`flex items-center px-6 py-3 text-sm ${router.pathname === item.href ? 'bg-[#6f6cd3] text-[#ffffff]' : 'text-[#292680] hover:bg-[#6f6cd3] hover:text-[#ffffff]'} cursor-pointer transition-colors duration-200`}>
                      <item.icon className="mr-3 text-lg" /> {t(item.label)}
                    </span>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-6 py-3 text-sm text-[#292680] hover:bg-[#6f6cd3] hover:text-[#ffffff] cursor-pointer rounded transition-colors duration-200"
                >
                  <FiLogOut className="mr-3 text-lg" /> {t('logout')}
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
          <div className="h-12"></div>
        </>
      )}
    </>
  );
};

export default Header;
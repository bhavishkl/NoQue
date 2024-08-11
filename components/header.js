import { useRouter } from 'next/router'
import Link from "next/link"
import { useState, useEffect } from "react"
import { FiMenu, FiBell, FiHome, FiList, FiBarChart2, FiUser, FiSettings, FiLogOut, FiPlusCircle } from "react-icons/fi"
import { supabase } from '../lib/supabaseClient'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'

const Header = () => {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { session } = useAuth()

  // useEffect(() => {
  //   if (!session) {
  //     router.push('/');
  //     toast.error('Please log in to access this page', {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   }
  // }, [session, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const navItems = [
    { href: '/user/home', icon: FiHome, label: 'Home' },
    { href: '/user/queues', icon: FiList, label: 'Queues' },
    { href: '/queue/create-queue', icon: FiPlusCircle, label: 'Create Queue' },
    { href: '/user/profile', icon: FiUser, label: 'Profile' },
    { href: '/settings', icon: FiSettings, label: 'Settings' },
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

  if (!session) {
    return null; // Don't render anything if there's no session
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#ffffff] shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/user/home">
                <span className="text-2xl font-bold text-[#3532a7] cursor-pointer">Wique</span>
              </Link>
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

      {/* Sidebar */}
      <div className={`sidebar fixed inset-y-0 left-0 z-50 w-64 bg-[#ffffff] shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="p-4 bg-[#3532a7]">
            <Link href="/home">
              <span className="text-2xl font-bold text-[#ffffff] cursor-pointer">Wique</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className="flex items-center px-4 py-2 text-sm text-[#292680] hover:bg-[#6f6cd3] hover:text-[#ffffff] cursor-pointer">
                  <item.icon className="mr-2" /> {item.label}
                </span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-[#292680] hover:bg-[#6f6cd3] hover:text-[#ffffff] cursor-pointer rounded"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Spacer to push content below the fixed header */}
      <div className="h-10"></div> {/* Adjust the height to match your header's height */}
    </>
  );
};

export default Header;
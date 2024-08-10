import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHome, FiSearch, FiUser } from 'react-icons/fi';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const BottomBar = () => {
  const [userName, setUserName] = useState('');
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();
        if (data && !error) {
          setUserName(data.name || 'User');
        }
      }
    };
    fetchUserName();
  }, [supabase]);

  const isActive = (path) => router.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg sm:hidden">
      <div className="flex justify-around items-center h-16">
        <Link href="/user/home" className={`flex flex-col items-center ${isActive('/user/home') ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-500 transition-colors duration-200`}>
          <FiHome className={`text-2xl ${isActive('/user/home') ? 'animate-bounce' : ''}`} />
          <span className="text-xs mt-1 font-medium">Home</span>
        </Link>
        <Link href="/user/queues" className={`flex flex-col items-center ${isActive('/user/queues') ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-500 transition-colors duration-200`}>
          <FiSearch className={`text-2xl ${isActive('/user/queues') ? 'animate-bounce' : ''}`} />
          <span className="text-xs mt-1 font-medium">Queues</span>
        </Link>
        <Link href="/user/profile" className={`flex flex-col items-center ${isActive('/user/profile') ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-500 transition-colors duration-200`}>
          <FiUser className={`text-2xl ${isActive('/user/profile') ? 'animate-bounce' : ''}`} />
          <span className="text-xs mt-1 font-medium">{userName}</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomBar;

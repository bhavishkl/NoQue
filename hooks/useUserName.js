import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export const useUserName = () => {
  const [userName, setUserName] = useState('');
  const supabase = useSupabaseClient();

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

  return userName;
};
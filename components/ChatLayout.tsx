import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient'; // Import supabase client
import ChannelList from './channelList';

interface ChatLayoutProps {
  children: ReactNode;
  channels: { id: number; slug: string }[];
}

type Channel = {
    id: string;
    name: string;
    description: string;
  };
  

export default function ChatLayout({ children }: ChatLayoutProps) {
    const [channels, setChannels] = useState<Channel[]>([]);
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
    // Redirect to login page after logout (optional)
    window.location.href = '/login'; 
  };

  useEffect(() => {
    const fetchChannels = async () => {
      const { data, error } = await supabase.from('channels').select('*');
      if (error) {
        console.error('Error fetching channels:', error);
      } else {
        setChannels(data || []); // TypeScript now knows that `data` is of type `Channel[]`
      }
    };

    fetchChannels();
  }, []);
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-blue-900 text-white w-64 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-8">Slack Clone</h2>
          <button className="bg-blue-600 w-full py-2 mb-6 rounded hover:bg-blue-700">
            New Channel
          </button>
          <p className="mb-8">myohtetmin99@gmail.com</p>
          <div>
            <h3 className="font-bold text-sm uppercase mb-4">Channels</h3>
            <ChannelList channels={channels} />
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-500 py-2 rounded hover:bg-blue-100"
        >
          Log out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-blue-500 text-white p-6 flex flex-col justify-between">
        <div className="overflow-y-auto">
          {/* Render the rest of the messages here */}
          {children}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import ChannelList from '../components/channelList';

type Channel = {
  id: string;
  name: string;
  description: string;
};

export default function Home() {
  // Explicitly type the state as an array of Channel objects
  const [channels, setChannels] = useState<Channel[]>([]);

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
    <>
      <Navbar />
      <div className="container mx-auto">
        <ChannelList channels={channels} />
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MessageInput({ channelId }: { channelId: string }) {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
      }
    }

    fetchUser();
  }, []);

  const sendMessage = async () => {
    if (message.trim().length > 0 && userId) {
      const { error } = await supabase
        .from('messages')
        .insert([{ message, channel_id: channelId, user_id: userId }]); // Use 'message' as the column name

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setMessage(''); // Clear the input field after sending
      }
    }
  };

  return (
    <div className="mt-6">
      <input
        type="text"
        placeholder="Send a message"
        className="w-full p-4 bg-gray-700 text-white rounded focus:outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
    </div>
  );
}

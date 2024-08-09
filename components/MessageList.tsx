import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Message {
  id: number;
  inserted_at: string;
  message: string;
  user_id: string;
  channel_id: number;
  username: string; // Ensure this is always defined
}

export default function MessageList({ channelId }: { channelId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, 
          inserted_at, 
          message, 
          user_id, 
          channel_id, 
          users (
            username
          )
        `)
        .eq('channel_id', channelId)
        .order('inserted_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        const formattedData = data?.map((message: any) => ({
          id: message.id,
          inserted_at: message.inserted_at,
          message: message.message,
          user_id: message.user_id,
          channel_id: message.channel_id,
          username: message.users?.username || 'Unknown', // Default to 'Unknown' if username is missing
        })) || [];
        setMessages(formattedData);
      }
    }

    fetchMessages();

    // Subscribe to real-time messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channelId}` }, async (payload) => {
        const { data: userData } = await supabase
          .from('users')
          .select('username')
          .eq('id', payload.new.user_id)
          .single();

        setMessages((currentMessages) => [
          ...currentMessages,
          {
            ...payload.new,
            username: userData?.username || 'Unknown',
          } as Message,
        ]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 overflow-y-auto">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div key={message.id} className="p-2 bg-gray-700 rounded">
            <p className="text-blue-400">{message.username}</p>
            <p>{message.message}</p>
            <span className="text-xs text-gray-500">{new Date(message.inserted_at).toLocaleString()}</span>
          </div>
        ))
      ) : (
        <p>No messages yet. Start the conversation!</p>
      )}
      <div ref={bottomRef} /> {/* This div will act as the bottom marker */}
    </div>
  );
}

import { useRouter } from 'next/router';
import ChatLayout from '../../components/ChatLayout';
import MessageList from '../../components/MessageList';
import MessageInput from '../../components/MessageInput';

export default function ChannelPage() {
  const router = useRouter();
  const { id: channelId } = router.query;

  return (
    <ChatLayout>
      {channelId ? (
        <>
          <MessageList channelId={channelId as string} />
          <MessageInput channelId={channelId as string} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </ChatLayout>
  );
}

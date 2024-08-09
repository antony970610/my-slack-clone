import Link from 'next/link';

export default function ChannelList({ channels }: { channels: any[] }) {
  return (
    <ul>
      {channels.map((channel) => (
        <li key={channel.id} className="border-b py-2">
          <Link href={`/channels/${channel.id}`}>
            <span className="text-blue-500">{channel.slug}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

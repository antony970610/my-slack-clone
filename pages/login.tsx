import { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize the router

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // setError(error.message);
    } else {
      // Fetch the first channel after login
      const { data, error: channelsError } = await supabase.from('channels').select('id').limit(1);
      if (channelsError) {
        console.error('Error fetching channels:', channelsError);
      } else if (data && data.length > 0) {
        router.push(`/channels/${data[0].id}`); // Redirect to the first channel
      } else {
        console.error('No channels found.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">Login to Slack Clone</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Log In
        </button>
      </div>
    </div>
  );
}

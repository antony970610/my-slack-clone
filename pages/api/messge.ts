import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channelId, content } = req.body;

  const { data, error } = await supabase
    .from('messages')
    .insert([{ channel_id: channelId, content }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ message: data });
}

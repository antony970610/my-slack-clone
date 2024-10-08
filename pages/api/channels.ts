import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from('channels').select('*');

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ channels: data });
}

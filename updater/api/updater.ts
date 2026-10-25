import dotenv from 'dotenv';
import axios from 'axios'
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node'; // Recommended types

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

async function getNews(game:'centaura' | 'deadahead') {
  try{
        let d = process.env.CENTAURA
        if(game === 'deadahead'){
            d = process.env.DEADAHEAD
        }
        const url = `https://games.roblox.com/v1/games/${d}/servers/Public?limit=100`
        let response = await axios.get(url)
        let data = response.data
        let ret = []
        for(var x of data.data){
            ret.push(x)
        }
        let next = data.nextPageCursor
        while(next !== null){
            response = await axios.get(`${url}&cursor=${next}`)
            data = response.data
            for(var x of data.data){
                ret.push(x)
            }
            next = data.nextPageCursor
        }
        return ret
    }catch(e){
        return []
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ msg: "Method Not Allowed" });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ msg: "Unauthorized" });
  }
  try{
    const centauraNewData = await getNews('centaura');
    const deadAheadNewData = await getNews("deadahead")
    const r = await supabase.from('centaura').delete()
    const r2 = await supabase.from('deadahead').delete()
    const ins1 = await supabase.from('centaura').insert({data:centauraNewData})
    const ins2 = await supabase.from('deadahead').insert({data:deadAheadNewData})
    return res.status(200).json({msg:"Data Updated"})
  }catch(e){
    return res.status(500).json({msg:"An error occured"})
  }
}

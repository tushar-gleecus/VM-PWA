import { supabase } from '../../supabaseClient';

export async function POST(req) {
  const { base64, filename } = await req.json();
  const base64Data = base64.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');

  const { data, error } = await supabase.storage
    .from('images')
    .upload(`user_uploads/${filename}`, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  const url = `https://uisclambrgfshwjuwwyw.supabase.co/storage/v1/object/public/images/${data.path}`;
  return new Response(JSON.stringify({ url }), { status: 200 });
}

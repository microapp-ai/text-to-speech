import { NextApiRequest, NextApiResponse } from 'next';

function blobToBase64(buffer: Buffer, contentType: string = 'application/octet-stream') {
  return `data:${contentType};base64,${buffer.toString('base64')}`;
}





export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  const {text, audioOption, audioFormat, audioSpeed} = req.body;
  console.log(text, audioOption, audioFormat, audioSpeed);
  try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: audioOption,
        response_format: audioFormat,
        speed: audioSpeed,
      }),
    });
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = await blobToBase64(buffer);
    res.status(200).json({  base64 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}

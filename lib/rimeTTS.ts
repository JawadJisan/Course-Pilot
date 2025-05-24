// utils/rimeTTS.ts
export async function fetchRimeTTS(text: string): Promise<Blob> {
  const response = await fetch("https://api.rime.ai/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_RIME_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice: "luna", // Choose from available voices
      model: "arcana", // or 'mist'
      sample_rate: 24000,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch TTS audio");
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Blob([arrayBuffer], { type: "audio/wav" });
}

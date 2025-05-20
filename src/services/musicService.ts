const SUNO_API_BASE = 'https://api.suno.ai/v1';

export interface MusicGenerationParams {
  prompt: string;
  duration?: number;
  style?: string;
  mood?: string;
}

export interface GeneratedMusic {
  id: string;
  url: string;
  title: string;
  duration: number;
  createdAt: Date;
}

export async function generateMusic(params: MusicGenerationParams): Promise<GeneratedMusic> {
  try {
    const response = await fetch(`${SUNO_API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: params.prompt,
        duration: params.duration || 30,
        style: params.style,
        mood: params.mood,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return {
      id: data.id,
      url: data.audioUrl,
      title: data.title,
      duration: data.duration,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Music generation error:', error);
    throw new Error('音乐生成失败');
  }
}

export async function getMusicHistory(): Promise<GeneratedMusic[]> {
  try {
    const response = await fetch(`${SUNO_API_BASE}/history`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      url: item.audioUrl,
      title: item.title,
      duration: item.duration,
      createdAt: new Date(item.createdAt),
    }));
  } catch (error) {
    console.error('Get music history error:', error);
    throw new Error('获取音乐历史记录失败');
  }
} 
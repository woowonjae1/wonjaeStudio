import { SunoClient } from '@suno/api';

const sunoClient = new SunoClient({
  apiKey: process.env.SUNO_API_KEY || '',
});

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
    const response = await sunoClient.generate({
      prompt: params.prompt,
      duration: params.duration || 30,
      style: params.style,
      mood: params.mood,
    });

    return {
      id: response.id,
      url: response.audioUrl,
      title: response.title,
      duration: response.duration,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Music generation error:', error);
    throw new Error('音乐生成失败');
  }
}

export async function getMusicHistory(): Promise<GeneratedMusic[]> {
  try {
    const response = await sunoClient.getHistory();
    return response.map(item => ({
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
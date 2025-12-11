export interface MusicTrack {
  id: number;
  title: string;
  description: string;
  image_url: string;
  audio_url: string | null;
  display_order: number;
  play_count?: number;
}

export interface MusicFormData {
  id?: number;
  title: string;
  description: string;
  image_url?: string;
  audio_url?: string | null;
}

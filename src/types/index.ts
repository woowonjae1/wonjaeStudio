// 专辑类型
export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioSrc: string;
  year: number;
  description?: string;
  tracks?: Track[];
}

// 音轨类型
export interface Track {
  id: string;
  title: string;
  duration: string;
}

// 球员类型
export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  country: string;
  imageUrl: string;
}

// 比赛类型
export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  competition: string;
  status: 'upcoming' | 'live' | 'completed';
  isFinished: boolean;
  homeTeamLogo: string;
  awayTeamLogo: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: Album | null;
}

// 添加 AlbumCard 的 Props 类型定义
export interface AlbumCardProps {
  key?: string;
  album: Album;
  onPlay: (album: Album) => void;
  isPlaying: boolean;
}
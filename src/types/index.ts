export interface Album {
    id: number;
    title: string;
    image: string;
    audioSrc: string;
    artist: string;
    imageSrc: string;
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

// 添加 Player 类型
export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  image: string;
  nationality: string;
}

// 添加赛事类型定义
export interface Match {
  id: number;
  competition: string;  // 比赛类型（英超、欧冠等）
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;  // 可选，比赛结束后才有分数
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  isFinished: boolean;
  homeTeamLogo: string;
  awayTeamLogo: string;
}
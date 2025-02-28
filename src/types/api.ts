export interface Match {
  id: number;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  isFinished: boolean;
  homeTeamLogo: string;
  awayTeamLogo: string;
} 
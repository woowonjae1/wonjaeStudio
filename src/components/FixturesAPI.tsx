import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Match {
  id: string;
  competition: {
    name: string;
    emblem: string;
  };
  homeTeam: {
    name: string;
    crest: string;
    id: number;
  };
  awayTeam: {
    name: string;
    crest: string;
    id: number;
  };
  utcDate: string;
  status: string;
  venue: string;
}

interface Team {
  id: number;
  name: string;
  short_name?: string;
  abbr?: string;
  city?: string;
  stadium?: string;
}

const FixturesAPI: React.FC = () => {
  const [fixtures, setFixtures] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        setLoading(true);
        
        // 获取API密钥
        const API_KEY = process.env.NEXT_PUBLIC_BALLDONTLIE_API_KEY || '';
        
        // 获取所有球队数据
        const teamsResponse = await fetch('https://api.balldontlie.io/epl/v1/teams?season=2024', {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        });
        
        if (!teamsResponse.ok) {
          throw new Error('Failed to fetch teams');
        }
        
        const teamsData = await teamsResponse.json();
        
        // 找到曼城队ID
        const cityTeam = teamsData.data.find((team: Team) => team.name === 'Manchester City');
        const cityId = cityTeam?.id || 27; // 默认曼城ID
        
        // 获取曼城的赛程数据
        // 注意：此处API端点可能需要根据实际文档进行调整
        const fixturesResponse = await fetch(`https://api.balldontlie.io/epl/v1/games?season=2024&team_ids[]=${cityId}&per_page=10`, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        });
        
        if (!fixturesResponse.ok) {
          throw new Error('Failed to fetch fixtures');
        }
        
        const fixturesData = await fixturesResponse.json();
        
        // 创建球队ID到球队信息的映射
        const teamsMap = new Map();
        teamsData.data.forEach((team: Team) => {
          teamsMap.set(team.id, team);
        });
        
        // 格式化比赛数据
        const formattedMatches: Match[] = fixturesData.data.map((game: any) => {
          const homeTeam = teamsMap.get(game.home_team_id);
          const awayTeam = teamsMap.get(game.away_team_id);
          
          // 获取联赛类型（假设都是英超）
          const competitionName = 'Premier League';
          
          return {
            id: game.id.toString(),
            competition: {
              name: competitionName,
              emblem: 'https://resources.premierleague.com/premierleague/badges/t8.svg'
            },
            homeTeam: {
              id: homeTeam.id,
              name: homeTeam.name,
              crest: `https://resources.premierleague.com/premierleague/badges/t${homeTeam.id}.svg`
            },
            awayTeam: {
              id: awayTeam.id,
              name: awayTeam.name,
              crest: `https://resources.premierleague.com/premierleague/badges/t${awayTeam.id}.svg`
            },
            utcDate: game.date || new Date().toISOString(),
            status: game.status || 'SCHEDULED',
            venue: homeTeam.stadium || 'TBD'
          };
        });
        
        setFixtures(formattedMatches);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError('Unable to load fixtures. Please try again later.');
        setLoading(false);
        
        // 保留模拟数据用于开发
        setFixtures([
          {
            id: '1',
            competition: {
              name: 'Premier League',
              emblem: 'https://resources.premierleague.com/premierleague/badges/t8.svg'
            },
            homeTeam: {
              id: 15,
              name: 'Nottingham Forest',
              crest: 'https://resources.premierleague.com/premierleague/badges/t15.svg'
            },
            awayTeam: {
              id: 27,
              name: 'Manchester City',
              crest: 'https://resources.premierleague.com/premierleague/badges/t27.svg'
            },
            utcDate: '2025-03-08T23:00:00Z',
            status: 'SCHEDULED',
            venue: 'City Ground'
          },
          {
            id: '2',
            competition: {
              name: 'Premier League',
              emblem: 'https://resources.premierleague.com/premierleague/badges/t8.svg'
            },
            homeTeam: {
              id: 27,
              name: 'Manchester City',
              crest: 'https://resources.premierleague.com/premierleague/badges/t27.svg'
            },
            awayTeam: {
              id: 9,
              name: 'Brighton',
              crest: 'https://resources.premierleague.com/premierleague/badges/t9.svg'
            },
            utcDate: '2025-03-15T23:00:00Z',
            status: 'SCHEDULED',
            venue: 'Etihad Stadium'
          },
          {
            id: '3',
            competition: {
              name: 'FA Cup',
              emblem: 'https://resources.premierleague.com/premierleague/badges/t8.svg'
            },
            homeTeam: {
              id: 27,
              name: 'Manchester City',
              crest: 'https://resources.premierleague.com/premierleague/badges/t27.svg'
            },
            awayTeam: {
              id: 32,
              name: 'Newcastle United',
              crest: 'https://resources.premierleague.com/premierleague/badges/t32.svg'
            },
            utcDate: '2025-03-23T01:30:00Z',
            status: 'SCHEDULED',
            venue: 'Etihad Stadium'
          }
        ]);
      }
    };
    
    fetchFixtures();
  }, []);

  // 格式化日期
  const formatDate = (utcDate: string) => {
    const date = new Date(utcDate);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold mb-8">Upcoming Fixtures</h2>
      
      {loading && <div className="text-center py-8">Loading fixtures...</div>}
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {fixtures.map((match) => (
          <div 
            key={match.id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center space-y-2 w-1/3">
                <div className="w-16 h-16 relative">
                  <Image
                    src={match.homeTeam.crest}
                    alt={match.homeTeam.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className="font-bold text-center">{match.homeTeam.name}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center w-1/3">
                <div className="mb-2 bg-gray-100 px-4 py-1 rounded-full">
                  <span className="text-sm font-medium">{match.competition.name}</span>
                </div>
                <div className="text-xl font-bold">VS</div>
                <div className="mt-1 text-sm text-gray-500">{formatDate(match.utcDate)}</div>
                <div className="mt-1 text-xs text-gray-400">{match.venue}</div>
              </div>
              
              <div className="flex flex-col items-center space-y-2 w-1/3">
                <div className="w-16 h-16 relative">
                  <Image
                    src={match.awayTeam.crest}
                    alt={match.awayTeam.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className="font-bold text-center">{match.awayTeam.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixturesAPI; 
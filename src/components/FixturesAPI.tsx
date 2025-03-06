'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 定义符合API返回格式的接口
interface ApiResponse {
  matches: ApiMatch[];
  count: number;
}

interface ApiMatch {
  id: number;
  competition: {
    id: number;
    name: string;
    type: string;
    emblem: string;
  };
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  utcDate: string;
  status: string;
  venue: string;
  matchday: number;
}

// 用于UI显示的赛事数据类型
interface Fixture {
  id: string;
  competition: string;
  competitionType: 'league' | 'cup' | 'friendly';
  homeTeam: {
    name: string;
    shortName: string;
    logo: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo: string;
  };
  date: string;
  time: string;
  venue: string;
  status: string;
}

const FixturesAPI: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useBackupData, setUseBackupData] = useState<boolean>(false);
  
  // 备用数据 - 在API失败时使用
  const backupFixtures: Fixture[] = [
    {
      id: '1',
      competition: 'Premier League',
      competitionType: 'league',
      homeTeam: {
        name: 'Manchester City',
        shortName: 'MCI',
        logo: 'https://crests.football-data.org/65.png'
      },
      awayTeam: {
        name: 'Wolverhampton',
        shortName: 'WOL',
        logo: 'https://crests.football-data.org/76.png'
      },
      date: '2024-05-04',
      time: '15:00',
      venue: 'Etihad Stadium',
      status: 'SCHEDULED'
    },
    {
      id: '2',
      competition: 'Premier League',
      competitionType: 'league',
      homeTeam: {
        name: 'Fulham',
        shortName: 'FUL',
        logo: 'https://crests.football-data.org/63.png'
      },
      awayTeam: {
        name: 'Manchester City',
        shortName: 'MCI',
        logo: 'https://crests.football-data.org/65.png'
      },
      date: '2024-05-11',
      time: '15:00',
      venue: 'Craven Cottage',
      status: 'SCHEDULED'
    },
    {
      id: '3',
      competition: 'Premier League',
      competitionType: 'league',
      homeTeam: {
        name: 'Manchester City',
        shortName: 'MCI',
        logo: 'https://crests.football-data.org/65.png'
      },
      awayTeam: {
        name: 'West Ham',
        shortName: 'WHU',
        logo: 'https://crests.football-data.org/563.png'
      },
      date: '2024-05-19',
      time: '16:00',
      venue: 'Etihad Stadium',
      status: 'SCHEDULED'
    }
  ];

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        if (useBackupData) {
          setFixtures(backupFixtures);
          setLoading(false);
          return;
        }
        
        // 尝试从API获取数据
        const response = await axios.get('https://api.football-data.org/v4/teams/65/matches', {
          headers: { 'X-Auth-Token': '06ef74f41cba44228f23cc92fdc95128' },
          params: {
            status: 'SCHEDULED', 
            limit: 5
          },
          timeout: 5000 // 5秒超时
        });
        
        // 处理API数据
        const apiMatches = response.data.matches || [];
        if (apiMatches.length === 0) {
          // 如果API返回空数据，使用备用数据
          setUseBackupData(true);
          setFixtures(backupFixtures);
        } else {
          // 转换API数据
          const formattedFixtures = apiMatches.map(match => ({
            id: match.id.toString(),
            competition: match.competition.name,
            competitionType: getCompetitionType(match.competition.type),
            homeTeam: {
              name: match.homeTeam.name,
              shortName: match.homeTeam.shortName || match.homeTeam.name.substring(0, 3).toUpperCase(),
              logo: match.homeTeam.crest || ''
            },
            awayTeam: {
              name: match.awayTeam.name,
              shortName: match.awayTeam.shortName || match.awayTeam.name.substring(0, 3).toUpperCase(),
              logo: match.awayTeam.crest || ''
            },
            date: match.utcDate.substring(0, 10),
            time: match.utcDate.substring(11, 16),
            venue: match.venue || '待定',
            status: match.status
          }));
          setFixtures(formattedFixtures);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        // 使用备用数据
        setUseBackupData(true);
        setFixtures(backupFixtures);
        setLoading(false);
      }
    };

    fetchFixtures();
  }, [useBackupData]);

  // 确定比赛类型
  const getCompetitionType = (type: string): 'league' | 'cup' | 'friendly' => {
    if (type === 'LEAGUE') return 'league';
    if (type === 'CUP') return 'cup';
    return 'friendly';
  }

  // 获取比赛类型的样式
  const getCompetitionStyle = (type: 'league' | 'cup' | 'friendly') => {
    switch (type) {
      case 'league':
        return 'bg-purple-600 text-white';
      case 'cup':
        return 'bg-blue-600 text-white';
      case 'friendly':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // 格式化日期显示
  const formatMatchDate = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}:00Z`);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    return `${year}年${month}月${day}日 ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  // 处理重新获取数据
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setUseBackupData(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">曼城近期赛程</h2>
      
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {useBackupData && !loading && (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-6">
          注意：当前显示的是备用数据，可能不是最新赛程。
          <button 
            onClick={handleRefresh}
            className="ml-4 underline hover:text-yellow-800"
          >
            重试
          </button>
        </div>
      )}
      
      {error && (
        <div className="text-center text-red-500 my-6 p-4 bg-red-50 rounded-lg">
          {error}
          <button 
            onClick={handleRefresh}
            className="ml-4 underline hover:text-red-800"
          >
            重试
          </button>
        </div>
      )}
      
      {!loading && fixtures.length === 0 && !error && (
        <div className="text-center text-gray-500 my-6">
          暂无曼城近期赛程数据
        </div>
      )}
      
      <div className="space-y-4">
        {fixtures.map((fixture) => (
          <div 
            key={fixture.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center space-y-3 w-1/3">
                {fixture.homeTeam.logo ? (
                  <img 
                    src={fixture.homeTeam.logo} 
                    alt={fixture.homeTeam.name}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/64/6CABDD/FFFFFF/?text=' + fixture.homeTeam.shortName;
                    }}
                  />
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ 
                      backgroundColor: '#6CABDD',
                      color: '#ffffff',
                      border: '2px solid #ffffff',
                    }}
                  >
                    {fixture.homeTeam.shortName}
                  </div>
                )}
                <span className="font-semibold text-center">{fixture.homeTeam.name}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center w-1/3">
                <div className={`mb-2 px-3 py-1 rounded-full ${getCompetitionStyle(fixture.competitionType)}`}>
                  <span className="text-sm font-medium">{fixture.competition}</span>
                </div>
                <div className="text-xl font-bold">VS</div>
                <div className="mt-2 text-sm text-gray-600">{formatMatchDate(fixture.date, fixture.time)}</div>
                <div className="mt-1 text-xs text-gray-500">{fixture.venue}</div>
              </div>
              
              <div className="flex flex-col items-center space-y-3 w-1/3">
                {fixture.awayTeam.logo ? (
                  <img 
                    src={fixture.awayTeam.logo} 
                    alt={fixture.awayTeam.name}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/64/6CABDD/FFFFFF/?text=' + fixture.awayTeam.shortName;
                    }}
                  />
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg"
                    style={{ 
                      backgroundColor: '#6CABDD',
                      color: '#ffffff',
                      border: '2px solid #ffffff',
                    }}
                  >
                    {fixture.awayTeam.shortName}
                  </div>
                )}
                <span className="font-semibold text-center">{fixture.awayTeam.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          查看更多赛程
        </button>
      </div>
    </div>
  );
};

export default FixturesAPI;
import React from 'react';
import Image from 'next/image';
import { Match } from '@/types';

interface MatchScheduleProps {
  matches: Match[];
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({ matches }) => {
  const upcomingMatches = matches.filter(match => !match.isFinished);
  const recentResults = matches.filter(match => match.isFinished);

  return (
    <div className="space-y-12">
      {/* 最近比赛结果 */}
      <div>
        <h3 className="text-4xl font-bold text-[#98C5E9] mb-8">RECENT RESULTS</h3>
        <div className="space-y-4">
          {recentResults.slice(0, 5).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>

      {/* 即将进行的比赛 */}
      <div>
        <h3 className="text-4xl font-bold text-[#98C5E9] mb-8">UPCOMING FIXTURES</h3>
        <div className="space-y-4">
          {upcomingMatches.slice(0, 5).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MatchCard: React.FC<{match: Match}> = ({ match }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* 主队 */}
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 relative">
            <Image
              src={`https://ui-avatars.com/api/?name=${match.homeTeam}&bold=true&background=98C5E9&color=fff`}
              alt={match.homeTeam}
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg">{match.homeTeam}</span>
        </div>

        {/* 比分/时间 */}
        <div className="text-center">
          {match.isFinished ? (
            <div className="text-2xl font-bold">
              {match.homeScore} - {match.awayScore}
            </div>
          ) : (
            <div>
              <div className="text-lg">{match.time}</div>
              <div className="text-sm text-gray-500">{match.date}</div>
            </div>
          )}
        </div>

        {/* 客队 */}
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 relative">
            <Image
              src={match.awayTeamLogo}
              alt={match.awayTeam}
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-lg">{match.awayTeam}</span>
        </div>
      </div>

      {/* 比赛信息 */}
      <div className="text-right">
        <div className="text-sm text-gray-500">{match.competition}</div>
        <div className="text-sm text-gray-500">{match.venue}</div>
      </div>
    </div>
  </div>
);

export default MatchSchedule; 
import React from 'react';
import Image from 'next/image';
import { Player } from '@/types';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

interface PlayerGridProps {
  players: Player[];
}

const PlayerGrid: React.FC<PlayerGridProps> = ({ players }) => {
  // 按位置分组
  const goalkeepers = players.filter(p => p.position === "Goalkeeper");
  const defenders = players.filter(p => p.position === "Defender");
  const midfielders = players.filter(p => p.position === "Midfielder");
  const forwards = players.filter(p => p.position === "Forward");

  return (
    <div className="space-y-12">
      {/* 门将部分 */}
      <div>
        <h3 className="text-4xl font-bold text-[#98C5E9] mb-8">GOALKEEPERS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goalkeepers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>

      {/* 后卫部分 */}
      <div>
        <h3 className="text-4xl font-bold text-[#98C5E9] mb-8">DEFENDERS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defenders.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>

      {/* 中场部分 */}
      <div>
        <h3 className="text-4xl font-bold text-[#98C5E9] mb-8">MIDFIELDERS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {midfielders.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>

      {/* 前锋部分 */}
      <div>
        <h3 className="text-4xl font-bold text-[#98C5E9] mb-8">FORWARDS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {forwards.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
};

// 单个球员卡片组件
const PlayerCard: React.FC<{player: Player}> = ({ player }) => {
  // 国家代码映射
  const countryCodeMap: { [key: string]: string } = {
    'Brazil': 'BR',
    'Germany': 'DE',
    'England': 'GB',
    'Portugal': 'PT',
    'Netherlands': 'NL',
    'Croatia': 'HR',
    'Belgium': 'BE',
    'Spain': 'ES',
    'Norway': 'NO',
    'Colombia': 'CO'
  };

  const countryCode = countryCodeMap[player.nationality];
  const flagEmoji = countryCode ? getUnicodeFlagIcon(countryCode) : '🏳️';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-80 w-full bg-[#98C5E9]">
        <Image
          src={`https://ui-avatars.com/api/?name=${player.name}&background=98C5E9&color=fff&size=512`}
          alt={player.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4 text-8xl font-bold text-white opacity-30">
          {player.number}
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="text-2xl">
            {flagEmoji}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-2xl font-bold text-[#1C2C5B]">{player.name}</h3>
      </div>
    </div>
  );
};

export default PlayerGrid; 
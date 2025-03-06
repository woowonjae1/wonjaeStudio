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
  
  // 使用开源足球球员图片 - 使用体育相关的可靠图片源
  const getPlayerImage = () => {
    // 使用 Sports DB API 的公开图片
    const position = player.position.toLowerCase();
    const id = player.id % 10 + 1; // 用于多样化图片
    
    // 返回可靠的体育图片
    return `https://source.unsplash.com/300x400/?football,${position},player`;
  };

  const playerImage = getPlayerImage();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-80 w-full bg-[#98C5E9]">
        {/* 球员图片 */}
        <div className="absolute inset-0 z-10">
          <Image
            src={playerImage}
            alt={player.name}
            fill
            className="object-cover object-center"
            unoptimized
          />
        </div>
        
        {/* 蓝色渐变叠加层 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#98C5E9]/70 to-transparent z-20"></div>
        
        {/* 球衣号码 */}
        <div className="absolute top-2 right-4 text-7xl font-bold text-white opacity-80 z-30 drop-shadow-lg">
          {player.number}
        </div>
        
        {/* 国旗 */}
        <div className="absolute bottom-4 left-4 z-30">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
            <span className="text-xl">{countryCode ? getUnicodeFlagIcon(countryCode) : '🏳️'}</span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white">
        <h3 className="text-xl font-bold text-[#1C2C5B] uppercase tracking-wide">{player.name}</h3>
      </div>
    </div>
  );
};

export default PlayerGrid; 
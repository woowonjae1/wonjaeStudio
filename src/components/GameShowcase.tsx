'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaPlaystation, FaSteam, FaXbox } from 'react-icons/fa';
import { SiEpicgames, SiRiotgames, SiUbisoft } from 'react-icons/si';

// 游戏数据类型
interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'FPS' | 'MOBA' | 'Adventure' | 'Battle Royale';
  platforms: string[];
  rating: number;
  releaseYear: number;
}

// 游戏数据
const games: Game[] = [
  {
    id: 1,
    title: "Counter-Strike 2",
    description: "全球最受欢迎的战术射击游戏的最新版本，具有更好的图形和改进的物理引擎。",
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1000&auto=format&fit=crop",
    category: "FPS",
    platforms: ["PC", "Steam"],
    rating: 4.8,
    releaseYear: 2023
  },
  {
    id: 2,
    title: "无畏契约 (Valorant)",
    description: "Riot Games的5v5角色型战术射击游戏，融合了精准射击和独特角色技能。",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
    category: "FPS",
    platforms: ["PC"],
    rating: 4.7,
    releaseYear: 2020
  },
  {
    id: 3,
    title: "英雄联盟 (League of Legends)",
    description: "全球最受欢迎的MOBA游戏，5v5团队合作，多样化的英雄选择。",
    image: "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=1000&auto=format&fit=crop",
    category: "MOBA",
    platforms: ["PC", "Mobile"],
    rating: 4.6,
    releaseYear: 2009
  },
  {
    id: 4,
    title: "守望先锋2 (Overwatch 2)",
    description: "暴雪娱乐推出的团队射击游戏，拥有独特的英雄和技能，强调团队合作。",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
    category: "FPS",
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    rating: 4.3,
    releaseYear: 2022
  },
  {
    id: 5,
    title: "刺客信条：幻影 (Assassin's Creed Mirage)",
    description: "育碧的动作冒险游戏，回归系列根源，以巴格达为背景的刺客冒险。",
    image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=1000&auto=format&fit=crop",
    category: "Adventure",
    platforms: ["PC", "PlayStation", "Xbox"],
    rating: 4.4,
    releaseYear: 2023
  },
  {
    id: 6,
    title: "Apex英雄 (Apex Legends)",
    description: "EA出品的免费多人射击游戏，以独特角色能力和快节奏战斗著称。",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1000&auto=format&fit=crop",
    category: "Battle Royale",
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    rating: 4.5,
    releaseYear: 2019
  },
  {
    id: 7,
    title: "绝地求生 (PUBG)",
    description: "由Krafton开发的大逃杀类游戏，100名玩家在岛上进行生存对抗，最后存活者获胜。",
    image: "https://images.unsplash.com/photo-1594347744426-aded257a74c2?q=80&w=1000&auto=format&fit=crop",
    category: "Battle Royale",
    platforms: ["PC", "PlayStation", "Xbox", "Mobile"],
    rating: 4.5,
    releaseYear: 2017
  }
];

// 游戏新闻数据
const gameNews = [
  {
    id: 1,
    title: "CS2大型更新发布",
    summary: "Valve推出CS2的重大更新，改进了多个地图和武器平衡性。",
    date: "2023-12-15"
  },
  {
    id: 2,
    title: "英雄联盟2024赛季即将开始",
    summary: "Riot Games宣布英雄联盟2024职业赛季的开始日期和重大变化。",
    date: "2023-12-10"
  },
  {
    id: 3,
    title: "无畏契约新角色曝光",
    summary: "Riot Games预告了即将加入无畏契约的全新角色及其独特能力。",
    date: "2023-12-05"
  }
];

const GameShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // 筛选游戏
  const filteredGames = selectedCategory 
    ? games.filter(game => game.category === selectedCategory)
    : games;

  // 平台图标映射
  const platformIcons: { [key: string]: React.ReactNode } = {
    "Steam": <FaSteam className="text-xl" />,
    "PC": <SiEpicgames className="text-xl" />,
    "PlayStation": <FaPlaystation className="text-xl" />,
    "Xbox": <FaXbox className="text-xl" />,
    "Mobile": <SiRiotgames className="text-xl" />,
    "Switch": <SiUbisoft className="text-xl" />
  };

  // 在组件内添加这行来检查数据
  console.log("Games data:", games);
  console.log("Filtered games:", filteredGames);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">游戏世界</h1>
      
      {/* 分类筛选 */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full ${!selectedCategory 
            ? 'bg-[#1C2C5B] text-white' 
            : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          全部
        </button>
        {['FPS', 'MOBA', 'Adventure', 'Battle Royale'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full ${selectedCategory === category 
              ? 'bg-[#1C2C5B] text-white' 
              : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 游戏展示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredGames.length > 0 ? (
          filteredGames.map((game, index) => (
            <motion.div 
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(game.rating) ? 'text-yellow-400' : 'text-gray-400'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1">{game.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{game.title}</h3>
                  <span className="text-xs bg-[#98C5E9] text-[#1C2C5B] px-2 py-1 rounded-full">{game.releaseYear}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.platforms.map(platform => (
                    <div key={platform} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <span className="mr-1">{platformIcons[platform]}</span>
                      <span className="text-xs">{platform}</span>
                    </div>
                  ))}
                </div>
                
                <button className="w-full bg-[#1C2C5B] text-white py-2 rounded-lg hover:bg-[#98C5E9] hover:text-[#1C2C5B] transition-colors">
                  了解更多
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            未找到游戏数据，请检查控制台日志
          </div>
        )}
      </div>

      {/* Steam推荐 */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaSteam className="mr-2" />
          Steam推荐游戏
        </h2>
        <div className="bg-gray-900 text-white rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-xl font-bold mb-2">周末特惠</h3>
              <p className="mb-4">探索Steam上数千款折扣游戏，包括大作和独立游戏。</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="font-semibold">本周热门</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Counter-Strike 2</li>
                    <li>• Baldur's Gate 3</li>
                    <li>• Cyberpunk 2077</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="font-semibold">即将推出</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Hollow Knight: Silksong</li>
                    <li>• Starfield</li>
                    <li>• Frostpunk 2</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Steam夏季特卖</h3>
                <p className="text-sm">即将开始！准备好你的愿望清单，6月22日开始大幅折扣。</p>
              </div>
              <button className="bg-white text-blue-600 font-bold py-2 px-4 rounded mt-4 hover:bg-opacity-90 transition-colors">
                加入提醒
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 游戏新闻 */}
      <div>
        <h2 className="text-2xl font-bold mb-6">游戏新闻</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gameNews.map(news => (
            <div key={news.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="text-xs text-gray-500 mb-2">{news.date}</div>
              <h3 className="font-bold text-lg mb-2">{news.title}</h3>
              <p className="text-gray-600">{news.summary}</p>
              <a href="#" className="text-[#1C2C5B] hover:underline mt-2 inline-block">阅读全文</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameShowcase; 
import Image from 'next/image';
import Link from 'next/link';

// 游戏数据
const games = [
  {
    id: 1,
    title: "Counter-Strike 2",
    category: "FPS",
    description: "《Counter-Strike 2》是Valve开发的免费FPS游戏，是《CS:GO》的后续作品，采用Source 2引擎，拥有更好的图形和物理效果。",
    image: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=400&auto=format&fit=crop",
    releaseDate: "2023年9月",
    platforms: ["PC"]
  },
  {
    id: 2,
    title: "无畏契约 (Valorant)",
    category: "FPS",
    description: "《无畏契约》是Riot Games开发的5v5角色型战术射击游戏，结合了精准射击和独特角色技能，为玩家提供战术深度。",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop",
    releaseDate: "2020年6月",
    platforms: ["PC"]
  },
  {
    id: 3,
    title: "英雄联盟",
    category: "MOBA",
    description: "《英雄联盟》是全球最受欢迎的MOBA游戏之一，玩家控制英雄角色，与队友合作击败敌方团队，摧毁对方基地。",
    image: "https://images.unsplash.com/photo-1624085568108-36410cfe4d24?q=80&w=400&auto=format&fit=crop",
    releaseDate: "2009年10月",
    platforms: ["PC", "移动端"]
  },
  {
    id: 4,
    title: "绝地求生 (PUBG)",
    category: "Battle Royale",
    description: "《绝地求生》是一款大逃杀类游戏，100名玩家跳伞到孤岛上，收集装备并战斗，直到最后一人或一队存活。",
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=400&auto=format&fit=crop",
    releaseDate: "2017年12月",
    platforms: ["PC", "主机", "移动端"]
  },
  {
    id: 5,
    title: "Minecraft",
    category: "沙盒",
    description: "《Minecraft》是一款关于方块与冒险的游戏。探索随机生成的世界，建造各种结构，或者在生存模式中与怪物战斗。",
    image: "https://images.unsplash.com/photo-1587573089734-599d584d49e7?q=80&w=400&auto=format&fit=crop",
    releaseDate: "2011年11月",
    platforms: ["PC", "主机", "移动端"]
  },
  {
    id: 6,
    title: "Apex英雄",
    category: "Battle Royale",
    description: "《Apex英雄》是一款免费的大逃杀游戏，玩家组成三人小队，选择具有独特能力的"传奇"角色，在不断缩小的地图上战斗。",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=400&auto=format&fit=crop",
    releaseDate: "2019年2月",
    platforms: ["PC", "主机", "移动端"]
  }
];

// 游戏新闻
const gameNews = [
  {
    id: 1,
    title: "《Counter-Strike 2》发布重大更新，优化了烟雾效果",
    date: "2023-12-15",
    summary: "Valve为《CS2》推出了新补丁，大幅改进了游戏中的烟雾弹物理效果和渲染方式。"
  },
  {
    id: 2,
    title: "《英雄联盟》世界赛：LPL战队再次夺冠",
    date: "2023-11-19",
    summary: "在一场激动人心的决赛中，来自LPL赛区的战队击败了韩国对手，赢得了世界冠军。"
  },
  {
    id: 3,
    title: "《Minecraft》将推出全新生物群系更新",
    date: "2024-01-10",
    summary: "Mojang宣布《Minecraft》即将迎来重大更新，添加新的生物群系、生物和建筑材料。"
  }
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#1C2C5B]">游戏资讯中心</h1>
        
        {/* 游戏新闻部分 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#1C2C5B]">最新游戏动态</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            {gameNews.map(news => (
              <div key={news.id} className="mb-6 pb-6 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{news.date}</p>
                <p className="text-gray-700">{news.summary}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* 游戏列表部分 */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#1C2C5B]">热门游戏推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map(game => (
              <div key={game.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{game.title}</h3>
                    <span className="bg-[#98C5E9] text-white text-xs font-semibold px-2.5 py-1 rounded">{game.category}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>发布日期: {game.releaseDate}</span>
                    <span>平台: {game.platforms.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* 游戏社区部分 */}
        <section className="mt-16">
          <div className="bg-[#1C2C5B] text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">加入我们的游戏社区</h2>
            <p className="mb-6">与其他玩家分享游戏体验，讨论策略，组队游戏</p>
            <Link 
              href="#" 
              className="inline-block bg-white text-[#1C2C5B] font-bold py-3 px-8 rounded-full hover:bg-[#98C5E9] hover:text-white transition-colors duration-300"
            >
              立即加入
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 
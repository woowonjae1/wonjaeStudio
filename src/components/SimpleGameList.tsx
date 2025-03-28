'use client'

import React from 'react';

const SimpleGameList = () => {
  // 简单的游戏数据
  const games = [
    { id: 1, title: "Counter-Strike 2", category: "FPS" },
    { id: 2, title: "无畏契约 (Valorant)", category: "FPS" },
    { id: 3, title: "英雄联盟", category: "MOBA" },
    { id: 7, title: "绝地求生 (PUBG)", category: "Battle Royale" }
  ];

  console.log("SimpleGameList渲染中，游戏数量:", games.length);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">游戏列表</h1>
      
      <div className="bg-white shadow-md rounded p-4">
        <ul className="divide-y">
          {games.map(game => (
            <li key={game.id} className="py-3">
              <div className="font-semibold">{game.title}</div>
              <div className="text-sm text-gray-600">{game.category}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SimpleGameList; 
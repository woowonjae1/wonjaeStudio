"use client";

import {
  IconMessage,
  IconMessageCircle,
  IconEye,
  IconCalendar,
  IconMusic,
} from "@tabler/icons-react";
import "./StatsCards.css";

interface StatsCardsProps {
  totalTopics: number;
  totalReplies: number;
  totalViews: number;
  topicsLast7Days: number;
  totalTracks: number;
}

export default function StatsCards({
  totalTopics,
  totalReplies,
  totalViews,
  topicsLast7Days,
  totalTracks,
}: StatsCardsProps) {
  const cards = [
    {
      title: "话题总数",
      value: totalTopics,
      icon: IconMessage,
      color: "#8b5cf6",
    },
    {
      title: "回复总数",
      value: totalReplies,
      icon: IconMessageCircle,
      color: "#06b6d4",
    },
    {
      title: "总浏览量",
      value: totalViews,
      icon: IconEye,
      color: "#10b981",
    },
    {
      title: "近7天话题",
      value: topicsLast7Days,
      icon: IconCalendar,
      color: "#f59e0b",
    },
    {
      title: "音乐曲目",
      value: totalTracks,
      icon: IconMusic,
      color: "#ec4899",
    },
  ];

  return (
    <div className="stats-cards">
      {cards.map((card) => (
        <div key={card.title} className="stats-card">
          <div
            className="card-icon"
            style={{ backgroundColor: `${card.color}20` }}
          >
            <card.icon size={24} style={{ color: card.color }} />
          </div>
          <div className="card-content">
            <span className="card-value">{card.value.toLocaleString()}</span>
            <span className="card-title">{card.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

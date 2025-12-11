"use client";

import { useState, useEffect } from "react";
import { getPosts, getReplies } from "@/lib/communityStorage";

interface CommunityStats {
  totalPosts: number;
  totalReplies: number;
  totalUsers: number;
  onlineUsers: number;
}

export default function CommunityRightSidebar() {
  const [stats, setStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalReplies: 0,
    totalUsers: 0,
    onlineUsers: 1,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const posts = await getPosts();
        let totalReplies = 0;
        const uniqueUsers = new Set<string>();

        for (const post of posts) {
          const replies = await getReplies(post.id);
          totalReplies += replies.length;
          uniqueUsers.add(post.author);
          replies.forEach((reply) => uniqueUsers.add(reply.author));
        }

        setStats({
          totalPosts: posts.length,
          totalReplies,
          totalUsers: uniqueUsers.size,
          onlineUsers: Math.min(
            Math.max(1, Math.floor(uniqueUsers.size * 0.2)),
            uniqueUsers.size
          ),
        });
      } catch (error) {
        console.error("Failed to load community stats:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <aside className="community-right-sidebar">
      {/* Stats */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">社区统计</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.totalPosts}</div>
            <div className="stat-label">话题</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalReplies}</div>
            <div className="stat-label">回复</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">用户</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.onlineUsers}</div>
            <div className="stat-label">在线</div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">关于社区</h3>
        <div className="community-info">
          <p>欢迎来到音乐制作社区！这里是音乐爱好者和制作人交流的地方。</p>
          <ul>
            <li>🎼 分享你的音乐作品</li>
            <li>🎹 学习制作技巧</li>
            <li>🎧 讨论插件和设备</li>
            <li>🤝 寻求帮助和建议</li>
          </ul>
        </div>
      </div>

      {/* Tags */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">热门标签</h3>
        <div className="genre-tags">
          <span className="genre-tag">EQ</span>
          <span className="genre-tag">压缩</span>
          <span className="genre-tag">混响</span>
          <span className="genre-tag">人声</span>
          <span className="genre-tag">合成器</span>
          <span className="genre-tag">采样</span>
        </div>
      </div>
    </aside>
  );
}

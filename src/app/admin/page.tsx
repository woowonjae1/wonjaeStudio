"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatsCards from "@/components/admin/StatsCards";
import { IconLoader2 } from "@tabler/icons-react";
import "./dashboard.css";

interface Stats {
  totalTopics: number;
  totalReplies: number;
  totalViews: number;
  topicsLast7Days: number;
  totalTracks: number;
  recentTopics: Array<{
    id: number;
    title: string;
    author_name: string;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError("加载统计数据失败");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return "刚刚";
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return date.toLocaleDateString("zh-CN");
  };

  return (
    <div className="admin-page">
      <AdminHeader title="仪表盘" />

      <div className="admin-content">
        {loading ? (
          <div className="loading-state">
            <IconLoader2 className="spin" size={32} />
            <span>加载中...</span>
          </div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : stats ? (
          <>
            <StatsCards
              totalTopics={stats.totalTopics}
              totalReplies={stats.totalReplies}
              totalViews={stats.totalViews}
              topicsLast7Days={stats.topicsLast7Days}
              totalTracks={stats.totalTracks}
            />

            <div className="recent-topics">
              <h2>最近话题</h2>
              {stats.recentTopics.length === 0 ? (
                <p className="empty-text">暂无话题</p>
              ) : (
                <div className="topics-list">
                  {stats.recentTopics.map((topic) => (
                    <div key={topic.id} className="topic-item">
                      <div className="topic-info">
                        <span className="topic-title">{topic.title}</span>
                        <span className="topic-author">
                          {topic.author_name}
                        </span>
                      </div>
                      <span className="topic-time">
                        {formatTime(topic.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

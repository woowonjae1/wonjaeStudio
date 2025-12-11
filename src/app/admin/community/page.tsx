"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import {
  IconTrash,
  IconPin,
  IconPinFilled,
  IconSearch,
  IconExternalLink,
} from "@tabler/icons-react";
import "./community.css";

interface Topic {
  id: number;
  title: string;
  author_name: string;
  category: string;
  views: number;
  replies_count: number;
  pinned: boolean;
  created_at: string;
}

interface Reply {
  id: number;
  content: string;
  author_name: string;
  created_at: string;
  topic_id: number;
  topic_title: string;
}

const categories = [
  { id: "all", name: "全部" },
  { id: "production", name: "编曲" },
  { id: "mixing", name: "混音" },
  { id: "plugins", name: "插件" },
  { id: "showcase", name: "作品" },
  { id: "help", name: "问答" },
];

export default function CommunityManagementPage() {
  const [activeTab, setActiveTab] = useState<"topics" | "replies">("topics");

  // Topics state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsTotal, setTopicsTotal] = useState(0);
  const [topicsPage, setTopicsPage] = useState(1);
  const [topicsTotalPages, setTopicsTotalPages] = useState(1);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [topicsSortBy, setTopicsSortBy] = useState("created_at");
  const [topicsSortOrder, setTopicsSortOrder] = useState<"asc" | "desc">(
    "desc"
  );
  const [deleteTopicId, setDeleteTopicId] = useState<number | null>(null);

  // Replies state
  const [replies, setReplies] = useState<Reply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [repliesTotal, setRepliesTotal] = useState(0);
  const [repliesPage, setRepliesPage] = useState(1);
  const [repliesTotalPages, setRepliesTotalPages] = useState(1);
  const [repliesSortBy, setRepliesSortBy] = useState("created_at");
  const [repliesSortOrder, setRepliesSortOrder] = useState<"asc" | "desc">(
    "desc"
  );
  const [deleteReplyId, setDeleteReplyId] = useState<number | null>(null);

  // Fetch topics
  const fetchTopics = useCallback(async () => {
    setTopicsLoading(true);
    try {
      const params = new URLSearchParams({
        page: topicsPage.toString(),
        limit: "20",
        category,
        search,
        sortBy: topicsSortBy,
        sortOrder: topicsSortOrder,
      });
      const res = await fetch(`/api/admin/topics?${params}`);
      const data = await res.json();
      setTopics(data.topics || []);
      setTopicsTotal(data.total || 0);
      setTopicsTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setTopicsLoading(false);
    }
  }, [topicsPage, category, search, topicsSortBy, topicsSortOrder]);

  // Fetch replies
  const fetchReplies = useCallback(async () => {
    setRepliesLoading(true);
    try {
      const params = new URLSearchParams({
        page: repliesPage.toString(),
        limit: "20",
        sortBy: repliesSortBy,
        sortOrder: repliesSortOrder,
      });
      const res = await fetch(`/api/admin/replies?${params}`);
      const data = await res.json();
      setReplies(data.replies || []);
      setRepliesTotal(data.total || 0);
      setRepliesTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    } finally {
      setRepliesLoading(false);
    }
  }, [repliesPage, repliesSortBy, repliesSortOrder]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  const handleDeleteTopic = async (id: number) => {
    try {
      await fetch(`/api/admin/topics/${id}`, { method: "DELETE" });
      fetchTopics();
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
    setDeleteTopicId(null);
  };

  const handleDeleteReply = async (id: number) => {
    try {
      await fetch(`/api/admin/replies/${id}`, { method: "DELETE" });
      fetchReplies();
    } catch (error) {
      console.error("Failed to delete reply:", error);
    }
    setDeleteReplyId(null);
  };

  const handlePin = async (id: number) => {
    try {
      await fetch(`/api/admin/topics/${id}/pin`, { method: "PUT" });
      fetchTopics();
    } catch (error) {
      console.error("Failed to pin topic:", error);
    }
  };

  const handleTopicsSort = (key: string, order: "asc" | "desc") => {
    setTopicsSortBy(key);
    setTopicsSortOrder(order);
    setTopicsPage(1);
  };

  const handleRepliesSort = (key: string, order: "asc" | "desc") => {
    setRepliesSortBy(key);
    setRepliesSortOrder(order);
    setRepliesPage(1);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const topicsColumns: Column<Topic>[] = [
    {
      key: "title",
      label: "标题",
      sortable: true,
      render: (topic) => (
        <div className="topic-title-cell">
          {topic.pinned && <IconPinFilled size={14} className="pin-icon" />}
          <span>{topic.title}</span>
        </div>
      ),
    },
    { key: "author_name", label: "作者" },
    {
      key: "category",
      label: "分类",
      render: (topic) => (
        <span className="category-badge">
          {categories.find((c) => c.id === topic.category)?.name ||
            topic.category}
        </span>
      ),
    },
    { key: "views", label: "浏览", sortable: true },
    { key: "replies_count", label: "回复", sortable: true },
    {
      key: "created_at",
      label: "创建时间",
      sortable: true,
      render: (topic) => formatTime(topic.created_at),
    },
    {
      key: "actions",
      label: "操作",
      render: (topic) => (
        <div className="action-buttons">
          <button
            className={`action-btn pin-btn ${topic.pinned ? "pinned" : ""}`}
            onClick={() => handlePin(topic.id)}
            title={topic.pinned ? "取消置顶" : "置顶"}
          >
            {topic.pinned ? <IconPinFilled size={16} /> : <IconPin size={16} />}
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => setDeleteTopicId(topic.id)}
            title="删除"
          >
            <IconTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const repliesColumns: Column<Reply>[] = [
    {
      key: "content",
      label: "内容",
      render: (reply) => (
        <span className="content-preview">
          {truncateContent(reply.content)}
        </span>
      ),
    },
    { key: "author_name", label: "作者" },
    {
      key: "topic_title",
      label: "所属话题",
      render: (reply) => (
        <Link
          href={`/community/post/${reply.topic_id}`}
          className="topic-link"
          target="_blank"
        >
          {truncateContent(reply.topic_title, 30)}
          <IconExternalLink size={14} />
        </Link>
      ),
    },
    {
      key: "created_at",
      label: "创建时间",
      sortable: true,
      render: (reply) => formatTime(reply.created_at),
    },
    {
      key: "actions",
      label: "操作",
      render: (reply) => (
        <div className="action-buttons">
          <button
            className="action-btn delete-btn"
            onClick={() => setDeleteReplyId(reply.id)}
            title="删除"
          >
            <IconTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <AdminHeader title="社区管理" />

      <div className="admin-content">
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === "topics" ? "active" : ""}`}
              onClick={() => setActiveTab("topics")}
            >
              话题管理
            </button>
            <button
              className={`tab-button ${activeTab === "replies" ? "active" : ""}`}
              onClick={() => setActiveTab("replies")}
            >
              回复管理
            </button>
          </div>

          {activeTab === "topics" && (
            <div className="tab-content">
              <div className="topics-toolbar">
                <div className="filter-group">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setTopicsPage(1);
                    }}
                    className="category-select"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <div className="search-input">
                    <IconSearch size={18} />
                    <input
                      type="text"
                      placeholder="搜索标题..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setTopicsPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              <DataTable
                data={topics}
                columns={topicsColumns}
                total={topicsTotal}
                page={topicsPage}
                totalPages={topicsTotalPages}
                onPageChange={setTopicsPage}
                onSort={handleTopicsSort}
                sortBy={topicsSortBy}
                sortOrder={topicsSortOrder}
                loading={topicsLoading}
              />
            </div>
          )}

          {activeTab === "replies" && (
            <div className="tab-content">
              <DataTable
                data={replies}
                columns={repliesColumns}
                total={repliesTotal}
                page={repliesPage}
                totalPages={repliesTotalPages}
                onPageChange={setRepliesPage}
                onSort={handleRepliesSort}
                sortBy={repliesSortBy}
                sortOrder={repliesSortOrder}
                loading={repliesLoading}
              />
            </div>
          )}
        </div>
      </div>

      {deleteTopicId && (
        <div className="modal-overlay" onClick={() => setDeleteTopicId(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>删除话题将同时删除所有相关回复，此操作不可撤销。</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteTopicId(null)}
              >
                取消
              </button>
              <button
                className="confirm-btn"
                onClick={() => handleDeleteTopic(deleteTopicId)}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteReplyId && (
        <div className="modal-overlay" onClick={() => setDeleteReplyId(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>确定要删除这条回复吗？此操作不可撤销。</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteReplyId(null)}
              >
                取消
              </button>
              <button
                className="confirm-btn"
                onClick={() => handleDeleteReply(deleteReplyId)}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

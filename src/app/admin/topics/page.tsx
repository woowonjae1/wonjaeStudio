"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import {
  IconTrash,
  IconPin,
  IconPinFilled,
  IconSearch,
} from "@tabler/icons-react";
import "./topics.css";

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

const categories = [
  { id: "all", name: "全部" },
  { id: "production", name: "编曲" },
  { id: "mixing", name: "混音" },
  { id: "plugins", name: "插件" },
  { id: "showcase", name: "作品" },
  { id: "help", name: "问答" },
];

export default function TopicsManagementPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        category,
        search,
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/admin/topics?${params}`);
      const data = await res.json();
      setTopics(data.topics || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    } finally {
      setLoading(false);
    }
  }, [page, category, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/topics/${id}`, { method: "DELETE" });
      fetchTopics();
    } catch (error) {
      console.error("Failed to delete topic:", error);
    }
    setDeleteId(null);
  };

  const handlePin = async (id: number) => {
    try {
      await fetch(`/api/admin/topics/${id}/pin`, { method: "PUT" });
      fetchTopics();
    } catch (error) {
      console.error("Failed to pin topic:", error);
    }
  };

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  const columns: Column<Topic>[] = [
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
            onClick={() => setDeleteId(topic.id)}
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
      <AdminHeader title="话题管理" />

      <div className="admin-content">
        <div className="topics-toolbar">
          <div className="filter-group">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
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
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        <DataTable
          data={topics}
          columns={columns}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          loading={loading}
        />
      </div>

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>确认删除</h3>
            <p>删除话题将同时删除所有相关回复，此操作不可撤销。</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteId(null)}>
                取消
              </button>
              <button
                className="confirm-btn"
                onClick={() => handleDelete(deleteId)}
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

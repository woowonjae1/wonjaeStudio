"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable, { Column } from "@/components/admin/DataTable";
import { IconTrash, IconExternalLink } from "@tabler/icons-react";
import "./replies.css";

interface Reply {
  id: number;
  content: string;
  author_name: string;
  created_at: string;
  topic_id: number;
  topic_title: string;
}

export default function RepliesManagementPage() {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchReplies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/admin/replies?${params}`);
      const data = await res.json();
      setReplies(data.replies || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/replies/${id}`, { method: "DELETE" });
      fetchReplies();
    } catch (error) {
      console.error("Failed to delete reply:", error);
    }
    setDeleteId(null);
  };

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const columns: Column<Reply>[] = [
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
            onClick={() => setDeleteId(reply.id)}
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
      <AdminHeader title="回复管理" />

      <div className="admin-content">
        <DataTable
          data={replies}
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
            <p>确定要删除这条回复吗？此操作不可撤销。</p>
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

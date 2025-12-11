"use client";

import { useEffect, useState, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import MusicForm from "@/components/admin/MusicForm";
import {
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  Music,
  Loader2,
} from "lucide-react";
import { MusicTrack } from "@/types/music";

export default function MusicManagementPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTrack, setEditTrack] = useState<MusicTrack | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/music");
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const handleCreate = async (formData: FormData) => {
    const res = await fetch("/api/admin/music", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      setShowForm(false);
      fetchTracks();
    }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editTrack) return;
    const res = await fetch(`/api/admin/music/${editTrack.id}`, {
      method: "PUT",
      body: formData,
    });
    if (res.ok) {
      setEditTrack(null);
      fetchTracks();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/music/${id}`, { method: "DELETE" });
      fetchTracks();
    } catch (error) {
      console.error("Failed to delete track:", error);
    }
    setDeleteId(null);
  };

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) return;

    const draggedIndex = tracks.findIndex((t) => t.id === draggedId);
    const targetIndex = tracks.findIndex((t) => t.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTracks = [...tracks];
    const [removed] = newTracks.splice(draggedIndex, 1);
    newTracks.splice(targetIndex, 0, removed);
    setTracks(newTracks);
  };

  const handleDragEnd = async () => {
    if (draggedId === null) return;
    setDraggedId(null);

    // Save new order
    const reorderData = tracks.map((track, index) => ({
      id: track.id,
      display_order: index,
    }));

    try {
      await fetch("/api/admin/music/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracks: reorderData }),
      });
    } catch (error) {
      console.error("Failed to reorder:", error);
      fetchTracks();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader title="音乐管理" />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">音乐管理</h1>
            <p className="text-muted-foreground mt-1">管理和排序你的音乐曲目</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加曲目
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">加载中...</span>
          </div>
        ) : tracks.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-4">暂无曲目</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
            >
              添加第一首曲目
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-accent/50 transition-colors ${
                  draggedId === track.id ? "opacity-50" : ""
                }`}
                draggable
                onDragStart={() => handleDragStart(track.id)}
                onDragOver={(e) => handleDragOver(e, track.id)}
                onDragEnd={handleDragEnd}
              >
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                  <GripVertical className="w-5 h-5" />
                </div>
                <img
                  src={track.image_url}
                  alt={track.title}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{track.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {track.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {track.audio_url ? "✓ 有音频" : "✗ 无音频"} ·{" "}
                    {track.play_count} 播放
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTrack(track)}
                    className="p-2 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    title="编辑"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(track.id)}
                    className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showForm || editTrack) && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowForm(false);
            setEditTrack(null);
          }}
        >
          <div
            className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <MusicForm
              track={
                editTrack
                  ? {
                      id: editTrack.id,
                      title: editTrack.title,
                      description: editTrack.description,
                      image_url: editTrack.image_url,
                      audio_url: editTrack.audio_url,
                    }
                  : undefined
              }
              onSubmit={editTrack ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditTrack(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-card border border-border rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">
              确认删除
            </h3>
            <p className="text-muted-foreground mb-6">
              确定要删除这首曲目吗？相关文件也将被删除。
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-md border border-input hover:bg-accent text-foreground transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
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

"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import FileUpload from "./FileUpload";
import { MusicFormData } from "@/types/music";

interface MusicFormProps {
  track?: MusicFormData;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function MusicForm({
  track,
  onSubmit,
  onCancel,
}: MusicFormProps) {
  const [title, setTitle] = useState(track?.title || "");
  const [description, setDescription] = useState(track?.description || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!track?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("请输入标题");
      return;
    }

    if (!isEdit && !imageFile) {
      setError("请上传封面图片");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      if (imageFile) formData.append("image", imageFile);
      if (audioFile) formData.append("audio", audioFile);

      await onSubmit(formData);
    } catch (err) {
      setError("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          {isEdit ? "编辑曲目" : "添加曲目"}
        </h3>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          标题 <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入曲目标题"
          disabled={loading}
          className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-foreground"
        >
          描述
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入曲目描述"
          rows={3}
          disabled={loading}
          className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        />
      </div>

      <FileUpload
        type="image"
        label={`封面图片 ${isEdit ? "" : "*"}`}
        accept="image/*"
        onChange={setImageFile}
        preview={track?.image_url}
      />

      <FileUpload
        type="audio"
        label="音频文件"
        accept="audio/*"
        onChange={setAudioFile}
        preview={track?.audio_url || undefined}
      />

      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-md border border-input hover:bg-accent text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              保存中...
            </>
          ) : (
            "保存"
          )}
        </button>
      </div>
    </form>
  );
}

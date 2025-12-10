"use client";

import { useState, useEffect } from "react";
import "./NicknameModal.css";

interface NicknameModalProps {
  isOpen: boolean;
  onSubmit: (nickname: string) => void;
  currentName?: string;
  onClose?: () => void;
}

export default function NicknameModal({
  isOpen,
  onSubmit,
  currentName,
  onClose,
}: NicknameModalProps) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && currentName) {
      setNickname(currentName);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const isEditMode = !!currentName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = nickname.trim();

    if (trimmed.length < 2) {
      setError("昵称至少 2 个字符");
      return;
    }

    if (trimmed.length > 20) {
      setError("昵称最多 20 个字符");
      return;
    }

    if (!/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/.test(trimmed)) {
      setError("只能包含中文、英文、数字和下划线");
      return;
    }

    onSubmit(trimmed);
  };

  const handleClose = () => {
    if (isEditMode && onClose) {
      setNickname(currentName || "");
      setError("");
      onClose();
    }
  };

  return (
    <div
      className="nickname-modal-overlay"
      onClick={isEditMode ? handleClose : undefined}
    >
      <div className="nickname-modal" onClick={(e) => e.stopPropagation()}>
        {isEditMode && onClose && (
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        )}

        <h2>{isEditMode ? "修改昵称" : "设置昵称"}</h2>
        <p>在社区中显示的名称</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="输入昵称"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setError("");
            }}
            maxLength={20}
            autoFocus
          />

          {error && <span className="error">{error}</span>}

          <button type="submit" disabled={!nickname.trim()}>
            {isEditMode ? "保存" : "确定"}
          </button>
        </form>

        {!isEditMode && <p className="hint">昵称设置后可在侧边栏修改</p>}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import "./EmojiPicker.css";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// 音乐主题表情包
const musicEmojis = {
  音乐: ["🎵", "🎶", "🎼", "🎹", "🎸", "🥁", "🎺", "🎷", "🎤", "🎧"],
  情感: ["😍", "🤩", "😎", "🔥", "❤️", "💯", "✨", "⭐", "🌟", "💫"],
  手势: ["👍", "👏", "🤘", "✌️", "👌", "🙌", "💪", "🤝", "👊", "✊"],
  表情: ["😊", "😂", "🥰", "😭", "🤔", "😮", "😴", "🤯", "🥳", "😇"],
};

export default function EmojiPicker({
  onEmojiSelect,
  isOpen,
  onClose,
}: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("音乐");

  if (!isOpen) return null;

  return (
    <div className="emoji-picker-overlay" onClick={onClose}>
      <div className="emoji-picker" onClick={(e) => e.stopPropagation()}>
        <div className="emoji-categories">
          {Object.keys(musicEmojis).map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="emoji-grid">
          {musicEmojis[activeCategory as keyof typeof musicEmojis].map(
            (emoji, index) => (
              <button
                key={index}
                className="emoji-btn"
                onClick={() => {
                  onEmojiSelect(emoji);
                  onClose();
                }}
              >
                {emoji}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

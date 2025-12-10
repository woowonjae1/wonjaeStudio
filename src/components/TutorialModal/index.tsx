"use client";

import { useEffect } from "react";
import "./TutorialModal.css";

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  image: string;
  content: any[];
}

export default function TutorialModal({
  isOpen,
  onClose,
  title,
  category,
  image,
  content,
}: TutorialModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="tutorial-modal-overlay" onClick={onClose}>
      <div
        className="tutorial-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-header">
          <img src={image} alt={title} className="modal-image" />
          <div className="modal-header-overlay">
            <span className="modal-category-tag">{category}</span>
            <h1 className="modal-title">{title}</h1>
          </div>
        </div>

        <div className="modal-body">
          {content.map((block, index) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2 key={index} className="modal-content-heading">
                    {block.content}
                  </h2>
                );
              case "text":
                return (
                  <p key={index} className="modal-content-text">
                    {block.content}
                  </p>
                );
              case "list":
                return (
                  <ul key={index} className="modal-content-list">
                    {(block.content as string[]).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              case "image":
                return (
                  <div key={index} className="modal-content-image">
                    <img src={block.content} alt={block.caption} />
                    {block.caption && (
                      <p className="modal-image-caption">{block.caption}</p>
                    )}
                  </div>
                );
              case "code":
                return (
                  <pre key={index} className="modal-content-code">
                    <code>{block.content}</code>
                  </pre>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}

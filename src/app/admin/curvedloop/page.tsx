"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { defaultConfig, CurvedLoopConfig } from "@/contexts/CurvedLoopContext";
import "./curvedloop.css";

const STORAGE_KEY = "curvedloop_config";

export default function CurvedLoopManagementPage() {
  const [config, setConfig] = useState<CurvedLoopConfig>(defaultConfig);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConfig({ ...defaultConfig, ...parsed });
      } catch {
        setConfig(defaultConfig);
      }
    }
  }, []);

  const handleChange = (key: keyof CurvedLoopConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-page">
      <AdminHeader title="CurvedLoop 设置" />

      <div className="admin-content">
        <div className="curvedloop-settings">
          <div className="settings-header">
            <h2>背景动画设置</h2>
            <p>配置社区页面底部的曲线文字动画效果</p>
          </div>

          <div className="settings-form">
            {/* 启用/禁用 */}
            <div className="setting-item">
              <label className="setting-label">启用动画</label>
              <div className="toggle-wrapper">
                <button
                  className={`toggle-btn ${config.enabled ? "active" : ""}`}
                  onClick={() => handleChange("enabled", !config.enabled)}
                >
                  <span className="toggle-slider" />
                </button>
                <span className="toggle-text">
                  {config.enabled ? "已启用" : "已禁用"}
                </span>
              </div>
            </div>

            {/* 文字内容 */}
            <div className="setting-item">
              <label className="setting-label">显示文字</label>
              <input
                type="text"
                value={config.marqueeText}
                onChange={(e) => handleChange("marqueeText", e.target.value)}
                placeholder="输入要显示的文字..."
                className="setting-input"
              />
            </div>

            {/* 速度 */}
            <div className="setting-item">
              <label className="setting-label">动画速度: {config.speed}</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={config.speed}
                onChange={(e) =>
                  handleChange("speed", parseFloat(e.target.value))
                }
                className="setting-range"
              />
              <div className="range-labels">
                <span>慢</span>
                <span>快</span>
              </div>
            </div>

            {/* 曲线弧度 */}
            <div className="setting-item">
              <label className="setting-label">
                曲线弧度: {config.curveAmount}
              </label>
              <input
                type="range"
                min="100"
                max="600"
                step="50"
                value={config.curveAmount}
                onChange={(e) =>
                  handleChange("curveAmount", parseInt(e.target.value))
                }
                className="setting-range"
              />
              <div className="range-labels">
                <span>平缓</span>
                <span>弯曲</span>
              </div>
            </div>

            {/* 方向 */}
            <div className="setting-item">
              <label className="setting-label">滚动方向</label>
              <div className="direction-buttons">
                <button
                  className={`direction-btn ${config.direction === "left" ? "active" : ""}`}
                  onClick={() => handleChange("direction", "left")}
                >
                  ← 向左
                </button>
                <button
                  className={`direction-btn ${config.direction === "right" ? "active" : ""}`}
                  onClick={() => handleChange("direction", "right")}
                >
                  向右 →
                </button>
              </div>
            </div>

            {/* 可拖拽 */}
            <div className="setting-item">
              <label className="setting-label">允许拖拽交互</label>
              <div className="toggle-wrapper">
                <button
                  className={`toggle-btn ${config.interactive ? "active" : ""}`}
                  onClick={() =>
                    handleChange("interactive", !config.interactive)
                  }
                >
                  <span className="toggle-slider" />
                </button>
                <span className="toggle-text">
                  {config.interactive ? "可拖拽" : "不可拖拽"}
                </span>
              </div>
            </div>

            {/* 颜色 */}
            <div className="setting-item">
              <label className="setting-label">文字颜色</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="color-picker"
                />
                <input
                  type="text"
                  value={config.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="color-input"
                />
              </div>
            </div>

            {/* 透明度 */}
            <div className="setting-item">
              <label className="setting-label">
                透明度: {Math.round(config.opacity * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={config.opacity}
                onChange={(e) =>
                  handleChange("opacity", parseFloat(e.target.value))
                }
                className="setting-range"
              />
              <div className="range-labels">
                <span>透明</span>
                <span>不透明</span>
              </div>
            </div>

            {/* 字体大小 */}
            <div className="setting-item">
              <label className="setting-label">
                字体大小: {config.fontSize}rem
              </label>
              <input
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={config.fontSize}
                onChange={(e) =>
                  handleChange("fontSize", parseFloat(e.target.value))
                }
                className="setting-range"
              />
              <div className="range-labels">
                <span>小</span>
                <span>大</span>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button className="reset-btn" onClick={handleReset}>
              恢复默认
            </button>
            <button className="save-btn" onClick={handleSave}>
              {saved ? "✓ 已保存" : "保存设置"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

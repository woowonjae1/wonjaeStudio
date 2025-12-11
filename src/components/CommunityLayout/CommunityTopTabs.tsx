"use client";

interface CommunityTopTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const tabs = [
  { id: "latest", name: "最新", icon: "🕐" },
  { id: "popular", name: "热门", icon: "🔥" },
  { id: "activity", name: "活跃", icon: "💬" },
];

export default function CommunityTopTabs({
  activeTab = "latest",
  onTabChange,
}: CommunityTopTabsProps) {
  return (
    <div className="community-top-tabs">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange?.(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import TutorialModal from "@/components/TutorialModal";
import { tutorialsData } from "./tutorialsData";
import "./tutorials.css";

interface Tutorial {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
}

const tutorials: Tutorial[] = [
  {
    id: "eq-mastering",
    title: "Fabfilter Pro-Q3 EQ 母带处理完全指南",
    category: "母带",
    description: "掌握业界最受欢迎的 EQ，让你的混音达到商业标准",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    date: "2025-01-20",
    readTime: "15 分钟",
  },
  {
    id: "compressor-vocals",
    title: "Waves CLA-76 压缩器 - 人声处理秘诀",
    category: "混音",
    description: "掌握经典压缩器，让人声更温暖、更粘合、更专业",
    image:
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80",
    date: "2025-01-18",
    readTime: "14 分钟",
  },
  {
    id: "reverb-space",
    title: "Valhalla VintageVerb - 创造专业的空间感",
    category: "效果器",
    description: "学习如何使用高质量混响创造自然的空间感",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    date: "2025-01-16",
    readTime: "16 分钟",
  },
];

const categories = ["全部", "编曲", "混音", "效果器", "母带"];

export default function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  );

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesCategory =
      selectedCategory === "全部" || tutorial.category === selectedCategory;
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTutorialContent = (id: string) => {
    return tutorialsData[id as keyof typeof tutorialsData];
  };

  const handleCardClick = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
  };

  const handleCloseModal = () => {
    setSelectedTutorial(null);
  };

  return (
    <div className="tutorials-page">
      <Navbar />

      <div className="tutorials-hero">
        <h1 className="tutorials-hero-title">插件使用教程</h1>
        <p className="tutorials-hero-subtitle">编曲与混音插件的实用指南</p>
      </div>

      <div className="tutorials-container">
        {/* Search and Filter */}
        <div className="tutorials-controls">
          <div className="search-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="search-icon"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="搜索教程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="tutorials-grid">
          {filteredTutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="tutorial-card"
              onClick={() => handleCardClick(tutorial)}
            >
              <div className="tutorial-card-image">
                <img src={tutorial.image} alt={tutorial.title} />
                <div className="tutorial-card-overlay">
                  <span className="tutorial-card-category">
                    {tutorial.category}
                  </span>
                </div>
              </div>
              <div className="tutorial-card-content">
                <h3 className="tutorial-card-title">{tutorial.title}</h3>
                <p className="tutorial-card-description">
                  {tutorial.description}
                </p>
                <div className="tutorial-card-meta">
                  <span>{tutorial.date}</span>
                  <span>•</span>
                  <span>{tutorial.readTime}</span>
                </div>
                <button className="tutorial-card-btn">查看详情</button>
              </div>
            </div>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="no-results">
            <p>没有找到相关教程</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedTutorial && (
        <TutorialModal
          isOpen={!!selectedTutorial}
          onClose={handleCloseModal}
          title={selectedTutorial.title}
          category={selectedTutorial.category}
          image={selectedTutorial.image}
          content={getTutorialContent(selectedTutorial.id)?.content || []}
        />
      )}
    </div>
  );
}

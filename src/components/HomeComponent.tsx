"use client";

import React, { useState, useRef, useEffect } from "react";
import { Album } from "@/types";
import Header from "@/components/layout/Header";
import AlbumGrid from "@/components/album/AlbumGrid";
import AudioPlayer from "@/components/audio/AudioPlayer";
import NotificationBanner from "@/components/NotificationBanner";
import { ALBUMS } from "@/utils/constants";
import CodeShowcase from "@/components/CodeShowcase";
import Image from "next/image";
import MusicProduction from "@/components/MusicProduction";
import { useRouter } from "next/navigation";
import Banner from "@/components/Banner";
import { MeteorsCard } from "@/components/MeteorsDemo";
import { AlbumListEnhanced } from "@/components/album/AlbumListEnhanced";
import { PostListAdvanced } from "@/components/blog/PostListAdvanced";

// 技术文章Tab数据
const techTabs = [
  { key: "latest", label: "最新" },
  { key: "tech", label: "技术" },
  { key: "backend", label: "后端" },
  { key: "frontend", label: "前端" },
  { key: "review", label: "测评" },
  { key: "tools", label: "开发工具" },
];

const techArticlesByTab: Record<
  string,
  { title: string; date: string; link: string }[]
> = {
  latest: [
    {
      title: "Gitee 开源社区年度报告发布",
      date: "2024.05.28",
      link: "/articles/gitee-report",
    },
    {
      title: "开源大模型 Llama 3 开放下载",
      date: "2024.05.20",
      link: "/articles/llama3",
    },
    {
      title: "OpenAI 发布全新 API 价格方案",
      date: "2024.05.15",
      link: "/articles/openai-api-pricing",
    },
    {
      title: "Stable Diffusion 3.0 社区贡献榜",
      date: "2024.05.10",
      link: "/articles/stable-diffusion-3",
    },
    {
      title: "LangChain 生态持续壮大",
      date: "2024.05.05",
      link: "/articles/langchain",
    },
    {
      title: "Hugging Face Spaces 热门项目推荐",
      date: "2024.05.01",
      link: "/articles/hf-spaces",
    },
    {
      title: "开源中国 OSC 2024 年度盛典",
      date: "2024.04.28",
      link: "/articles/osc-2024",
    },
    {
      title: "Python 3.13 新特性前瞻",
      date: "2024.04.20",
      link: "/articles/python-313",
    },
    {
      title: "Kaggle 社区最新竞赛资讯",
      date: "2024.04.15",
      link: "/articles/kaggle-news",
    },
  ],
  // 其他分类的文章...
};

// HomeComponent组件
const HomeComponent = () => {
  const [audioState, setAudioState] = useState({
    currentAlbum: null as Album | null,
    isPlaying: false,
  });
  const [activeTab, setActiveTab] = useState("suno");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const handlePlayAlbum = (album: Album) => {
    if (audioState.currentAlbum?.id === album.id) {
      if (audioRef.current) {
        if (audioState.isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setAudioState((prev) => ({
          ...prev,
          isPlaying: !prev.isPlaying,
        }));
      }
    } else {
      setAudioState({
        currentAlbum: album,
        isPlaying: true,
      });

      if (audioRef.current) {
        audioRef.current.src = album.audioSrc;
        audioRef.current.play();
      }
    }
  };

  const tools = {
    suno: {
      name: "Suno AI",
      description:
        "Suno 是一个强大的 AI 音乐生成工具，可以创建各种风格的音乐。",
      features: [
        "支持多种音乐风格生成",
        "可以控制音乐长度和情绪",
        "提供高质量的音乐输出",
        "支持文本描述生成音乐",
      ],
      usage: [
        "访问 Suno 官网 (https://suno.ai)",
        "注册并获取 API key",
        "使用文本描述你想要创建的音乐",
        "选择音乐风格和长度",
        "等待生成结果",
      ],
      tips: [
        "使用详细的描述可以获得更好的结果",
        "可以指定具体的乐器组合",
        "可以描述音乐的情绪和氛围",
        "建议使用英文提示词获得更好的效果",
      ],
    },
    stableAudio: {
      name: "Stable Audio",
      description:
        "Stable Audio 是一个专注于音频生成的 AI 工具，特别适合创建音效和短音乐片段。",
      features: [
        "专注于音效生成",
        "支持多种音频格式",
        "快速生成短音频片段",
        "适合游戏和视频制作",
      ],
      usage: [
        "访问 Stable Audio 官网",
        "创建账户并获取访问权限",
        "选择音频类型（音乐/音效）",
        "输入描述或上传参考音频",
        "调整参数并生成",
      ],
      tips: [
        "音效生成建议使用具体的描述",
        "可以上传参考音频来获得类似效果",
        "注意调整生成时长",
        "可以组合多个音效创建复杂效果",
      ],
    },
    aceStep: {
      name: "Ace Step",
      description:
        "Ace Step 是一个专业的音乐制作 AI 工具，特别适合电子音乐创作。",
      features: [
        "专注于电子音乐生成",
        "支持多种电子音乐风格",
        "提供专业的音乐制作工具",
        "可以导出多种格式",
      ],
      usage: [
        "下载并安装 Ace Step 软件",
        "选择音乐风格和模板",
        "调整音乐参数",
        "添加效果和混音",
        "导出最终作品",
      ],
      tips: [
        "建议先熟悉各种电子音乐风格",
        "可以组合多个模板创建独特作品",
        "注意调整 BPM 和调性",
        "使用内置效果器增强音乐表现",
      ],
    },
    mubert: {
      name: "Mubert",
      description:
        "Mubert 是一个基于 AI 的音乐生成平台，特别适合创建背景音乐和氛围音乐。",
      features: [
        "支持实时音乐生成",
        "提供丰富的音乐风格库",
        "可以生成无限长度的音乐",
        "支持商业用途",
      ],
      usage: [
        "访问 Mubert 官网 (https://mubert.com)",
        "注册开发者账户",
        "获取 API 密钥",
        "选择音乐风格和参数",
        "生成并下载音乐",
      ],
      tips: [
        "可以组合多个标签来获得更精确的结果",
        "使用情绪标签来调整音乐氛围",
        "可以设置音乐长度和循环方式",
        "支持实时调整音乐参数",
      ],
    },
    amper: {
      name: "Amper Music",
      description:
        "Amper Music 是一个专业的 AI 作曲工具，特别适合创建商业音乐和配乐。",
      features: [
        "支持多种音乐风格和流派",
        "提供专业的音乐制作工具",
        "支持自定义音乐结构",
        "适合商业用途",
      ],
      usage: [
        "注册 Amper Music 账户",
        "选择音乐风格和情绪",
        "设置音乐长度和结构",
        "调整音乐参数",
        "导出最终作品",
      ],
      tips: [
        "使用情绪标签来调整音乐风格",
        "可以设置音乐的高潮和过渡",
        "支持导出多种音频格式",
        "可以调整乐器和音色",
      ],
    },
    aiva: {
      name: "AIVA",
      description:
        "AIVA 是一个专业的 AI 作曲助手，特别适合创建古典音乐和电影配乐。",
      features: [
        "专注于古典音乐创作",
        "支持多种音乐风格",
        "提供专业的编曲工具",
        "可以生成完整的音乐作品",
      ],
      usage: [
        "注册 AIVA 账户",
        "选择音乐风格和类型",
        "设置音乐参数和结构",
        "生成并编辑音乐",
        "导出最终作品",
      ],
      tips: [
        "可以上传参考音乐来获得类似风格",
        "支持调整音乐的情绪和强度",
        "可以编辑和修改生成的音乐",
        "支持导出多种格式和分轨",
      ],
    },
  };

  useEffect(() => {}, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <Header />
      <div className="pt-16">
        <NotificationBanner onPlayAlbum={handlePlayAlbum} />
        <Banner />
        <main className="container mx-auto px-4 pb-24">
          <section id="albums" className="py-12">
            <h2 className="text-3xl font-bold mb-6">My Albums</h2>
            <AlbumGrid
              albums={ALBUMS}
              onPlayAlbum={handlePlayAlbum}
              currentAlbum={audioState.currentAlbum}
              isPlaying={audioState.isPlaying}
            />
          </section>

          <section id="code" className="py-12">
            <h2 className="text-3xl font-bold mb-4">Code</h2>
            <div className="mt-0">
              <TechArticleTabs />
            </div>
          </section>

          <section id="about" className="py-12">
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex flex-col items-center">
                <div className="w-full md:w-1/3 mx-auto p-4">
                  <Image
                    src="https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?q=80&w=600&auto=format&fit=crop"
                    alt="音乐制作人"
                    width={400}
                    height={400}
                    className="rounded-full w-64 h-64 object-cover mx-auto"
                  />
                </div>
                <div className="p-8 text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    Hello! I'm Woowonjae, a passionate music producer and
                    blogger. Welcome to my personal space where I share my
                    journey and insights into music production.
                  </p>
                  <p className="text-gray-600 mb-4">
                    我使用FL
                    Studio已经有2年时间，熟悉各种音乐制作技术和工作流程。我相信音乐是表达自我的最佳方式之一，无论你是专业音乐人还是爱好者，都能通过这个平台找到表达的方式。
                  </p>
                  <p className="text-gray-600 mb-6">
                    在这个音乐制作中心，我希望与大家分享我的经验和技巧，帮助更多人踏上音乐创作的旅程。无论你是想学习基础知识，还是寻求高级技巧，我都很乐意提供帮助。
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a href="#" className="text-[#1C2C5B] hover:text-[#98C5E9]">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                    <a href="#" className="text-[#1C2C5B] hover:text-[#98C5E9]">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-[#1C2C5B] hover:text-[#98C5E9]">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <audio ref={audioRef} style={{ display: "none" }} />

      {audioState.currentAlbum && (
        <AudioPlayer
          album={audioState.currentAlbum}
          isPlaying={audioState.isPlaying}
          onPlayPause={() => handlePlayAlbum(audioState.currentAlbum!)}
          audioRef={audioRef}
        />
      )}
    </div>
  );
};

// 技术文章Tab组件
function TechArticleTabs() {
  const [activeTab, setActiveTab] = useState("latest");
  const [showAll, setShowAll] = useState(false);
  const articles = techArticlesByTab[activeTab] || [];
  const visibleArticles = showAll ? articles : articles.slice(0, 5);
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl p-8 w-full shadow-md min-h-[480px] flex flex-col justify-between mt-0 ml-0">
      {/* Tab栏 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {techTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setShowAll(false);
            }}
            className={`px-4 py-2 rounded-lg font-semibold text-base transition-colors duration-150 ${
              activeTab === tab.key
                ? "bg-[#232323] text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* 文章列表 */}
      <div>
        {visibleArticles.length === 0 && (
          <div className="text-gray-400 text-center py-8">暂无内容</div>
        )}
        {visibleArticles.map((article) =>
          article.link.startsWith("/") ? (
            <div
              key={article.link + article.title}
              onClick={() => router.push(article.link)}
              className="flex justify-between items-center px-6 py-4 mb-3 rounded-xl bg-gray-100 text-gray-900 hover:bg-[#98C5E9]/10 transition-all duration-200 cursor-pointer text-base font-medium group"
            >
              <span className="font-bold group-hover:text-[#98C5E9] transition-colors duration-200">
                {article.title}
              </span>
              <span className="text-gray-400 text-sm font-normal group-hover:text-gray-500 transition-colors duration-200">
                {article.date}
              </span>
            </div>
          ) : (
            <a
              key={article.link + article.title}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center px-6 py-4 mb-3 rounded-xl bg-gray-100 text-gray-900 hover:bg-[#f3f3f3] transition-all duration-200 cursor-pointer text-base font-medium group"
            >
              <span className="font-bold group-hover:text-[#98C5E9] transition-colors duration-200">
                {article.title}
              </span>
              <span className="text-gray-400 text-sm font-normal group-hover:text-gray-500 transition-colors duration-200">
                {article.date}
              </span>
            </a>
          )
        )}
        {articles.length > 5 && !showAll && (
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
            >
              查看更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeComponent;

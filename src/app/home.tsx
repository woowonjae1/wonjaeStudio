'use client';

import React, { useState, useRef } from "react";
import { Album } from "@/types";
import Header from "@/components/layout/Header";
import AlbumGrid from "@/components/album/AlbumGrid";
import AudioPlayer from "@/components/audio/AudioPlayer";
import ImageSlider from "@/components/ImageSlider";
import NotificationBanner from "@/components/NotificationBanner";
import { ALBUMS, PLAYERS, MATCHES } from "@/utils/constants";
import CodeShowcase from '@/components/CodeShowcase';
import Image from 'next/image';
import PlayerGrid from '@/components/PlayerGrid';
import MatchSchedule from '@/components/MatchSchedule';
import FixturesAPI from '@/components/FixturesAPI';
import MusicProduction from '@/components/MusicProduction';
import { useRouter } from 'next/navigation';

// 技术文章Tab数据
const techTabs = [
  { key: 'latest', label: '最新' },
  { key: 'tech', label: '技术' },
  { key: 'backend', label: '后端' },
  { key: 'frontend', label: '前端' },
  { key: 'review', label: '测评' },
  { key: 'tools', label: '开发工具' },
];

const techArticlesByTab: Record<string, { title: string; date: string; link: string }[]> = {
  latest: [
    { title: 'GitHub Copilot X 正式发布，AI辅助开发再升级', date: '2024.06.01', link: '/articles/copilot-x' },
    { title: 'Gitee 开源社区年度报告发布', date: '2024.05.28', link: '/articles/gitee-report' },
    { title: '开源大模型 Llama 3 开放下载', date: '2024.05.20', link: '/articles/llama3' },
    { title: 'OpenAI 发布全新 API 价格方案', date: '2024.05.15', link: '/articles/openai-api-pricing' },
    { title: 'Stable Diffusion 3.0 社区贡献榜', date: '2024.05.10', link: '/articles/stable-diffusion-3' },
    { title: 'LangChain 生态持续壮大', date: '2024.05.05', link: '/articles/langchain' },
    { title: 'Hugging Face Spaces 热门项目推荐', date: '2024.05.01', link: '/articles/hf-spaces' },
    { title: '开源中国 OSC 2024 年度盛典', date: '2024.04.28', link: '/articles/osc-2024' },
    { title: 'Python 3.13 新特性前瞻', date: '2024.04.20', link: '/articles/python-313' },
    { title: 'Kaggle 社区最新竞赛资讯', date: '2024.04.15', link: '/articles/kaggle-news' },
  ],
  // 其他分类的文章...
};

export default function Home() {
  const [audioState, setAudioState] = useState({
    currentAlbum: null as Album | null,
    isPlaying: false,
  });
  const [activeTab, setActiveTab] = useState('suno');
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
        setAudioState(prev => ({
          ...prev,
          isPlaying: !prev.isPlaying
        }));
      }
    } else {
      setAudioState({
        currentAlbum: album,
        isPlaying: true
      });
      
      if (audioRef.current) {
        audioRef.current.src = album.audioSrc;
        audioRef.current.play();
      }
    }
  };

  const tools = {
    suno: {
      name: 'Suno AI',
      description: 'Suno 是一个强大的 AI 音乐生成工具，可以创建各种风格的音乐。',
      features: [
        '支持多种音乐风格生成',
        '可以控制音乐长度和情绪',
        '提供高质量的音乐输出',
        '支持文本描述生成音乐'
      ],
      usage: [
        '访问 Suno 官网 (https://suno.ai)',
        '注册并获取 API key',
        '使用文本描述你想要创建的音乐',
        '选择音乐风格和长度',
        '等待生成结果'
      ],
      tips: [
        '使用详细的描述可以获得更好的结果',
        '可以指定具体的乐器组合',
        '可以描述音乐的情绪和氛围',
        '建议使用英文提示词获得更好的效果'
      ]
    },
    stableAudio: {
      name: 'Stable Audio',
      description: 'Stable Audio 是一个专注于音频生成的 AI 工具，特别适合创建音效和短音乐片段。',
      features: [
        '专注于音效生成',
        '支持多种音频格式',
        '快速生成短音频片段',
        '适合游戏和视频制作'
      ],
      usage: [
        '访问 Stable Audio 官网',
        '创建账户并获取访问权限',
        '选择音频类型（音乐/音效）',
        '输入描述或上传参考音频',
        '调整参数并生成'
      ],
      tips: [
        '音效生成建议使用具体的描述',
        '可以上传参考音频来获得类似效果',
        '注意调整生成时长',
        '可以组合多个音效创建复杂效果'
      ]
    },
    aceStep: {
      name: 'Ace Step',
      description: 'Ace Step 是一个专业的音乐制作 AI 工具，特别适合电子音乐创作。',
      features: [
        '专注于电子音乐生成',
        '支持多种电子音乐风格',
        '提供专业的音乐制作工具',
        '可以导出多种格式'
      ],
      usage: [
        '下载并安装 Ace Step 软件',
        '选择音乐风格和模板',
        '调整音乐参数',
        '添加效果和混音',
        '导出最终作品'
      ],
      tips: [
        '建议先熟悉各种电子音乐风格',
        '可以组合多个模板创建独特作品',
        '注意调整 BPM 和调性',
        '使用内置效果器增强音乐表现'
      ]
    },
    mubert: {
      name: 'Mubert',
      description: 'Mubert 是一个基于 AI 的音乐生成平台，特别适合创建背景音乐和氛围音乐。',
      features: [
        '支持实时音乐生成',
        '提供丰富的音乐风格库',
        '可以生成无限长度的音乐',
        '支持商业用途'
      ],
      usage: [
        '访问 Mubert 官网 (https://mubert.com)',
        '注册开发者账户',
        '获取 API 密钥',
        '选择音乐风格和参数',
        '生成并下载音乐'
      ],
      tips: [
        '可以组合多个标签来获得更精确的结果',
        '使用情绪标签来调整音乐氛围',
        '可以设置音乐长度和循环方式',
        '支持实时调整音乐参数'
      ]
    },
    amper: {
      name: 'Amper Music',
      description: 'Amper Music 是一个专业的 AI 作曲工具，特别适合创建商业音乐和配乐。',
      features: [
        '支持多种音乐风格和流派',
        '提供专业的音乐制作工具',
        '支持自定义音乐结构',
        '适合商业用途'
      ],
      usage: [
        '注册 Amper Music 账户',
        '选择音乐风格和情绪',
        '设置音乐长度和结构',
        '调整音乐参数',
        '导出最终作品'
      ],
      tips: [
        '使用情绪标签来调整音乐风格',
        '可以设置音乐的高潮和过渡',
        '支持导出多种音频格式',
        '可以调整乐器和音色'
      ]
    },
    aiva: {
      name: 'AIVA',
      description: 'AIVA 是一个专业的 AI 作曲助手，特别适合创建古典音乐和电影配乐。',
      features: [
        '专注于古典音乐创作',
        '支持多种音乐风格',
        '提供专业的编曲工具',
        '可以生成完整的音乐作品'
      ],
      usage: [
        '注册 AIVA 账户',
        '选择音乐风格和类型',
        '设置音乐参数和结构',
        '生成并编辑音乐',
        '导出最终作品'
      ],
      tips: [
        '可以上传参考音乐来获得类似风格',
        '支持调整音乐的情绪和强度',
        '可以编辑和修改生成的音乐',
        '支持导出多种格式和分轨'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <Header />
      <div className="pt-16">
        <NotificationBanner onPlayAlbum={handlePlayAlbum} />
        <ImageSlider />
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

          <section id="manchester-city" className="py-12">
            <div className="w-full bg-[#6CABDD] mb-6 rounded-lg">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center space-x-4">
                  <Image 
                    src="/image/manchester_city_logo.jpg"
                    alt="Manchester City Logo"
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <h2 className="text-2xl font-bold text-white">Manchester City</h2>
                </div>
              </div>
            </div>
            
            {/* 德布劳内荣誉展示 - 使用原图展示 */}
            <div className="flex flex-col items-center my-6">
              <img src="/image/德布劳内.jpg" alt="Kevin De Bruyne" className="w-full max-w-[600px] rounded-xl shadow-lg mb-4 object-cover" />
              <div className="flex items-center mt-2 text-2xl font-bold text-[#1C2C5B]">
                曼城永远的王
                <span className="ml-2 align-middle">
                  {/* 开源皇冠SVG */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 19L4.5 7.5L9 15L12 7L15 15L19.5 7.5L22 19H2Z" fill="#FFD700" stroke="#E6B800" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-6">Latest News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-semibold mb-3">Kevin De Bruyne's Departure</h4>
                <p className="text-gray-600 mb-4">
                  Manchester City's midfield maestro Kevin De Bruyne has announced his departure from the club. The Belgian international, who has been instrumental in City's recent success, will be leaving after 8 successful seasons at the Etihad Stadium.
                </p>
                <div className="text-sm text-gray-500">
                  <span>Impact:</span>
                  <ul className="list-disc list-inside mt-2">
                    <li>8 seasons at Manchester City</li>
                    <li>96 goals and 153 assists</li>
                    <li>5 Premier League titles</li>
                    <li>1 Champions League title</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-semibold mb-3">Transfer Updates</h4>
                <p className="text-gray-600 mb-4">
                  Manchester City is actively working on strengthening their squad for the upcoming season. The club is looking to bring in new talent to maintain their dominance in both domestic and European competitions.
                </p>
                <div className="text-sm text-gray-500">
                  <span>Recent Activities:</span>
                  <ul className="list-disc list-inside mt-2">
                    <li>Scouting for midfield replacements</li>
                    <li>Monitoring young talents</li>
                    <li>Contract renewals for key players</li>
                    <li>Youth academy promotions</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-semibold mb-3">德布劳内正式离队</h4>
                <p className="text-gray-600 mb-4">
                  曼城传奇中场德布劳内（Kevin De Bruyne）正式宣布离队，结束了他在曼城8年的辉煌生涯。球迷纷纷送上祝福，感谢他为球队带来的无数精彩瞬间。
                </p>
                <div className="text-sm text-gray-500">
                  <span>球迷热议：</span>
                  <ul className="list-disc list-inside mt-2">
                    <li>"再见传奇，祝你未来一切顺利！"</li>
                    <li>"KDB永远是蓝月亮的英雄！"</li>
                  </ul>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-semibold mb-3">曼城本赛季最后一场主场比赛赛况</h4>
                <p className="text-gray-600 mb-4">
                  曼城在本赛季英超最后一轮主场迎战伯恩茅斯，最终以3-1获胜。
                </p>
                <div className="text-sm text-gray-500">
                  <span>关键事件：</span>
                  <ul className="list-disc list-inside mt-2">
                    <li>马尔牧什第14分钟世界波破门</li>
                    <li>兔兔第38分钟禁区得分</li>
                    <li>德布劳内第66分钟换下,结束曼城生涯最后一个主场比赛</li>
                    <li>尼克冈萨雷斯第89分钟替补登场,攻入曼城生涯首球</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="game" className="py-12">
            <h2 className="text-3xl font-bold mb-4">Game</h2>
            
            <p className="text-gray-700 mb-4">
              Check out my game development projects and gaming content. From design to implementation, I enjoy creating engaging experiences.
            </p>
          </section>

          <section id="music" className="py-12 relative min-h-[800px]">
            {/* 浮动背景图 - 限制在特定区域内 */}
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="floating-image absolute"
                style={{
                  animation: 'float 8s ease-in-out infinite',
                  left: '5%',
                  top: '15%',
                  width: '200px',
                  height: '200px'
                }}
              >
                <Image
                  src="/image/hcq.jpg"
                  alt="Floating HCQ"
                  fill
                  className="opacity-30 object-contain"
                />
              </div>
              <div 
                className="floating-image absolute"
                style={{
                  animation: 'float 10s ease-in-out infinite',
                  right: '10%',
                  top: '30%',
                  width: '160px',
                  height: '160px'
                }}
              >
                <Image
                  src="/image/hcq.jpg"
                  alt="Floating HCQ"
                  fill
                  className="opacity-25 object-contain"
                />
              </div>
              <div 
                className="floating-image absolute"
                style={{
                  animation: 'float 7s ease-in-out infinite',
                  left: '25%',
                  top: '45%',
                  width: '120px',
                  height: '120px'
                }}
              >
                <Image
                  src="/image/hcq.jpg"
                  alt="Floating HCQ"
                  fill
                  className="opacity-20 object-contain"
                />
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Music Production</h2>
              
              {/* Banner 模块 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="relative w-full" style={{ paddingTop: '50%' }}>
                  <Image
                    src="/image/Wyy.jpg"
                    alt="Music Production Banner"
                    fill
                    className="object-contain object-center scale-125"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="container mx-auto">
                      <h3 className="text-2xl font-bold mb-1 text-white">Music Studio</h3>
                      <div className="flex items-center space-x-2 text-sm text-white/90">
                        <span>Professional Music Production Environment</span>
                        <span>•</span>
                        <span>禹元宰52hz</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI 音乐工具指南 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold mb-6">AI 音乐生成工具指南</h3>
                
                {/* 工具选择标签 */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {Object.keys(tools).map((tool) => (
                    <button
                      key={tool}
                      onClick={() => setActiveTab(tool)}
                      className={`px-4 py-2 rounded-md ${
                        activeTab === tool
                          ? 'bg-[#1C2C5B] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tools[tool as keyof typeof tools].name}
                    </button>
                  ))}
                </div>

                {/* 工具详情 */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {tools[activeTab as keyof typeof tools].name}
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    {tools[activeTab as keyof typeof tools].description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 功能特点 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">主要功能</h3>
                      <ul className="space-y-2">
                        {tools[activeTab as keyof typeof tools].features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#1C2C5B] mr-2">•</span>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 使用步骤 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">使用步骤</h3>
                      <ol className="space-y-2">
                        {tools[activeTab as keyof typeof tools].usage.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-[#1C2C5B] mr-2">{index + 1}.</span>
                            <span className="text-gray-600">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* 使用技巧 */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">使用技巧</h3>
                    <ul className="space-y-2">
                      {tools[activeTab as keyof typeof tools].tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-[#1C2C5B] mr-2">💡</span>
                          <span className="text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="py-12">
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            <p className="text-gray-700">
              Hello! I'm Woowonjae, a passionate music producer and blogger. Welcome to my personal space where I share my journey and insights into music production.
            </p>
          </section>

          <MusicProduction />
        </main>
      </div>

      <audio
        ref={audioRef}
        style={{ display: 'none' }}
      />

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
}

// 技术文章Tab组件
function TechArticleTabs() {
  const [activeTab, setActiveTab] = useState('latest');
  const [showAll, setShowAll] = useState(false);
  const articles = techArticlesByTab[activeTab] || [];
  const visibleArticles = showAll ? articles : articles.slice(0, 5);
  const router = useRouter();
  
  return (
    <div className="bg-white rounded-2xl p-8 w-full shadow-md min-h-[480px] flex flex-col justify-between mt-0 ml-0">
      {/* Tab栏 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {techTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setShowAll(false); }}
            className={`px-4 py-2 rounded-lg font-semibold text-base transition-colors duration-150 ${
              activeTab === tab.key
                ? 'bg-[#232323] text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
        {visibleArticles.map(article =>
          article.link.startsWith('/') ? (
            <div
              key={article.link + article.title}
              onClick={() => router.push(article.link)}
              className="flex justify-between items-center px-6 py-4 mb-3 rounded-xl bg-gray-100 text-gray-900 hover:bg-[#98C5E9]/10 transition-all duration-200 cursor-pointer text-base font-medium group"
            >
              <span className="font-bold group-hover:text-[#98C5E9] transition-colors duration-200">{article.title}</span>
              <span className="text-gray-400 text-sm font-normal group-hover:text-gray-500 transition-colors duration-200">{article.date}</span>
            </div>
          ) : (
            <a
              key={article.link + article.title}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center px-6 py-4 mb-3 rounded-xl bg-gray-100 text-gray-900 hover:bg-[#f3f3f3] transition-all duration-200 cursor-pointer text-base font-medium group"
            >
              <span className="font-bold group-hover:text-[#98C5E9] transition-colors duration-200">{article.title}</span>
              <span className="text-gray-400 text-sm font-normal group-hover:text-gray-500 transition-colors duration-200">{article.date}</span>
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
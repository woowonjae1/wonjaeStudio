'use client';

import React from "react";
import Link from 'next/link';
import { useTheme } from "@/contexts/ThemeContext";

export default function CodePage() {
  const { theme } = useTheme();

  // 样例代码项目
  const codeProjects = [
    {
      id: 1,
      title: "音乐可视化工具",
      description: "基于WebGL和Three.js的音乐可视化工具，支持实时响应音频频谱",
      tags: ["JavaScript", "Three.js", "WebGL", "Web Audio API"],
      demoUrl: "#",
      repoUrl: "#"
    },
    {
      id: 2,
      title: "足球赛事数据分析器",
      description: "基于Python的足球赛事数据分析工具，可视化比赛统计和球员表现",
      tags: ["Python", "Pandas", "Matplotlib", "数据分析"],
      demoUrl: "#",
      repoUrl: "#"
    },
    {
      id: 3,
      title: "AI音乐生成模型",
      description: "使用TensorFlow构建的音乐生成模型，可以根据输入的风格创作新的音乐片段",
      tags: ["Python", "TensorFlow", "AI", "音乐生成"],
      demoUrl: "#",
      repoUrl: "#"
    },
    {
      id: 4,
      title: "Next.js个人博客系统",
      description: "使用Next.js和Tailwind CSS构建的现代化个人博客系统，支持Markdown内容",
      tags: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
      demoUrl: "#",
      repoUrl: "#"
    }
  ];

  // 代码片段示例
  const codeSnippet = `
// 使用Web Audio API进行音频分析
function createAudioAnalyzer(audioElement) {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(audioElement);
  const analyser = audioContext.createAnalyser();
  
  analyser.fftSize = 2048;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  return {
    analyser,
    dataArray,
    getData: function() {
      analyser.getByteFrequencyData(dataArray);
      return dataArray;
    }
  };
}
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 pt-16 pb-12">
      {/* 导航栏 */}
      <div className="fixed top-2 left-2 z-50 flex gap-2">
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
        >
          返回首页
        </Link>
        <Link 
          href="/home"
          className="inline-block bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
        >
          主页
        </Link>
      </div>
      
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-300 mb-4">代码作品集</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            这里展示了我的一些编程项目和代码片段，涵盖音乐制作、数据分析和Web开发等领域。
          </p>
        </header>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">项目案例</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {codeProjects.map(project => (
              <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <a href={project.demoUrl} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">查看演示</a>
                    <a href={project.repoUrl} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">GitHub仓库</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">代码片段</h2>
          
          <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-800 text-gray-200 font-mono text-sm">
              <span className="text-blue-400">// 音频可视化示例代码</span>
            </div>
            <pre className="p-4 overflow-x-auto text-gray-300 font-mono text-sm">
              {codeSnippet}
            </pre>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">技术栈</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'TensorFlow', 'Three.js'].map((tech, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="font-medium text-gray-700 dark:text-gray-300">{tech}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 
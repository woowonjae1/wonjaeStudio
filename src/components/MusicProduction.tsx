import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MusicMarquee3D } from './MusicMarquee3D';
import { MusicPlayer } from './MusicPlayer';

const MusicProduction: React.FC = () => {
  // FL Studio功能列表
  const features = [
    {
      title: "直观的界面",
      description: "FL Studio提供了一个用户友好的界面，即使是初学者也能快速上手。",
      icon: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&h=200&auto=format&fit=crop"
    },
    {
      title: "强大的音序器",
      description: "使用步进音序器和钢琴卷帘编辑器创建复杂的音乐模式。",
      icon: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=300&h=200&auto=format&fit=crop"
    },
    {
      title: "丰富的插件",
      description: "内置多种合成器和效果器，可以创造广泛的声音。",
      icon: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=300&h=200&auto=format&fit=crop"
    },
    {
      title: "混音与母带制作",
      description: "专业级别的混音和母带制作工具，确保你的音乐听起来完美。",
      icon: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?q=80&w=300&h=200&auto=format&fit=crop"
    }
  ];

  // 教程列表
  const tutorials = [
    {
      title: "FL Studio入门指南",
      description: "了解如何设置FL Studio并创建你的第一个节拍。",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&h=250&auto=format&fit=crop"
    },
    {
      title: "电子舞曲制作",
      description: "学习创作具有独特风格的电子舞曲，掌握制作技巧。",
      image: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?q=80&w=400&h=250&auto=format&fit=crop"
    },
    {
      title: "体育场歌曲混音",
      description: "如何制作适合体育场氛围的激动人心的歌曲和赞歌。",
      image: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=400&h=250&auto=format&fit=crop"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-sky-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1C2C5B] mb-3">音乐制作中心</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            发掘你的音乐创作潜能，探索音乐制作的无限可能。通过FL Studio，你可以创作出专业水准的音乐作品，表达你独特的音乐理念。
          </p>
        </div>

        {/* FL Studio主展示区 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-16">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?q=80&w=800&auto=format&fit=crop"
                alt="FL Studio工作站"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <div className="uppercase tracking-wide text-sm text-[#98C5E9] font-semibold">专业音乐制作软件</div>
              <h3 className="mt-2 text-3xl leading-tight font-bold text-[#1C2C5B]">
                FL Studio：你的音乐创作伙伴
              </h3>
              <p className="mt-4 text-gray-600">
                FL Studio（前身为FruityLoops）是全球领先的数字音频工作站，为音乐制作人和DJ提供了创作、录制、编辑和混音音乐的完整解决方案。无论你是想制作热门歌曲，还是创作下一个体育场合唱，FL Studio都能满足你的需求。
              </p>
              <div className="mt-6">
                <span className="inline-block bg-[#1C2C5B] rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">#电子音乐</span>
                <span className="inline-block bg-[#1C2C5B] rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">#音乐创作</span>
                <span className="inline-block bg-[#1C2C5B] rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">#音乐制作</span>
                <span className="inline-block bg-[#1C2C5B] rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">#FL Studio</span>
              </div>
            </div>
          </div>
        </div>

        {/* FL Studio特性 */}
        <h3 className="text-3xl font-bold text-[#1C2C5B] text-center mb-8">FL Studio的强大功能</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image
                src={feature.icon}
                alt={feature.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h4 className="font-bold text-xl mb-2 text-[#1C2C5B]">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 在教程部分上方添加播放器组件 */}
        <div className="mt-12 mb-16">
          <h3 className="text-2xl font-bold text-[#1C2C5B] mb-6 text-center">试听演示</h3>
          <div className="max-w-2xl mx-auto">
            <MusicPlayer 
              audioSrc="/demo-track.mp3" 
              title="FL Studio制作示例 - 电子舞曲" 
              className="mb-8"
            />
            <MusicPlayer 
              audioSrc="/piano-demo.mp3" 
              title="钢琴Roll编辑器示例" 
            />
          </div>
        </div>

        {/* 教程部分 */}
        <h3 className="text-3xl font-bold text-[#1C2C5B] text-center mb-8">开始你的音乐制作之旅</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image
                src={tutorial.image}
                alt={tutorial.title}
                width={400}
                height={250}
                className="w-full h-52 object-cover"
              />
              <div className="p-6">
                <h4 className="font-bold text-xl mb-2 text-[#1C2C5B]">{tutorial.title}</h4>
                <p className="text-gray-600 mb-4">{tutorial.description}</p>
                <Link href="#" className="text-[#98C5E9] font-semibold hover:text-[#1C2C5B] transition-colors duration-300">
                  观看教程 &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 在教程部分后添加3D消息队列 */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-[#1C2C5B] text-center mb-8">用户评价</h3>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            听听其他音乐制作人对FL Studio的看法，了解他们如何使用这款强大的软件创作出令人惊叹的音乐作品。
          </p>
          <MusicMarquee3D />
        </div>

        {/* 号召性用语 */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-[#1C2C5B] mb-4">准备好创作自己的歌曲了吗？</h3>
          <p className="text-lg text-gray-600 mb-6">
            加入我们的音乐制作社区，分享你的作品，与其他音乐爱好者一起创作。
          </p>
          <Link 
            href="https://www.image-line.com/fl-studio/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-[#1C2C5B] hover:bg-[#98C5E9] text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
          >
            开始创作
          </Link>
        </div>
      </div>
      
      {/* About Me 部分 - 页面最底部并居中 */}
      <div className="mt-32 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[#1C2C5B]">About Me</h2>
          </div>
          
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
                  Hello! I'm Woowonjae, a passionate music producer and blogger. Welcome to my personal space where I share my journey and insights into music production.
                </p>
                <p className="text-gray-600 mb-4">
                  我使用FL Studio已经有7年时间，熟悉各种音乐制作技术和工作流程。我相信音乐是表达自我的最佳方式之一，无论你是专业音乐人还是爱好者，都能通过这个平台找到表达的方式。
                </p>
                <p className="text-gray-600 mb-6">
                  在这个音乐制作中心，我希望与大家分享我的经验和技巧，帮助更多人踏上音乐创作的旅程。无论你是想学习基础知识，还是寻求高级技巧，我都很乐意提供帮助。
                </p>
                <div className="flex justify-center space-x-6 mt-6">
                  <Link href="#" className="text-[#1C2C5B] hover:text-[#98C5E9]">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                    </svg>
                  </Link>
                  <Link href="#" className="text-[#1C2C5B] hover:text-[#98C5E9]">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </Link>
                  <Link href="#" className="text-[#1C2C5B] hover:text-[#98C5E9]">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </Link>
                  <Link href="#" className="text-[#1C2C5B] hover:text-[#98C5E9]">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicProduction; 
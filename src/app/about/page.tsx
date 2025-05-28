'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from "@/contexts/ThemeContext";

export default function About() {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-teal-50 dark:from-gray-900 dark:to-teal-900 pt-16 pb-12">
      {/* 导航栏 */}
      <div className="fixed top-2 left-2 z-50 flex gap-2">
        <Link 
          href="/"
          className="inline-block bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
        >
          返回首页
        </Link>
        <Link 
          href="/home"
          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
        >
          主页
        </Link>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-teal-800 dark:text-teal-300 mb-4">关于我</h1>
          </header>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-10">
            <div className="md:flex">
              <div className="md:w-1/3 p-8 flex justify-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?q=80&w=400&auto=format&fit=crop"
                    alt="Woowonjae"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-4">WooWonJae</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  音乐制作人 | 独立开发者 | 足球爱好者
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  我是一名热爱音乐与技术的创作者，擅长将编程与音乐创作相结合。
                  在过去的几年中，我致力于探索AI音乐生成技术，以及开发音乐相关的应用程序。
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-4">我的技能</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">音乐制作</span>
                    <span className="text-gray-600 dark:text-gray-400">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Web开发</span>
                    <span className="text-gray-600 dark:text-gray-400">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">AI技术</span>
                    <span className="text-gray-600 dark:text-gray-400">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">足球战术分析</span>
                    <span className="text-gray-600 dark:text-gray-400">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-4">我的经历</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-teal-500 pl-4 pb-4">
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">2021 - 至今</h3>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">独立音乐制作人</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">创作和发布个人音乐作品，探索AI辅助创作</p>
                </div>
                <div className="border-l-2 border-teal-500 pl-4 pb-4">
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">2020 - 至今</h3>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Web开发工程师</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">开发音乐相关的Web应用和工具</p>
                </div>
                <div className="border-l-2 border-teal-500 pl-4">
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">2019 - 2020</h3>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">足球数据分析师</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">为足球俱乐部提供数据分析和战术建议</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-10">
            <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-4">关于本站</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              本网站是我的个人作品集和博客平台，主要展示我在音乐制作、编程开发和足球分析方面的作品和想法。
              网站使用Next.js和TailwindCSS构建，采用了现代化的设计理念和技术栈。
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              我希望通过这个平台与志同道合的朋友交流，分享我的创作过程和经验。如果你对音乐制作、Web开发或足球分析有兴趣，
              欢迎通过社交媒体与我联系！
            </p>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-4">联系我</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              如果你对我的作品感兴趣，或者有合作意向，欢迎随时联系我
            </p>
            <a 
              href="mailto:contact@woowonjae.com" 
              className="inline-block bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition"
            >
              发送邮件
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
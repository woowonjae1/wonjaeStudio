'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">页面未找到</h2>
        
        <div className="bg-gray-800 p-4 rounded-lg mb-8 text-left overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">调试信息:</h3>
          <p className="font-mono break-all bg-gray-900 p-2 rounded mb-2">
            请求路径: <span className="text-yellow-400">{pathname}</span>
          </p>
          <p className="text-sm text-gray-400 mb-4">
            此路径不存在或未正确配置。在Next.js应用中，路径需要对应到正确的页面组件。
          </p>
          
          <h4 className="font-semibold mb-1">可能的原因:</h4>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-300 mb-4">
            <li>路径拼写错误</li>
            <li>页面组件不存在</li>
            <li>路由配置问题</li>
            <li>动态路由参数错误</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
            返回首页
          </Link>
          <Link href="/debug-route" className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition">
            路由调试工具
          </Link>
        </div>
      </div>
    </div>
  );
} 
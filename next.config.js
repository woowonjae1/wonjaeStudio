/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { dev }) => {
    // 支持 Three.js
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    
    if (dev) {
      config.watchOptions = {
        poll: 1000, // 每秒检查一次更改
        aggregateTimeout: 300, // 防抖延迟
        ignored: ['**/node_modules', '**/.git'], // 忽略这些文件夹的变化
      };
    }
    return config;
  },
  // 添加快速刷新配置
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
};

module.exports = nextConfig;
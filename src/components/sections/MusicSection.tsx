import { FC } from 'react';

interface SocialCardProps {
  name: string;
  followers: number;
  color: string;
  link: string;
  textColor?: string;
}

const SocialCard: FC<SocialCardProps> = ({ name, followers, color, link, textColor }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="w-full rounded-2xl shadow-xl px-8 py-6 mb-8 flex justify-between items-center font-bold text-xl transition-transform duration-150 hover:scale-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-opacity-50"
    style={{ background: color, color: textColor || '#fff', boxShadow: '0 6px 32px 0 rgba(0,0,0,0.18), 0 0 16px 2px ' + color + '33' }}
    tabIndex={0}
  >
    <span className="tracking-wide">{name}</span>
    <span className="text-base font-semibold opacity-95">{followers} Followers</span>
  </a>
);

const socialList = [
  {
    name: '小红书',
    followers: 80,
    color: '#FF2C55',
    link: 'https://www.xiaohongshu.com/user/profile/5dd412400000000001006f7c',
  },
  {
    name: 'Bilibili',
    followers: 3,
    color: '#FF7CA8',
    link: 'https://space.bilibili.com/270089039',
  },
  {
    name: 'GitHub',
    followers: 1,
    color: '#181818',
    link: 'https://github.com/woowonjae1',
  },
  {
    name: '网易云',
    followers: 489,
    color: '#E71A1A',
    link: 'https://music.163.com/#/user/home?id=1939616311',
  },
];

const MusicSection: FC = () => {
  return (
    <section id="music" className="py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 items-start">
        {/* 左侧内容 */}
        <div className="flex-1 mb-8 md:mb-0">
          <h2 className="text-3xl font-bold mb-6">Music Production</h2>
          <p className="text-gray-600 mb-8">
            Explore my music production tips, tutorials, and projects.
          </p>
        </div>
        {/* 右侧社交卡片 */}
        <div className="w-full md:w-80 flex flex-col">
          {socialList.map((item) => (
            <SocialCard key={item.name} {...item} textColor={item.name === 'GitHub' ? '#fff' : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MusicSection;
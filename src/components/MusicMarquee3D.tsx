import React from 'react';
import { cn } from "@/lib/utils";

// 自定义Marquee组件替换缺失的导入
const Marquee = ({ 
  children, 
  className, 
  pauseOnHover = false, 
  direction = 'left', 
  speed = 50,
  vertical = false,
  reverse = false
}: { 
  children: React.ReactNode, 
  className?: string, 
  pauseOnHover?: boolean, 
  direction?: 'left' | 'right', 
  speed?: number,
  vertical?: boolean,
  reverse?: boolean
}) => {
  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      style={{ '--speed': `${speed}s` } as React.CSSProperties}
    >
      <div 
        className={cn(
          vertical ? "flex flex-col min-h-full" : "flex min-w-full",
          "whitespace-nowrap py-3",
          vertical ? "animate-marquee-vertical" : "animate-marquee",
          pauseOnHover && "hover:[animation-play-state:paused]",
          (!vertical && direction === 'right') || reverse ? "animate-marquee-reverse" : ""
        )}
      >
        {children}
      </div>
    </div>
  );
};

// 音乐制作相关的评论
const musicReviews = [
  {
    name: "Alex",
    username: "@producer_alex",
    body: "FL Studio的音序器太强大了，制作电子音乐非常流畅。完全改变了我的创作流程！",
    img: "https://avatar.vercel.sh/alex",
  },
  {
    name: "Sofia",
    username: "@sofia_beats",
    body: "刚学会用Harmor合成器，声音设计的可能性简直无限。太惊艳了！",
    img: "https://avatar.vercel.sh/sofia",
  },
  {
    name: "Mike",
    username: "@mikemusic",
    body: "钢琴卷帘编辑器的精确控制让我的曲子动态感增强了很多。推荐给所有制作人！",
    img: "https://avatar.vercel.sh/mike",
  },
  {
    name: "Emma",
    username: "@emma_sound",
    body: "Edison的录音和编辑功能让我可以快速采样和处理声音。音频处理从未如此简单！",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "David",
    username: "@davemixer",
    body: "使用Maximus进行母带处理真的提升了我作品的音质。听起来更加专业了！",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Lily",
    username: "@lily_loops",
    body: "粒子合成器让我创造出了一些超现实的音效。这种创新真的让我爱上了FL Studio！",
    img: "https://avatar.vercel.sh/lily",
  },
  {
    name: "Ryan",
    username: "@ryan_rhythm",
    body: "FL Studio的鼓机插件让我能够创造出复杂的节奏。现在我的打击乐部分听起来超专业！",
    img: "https://avatar.vercel.sh/ryan",
  },
  {
    name: "Zoe",
    username: "@zoe_zen",
    body: "从未想过音乐制作可以这么直观。FL Studio的界面设计简直就是创造力的催化剂！",
    img: "https://avatar.vercel.sh/zoe",
  },
  {
    name: "Tom",
    username: "@tom_tracks",
    body: "使用FL Studio的自动化功能真的让我的音乐更有动态感。每个参数都可以完美控制！",
    img: "https://avatar.vercel.sh/tom",
  },
  {
    name: "Nora",
    username: "@nora_notes",
    body: "Flex合成器改变了我制作贝斯的方式，声音太饱满了！推荐给每位制作人尝试。",
    img: "https://avatar.vercel.sh/nora",
  },
  {
    name: "James",
    username: "@james_jamming",
    body: "Sytrus合成器的FM能力无与伦比，我用它创造了一些令人难以置信的音色。",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Kira",
    username: "@kira_keys",
    body: "FL Studio的Piano Roll编辑功能如此精确，可以表达任何音乐想法，非常直观！",
    img: "https://avatar.vercel.sh/kira",
  },
  {
    name: "Owen",
    username: "@owen_808",
    body: "用Pitcher修正人声简直太容易了，非常适合录制和编辑人声作品。",
    img: "https://avatar.vercel.sh/owen",
  },
  {
    name: "Maya",
    username: "@maya_mix",
    body: "FL Studio的混音控制台让我能轻松平衡各个音轨，使最终作品听起来专业无比。",
    img: "https://avatar.vercel.sh/maya",
  },
  {
    name: "Leo",
    username: "@leo_loops",
    body: "Pattern编辑器让我能快速实验不同的音乐想法，然后无缝组合到最终曲目中。",
    img: "https://avatar.vercel.sh/leo",
  },
  {
    name: "Aisha",
    username: "@aisha_audio",
    body: "FL Studio的Patcher简直就是模块化天堂，可以创建复杂的信号链而不会混乱。",
    img: "https://avatar.vercel.sh/aisha",
  },
  {
    name: "Carlos",
    username: "@carlos_chords",
    body: "从未想过我能这么快就掌握音乐制作，FL Studio的工作流程太流畅了！",
    img: "https://avatar.vercel.sh/carlos",
  },
  {
    name: "Ella",
    username: "@ella_electro",
    body: "使用Image-Line云服务备份我的项目非常方便，再也不用担心丢失创作了。",
    img: "https://avatar.vercel.sh/ella",
  }
];

// 分成四列，每列分配4-5条评论
const column1 = musicReviews.slice(0, 5);
const column2 = musicReviews.slice(5, 9);
const column3 = musicReviews.slice(9, 14);
const column4 = musicReviews.slice(14, 18);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-44 cursor-pointer overflow-hidden rounded-xl border p-4 mb-4",
        // light styles
        "border-[#1C2C5B]/[.1] bg-[#1C2C5B]/[.01] hover:bg-[#1C2C5B]/[.05]",
        // dark styles
        "dark:border-[#98C5E9]/[.1] dark:bg-[#98C5E9]/[.05] dark:hover:bg-[#98C5E9]/[.1]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-[#1C2C5B] dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-[#1C2C5B]/60 dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-gray-600">{body}</blockquote>
    </figure>
  );
};

export function MusicMarquee3D() {
  return (
    <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        <Marquee pauseOnHover vertical className="[--duration:15s]">
          {column1.map((review, index) => (
            <ReviewCard key={`col1-${index}`} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover vertical className="[--duration:18s]">
          {column2.map((review, index) => (
            <ReviewCard key={`col2-${index}`} {...review} />
          ))}
        </Marquee>
        <Marquee pauseOnHover vertical className="[--duration:20s]">
          {column3.map((review, index) => (
            <ReviewCard key={`col3-${index}`} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover vertical className="[--duration:17s]">
          {column4.map((review, index) => (
            <ReviewCard key={`col4-${index}`} {...review} />
          ))}
        </Marquee>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white"></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
    </div>
  );
} 
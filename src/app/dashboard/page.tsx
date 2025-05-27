'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FloatingCard } from '@/components/ui/floating-card';
import { DotPattern } from '@/components/ui/dot-pattern';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">欢迎来到 Dashboard（演示页面，无需登录）</div>
    </div>
  );
} 
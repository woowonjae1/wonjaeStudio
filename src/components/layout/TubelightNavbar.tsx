"use client";

import { Home, BookOpen, Hash, Music } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

export function TubelightNavbar() {
  const navItems = [
    { name: "首页", url: "/", icon: Home },
    { name: "笔记", url: "/notes", icon: BookOpen },
    { name: "主题", url: "/topics", icon: Hash },
    { name: "音乐", url: "/music", icon: Music },
  ];

  return <NavBar items={navItems} />;
}

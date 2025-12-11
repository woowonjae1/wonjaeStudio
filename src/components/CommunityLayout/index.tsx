"use client";

import { ReactNode, useState, useEffect } from "react";
import CommunityHeader from "./CommunityHeader";
import CommunityLeftSidebar from "@/components/CommunityLayout/CommunityLeftSidebar";
import CommunityRightSidebar from "@/components/CommunityLayout/CommunityRightSidebar";
import NicknameModal from "@/components/NicknameModal";
import {
  getUserIdentity,
  setUserIdentity,
  updateUsername,
  UserIdentity,
} from "@/lib/userIdentity";
import "./CommunityHeader.css";
import "./CommunityLayout.css";

interface CommunityLayoutProps {
  children: ReactNode;
  showSidebars?: boolean;
}

export default function CommunityLayout({
  children,
  showSidebars = true,
}: CommunityLayoutProps) {
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  useEffect(() => {
    const existingUser = getUserIdentity();
    if (existingUser) {
      setUser(existingUser);
    } else {
      setShowNicknameModal(true);
    }
  }, []);

  const handleSetNickname = (nickname: string) => {
    if (user) {
      const updated = updateUsername(nickname);
      if (updated) setUser(updated);
    } else {
      const newUser = setUserIdentity(nickname);
      setUser(newUser);
    }
    setShowNicknameModal(false);
  };

  return (
    <div className="discourse-page">
      <CommunityHeader
        user={user}
        onEditProfile={() => setShowNicknameModal(true)}
      />

      <NicknameModal
        isOpen={showNicknameModal}
        onSubmit={handleSetNickname}
        currentName={user?.username}
        onClose={() => setShowNicknameModal(false)}
      />

      <div className="discourse-container">
        {showSidebars && <CommunityLeftSidebar />}

        <main className="discourse-main">{children}</main>

        {showSidebars && <CommunityRightSidebar />}
      </div>
    </div>
  );
}

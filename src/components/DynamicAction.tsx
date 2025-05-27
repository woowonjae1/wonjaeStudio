"use client"

import { Loader, MessageCircle, Waves } from "lucide-react"
import {
  DynamicContainer,
  DynamicDescription,
  DynamicDiv,
  DynamicIsland,
  DynamicTitle,
  SizePresets,
  useDynamicIslandSize,
  useScheduledAnimations,
} from "@/components/ui/dynamic-island"

export function DynamicAction() {
  const { state: blobState } = useDynamicIslandSize()

  // 自动播放动画序列
  useScheduledAnimations([
    { size: "compact", delay: 0 },
    { size: "large", delay: 500 },
    { size: "tall", delay: 1000 },
    { size: "long", delay: 1500 },
    { size: "medium", delay: 2000 },
  ])

  const renderCompactState = () => (
    <DynamicContainer className="flex items-center justify-center h-full w-full">
      <div className="relative w-full flex items-center">
        <DynamicDescription className="absolute left-4 my-auto text-lg font-medium tracking-tighter text-white">
          <MessageCircle className="h-5 w-5 fill-cyan-400 text-cyan-400" />
        </DynamicDescription>
        <DynamicDescription className="absolute text-white right-4 my-auto text-lg font-bold tracking-tighter">
          Loading...
        </DynamicDescription>
      </div>
    </DynamicContainer>
  )

  const renderLargeState = () => (
    <DynamicContainer className="flex items-center justify-center h-full w-full">
      <div className="relative flex w-full items-center justify-between gap-6 px-4">
        <Loader className="animate-spin h-12 w-12 text-yellow-300" />
        <DynamicTitle className="my-auto text-2xl font-black tracking-tighter text-white">
          Preparing
        </DynamicTitle>
      </div>
    </DynamicContainer>
  )

  const renderTallState = () => (
    <DynamicContainer className="flex items-center justify-center h-full w-full">
      <DynamicTitle className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-cyan-100 whitespace-nowrap">
        Welcome to Woowonjae Studio
      </DynamicTitle>
    </DynamicContainer>
  )

  const renderLongState = () => (
    <DynamicContainer className="flex items-center justify-center h-full w-full">
      <DynamicDiv className="relative flex w-full items-center justify-between gap-6 px-4">
        <div>
          <Waves className="text-cyan-400 h-8 w-8" />
        </div>
        <DynamicTitle className="my-auto text-xl font-black tracking-tighter text-white">
          Almost there...
        </DynamicTitle>
      </DynamicDiv>
    </DynamicContainer>
  )

  const renderMediumState = () => (
    <DynamicContainer className="flex flex-col justify-between px-2 pt-4 text-left text-white h-full">
      <DynamicTitle className="text-2xl pl-3 font-black tracking-tighter">
        Let's make some music
      </DynamicTitle>
      <DynamicDescription className="leading-5 text-neutral-500 pl-3">
        Your creative journey awaits
      </DynamicDescription>
    </DynamicContainer>
  )

  function renderState() {
    switch (blobState.size) {
      case "compact":
        return renderCompactState()
      case "large":
        return renderLargeState()
      case "tall":
        return renderTallState()
      case "medium":
        return renderMediumState()
      case "long":
        return renderLongState()
      default:
        return renderCompactState()
    }
  }

  return (
    <div className="h-full">
      <div className="flex flex-col gap-4 h-full">
        <DynamicIsland id="dynamic-blob">{renderState()}</DynamicIsland>
      </div>
    </div>
  )
} 
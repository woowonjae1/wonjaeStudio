'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from "@/lib/utils"

// 专辑数据类型
interface Album {
  id: string
  title: string
  image: string
  audioSrc: string
  artist?: string
  duration?: string
}

export function AlbumList() {
  // 专辑数据
  const albums: Album[] = [
    {
      id: '1',
      title: 'Romantic Album',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop',
      audioSrc: '/romantic-track.mp3',
      artist: '再完美5zhz',
      duration: '2:56'
    },
    {
      id: '2',
      title: 'Art Life Album',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=200&auto=format&fit=crop',
      audioSrc: '/art-life-track.mp3',
      artist: '再完美5zhz',
      duration: '3:15'
    },
    {
      id: '3',
      title: 'Heart Breaking Album',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop',
      audioSrc: '/heart-breaking-track.mp3',
      artist: '再完美5zhz',
      duration: '2:56'
    },
    {
      id: '4',
      title: 'Nobody Gets Me Album',
      image: 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?q=80&w=200&auto=format&fit=crop',
      audioSrc: '/nobody-gets-me-track.mp3',
      artist: '再完美5zhz',
      duration: '3:42'
    }
  ]

  // 状态管理
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlayer, setShowPlayer] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // 播放专辑
  const playAlbum = (album: Album) => {
    setCurrentAlbum(album)
    setShowPlayer(true)
    
    // 如果是同一首歌，则切换播放状态
    if (currentAlbum?.id === album.id) {
      togglePlay()
    } else {
      // 设置新的歌曲后自动播放
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
          setIsPlaying(true)
        }
      }, 100)
    }
  }

  // 切换播放状态
  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // 处理播放进度更新
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  // 关闭播放器
  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setIsPlaying(false)
    setShowPlayer(false)
  }

  // 监听音频事件
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const updateDuration = () => {
      if (audio.duration) setDuration(audio.duration)
    }
    
    const updateTime = () => {
      setCurrentTime(audio.currentTime)
    }
    
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }
    
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)
    
    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentAlbum])

  // 格式化时间
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold mb-8">My Albums</h2>
      
      {/* 专辑列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {albums.map((album) => (
          <div key={album.id} className="flex flex-col items-center">
            <div 
              className="relative w-56 h-56 mb-4 transform transition-transform duration-300 hover:scale-105 cursor-pointer"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                transform: 'rotateY(15deg)'
              }}
            >
              <Image 
                src={album.image} 
                alt={album.title}
                width={200}
                height={200}
                className="rounded-lg shadow-lg object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-medium mb-2">{album.title}</h3>
            <button 
              onClick={() => playAlbum(album)}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Play
            </button>
          </div>
        ))}
      </div>
      
      {/* 音频播放器 - 可关闭 */}
      {showPlayer && currentAlbum && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-2 flex items-center">
          <audio 
            ref={audioRef}
            src={currentAlbum.audioSrc}
            preload="metadata"
          />
          
          <div className="flex items-center">
            <Image 
              src={currentAlbum.image} 
              alt={currentAlbum.title}
              width={56}
              height={56}
              className="rounded-md"
            />
            <div className="ml-3">
              <h4 className="font-medium">{currentAlbum.title}</h4>
              <p className="text-sm text-gray-600">{currentAlbum.artist}</p>
            </div>
          </div>
          
          <div className="flex-1 mx-6">
            <div className="flex items-center">
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>
              
              <div className="flex-1 mx-4">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{currentAlbum.duration || formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 关闭按钮 */}
          <button 
            onClick={closePlayer}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="关闭播放器"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
} 
'use client'

import { useState } from 'react'

// 赛事数据类型
interface Fixture {
  id: string
  competition: string
  competitionShort: string
  homeTeam: {
    name: string
    shortName: string
    score?: number
  }
  awayTeam: {
    name: string
    shortName: string
    score?: number
  }
  date: string
  time: string
  isUpcoming: boolean
  venue?: string
}

export function UpcomingFixtures() {
  return null;
} 
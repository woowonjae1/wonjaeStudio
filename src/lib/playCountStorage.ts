// Play count storage using localStorage

const STORAGE_KEY = "woowonjae_play_counts";
const TOTAL_PLAYS_KEY = "woowonjae_total_plays";

export interface PlayCounts {
  [trackTitle: string]: number;
}

export const getPlayCounts = (): PlayCounts => {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error("Error reading play counts:", e);
    return {};
  }
};

export const getTotalPlays = (): number => {
  if (typeof window === "undefined") return 50000;

  try {
    const stored = localStorage.getItem(TOTAL_PLAYS_KEY);
    return stored ? parseInt(stored, 10) : 50000;
  } catch (e) {
    console.error("Error reading total plays:", e);
    return 50000;
  }
};

export const incrementPlayCount = (trackTitle: string): void => {
  if (typeof window === "undefined") return;

  try {
    // Increment track play count
    const counts = getPlayCounts();
    counts[trackTitle] = (counts[trackTitle] || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));

    // Increment total plays
    const totalPlays = getTotalPlays();
    localStorage.setItem(TOTAL_PLAYS_KEY, (totalPlays + 1).toString());
  } catch (e) {
    console.error("Error incrementing play count:", e);
  }
};

export const getTrackPlayCount = (trackTitle: string): number => {
  const counts = getPlayCounts();
  return counts[trackTitle] || 0;
};

export const formatPlayCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

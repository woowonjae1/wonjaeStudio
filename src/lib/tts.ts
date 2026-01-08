"use client";

export type AccentType = "us" | "uk";

// 获取存储的口音偏好
export function getStoredAccent(): AccentType {
  if (typeof window === "undefined") return "us";
  return (localStorage.getItem("english_accent") as AccentType) || "us";
}

// 保存口音偏好
export function setStoredAccent(accent: AccentType): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("english_accent", accent);
  // 触发事件通知其他组件
  window.dispatchEvent(new CustomEvent("accentChange", { detail: accent }));
}

// 文本转语音功能
export function speak(
  text: string,
  accent?: AccentType,
  rate: number = 0.9
): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  // 停止当前播放
  window.speechSynthesis.cancel();

  const currentAccent = accent || getStoredAccent();
  const lang = currentAccent === "uk" ? "en-GB" : "en-US";

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = 1;

  // 获取可用语音
  const voices = window.speechSynthesis.getVoices();

  // 根据口音选择合适的语音
  let selectedVoice: SpeechSynthesisVoice | undefined;

  if (currentAccent === "uk") {
    // 英式发音优先级
    selectedVoice =
      voices.find(
        (v) => v.lang === "en-GB" && v.name.includes("Google UK English")
      ) ||
      voices.find((v) => v.lang === "en-GB" && v.name.includes("Microsoft")) ||
      voices.find((v) => v.lang === "en-GB") ||
      voices.find((v) => v.lang.startsWith("en"));
  } else {
    // 美式发音优先级
    selectedVoice =
      voices.find(
        (v) => v.lang === "en-US" && v.name.includes("Google US English")
      ) ||
      voices.find((v) => v.lang === "en-US" && v.name.includes("Microsoft")) ||
      voices.find((v) => v.lang === "en-US") ||
      voices.find((v) => v.lang.startsWith("en"));
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// 慢速播放
export function speakSlow(text: string, accent?: AccentType): void {
  speak(text, accent, 0.6);
}

// 预加载语音
export function preloadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // 等待语音加载
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
}

// 获取可用的英语语音列表
export function getEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.startsWith("en"));
}

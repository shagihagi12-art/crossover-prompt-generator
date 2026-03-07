import type { CSSProperties } from "react";
import type { SpeechStyleType } from "@/lib/types";

export interface FontTheme {
  id: string;
  workName: string;
  fontFamily: string;
  googleFontUrl: string;
  baseStyle: CSSProperties;
  nameTagStyle: CSSProperties;
  speechStyleOverrides: Partial<Record<SpeechStyleType, CSSProperties>>;
  bubbleStyle: CSSProperties;
  accentColor: string;
}

// ============================================================
// 8作品テーマ + デフォルト
// ============================================================

const DEFAULT_THEME: FontTheme = {
  id: "default",
  workName: "デフォルト",
  fontFamily: "'Noto Sans JP', sans-serif",
  googleFontUrl: "",
  baseStyle: {
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#1a1a2e",
  },
  nameTagStyle: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  speechStyleOverrides: {
    shout: { fontWeight: 900, fontSize: "1.15rem", color: "#d32f2f" },
    whisper: { fontSize: "0.8rem", color: "#888", fontStyle: "italic" },
    inner: { fontStyle: "italic", color: "#666", borderLeft: "3px solid #ccc", paddingLeft: "8px" },
    dramatic: { fontWeight: 700, letterSpacing: "0.05em" },
    comedic: { fontSize: "1.05rem" },
  },
  bubbleStyle: {
    backgroundColor: "#fff",
    border: "2px solid #333",
    borderRadius: "12px",
    padding: "8px 12px",
  },
  accentColor: "#6c757d",
};

const MHA_THEME: FontTheme = {
  id: "mha",
  workName: "僕のヒーローアカデミア",
  fontFamily: "'M PLUS Rounded 1c', 'Noto Sans JP', sans-serif",
  googleFontUrl: "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;900&display=swap",
  baseStyle: {
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#1a3a1a",
    fontWeight: 700,
  },
  nameTagStyle: {
    backgroundColor: "#2e7d32",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 900,
  },
  speechStyleOverrides: {
    shout: { fontWeight: 900, fontSize: "1.2rem", color: "#d32f2f", textShadow: "1px 1px 0 rgba(0,0,0,0.2)" },
    whisper: { fontSize: "0.8rem", color: "#666", fontStyle: "italic" },
    inner: { fontStyle: "italic", color: "#4a7c59", borderLeft: "3px solid #2e7d32", paddingLeft: "8px" },
    dramatic: { fontWeight: 900, letterSpacing: "0.08em", fontSize: "1.1rem" },
  },
  bubbleStyle: {
    backgroundColor: "#f0fff0",
    border: "2px solid #2e7d32",
    borderRadius: "12px",
    padding: "8px 12px",
  },
  accentColor: "#2e7d32",
};

const BLUELOCK_THEME: FontTheme = {
  id: "bluelock",
  workName: "ブルーロック",
  fontFamily: "'Noto Sans JP', sans-serif",
  googleFontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap",
  baseStyle: {
    fontSize: "0.95rem",
    lineHeight: 1.4,
    color: "#0a1628",
    fontWeight: 700,
  },
  nameTagStyle: {
    backgroundColor: "#00bcd4",
    color: "#0a1628",
    padding: "2px 8px",
    borderRadius: "2px",
    fontSize: "0.75rem",
    fontWeight: 900,
    letterSpacing: "0.05em",
  },
  speechStyleOverrides: {
    shout: { fontWeight: 900, fontSize: "1.15rem", color: "#00e5ff", textShadow: "0 0 8px rgba(0,229,255,0.4)" },
    whisper: { fontSize: "0.8rem", color: "#5c6b7a" },
    inner: { fontStyle: "italic", color: "#00bcd4", borderLeft: "3px solid #00bcd4", paddingLeft: "8px" },
    dramatic: { fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" as const },
  },
  bubbleStyle: {
    backgroundColor: "#0d1b2a",
    border: "2px solid #00bcd4",
    borderRadius: "4px",
    padding: "8px 12px",
    color: "#e0f7fa",
  },
  accentColor: "#00bcd4",
};

const EVANGELION_THEME: FontTheme = {
  id: "evangelion",
  workName: "新世紀エヴァンゲリオン",
  fontFamily: "'Noto Sans JP', sans-serif",
  googleFontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap",
  baseStyle: {
    fontSize: "0.95rem",
    lineHeight: 1.4,
    color: "#1a0a2e",
    fontWeight: 400,
  },
  nameTagStyle: {
    backgroundColor: "#7b1fa2",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "0px",
    fontSize: "0.75rem",
    fontWeight: 900,
    letterSpacing: "0.1em",
  },
  speechStyleOverrides: {
    shout: { fontWeight: 900, fontSize: "1.2rem", color: "#e040fb", textShadow: "0 0 12px rgba(224,64,251,0.5)" },
    whisper: { fontSize: "0.8rem", color: "#9e9e9e", letterSpacing: "0.15em" },
    inner: { fontStyle: "normal", color: "#ce93d8", borderLeft: "3px solid #7b1fa2", paddingLeft: "8px", letterSpacing: "0.1em" },
    dramatic: { fontWeight: 900, letterSpacing: "0.15em", fontSize: "1.1rem" },
  },
  bubbleStyle: {
    backgroundColor: "#1a0a2e",
    border: "2px solid #7b1fa2",
    borderRadius: "0px",
    padding: "8px 12px",
    color: "#e1bee7",
  },
  accentColor: "#7b1fa2",
};

const CRAYON_SHINCHAN_THEME: FontTheme = {
  id: "crayon_shinchan",
  workName: "クレヨンしんちゃん",
  fontFamily: "'Kosugi Maru', 'Noto Sans JP', sans-serif",
  googleFontUrl: "https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap",
  baseStyle: {
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "#333",
  },
  nameTagStyle: {
    backgroundColor: "#fdd835",
    color: "#333",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  speechStyleOverrides: {
    shout: { fontWeight: 700, fontSize: "1.15rem", color: "#e65100" },
    whisper: { fontSize: "0.8rem", color: "#888" },
    comedic: { fontSize: "1.1rem", color: "#e65100" },
  },
  bubbleStyle: {
    backgroundColor: "#fffde7",
    border: "3px solid #fdd835",
    borderRadius: "20px",
    padding: "8px 14px",
  },
  accentColor: "#fdd835",
};

const DRAGONBALL_THEME: FontTheme = {
  id: "dragonball",
  workName: "ドラゴンボール",
  fontFamily: "'M PLUS Rounded 1c', 'Noto Sans JP', sans-serif",
  googleFontUrl: "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;900&display=swap",
  baseStyle: {
    fontSize: "1rem",
    lineHeight: 1.4,
    color: "#1a1a1a",
    fontWeight: 700,
  },
  nameTagStyle: {
    backgroundColor: "#ff6d00",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 900,
  },
  speechStyleOverrides: {
    shout: { fontWeight: 900, fontSize: "1.3rem", color: "#d50000", animation: "shake 0.3s ease-in-out" },
    whisper: { fontSize: "0.8rem", color: "#777" },
    dramatic: { fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.05em" },
  },
  bubbleStyle: {
    backgroundColor: "#fff3e0",
    border: "3px solid #ff6d00",
    borderRadius: "10px",
    padding: "8px 12px",
  },
  accentColor: "#ff6d00",
};

const ONEPIECE_THEME: FontTheme = {
  id: "onepiece",
  workName: "ワンピース",
  fontFamily: "'M PLUS Rounded 1c', 'Noto Sans JP', sans-serif",
  googleFontUrl: "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;900&display=swap",
  baseStyle: {
    fontSize: "1rem",
    lineHeight: 1.4,
    color: "#1a1a1a",
    fontWeight: 700,
  },
  nameTagStyle: {
    backgroundColor: "#c62828",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: 900,
  },
  speechStyleOverrides: {
    shout: { fontWeight: 900, fontSize: "1.25rem", color: "#b71c1c" },
    whisper: { fontSize: "0.8rem", color: "#666" },
    dramatic: { fontWeight: 900, fontSize: "1.15rem", letterSpacing: "0.08em" },
    comedic: { fontSize: "1.1rem", color: "#e65100" },
  },
  bubbleStyle: {
    backgroundColor: "#fff8f0",
    border: "2px solid #c62828",
    borderRadius: "12px",
    padding: "8px 12px",
  },
  accentColor: "#c62828",
};

const KIMETSU_THEME: FontTheme = {
  id: "kimetsu",
  workName: "鬼滅の刃",
  fontFamily: "'Noto Serif JP', serif",
  googleFontUrl: "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&display=swap",
  baseStyle: {
    fontSize: "0.95rem",
    lineHeight: 1.5,
    color: "#1a1a2e",
  },
  nameTagStyle: {
    backgroundColor: "#1a237e",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "2px",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
  },
  speechStyleOverrides: {
    shout: { fontWeight: 900, fontSize: "1.15rem", color: "#b71c1c" },
    whisper: { fontSize: "0.8rem", color: "#78909c", fontStyle: "italic" },
    inner: { fontStyle: "italic", color: "#3949ab", borderLeft: "3px solid #1a237e", paddingLeft: "8px" },
    dramatic: { fontWeight: 700, letterSpacing: "0.1em" },
  },
  bubbleStyle: {
    backgroundColor: "#e8eaf6",
    border: "2px solid #1a237e",
    borderRadius: "4px",
    padding: "8px 12px",
  },
  accentColor: "#1a237e",
};

const AOT_THEME: FontTheme = {
  id: "aot",
  workName: "進撃の巨人",
  fontFamily: "'Noto Sans JP', sans-serif",
  googleFontUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap",
  baseStyle: {
    fontSize: "0.95rem",
    lineHeight: 1.4,
    color: "#212121",
    fontWeight: 400,
  },
  nameTagStyle: {
    backgroundColor: "#455a64",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "2px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  speechStyleOverrides: {
    shout: { fontWeight: 900, fontSize: "1.2rem", color: "#b71c1c", letterSpacing: "0.05em" },
    whisper: { fontSize: "0.8rem", color: "#78909c" },
    inner: { fontStyle: "italic", color: "#546e7a", borderLeft: "3px solid #455a64", paddingLeft: "8px" },
    dramatic: { fontWeight: 900, letterSpacing: "0.1em", fontSize: "1.1rem" },
  },
  bubbleStyle: {
    backgroundColor: "#eceff1",
    border: "2px solid #455a64",
    borderRadius: "4px",
    padding: "8px 12px",
  },
  accentColor: "#455a64",
};

// ============================================================
// テーマレジストリ
// ============================================================

const FONT_THEMES: Record<string, FontTheme> = {
  default: DEFAULT_THEME,
  mha: MHA_THEME,
  bluelock: BLUELOCK_THEME,
  evangelion: EVANGELION_THEME,
  crayon_shinchan: CRAYON_SHINCHAN_THEME,
  dragonball: DRAGONBALL_THEME,
  onepiece: ONEPIECE_THEME,
  kimetsu: KIMETSU_THEME,
  aot: AOT_THEME,
};

/** テーマIDからフォントテーマを取得（未登録ならデフォルト） */
export function getFontTheme(themeId: string): FontTheme {
  return FONT_THEMES[themeId] || DEFAULT_THEME;
}

/** 全テーマのGoogle Font URLをまとめて返す（重複排除） */
export function getAllGoogleFontUrls(): string[] {
  const urls = new Set<string>();
  for (const theme of Object.values(FONT_THEMES)) {
    if (theme.googleFontUrl) {
      urls.add(theme.googleFontUrl);
    }
  }
  return Array.from(urls);
}

export { DEFAULT_THEME, FONT_THEMES };

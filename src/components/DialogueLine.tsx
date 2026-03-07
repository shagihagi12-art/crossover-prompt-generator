"use client";

import type { CSSProperties } from "react";
import type { SpeechStyleType } from "@/lib/types";
import type { FontTheme } from "@/styles/fontThemes";
import { getFontTheme, DEFAULT_THEME } from "@/styles/fontThemes";

interface DialogueLineProps {
  character: string;
  line: string;
  emotion: string;
  emotionIntensity?: number;
  speechStyle?: SpeechStyleType;
  reactionTo?: string | null;
  visualDirection?: string;
  fontThemeId?: string; // キャラのfontStyleId
}

/** 感情の強度に応じたスタイル補正 */
function getIntensityStyle(intensity: number): CSSProperties {
  if (intensity >= 8) return { fontSize: "1.15em", fontWeight: 900 };
  if (intensity >= 5) return { fontWeight: 700 };
  if (intensity <= 2) return { fontSize: "0.9em", opacity: 0.8 };
  return {};
}

/** speechStyleアイコン */
function getSpeechIcon(style?: SpeechStyleType): string {
  switch (style) {
    case "shout": return "🗯️";
    case "whisper": return "💭";
    case "inner": return "💬";
    case "dramatic": return "✨";
    case "comedic": return "😂";
    case "mumble": return "💤";
    default: return "";
  }
}

export default function DialogueLine({
  character,
  line,
  emotion,
  emotionIntensity,
  speechStyle = "normal",
  reactionTo,
  visualDirection,
  fontThemeId,
}: DialogueLineProps) {
  const theme: FontTheme = fontThemeId ? getFontTheme(fontThemeId) : DEFAULT_THEME;

  // スタイル合成
  const speechOverride = theme.speechStyleOverrides[speechStyle] || {};
  const intensityStyle = emotionIntensity != null ? getIntensityStyle(emotionIntensity) : {};
  const icon = getSpeechIcon(speechStyle);

  const mergedLineStyle: CSSProperties = {
    ...theme.baseStyle,
    fontFamily: theme.fontFamily,
    ...speechOverride,
    ...intensityStyle,
  };

  return (
    <div className="flex flex-col gap-1 animate-fadeIn" style={{ marginBottom: "6px" }}>
      {/* 名前タグ + 感情ラベル */}
      <div className="flex items-center gap-2 flex-wrap">
        <span style={theme.nameTagStyle}>{character}</span>
        <span className="text-xs" style={{ color: theme.accentColor }}>
          {emotion}
          {emotionIntensity != null && <span className="opacity-60"> ({emotionIntensity}/10)</span>}
        </span>
        {reactionTo && (
          <span className="text-xs text-gray-400">→ {reactionTo}</span>
        )}
      </div>

      {/* セリフ吹き出し */}
      <div style={theme.bubbleStyle}>
        <p style={mergedLineStyle}>
          {icon && <span className="mr-1">{icon}</span>}
          「{line}」
        </p>
      </div>

      {/* ビジュアルディレクション */}
      {visualDirection && (
        <p className="text-xs text-gray-400 italic ml-2">🎬 {visualDirection}</p>
      )}
    </div>
  );
}

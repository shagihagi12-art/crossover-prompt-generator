"use client";

import { useEffect } from "react";
import DialogueLine from "./DialogueLine";
import { CHARACTER_DB } from "@/data/characters";
import { loadGoogleFonts } from "@/lib/fontLoader";
import { getAllGoogleFontUrls } from "@/styles/fontThemes";
import type { EnhancedPanel, SpeechStyleType } from "@/lib/types";

interface DialoguePanelProps {
  panels: EnhancedPanel[];
}

const BEAT_LABELS: Record<string, string> = {
  "起": "起 — 状況設定",
  "承": "承 — 展開",
  "転": "転 — 転換",
  "結": "結 — オチ",
};

/** キャラ名からfontStyleIdを検索 */
function findFontThemeId(charName: string): string | undefined {
  const profile = CHARACTER_DB.find(
    (c) => c.name === charName || c.name.includes(charName) || charName.includes(c.name)
  );
  return profile?.fontStyleId;
}

export default function DialoguePanel({ panels }: DialoguePanelProps) {
  // フォント一括読み込み
  useEffect(() => {
    loadGoogleFonts(getAllGoogleFontUrls());
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        🎭 セリフパネル
      </h3>

      {panels.map((panel) => (
        <div
          key={panel.number}
          className="rounded-lg border border-gray-700 overflow-hidden animate-fadeIn"
          style={{ animationDelay: `${(panel.number - 1) * 100}ms` }}
        >
          {/* パネルヘッダー */}
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-3">
            <span className="bg-blue-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center">
              {panel.number}
            </span>
            <span className="text-sm text-gray-300">
              {BEAT_LABELS[panel.beat] || panel.beat}
            </span>
          </div>

          {/* 構図説明 */}
          <div className="px-4 py-2 bg-gray-900/50 border-b border-gray-700">
            <p className="text-sm text-gray-400">📝 {panel.description}</p>
            {panel.visualDirection && (
              <p className="text-xs text-gray-500 mt-1">🎬 {panel.visualDirection}</p>
            )}
          </div>

          {/* セリフ一覧 */}
          <div className="px-4 py-3 space-y-2 bg-gray-950/30">
            {panel.dialogue.map((d, i) => (
              <DialogueLine
                key={`${panel.number}-${i}`}
                character={d.character}
                line={d.line}
                emotion={d.emotion}
                emotionIntensity={d.emotionIntensity}
                speechStyle={d.speechStyle as SpeechStyleType | undefined}
                reactionTo={d.reactionTo}
                visualDirection={d.visualDirection}
                fontThemeId={findFontThemeId(d.character)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

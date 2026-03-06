"use client";

import { useState, useMemo } from "react";
import { GENRES, WORKS, filterByGenre } from "@/lib/works";

const DIRECTION_PRESETS = [
  { id: "satsubatsu-muku", label: "殺伐×無垢", example: "呪術廻戦 × ちいかわ" },
  { id: "surreal-gag", label: "シュールギャグ", example: "どうぶつの森 × キングダム" },
  { id: "ability-mismatch", label: "能力ミスマッチ", example: "コナン × 煉獄" },
  { id: "nichijou-shinshoku", label: "日常侵食", example: "エヴァ × しんちゃん" },
  { id: "dark-fantasy", label: "ダークファンタジー", example: "ベルセルク × ポケモン" },
  { id: "honobono-konton", label: "ほのぼの混沌", example: "すみっコ × 進撃の巨人" },
  { id: "emotional", label: "エモーショナル", example: "CLANNAD × 鬼滅の刃" },
  { id: "battle-royale", label: "バトルロイヤル", example: "ドラゴンボール × ナルト" },
];

const BEAT_COLORS: Record<string, string> = {
  "起": "border-blue-500 bg-blue-900/20",
  "承": "border-green-500 bg-green-900/20",
  "転": "border-yellow-500 bg-yellow-900/20",
  "結": "border-red-500 bg-red-900/20",
};

function WorkSelector({
  label,
  value,
  onChange,
  characterValues,
  onCharacterChange,
  placeholder,
  characterPlaceholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  characterValues: string[];
  onCharacterChange: (v: string[]) => void;
  placeholder: string;
  characterPlaceholder: string;
}) {
  const [genre, setGenre] = useState("全ジャンル");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => filterByGenre(genre), [genre]);
  const selectedWork = WORKS.find((w) => w.name === value);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <div className="flex flex-wrap gap-1">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => { setGenre(g); setIsOpen(true); }}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              genre === g
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
              {filtered
                .filter((w) => !value || w.name.toLowerCase().includes(value.toLowerCase()))
                .map((w) => (
                  <button
                    key={w.name}
                    onClick={() => { onChange(w.name); onCharacterChange([]); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center justify-between ${
                      value === w.name ? "bg-blue-900/40 text-blue-300" : "text-gray-200"
                    }`}
                  >
                    <span>{w.name}</span>
                    <span className="text-xs text-gray-500">{w.genre}</span>
                  </button>
                ))}
              {filtered.filter((w) => !value || w.name.toLowerCase().includes(value.toLowerCase())).length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">該当なし（自由入力OK）</div>
              )}
            </div>
          </>
        )}
      </div>
      {selectedWork && selectedWork.characters.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selectedWork.characters.map((c) => (
            <button
              key={c}
              onClick={() => {
                if (characterValues.includes(c)) {
                  onCharacterChange(characterValues.filter((v) => v !== c));
                } else {
                  onCharacterChange([...characterValues, c]);
                }
              }}
              className={`px-2 py-1 rounded text-xs transition-colors border ${
                characterValues.includes(c)
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <input
        type="text"
        value={characterValues.join("・")}
        onChange={(e) => {
          const text = e.target.value;
          if (text === "") {
            onCharacterChange([]);
          } else {
            onCharacterChange(text.split("・").map((s) => s.trim()).filter(Boolean));
          }
        }}
        placeholder={characterPlaceholder}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

interface PanelData {
  number: number;
  beat: string;
  description: string;
  dialogue: { character: string; line: string; emotion: string }[];
}

interface PromptResult {
  main_title: string;
  subtitle: string;
  prompt_full: string;
  scene_description: string;
  panels: PanelData[];
  style_mix: string;
  visual_effects: string[];
}

export default function GeneratorPage() {
  const [direction, setDirection] = useState("");
  const [worldWork, setWorldWork] = useState("");
  const [worldChars, setWorldChars] = useState<string[]>([]);
  const [charWork, setCharWork] = useState("");
  const [charChars, setCharChars] = useState<string[]>([]);
  const [detail, setDetail] = useState("");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [parsed, setParsed] = useState<PromptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const world = worldChars.length > 0 ? `${worldWork}（${worldChars.join("・")}）` : worldWork;
  const character = charChars.length > 0 ? `${charWork}の${charChars.join("・")}` : charWork;
  const canGenerate = direction.trim() && worldWork.trim() && charWork.trim();

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setError(null);
    setPrompt(null);
    setParsed(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direction: direction.trim(),
          world: world.trim(),
          character: character.trim(),
          detail: detail.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPrompt(data.prompt);
        // Try to parse as instruction for later - not used for now
        // The prompt is what gets copied to AI
      }
    } catch {
      setError("通信エラーが発生しました");
    }
  };

  const copyText = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
    }
  };

  const saveToHistory = () => {
    if (!prompt) return;
    const history = JSON.parse(localStorage.getItem("crossover-history") || "[]");
    history.unshift({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      input: { direction, world, character, detail },
      prompt,
    });
    if (history.length > 100) history.length = 100;
    localStorage.setItem("crossover-history", JSON.stringify(history));
    setCopiedField("saved");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">4コマ漫画プロンプト生成</h2>
          <p className="text-sm text-gray-500 mt-1">
            クロスオーバー4コマ漫画の画像生成プロンプトを作成します。AIに貼り付けてそのまま画像生成できます。
          </p>
        </div>

        {/* Direction Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            方向性（テーマ・トーン）
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {DIRECTION_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setDirection(p.label)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  direction === p.label
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500"
                }`}
              >
                <div>{p.label}</div>
                <div className="text-xs opacity-60 mt-0.5">{p.example}</div>
              </button>
            ))}
          </div>
          <input
            type="text"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            placeholder="プリセットを選ぶか、自由入力"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* World & Character */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkSelector
            label="作品A（世界観・舞台）"
            value={worldWork}
            onChange={setWorldWork}
            characterValues={worldChars}
            onCharacterChange={setWorldChars}
            placeholder="作品名を選択 or 入力"
            characterPlaceholder="キャラ指定（複数可・「・」区切り）"
          />
          <WorkSelector
            label="作品B（迷い込むキャラ）"
            value={charWork}
            onChange={setCharWork}
            characterValues={charChars}
            onCharacterChange={setCharChars}
            placeholder="作品名を選択 or 入力"
            characterPlaceholder="キャラ指定（複数可・「・」区切り）"
          />
        </div>

        {/* Detail */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            具体的な要望・イメージ（任意）
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder='例: たぬきち商店でローンを組まされる。「天下の大将軍ですよ」「ンォフゥッ」'
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          4コマプロンプトを生成
        </button>

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </section>

      {/* Result */}
      {prompt && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">生成結果</h2>
            <button
              onClick={saveToHistory}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                copiedField === "saved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300"
              }`}
            >
              {copiedField === "saved" ? "保存しました!" : "履歴に保存"}
            </button>
          </div>

          {/* Main Copy Area - prompt_full equivalent */}
          <div className="bg-gray-900 rounded-xl border-2 border-blue-600 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-blue-400">
                AIに渡すプロンプト（全文）
              </h3>
              <button
                onClick={() => copyText(prompt, "full")}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                  copiedField === "full"
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {copiedField === "full" ? "Copied!" : "Geminiにコピー"}
              </button>
            </div>
            <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed bg-gray-800 rounded-lg p-4 max-h-80 overflow-y-auto">
              {prompt}
            </pre>
          </div>

          {/* Usage Guide */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-300 mb-2">使い方</h3>
            <ol className="text-sm text-blue-200/80 space-y-1 list-decimal list-inside">
              <li>上のプロンプトを「Geminiにコピー」ボタンでコピー</li>
              <li>ChatGPT / Gemini / Claude に貼り付けて送信</li>
              <li>AIがJSON形式で4コマ漫画の詳細設定を返します</li>
              <li>返ってきた <code className="bg-gray-800 px-1 rounded">prompt_full</code> をGeminiの画像生成に貼り付けて4コマ漫画画像を生成</li>
            </ol>
          </div>
        </section>
      )}
    </div>
  );
}

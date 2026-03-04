"use client";

import { useState, useMemo } from "react";
import { GENRES, WORKS, filterByGenre } from "@/lib/works";

const DIRECTION_PRESETS = [
  { id: "satsubatsu-muku", label: "殺伐×無垢", example: "呪術廻戦 × ちいかわ" },
  { id: "surreal-gag", label: "シュールギャグ", example: "どうぶつの森 × キングダム" },
  { id: "ability-mismatch", label: "能力ミスマッチ", example: "ワンピース × サザエさん" },
  { id: "nichijou-shinshoku", label: "日常侵食", example: "エヴァ × しんちゃん" },
  { id: "dark-fantasy", label: "ダークファンタジー", example: "ベルセルク × ポケモン" },
  { id: "honobono-konton", label: "ほのぼの混沌", example: "すみっコ × 進撃の巨人" },
  { id: "emotional", label: "エモーショナル", example: "CLANNAD × 鬼滅の刃" },
  { id: "battle-royale", label: "バトルロイヤル", example: "ドラゴンボール × ナルト" },
];

function WorkSelector({
  label,
  value,
  onChange,
  characterValue,
  onCharacterChange,
  placeholder,
  characterPlaceholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  characterValue: string;
  onCharacterChange: (v: string) => void;
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

      {/* Genre filter */}
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

      {/* Work dropdown */}
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
                    onClick={() => {
                      onChange(w.name);
                      onCharacterChange("");
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center justify-between ${
                      value === w.name ? "bg-blue-900/40 text-blue-300" : "text-gray-200"
                    }`}
                  >
                    <span>{w.name}</span>
                    <span className="text-xs text-gray-500">{w.genre}</span>
                  </button>
                ))}
              {filtered.filter((w) => !value || w.name.toLowerCase().includes(value.toLowerCase())).length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  該当なし（自由入力OK）
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Character selector */}
      {selectedWork && selectedWork.characters.length > 0 && (
        <div>
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedWork.characters.map((c) => (
              <button
                key={c}
                onClick={() => onCharacterChange(characterValue === c ? "" : c)}
                className={`px-2 py-1 rounded text-xs transition-colors border ${
                  characterValue === c
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}
      <input
        type="text"
        value={characterValue}
        onChange={(e) => onCharacterChange(e.target.value)}
        placeholder={characterPlaceholder}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default function GeneratorPage() {
  const [direction, setDirection] = useState("");
  const [worldWork, setWorldWork] = useState("");
  const [worldChar, setWorldChar] = useState("");
  const [charWork, setCharWork] = useState("");
  const [charChar, setCharChar] = useState("");
  const [detail, setDetail] = useState("");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Build the world/character strings for the API
  const world = worldChar ? `${worldWork}（${worldChar}）` : worldWork;
  const character = charChar ? `${charWork}の${charChar}` : charWork;

  const canGenerate = direction.trim() && worldWork.trim() && charWork.trim();

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setError(null);
    setPrompt(null);

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
          <h2 className="text-xl font-bold">プロンプト生成</h2>
          <p className="text-sm text-gray-500 mt-1">
            入力内容からAIに渡すプロンプトを生成します。コピーしてお好きなAI（ChatGPT / Gemini / Claude等）に貼り付けてください。
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

        {/* World & Character - side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkSelector
            label="作品A（世界観・舞台）"
            value={worldWork}
            onChange={setWorldWork}
            characterValue={worldChar}
            onCharacterChange={setWorldChar}
            placeholder="作品名を選択 or 入力"
            characterPlaceholder="キャラ指定（任意・自由入力OK）"
          />
          <WorkSelector
            label="作品B（迷い込むキャラ）"
            value={charWork}
            onChange={setCharWork}
            characterValue={charChar}
            onCharacterChange={setCharChar}
            placeholder="作品名を選択 or 入力"
            characterPlaceholder="キャラ指定（任意・自由入力OK）"
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
            placeholder="例: たぬきち商店でローンを組まされる王騎将軍。「天下の大将軍ですよ」"
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
          プロンプトを生成
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
            <h2 className="text-xl font-bold">生成されたプロンプト</h2>
            <div className="flex gap-2">
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
          </div>

          {/* Full Prompt */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">
                AIに渡すプロンプト（全文）
              </h3>
              <button
                onClick={() => copyText(prompt, "full")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  copiedField === "full"
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {copiedField === "full" ? "Copied!" : "コピーする"}
              </button>
            </div>
            <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              {prompt}
            </pre>
          </div>

          {/* Usage Guide */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-300 mb-2">使い方</h3>
            <ol className="text-sm text-blue-200/80 space-y-1 list-decimal list-inside">
              <li>上のプロンプトを「コピーする」ボタンでコピー</li>
              <li>お好きなAI（ChatGPT / Gemini / Claude）に貼り付けて送信</li>
              <li>AIが画像生成用のプロンプト（EN/JA）やシーン設定をJSON形式で返します</li>
              <li>返ってきた英語プロンプトを画像生成AI（Gemini等）に入力して画像を生成</li>
            </ol>
          </div>
        </section>
      )}
    </div>
  );
}

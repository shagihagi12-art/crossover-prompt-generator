"use client";

import { useState, useMemo, useEffect } from "react";
import { GENRES, WORKS, filterByGenre } from "@/lib/works";

const DIRECTION_PRESETS = [
  { id: "satsubatsu-muku", label: "殺伐×無垢", combos: [
    { workA: "呪術廻戦", workB: "ちいかわ" },
    { workA: "進撃の巨人", workB: "すみっコぐらし" },
    { workA: "東京喰種", workB: "どうぶつの森" },
    { workA: "チェンソーマン", workB: "よつばと!" },
  ]},
  { id: "surreal-gag", label: "シュールギャグ", combos: [
    { workA: "どうぶつの森", workB: "キングダム" },
    { workA: "サザエさん", workB: "ジョジョの奇妙な冒険" },
    { workA: "ちびまる子ちゃん", workB: "ベルセルク" },
    { workA: "日常", workB: "BLEACH" },
  ]},
  { id: "ability-mismatch", label: "能力ミスマッチ", combos: [
    { workA: "名探偵コナン", workB: "鬼滅の刃" },
    { workA: "ドラえもん", workB: "呪術廻戦" },
    { workA: "クレヨンしんちゃん", workB: "NARUTO" },
    { workA: "サザエさん", workB: "HUNTER×HUNTER" },
  ]},
  { id: "nichijou-shinshoku", label: "日常侵食", combos: [
    { workA: "新世紀エヴァンゲリオン", workB: "クレヨンしんちゃん" },
    { workA: "進撃の巨人", workB: "ドラえもん" },
    { workA: "デスノート", workB: "サザエさん" },
    { workA: "東京喰種", workB: "ちびまる子ちゃん" },
  ]},
  { id: "dark-fantasy", label: "ダークファンタジー", combos: [
    { workA: "ベルセルク", workB: "ポケモン" },
    { workA: "メイドインアビス", workB: "星のカービィ" },
    { workA: "GANTZ", workB: "マリオシリーズ" },
    { workA: "約束のネバーランド", workB: "どうぶつの森" },
  ]},
  { id: "honobono-konton", label: "ほのぼの混沌", combos: [
    { workA: "すみっコぐらし", workB: "進撃の巨人" },
    { workA: "ちいかわ", workB: "鬼滅の刃" },
    { workA: "となりのトトロ", workB: "呪術廻戦" },
    { workA: "よつばと!", workB: "チェンソーマン" },
  ]},
  { id: "emotional", label: "エモーショナル", combos: [
    { workA: "CLANNAD", workB: "鬼滅の刃" },
    { workA: "あの花", workB: "葬送のフリーレン" },
    { workA: "四月は君の嘘", workB: "ヴァイオレット・エヴァーガーデン" },
    { workA: "君の名は。", workB: "Re:ゼロ" },
  ]},
  { id: "battle-royale", label: "バトルロイヤル", combos: [
    { workA: "ドラゴンボール", workB: "NARUTO" },
    { workA: "ワンピース", workB: "BLEACH" },
    { workA: "呪術廻戦", workB: "鬼滅の刃" },
    { workA: "僕のヒーローアカデミア", workB: "HUNTER×HUNTER" },
  ]},
  { id: "saikyou-taiketsu", label: "最強対決", combos: [
    { workA: "ワンパンマン", workB: "ドラゴンボール" },
    { workA: "北斗の拳", workB: "バキ" },
    { workA: "ジョジョの奇妙な冒険", workB: "HUNTER×HUNTER" },
    { workA: "鋼の錬金術師", workB: "Fate/stay night" },
  ]},
  { id: "iyashi-horror", label: "癒し×ホラー", combos: [
    { workA: "よつばと!", workB: "東京喰種" },
    { workA: "ちいかわ", workB: "ひぐらしのなく頃に" },
    { workA: "すみっコぐらし", workB: "約束のネバーランド" },
    { workA: "となりのトトロ", workB: "寄生獣" },
  ]},
  { id: "chiraku-battle", label: "知略バトル", combos: [
    { workA: "デスノート", workB: "カイジ" },
    { workA: "名探偵コナン", workB: "LIAR GAME" },
    { workA: "コードギアス", workB: "HUNTER×HUNTER" },
    { workA: "STEINS;GATE", workB: "デスノート" },
  ]},
  { id: "sedai-gap", label: "世代ギャップ", combos: [
    { workA: "鬼滅の刃", workB: "北斗の拳" },
    { workA: "呪術廻戦", workB: "聖闘士星矢" },
    { workA: "チェンソーマン", workB: "シティーハンター" },
    { workA: "ブルーロック", workB: "キャプテン翼" },
  ]},
  { id: "shokuba-taiken", label: "職場体験", combos: [
    { workA: "SPY×FAMILY", workB: "こちら葛飾区亀有公園前派出所" },
    { workA: "銀魂", workB: "暗殺教室" },
    { workA: "ドラえもん", workB: "薬屋のひとりごと" },
    { workA: "サザエさん", workB: "ゴールデンカムイ" },
  ]},
  { id: "tsukkomi-fuzai", label: "ツッコミ不在", combos: [
    { workA: "ボボボーボ・ボーボボ", workB: "ポプテピピック" },
    { workA: "銀魂", workB: "おそ松さん" },
    { workA: "日常", workB: "斉木楠雄のΨ難" },
    { workA: "磯部磯兵衛物語", workB: "ボボボーボ・ボーボボ" },
  ]},
  { id: "gourmet-chaos", label: "グルメカオス", combos: [
    { workA: "トリコ", workB: "ダンジョン飯" },
    { workA: "ワンピース", workB: "銀魂" },
    { workA: "ドラゴンボール", workB: "ちいかわ" },
    { workA: "鬼滅の刃", workB: "よつばと!" },
  ]},
  { id: "isekai-tensei", label: "異世界転生", combos: [
    { workA: "Re:ゼロ", workB: "サザエさん" },
    { workA: "このすば", workB: "ちびまる子ちゃん" },
    { workA: "転生したらスライムだった件", workB: "ドラえもん" },
    { workA: "無職転生", workB: "クレヨンしんちゃん" },
  ]},
];

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

export default function GeneratorPage() {
  const [direction, setDirection] = useState("");
  const [worldWork, setWorldWork] = useState("");
  const [worldChars, setWorldChars] = useState<string[]>([]);
  const [charWork, setCharWork] = useState("");
  const [charChars, setCharChars] = useState<string[]>([]);
  const [detail, setDetail] = useState("");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // JSON parser state
  const [jsonInput, setJsonInput] = useState("");
  const [extractedPromptFull, setExtractedPromptFull] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [showJsonParser, setShowJsonParser] = useState(false);

  // Combo ranking state
  const [comboStats, setComboStats] = useState<Record<string, number>>({});

  // Load combo stats + URL params on mount
  useEffect(() => {
    const stored = localStorage.getItem("crossover-combo-stats");
    if (stored) {
      try { setComboStats(JSON.parse(stored)); } catch { /* ignore */ }
    }

    // Load from share URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get("d")) setDirection(params.get("d")!);
    if (params.get("wa")) setWorldWork(params.get("wa")!);
    if (params.get("wb")) setCharWork(params.get("wb")!);
    if (params.get("ca")) setWorldChars(params.get("ca")!.split("・").filter(Boolean));
    if (params.get("cb")) setCharChars(params.get("cb")!.split("・").filter(Boolean));
    if (params.get("dt")) setDetail(params.get("dt")!);
  }, []);

  const world = worldChars.length > 0 ? `${worldWork}（${worldChars.join("・")}）` : worldWork;
  const character = charChars.length > 0 ? `${charWork}の${charChars.join("・")}` : charWork;
  const canGenerate = direction.trim() && worldWork.trim() && charWork.trim();

  // Top combos for ranking
  const topCombos = useMemo(() => {
    return Object.entries(comboStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [comboStats]);

  // --- Feature 1: Swap A <-> B ---
  const handleSwap = () => {
    const tmpWork = worldWork;
    const tmpChars = [...worldChars];
    setWorldWork(charWork);
    setWorldChars([...charChars]);
    setCharWork(tmpWork);
    setCharChars(tmpChars);
  };

  // --- Feature 2: Full Random ---
  const handleRandom = () => {
    const randomPreset = DIRECTION_PRESETS[Math.floor(Math.random() * DIRECTION_PRESETS.length)];
    setDirection(randomPreset.label);
    const workA = WORKS[Math.floor(Math.random() * WORKS.length)];
    let workB = WORKS[Math.floor(Math.random() * WORKS.length)];
    while (workB.name === workA.name) {
      workB = WORKS[Math.floor(Math.random() * WORKS.length)];
    }
    setWorldWork(workA.name);
    setWorldChars([]);
    setCharWork(workB.name);
    setCharChars([]);
  };

  // --- Feature 5: Track combo stats ---
  const trackCombo = () => {
    const key = `${worldWork} × ${charWork}`;
    const stats = { ...comboStats };
    stats[key] = (stats[key] || 0) + 1;
    setComboStats(stats);
    localStorage.setItem("crossover-combo-stats", JSON.stringify(stats));
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setError(null);
    setPrompt(null);

    trackCombo();

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

  // Save to history
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

  // --- Feature 4: Save to favorites ---
  const saveToFavorites = () => {
    if (!prompt) return;
    const favorites = JSON.parse(localStorage.getItem("crossover-favorites") || "[]");
    favorites.unshift({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      input: { direction, world, character, detail },
      prompt,
    });
    if (favorites.length > 50) favorites.length = 50;
    localStorage.setItem("crossover-favorites", JSON.stringify(favorites));
    setCopiedField("favorited");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // --- Feature 6: Share URL ---
  const generateShareUrl = () => {
    const params = new URLSearchParams();
    if (direction) params.set("d", direction);
    if (worldWork) params.set("wa", worldWork);
    if (charWork) params.set("wb", charWork);
    if (worldChars.length > 0) params.set("ca", worldChars.join("・"));
    if (charChars.length > 0) params.set("cb", charChars.join("・"));
    if (detail) params.set("dt", detail);
    const url = `${window.location.origin}?${params.toString()}`;
    copyText(url, "share");
  };

  // --- Feature 3: JSON parser ---
  const handleParseJson = () => {
    setJsonError(null);
    setExtractedPromptFull(null);
    try {
      let jsonStr = jsonInput.trim();
      // Remove markdown code blocks if present
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      const parsed = JSON.parse(jsonStr);
      if (parsed.prompt_full) {
        setExtractedPromptFull(parsed.prompt_full);
      } else {
        setJsonError("prompt_full フィールドが見つかりません");
      }
    } catch {
      setJsonError("JSONの解析に失敗しました。AIの返答をそのまま貼り付けてください。");
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">4コマ漫画プロンプト生成</h2>
            <p className="text-sm text-gray-500 mt-1">
              クロスオーバー4コマ漫画の画像生成プロンプトを作成します。AIに貼り付けてそのまま画像生成できます。
            </p>
          </div>
          {/* Feature 2: Random Button */}
          <button
            onClick={handleRandom}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors shrink-0"
            title="方向性・作品A・作品Bをランダムで選ぶ"
          >
            {"🎲 ガチャ"}
          </button>
        </div>

        {/* Direction Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            方向性（テーマ・トーン）
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {DIRECTION_PRESETS.map((p) => {
              const example = p.combos[0];
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setDirection(p.label);
                    const combo = p.combos[Math.floor(Math.random() * p.combos.length)];
                    setWorldWork(combo.workA);
                    setWorldChars([]);
                    setCharWork(combo.workB);
                    setCharChars([]);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    direction === p.label
                      ? "bg-blue-600 border-blue-500 text-white"
                      : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500"
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-xs opacity-60 mt-0.5">{example.workA} × {example.workB}</div>
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            placeholder="プリセットを選ぶか、自由入力"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* World & Character with Swap Button */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          <WorkSelector
            label="作品A（世界観・舞台）"
            value={worldWork}
            onChange={setWorldWork}
            characterValues={worldChars}
            onCharacterChange={setWorldChars}
            placeholder="作品名を選択 or 入力"
            characterPlaceholder="キャラ指定（複数可・「・」区切り）"
          />

          {/* Feature 1: Swap Button */}
          <div className="flex items-center justify-center lg:pt-8">
            <button
              onClick={handleSwap}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors border border-gray-700 hover:border-gray-500"
              title="A↔B 入れ替え"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

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

        {/* Feature 5: Popular Combos Ranking */}
        {topCombos.length > 0 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 mb-2">{"🔥 よく使うコンボ"}</h3>
            <div className="flex flex-wrap gap-1.5">
              {topCombos.map(([combo, count], i) => (
                <button
                  key={combo}
                  onClick={() => {
                    const [a, b] = combo.split(" × ");
                    if (a && b) {
                      setWorldWork(a.trim());
                      setWorldChars([]);
                      setCharWork(b.trim());
                      setCharChars([]);
                    }
                  }}
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs text-gray-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-yellow-500">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}</span>
                  <span>{combo}</span>
                  <span className="text-gray-600">({count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Detail */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            具体的な要望・イメージ（任意）
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder={'例: たぬきち商店でローンを組まされる。「天下の大将軍ですよ」「ンォフゥッ」'}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>

        {/* Generate + Share Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            4コマプロンプトを生成
          </button>
          {/* Feature 6: Share URL */}
          {canGenerate && (
            <button
              onClick={generateShareUrl}
              className={`px-4 py-3 rounded-lg font-medium transition-colors shrink-0 ${
                copiedField === "share"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
              }`}
              title="この組み合わせをURLで共有"
            >
              {copiedField === "share" ? "✅ URLコピー!" : "🔗 共有"}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </section>

      {/* Result */}
      {prompt && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-xl font-bold">生成結果</h2>
            <div className="flex gap-2">
              {/* Feature 4: Favorite Button */}
              <button
                onClick={saveToFavorites}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  copiedField === "favorited"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700"
                }`}
              >
                {copiedField === "favorited" ? "⭐ 保存しました!" : "☆ お気に入り"}
              </button>
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

          {/* Main Copy Area */}
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
              <li>返ってきたJSONを下の「prompt_full抽出」に貼り付け → Gemini画像生成へ</li>
            </ol>
          </div>

          {/* Feature 3: JSON Parser */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <button
              onClick={() => setShowJsonParser(!showJsonParser)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
            >
              <h3 className="text-sm font-bold text-purple-400">
                {"🔧 prompt_full 抽出ツール（AIの返答を貼り付け）"}
              </h3>
              <span className="text-gray-500">{showJsonParser ? "▲" : "▼"}</span>
            </button>

            {showJsonParser && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
                <p className="text-xs text-gray-500">
                  AIが返したJSONをそのまま貼り付けると、prompt_full だけを抽出します。
                </p>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={'AIの返答をここに貼り付け…\n\n例: {"main_title": "...", "prompt_full": "...", ...}'}
                  rows={5}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y font-mono"
                />
                <button
                  onClick={handleParseJson}
                  disabled={!jsonInput.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                >
                  prompt_full を抽出
                </button>

                {jsonError && (
                  <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
                    {jsonError}
                  </div>
                )}

                {extractedPromptFull && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-400">✅ prompt_full 抽出成功!</span>
                      <button
                        onClick={() => copyText(extractedPromptFull, "prompt_full")}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                          copiedField === "prompt_full"
                            ? "bg-green-600 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                      >
                        {copiedField === "prompt_full" ? "Copied!" : "Gemini画像生成にコピー"}
                      </button>
                    </div>
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-gray-800 rounded-lg p-3 max-h-60 overflow-y-auto leading-relaxed">
                      {extractedPromptFull}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

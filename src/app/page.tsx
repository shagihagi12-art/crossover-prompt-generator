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
    if (params.get("ca")) setWorldChars(params.get("ca")!.split("\u30FB").filter(Boolean));
    if (params.get("cb")) setCharChars(params.get("cb")!.split("\u30FB").filter(Boolean));
    if (params.get("dt")) setDetail(params.get("dt")!);
  }, []);

  const world = worldChars.length > 0 ? `${worldWork}\uFF08${worldChars.join("\u30FB")}\uFF09` : worldWork;
  const character = charChars.length > 0 ? `${charWork}\u306E${charChars.join("\u30FB")}` : charWork;
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
    const key = `${worldWork} \u00D7 ${charWork}`;
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
      setError("\u901A\u4FE1\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F");
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
    if (worldChars.length > 0) params.set("ca", worldChars.join("\u30FB"));
    if (charChars.length > 0) params.set("cb", charChars.join("\u30FB"));
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
        setJsonError("prompt_full \u30D5\u30A3\u30FC\u30EB\u30C9\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093");
      }
    } catch {
      setJsonError("JSON\u306E\u89E3\u6790\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002AI\u306E\u8FD4\u7B54\u3092\u305D\u306E\u307E\u307E\u8CBC\u308A\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044\u3002");
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">4\u30B3\u30DE\u6F2B\u753B\u30D7\u30ED\u30F3\u30D7\u30C8\u751F\u6210</h2>
            <p className="text-sm text-gray-500 mt-1">
              \u30AF\u30ED\u30B9\u30AA\u30FC\u30D0\u30FC4\u30B3\u30DE\u6F2B\u753B\u306E\u753B\u50CF\u751F\u6210\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u4F5C\u6210\u3057\u307E\u3059\u3002AI\u306B\u8CBC\u308A\u4ED8\u3051\u3066\u305D\u306E\u307E\u307E\u753B\u50CF\u751F\u6210\u3067\u304D\u307E\u3059\u3002
            </p>
          </div>
          {/* Feature 2: Random Button */}
          <button
            onClick={handleRandom}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors shrink-0"
            title="\u65B9\u5411\u6027\u30FB\u4F5C\u54C1A\u30FB\u4F5C\u54C1B\u3092\u30E9\u30F3\u30C0\u30E0\u3067\u9078\u3076"
          >
            \uD83C\uDFB2 \u30AC\u30C1\u30E3
          </button>
        </div>

        {/* Direction Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            \u65B9\u5411\u6027\uFF08\u30C6\u30FC\u30DE\u30FB\u30C8\u30FC\u30F3\uFF09
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
                  <div className="text-xs opacity-60 mt-0.5">{example.workA} \u00D7 {example.workB}</div>
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            placeholder="\u30D7\u30EA\u30BB\u30C3\u30C8\u3092\u9078\u3076\u304B\u3001\u81EA\u7531\u5165\u529B"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* World & Character with Swap Button */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          <WorkSelector
            label="\u4F5C\u54C1A\uFF08\u4E16\u754C\u89B3\u30FB\u821E\u53F0\uFF09"
            value={worldWork}
            onChange={setWorldWork}
            characterValues={worldChars}
            onCharacterChange={setWorldChars}
            placeholder="\u4F5C\u54C1\u540D\u3092\u9078\u629E or \u5165\u529B"
            characterPlaceholder="\u30AD\u30E3\u30E9\u6307\u5B9A\uFF08\u8907\u6570\u53EF\u30FB\u300C\u30FB\u300D\u533A\u5207\u308A\uFF09"
          />

          {/* Feature 1: Swap Button */}
          <div className="flex items-center justify-center lg:pt-8">
            <button
              onClick={handleSwap}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors border border-gray-700 hover:border-gray-500"
              title="A\u2194B \u5165\u308C\u66FF\u3048"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          <WorkSelector
            label="\u4F5C\u54C1B\uFF08\u8FF7\u3044\u8FBC\u3080\u30AD\u30E3\u30E9\uFF09"
            value={charWork}
            onChange={setCharWork}
            characterValues={charChars}
            onCharacterChange={setCharChars}
            placeholder="\u4F5C\u54C1\u540D\u3092\u9078\u629E or \u5165\u529B"
            characterPlaceholder="\u30AD\u30E3\u30E9\u6307\u5B9A\uFF08\u8907\u6570\u53EF\u30FB\u300C\u30FB\u300D\u533A\u5207\u308A\uFF09"
          />
        </div>

        {/* Feature 5: Popular Combos Ranking */}
        {topCombos.length > 0 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
            <h3 className="text-xs font-medium text-gray-500 mb-2">\uD83D\uDD25 \u3088\u304F\u4F7F\u3046\u30B3\u30F3\u30DC</h3>
            <div className="flex flex-wrap gap-1.5">
              {topCombos.map(([combo, count], i) => (
                <button
                  key={combo}
                  onClick={() => {
                    const [a, b] = combo.split(" \u00D7 ");
                    if (a && b) {
                      setWorldWork(a.trim());
                      setWorldChars([]);
                      setCharWork(b.trim());
                      setCharChars([]);
                    }
                  }}
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-xs text-gray-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-yellow-500">{i === 0 ? "\uD83E\uDD47" : i === 1 ? "\uD83E\uDD48" : i === 2 ? "\uD83E\uDD49" : `${i + 1}.`}</span>
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
            \u5177\u4F53\u7684\u306A\u8981\u671B\u30FB\u30A4\u30E1\u30FC\u30B8\uFF08\u4EFB\u610F\uFF09
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder='\u4F8B: \u305F\u306C\u304D\u3061\u5546\u5E97\u3067\u30ED\u30FC\u30F3\u3092\u7D44\u307E\u3055\u308C\u308B\u3002\u300C\u5929\u4E0B\u306E\u5927\u5C06\u8ECD\u3067\u3059\u3088\u300D\u300C\u30F3\u30A9\u30D5\u30A5\u30C3\u300D'
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
            4\u30B3\u30DE\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u751F\u6210
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
              title="\u3053\u306E\u7D44\u307F\u5408\u308F\u305B\u3092URL\u3067\u5171\u6709"
            >
              {copiedField === "share" ? "\u2705 URL\u30B3\u30D4\u30FC!" : "\uD83D\uDD17 \u5171\u6709"}
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
            <h2 className="text-xl font-bold">\u751F\u6210\u7D50\u679C</h2>
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
                {copiedField === "favorited" ? "\u2B50 \u4FDD\u5B58\u3057\u307E\u3057\u305F!" : "\u2606 \u304A\u6C17\u306B\u5165\u308A"}
              </button>
              <button
                onClick={saveToHistory}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  copiedField === "saved"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                }`}
              >
                {copiedField === "saved" ? "\u4FDD\u5B58\u3057\u307E\u3057\u305F!" : "\u5C65\u6B74\u306B\u4FDD\u5B58"}
              </button>
            </div>
          </div>

          {/* Main Copy Area */}
          <div className="bg-gray-900 rounded-xl border-2 border-blue-600 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-blue-400">
                AI\u306B\u6E21\u3059\u30D7\u30ED\u30F3\u30D7\u30C8\uFF08\u5168\u6587\uFF09
              </h3>
              <button
                onClick={() => copyText(prompt, "full")}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                  copiedField === "full"
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {copiedField === "full" ? "Copied!" : "Gemini\u306B\u30B3\u30D4\u30FC"}
              </button>
            </div>
            <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed bg-gray-800 rounded-lg p-4 max-h-80 overflow-y-auto">
              {prompt}
            </pre>
          </div>

          {/* Usage Guide */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-300 mb-2">\u4F7F\u3044\u65B9</h3>
            <ol className="text-sm text-blue-200/80 space-y-1 list-decimal list-inside">
              <li>\u4E0A\u306E\u30D7\u30ED\u30F3\u30D7\u30C8\u3092\u300CGemini\u306B\u30B3\u30D4\u30FC\u300D\u30DC\u30BF\u30F3\u3067\u30B3\u30D4\u30FC</li>
              <li>ChatGPT / Gemini / Claude \u306B\u8CBC\u308A\u4ED8\u3051\u3066\u9001\u4FE1</li>
              <li>AI\u304CJSON\u5F62\u5F0F\u30674\u30B3\u30DE\u6F2B\u753B\u306E\u8A73\u7D30\u8A2D\u5B9A\u3092\u8FD4\u3057\u307E\u3059</li>
              <li>\u8FD4\u3063\u3066\u304D\u305FJSON\u3092\u4E0B\u306E\u300Cprompt_full\u62BD\u51FA\u300D\u306B\u8CBC\u308A\u4ED8\u3051\u2192Gemini\u753B\u50CF\u751F\u6210\u3078</li>
            </ol>
          </div>

          {/* Feature 3: JSON Parser */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <button
              onClick={() => setShowJsonParser(!showJsonParser)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
            >
              <h3 className="text-sm font-bold text-purple-400">
                \uD83D\uDD27 prompt_full \u62BD\u51FA\u30C4\u30FC\u30EB\uFF08AI\u306E\u8FD4\u7B54\u3092\u8CBC\u308A\u4ED8\u3051\uFF09
              </h3>
              <span className="text-gray-500">{showJsonParser ? "\u25B2" : "\u25BC"}</span>
            </button>

            {showJsonParser && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
                <p className="text-xs text-gray-500">
                  AI\u304C\u8FD4\u3057\u305FJSON\u3092\u305D\u306E\u307E\u307E\u8CBC\u308A\u4ED8\u3051\u308B\u3068\u3001prompt_full \u3060\u3051\u3092\u62BD\u51FA\u3057\u307E\u3059\u3002
                </p>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='AI\u306E\u8FD4\u7B54\u3092\u3053\u3053\u306B\u8CBC\u308A\u4ED8\u3051\u2026\u000A\u000A\u4F8B: {"main_title": "...", "prompt_full": "...", ...}'
                  rows={5}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y font-mono"
                />
                <button
                  onClick={handleParseJson}
                  disabled={!jsonInput.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                >
                  prompt_full \u3092\u62BD\u51FA
                </button>

                {jsonError && (
                  <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
                    {jsonError}
                  </div>
                )}

                {extractedPromptFull && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-400">\u2705 prompt_full \u62BD\u51FA\u6210\u529F!</span>
                      <button
                        onClick={() => copyText(extractedPromptFull, "prompt_full")}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                          copiedField === "prompt_full"
                            ? "bg-green-600 text-white"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                      >
                        {copiedField === "prompt_full" ? "Copied!" : "Gemini\u753B\u50CF\u751F\u6210\u306B\u30B3\u30D4\u30FC"}
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

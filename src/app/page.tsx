"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { GENRES, WORKS, filterByGenre, hasCharacterDb } from "@/lib/works";
import { CHARACTER_ROLES } from "@/lib/roles";
import { buildMultiFullPrompt } from "@/lib/prompts-multi";
import { buildSoloFullPrompt } from "@/lib/prompts-solo";
import { buildTemplateOnlyPrompt } from "@/lib/generator";
import { getCharacterProfile } from "@/data/characters";
import { getRecommendations, getRecommendedDirections } from "@/lib/recommendations";
import { STORY_TEMPLATES, STORY_CATEGORIES, filterTemplates } from "@/lib/story-templates";
import DialoguePanel from "@/components/DialoguePanel";
import type { CharacterRole, MultiWork } from "@/lib/types";

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
  { id: "renai-panic", label: "恋愛パニック", combos: [
    { workA: "かぐや様は告らせたい", workB: "ドラゴンボール" },
    { workA: "CLANNAD", workB: "進撃の巨人" },
    { workA: "四月は君の嘘", workB: "NARUTO" },
    { workA: "君の名は。", workB: "ワンピース" },
  ]},
  { id: "sports-tamashii", label: "スポーツ魂", combos: [
    { workA: "スラムダンク", workB: "ブルーロック" },
    { workA: "ハイキュー!!", workB: "キャプテン翼" },
    { workA: "テニスの王子様", workB: "弱虫ペダル" },
    { workA: "ブルーロック", workB: "スラムダンク" },
  ]},
  { id: "gakuen-dotabata", label: "学園ドタバタ", combos: [
    { workA: "暗殺教室", workB: "斉木楠雄のΨ難" },
    { workA: "僕のヒーローアカデミア", workB: "おそ松さん" },
    { workA: "かぐや様は告らせたい", workB: "銀魂" },
    { workA: "NARUTO", workB: "日常" },
  ]},
  { id: "shitei-cross", label: "師弟クロス", combos: [
    { workA: "NARUTO", workB: "鬼滅の刃" },
    { workA: "ドラゴンボール", workB: "僕のヒーローアカデミア" },
    { workA: "HUNTER×HUNTER", workB: "呪術廻戦" },
    { workA: "るろうに剣心", workB: "葬送のフリーレン" },
  ]},
  { id: "rival-gekitotsu", label: "ライバル激突", combos: [
    { workA: "NARUTO", workB: "BLEACH" },
    { workA: "ブルーロック", workB: "ハイキュー!!" },
    { workA: "デスノート", workB: "コードギアス" },
    { workA: "ドラゴンボール", workB: "ワンパンマン" },
  ]},
  { id: "oyako-taiketsu", label: "親子対決", combos: [
    { workA: "ドラゴンボール", workB: "SPY×FAMILY" },
    { workA: "NARUTO", workB: "クレヨンしんちゃん" },
    { workA: "鬼滅の刃", workB: "サザエさん" },
    { workA: "進撃の巨人", workB: "ドラえもん" },
  ]},
  { id: "kagaku-vs-mahou", label: "科学vs魔法", combos: [
    { workA: "STEINS;GATE", workB: "葬送のフリーレン" },
    { workA: "攻殻機動隊", workB: "鬼滅の刃" },
    { workA: "PSYCHO-PASS", workB: "Fate/stay night" },
    { workA: "新世紀エヴァンゲリオン", workB: "鋼の錬金術師" },
  ]},
  { id: "time-slip", label: "タイムスリップ", combos: [
    { workA: "STEINS;GATE", workB: "るろうに剣心" },
    { workA: "Re:ゼロ", workB: "キングダム" },
    { workA: "ドラえもん", workB: "鬼滅の刃" },
    { workA: "君の名は。", workB: "ゴールデンカムイ" },
  ]},
  { id: "bunka-shoutotsu", label: "文化衝突", combos: [
    { workA: "ゴールデンカムイ", workB: "SPY×FAMILY" },
    { workA: "ワンピース", workB: "サザエさん" },
    { workA: "キングダム", workB: "日常" },
    { workA: "葬送のフリーレン", workB: "クレヨンしんちゃん" },
  ]},
  { id: "oudou-vs-jadou", label: "王道vs邪道", combos: [
    { workA: "ドラゴンボール", workB: "チェンソーマン" },
    { workA: "ワンピース", workB: "デスノート" },
    { workA: "僕のヒーローアカデミア", workB: "東京喰種" },
    { workA: "NARUTO", workB: "GANTZ" },
  ]},
  { id: "tensai-vs-tennen", label: "天才vs天然", combos: [
    { workA: "デスノート", workB: "ボボボーボ・ボーボボ" },
    { workA: "名探偵コナン", workB: "クレヨンしんちゃん" },
    { workA: "STEINS;GATE", workB: "日常" },
    { workA: "コードギアス", workB: "おそ松さん" },
  ]},
  { id: "seigi-no-bousou", label: "正義の暴走", combos: [
    { workA: "デスノート", workB: "僕のヒーローアカデミア" },
    { workA: "PSYCHO-PASS", workB: "ワンピース" },
    { workA: "コードギアス", workB: "鬼滅の刃" },
    { workA: "進撃の巨人", workB: "NARUTO" },
  ]},
  { id: "yamiochi-comedy", label: "闇堕ちコメディ", combos: [
    { workA: "東京喰種", workB: "銀魂" },
    { workA: "デスノート", workB: "おそ松さん" },
    { workA: "ベルセルク", workB: "斉木楠雄のΨ難" },
    { workA: "チェンソーマン", workB: "ポプテピピック" },
  ]},
  { id: "survival", label: "サバイバル", combos: [
    { workA: "進撃の巨人", workB: "ダンジョン飯" },
    { workA: "約束のネバーランド", workB: "ゴールデンカムイ" },
    { workA: "GANTZ", workB: "メイドインアビス" },
    { workA: "呪術廻戦", workB: "トリコ" },
  ]},
  { id: "suiri-baka", label: "推理×バカ", combos: [
    { workA: "名探偵コナン", workB: "ボボボーボ・ボーボボ" },
    { workA: "デスノート", workB: "クレヨンしんちゃん" },
    { workA: "LIAR GAME", workB: "おそ松さん" },
    { workA: "薬屋のひとりごと", workB: "ポプテピピック" },
  ]},
  { id: "mecha-fantasy", label: "メカ×ファンタジー", combos: [
    { workA: "新世紀エヴァンゲリオン", workB: "葬送のフリーレン" },
    { workA: "ガンダム", workB: "鬼滅の刃" },
    { workA: "コードギアス", workB: "ワンピース" },
    { workA: "攻殻機動隊", workB: "鋼の錬金術師" },
  ]},
  { id: "idol-kyousoukyoku", label: "アイドル狂想曲", combos: [
    { workA: "かぐや様は告らせたい", workB: "ポプテピピック" },
    { workA: "セーラームーン", workB: "銀魂" },
    { workA: "プリキュアシリーズ", workB: "おそ松さん" },
    { workA: "カードキャプターさくら", workB: "斉木楠雄のΨ難" },
  ]},
  { id: "kaizoku-vs-ninja", label: "海賊vs忍者", combos: [
    { workA: "ワンピース", workB: "NARUTO" },
    { workA: "ワンピース", workB: "呪術廻戦" },
    { workA: "NARUTO", workB: "ゴールデンカムイ" },
    { workA: "ワンピース", workB: "鬼滅の刃" },
  ]},
  { id: "koten-gendai", label: "古典×現代", combos: [
    { workA: "るろうに剣心", workB: "チェンソーマン" },
    { workA: "北斗の拳", workB: "呪術廻戦" },
    { workA: "聖闘士星矢", workB: "ブルーロック" },
    { workA: "キングダム", workB: "SPY×FAMILY" },
  ]},
  { id: "yuujou-chaos", label: "友情カオス", combos: [
    { workA: "ワンピース", workB: "銀魂" },
    { workA: "NARUTO", workB: "僕のヒーローアカデミア" },
    { workA: "ドラゴンボール", workB: "HUNTER×HUNTER" },
    { workA: "鬼滅の刃", workB: "ハイキュー!!" },
  ]},
  { id: "maou-nichijou", label: "魔王×日常", combos: [
    { workA: "Re:ゼロ", workB: "サザエさん" },
    { workA: "転生したらスライムだった件", workB: "日常" },
    { workA: "このすば", workB: "よつばと!" },
    { workA: "葬送のフリーレン", workB: "ちびまる子ちゃん" },
  ]},
  { id: "love-comedy-jigoku", label: "ラブコメ地獄", combos: [
    { workA: "かぐや様は告らせたい", workB: "デスノート" },
    { workA: "CLANNAD", workB: "呪術廻戦" },
    { workA: "四月は君の嘘", workB: "チェンソーマン" },
    { workA: "君の名は。", workB: "東京喰種" },
  ]},
  { id: "shoujo-shounen", label: "少女×少年漫画", combos: [
    { workA: "セーラームーン", workB: "ドラゴンボール" },
    { workA: "カードキャプターさくら", workB: "NARUTO" },
    { workA: "プリキュアシリーズ", workB: "ワンピース" },
    { workA: "フルーツバスケット", workB: "鬼滅の刃" },
  ]},
  { id: "pet-soudou", label: "ペット騒動", combos: [
    { workA: "ポケモン", workB: "ちいかわ" },
    { workA: "どうぶつの森", workB: "ジョジョの奇妙な冒険" },
    { workA: "星のカービィ", workB: "チェンソーマン" },
    { workA: "となりのトトロ", workB: "HUNTER×HUNTER" },
  ]},
  { id: "ghibli-battle", label: "ジブリ×バトル", combos: [
    { workA: "となりのトトロ", workB: "ドラゴンボール" },
    { workA: "千と千尋の神隠し", workB: "鬼滅の刃" },
    { workA: "もののけ姫", workB: "進撃の巨人" },
    { workA: "天空の城ラピュタ", workB: "ワンピース" },
  ]},
  { id: "game-vs-anime", label: "ゲーム×アニメ", combos: [
    { workA: "ゼルダの伝説", workB: "葬送のフリーレン" },
    { workA: "ポケモン", workB: "呪術廻戦" },
    { workA: "マリオシリーズ", workB: "NARUTO" },
    { workA: "星のカービィ", workB: "鬼滅の刃" },
  ]},
  { id: "spy-thriller", label: "スパイ劇場", combos: [
    { workA: "SPY×FAMILY", workB: "名探偵コナン" },
    { workA: "SPY×FAMILY", workB: "デスノート" },
    { workA: "PSYCHO-PASS", workB: "SPY×FAMILY" },
    { workA: "コードギアス", workB: "薬屋のひとりごと" },
  ]},
  { id: "power-inflation", label: "インフレ合戦", combos: [
    { workA: "ドラゴンボール", workB: "ワンパンマン" },
    { workA: "北斗の拳", workB: "ジョジョの奇妙な冒険" },
    { workA: "BLEACH", workB: "NARUTO" },
    { workA: "聖闘士星矢", workB: "バキ" },
  ]},
  { id: "zetsubou-kibou", label: "絶望×希望", combos: [
    { workA: "進撃の巨人", workB: "僕のヒーローアカデミア" },
    { workA: "メイドインアビス", workB: "ドラゴンボール" },
    { workA: "約束のネバーランド", workB: "ワンピース" },
    { workA: "ベルセルク", workB: "鬼滅の刃" },
  ]},
  { id: "mystery-gourmet", label: "推理×グルメ", combos: [
    { workA: "名探偵コナン", workB: "ダンジョン飯" },
    { workA: "薬屋のひとりごと", workB: "トリコ" },
    { workA: "LIAR GAME", workB: "ゴールデンカムイ" },
    { workA: "デスノート", workB: "銀魂" },
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
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => filterByGenre(genre), [genre]);
  const selectedWork = WORKS.find((w) => w.name === value);

  // Click-outside detection (blur/focusに一切依存しない)
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const handleSelect = (workName: string) => {
    onChange(workName);
    onCharacterChange([]);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <div ref={containerRef}>
        <div className="flex flex-wrap gap-1 mb-2">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
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
            <div
              className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
            >
              {filtered
                .filter((w) => !value || w.name.toLowerCase().includes(value.toLowerCase()))
                .map((w) => (
                  <button
                    key={w.name}
                    type="button"
                    onClick={() => handleSelect(w.name)}
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
          )}
        </div>
      </div>
      {selectedWork && selectedWork.characters.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selectedWork.characters.map((c) => {
            const hasDb = hasCharacterDb(value) && !!getCharacterProfile(c, value);
            return (
              <button
                key={c}
                type="button"
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
                title={hasDb ? "キャラDB登録済み（口調・外見データあり）" : undefined}
              >
                {hasDb && <span className="text-yellow-400 mr-0.5">★</span>}{c}
              </button>
            );
          })}
          {hasCharacterDb(value) && (
            <span className="text-xs text-yellow-400/70 self-center ml-1">★=口調DB対応</span>
          )}
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

const DEFAULT_ROLES: CharacterRole[] = [
  "protagonist", "tsukkomi", "boke", "rival",
  "makikomare", "troublemaker", "observer",
  "heroine", "villain", "mentor", "mascot",
  "mastermind", "victim", "wildcard", "guide",
];

export default function GeneratorPage() {
  const [mode, setMode] = useState<"solo" | "duo" | "multi" | "reverse">("duo");
  const [direction, setDirection] = useState("");
  // Solo mode state
  const [soloWork, setSoloWork] = useState("");
  const [soloChars, setSoloChars] = useState<string[]>([]);
  // Reverse mode state
  const [reverseWork, setReverseWork] = useState("");
  const [reverseChars, setReverseChars] = useState<string[]>([]);
  // Story template state
  const [storyCategory, setStoryCategory] = useState("全て");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [openDirection, setOpenDirection] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);
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
  const [parsedPanels, setParsedPanels] = useState<import("@/lib/types").EnhancedPanel[] | null>(null);
  const [parsedEndingCaption, setParsedEndingCaption] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [showJsonParser, setShowJsonParser] = useState(false);

  // Combo ranking state
  const [comboStats, setComboStats] = useState<Record<string, number>>({});

  // Multi-mode state
  const [multiWorks, setMultiWorks] = useState<Array<{
    workName: string;
    characters: string[];
    role: CharacterRole;
    freeRoleText: string;
  }>>([
    { workName: "", characters: [], role: "protagonist", freeRoleText: "" },
    { workName: "", characters: [], role: "tsukkomi", freeRoleText: "" },
    { workName: "", characters: [], role: "boke", freeRoleText: "" },
  ]);

  const addMultiWork = () => {
    const nextRole = DEFAULT_ROLES[multiWorks.length] || "free";
    setMultiWorks([...multiWorks, { workName: "", characters: [], role: nextRole, freeRoleText: "" }]);
  };

  const removeMultiWork = (index: number) => {
    if (multiWorks.length <= 2) return;
    setMultiWorks(multiWorks.filter((_, i) => i !== index));
  };

  const updateMultiWork = (index: number, updates: Partial<typeof multiWorks[0]>) => {
    setMultiWorks(prev => prev.map((w, i) => i === index ? { ...w, ...updates } : w));
  };

  // Load combo stats + URL params on mount
  useEffect(() => {
    const stored = localStorage.getItem("crossover-combo-stats");
    if (stored) {
      try { setComboStats(JSON.parse(stored)); } catch { /* ignore */ }
    }

    // Load from share URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "solo") {
      setMode("solo");
      if (params.get("d")) setDirection(params.get("d")!);
      if (params.get("dt")) setDetail(params.get("dt")!);
      if (params.get("w")) setSoloWork(params.get("w")!);
      if (params.get("c")) setSoloChars(params.get("c")!.split("・").filter(Boolean));
    } else if (params.get("mode") === "multi") {
      setMode("multi");
      if (params.get("d")) setDirection(params.get("d")!);
      if (params.get("dt")) setDetail(params.get("dt")!);
      const works: typeof multiWorks = [];
      for (let i = 1; ; i++) {
        const w = params.get(`w${i}`);
        if (!w) break;
        works.push({
          workName: w,
          characters: params.get(`c${i}`)?.split("・").filter(Boolean) || [],
          role: (params.get(`r${i}`) || DEFAULT_ROLES[i - 1] || "free") as CharacterRole,
          freeRoleText: params.get(`f${i}`) || "",
        });
      }
      if (works.length >= 2) setMultiWorks(works);
    } else {
      if (params.get("d")) setDirection(params.get("d")!);
      if (params.get("wa")) setWorldWork(params.get("wa")!);
      if (params.get("wb")) setCharWork(params.get("wb")!);
      if (params.get("ca")) setWorldChars(params.get("ca")!.split("・").filter(Boolean));
      if (params.get("cb")) setCharChars(params.get("cb")!.split("・").filter(Boolean));
      if (params.get("dt")) setDetail(params.get("dt")!);
    }
  }, []);

  const world = worldChars.length > 0 ? `${worldWork}（${worldChars.join("・")}）` : worldWork;
  const character = charChars.length > 0 ? `${charWork}の${charChars.join("・")}` : charWork;
  const canGenerateSolo = direction.trim() && soloWork.trim();
  const canGenerateDuo = direction.trim() && worldWork.trim() && charWork.trim();
  const canGenerateMulti = direction.trim() && multiWorks.filter((w) => w.workName.trim()).length >= 2;
  const canGenerate = mode === "reverse" ? false
    : detail.trim() !== ""
    || (mode === "solo" ? canGenerateSolo : mode === "duo" ? canGenerateDuo : canGenerateMulti);

  // Reverse mode recommendations
  const reverseRecommendations = useMemo(
    () => reverseWork.trim() ? getRecommendations(reverseWork.trim()) : [],
    [reverseWork]
  );
  const reverseDirections = useMemo(
    () => reverseWork.trim() ? getRecommendedDirections(reverseWork.trim()) : [],
    [reverseWork]
  );

  // Filtered story templates
  const filteredTemplates = useMemo(
    () => filterTemplates(storyCategory),
    [storyCategory]
  );

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

    if (mode === "reverse") {
      const pick = WORKS[Math.floor(Math.random() * WORKS.length)];
      setReverseWork(pick.name);
      setReverseChars([]);
      return; // 逆引きはここで終わり（方向性はレコメンドで選ぶ）
    } else if (mode === "solo") {
      const pick = WORKS[Math.floor(Math.random() * WORKS.length)];
      setSoloWork(pick.name);
      setSoloChars([]);
    } else if (mode === "multi") {
      const count = multiWorks.length;
      const used = new Set<string>();
      const newWorks = multiWorks.map((w, i) => {
        let pick = WORKS[Math.floor(Math.random() * WORKS.length)];
        while (used.has(pick.name)) {
          pick = WORKS[Math.floor(Math.random() * WORKS.length)];
        }
        used.add(pick.name);
        return { ...w, workName: pick.name, characters: [], role: DEFAULT_ROLES[i] || "free" as CharacterRole, freeRoleText: "" };
      });
      setMultiWorks(newWorks);
    } else {
      const workA = WORKS[Math.floor(Math.random() * WORKS.length)];
      let workB = WORKS[Math.floor(Math.random() * WORKS.length)];
      while (workB.name === workA.name) {
        workB = WORKS[Math.floor(Math.random() * WORKS.length)];
      }
      setWorldWork(workA.name);
      setWorldChars([]);
      setCharWork(workB.name);
      setCharChars([]);
    }
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

    // テンプレートのラベルを方向性のフォールバックに使用
    const templateObj = selectedTemplate ? STORY_TEMPLATES.find(t => t.id === selectedTemplate) : null;
    const effectiveDirection = direction.trim() || templateObj?.label || "";

    // effectiveDirection込みで通常フローが可能か判定
    const normalFlowReady = mode === "solo"
      ? (!!effectiveDirection && !!soloWork.trim())
      : mode === "duo"
      ? (!!effectiveDirection && !!worldWork.trim() && !!charWork.trim())
      : (!!effectiveDirection && multiWorks.filter(w => w.workName.trim()).length >= 2);

    // 通常フローの必須項目が足りないがdetailに内容がある場合
    if (!normalFlowReady && detail.trim()) {
      // 選択済みの作品情報を収集
      let worksInfo: string | undefined;

      if (mode === "solo" && soloWork.trim()) {
        const chars = soloChars.length > 0 ? `（${soloChars.join("・")}）` : "";
        worksInfo = `【作品】${soloWork}${chars}\n※この作品のキャラクターで4コマ漫画を作成してください。`;
      } else if (mode === "duo") {
        const parts: string[] = [];
        if (worldWork.trim()) {
          const wc = worldChars.length > 0 ? `（${worldChars.join("・")}）` : "";
          parts.push(`【作品A（世界観・舞台）】${worldWork}${wc}`);
        }
        if (charWork.trim()) {
          const cc = charChars.length > 0 ? `（${charChars.join("・")}）` : "";
          parts.push(`【作品B（迷い込むキャラ）】${charWork}${cc}`);
        }
        if (parts.length > 0) {
          worksInfo = parts.join("\n");
          if (parts.length === 1) {
            worksInfo += "\n※もう1作品はシナリオに合うものをAIが選んでください。";
          }
        }
      } else if (mode === "multi") {
        const filledWorks = multiWorks.filter(w => w.workName.trim());
        if (filledWorks.length > 0) {
          const workLines = filledWorks.map((w, i) => {
            const chars = w.characters.length > 0 ? `（${w.characters.join("・")}）` : "";
            return `【作品${i + 1}】${w.workName}${chars}`;
          });
          worksInfo = workLines.join("\n");
          if (filledWorks.length === 1) {
            worksInfo += "\n※追加の作品はシナリオに合うものをAIが選んでください。";
          }
        }
      }

      try {
        const result = buildTemplateOnlyPrompt(
          detail.trim(),
          templateObj?.label,
          direction.trim() || undefined,
          worksInfo,
        );
        setPrompt(result);
      } catch {
        setError("プロンプト生成に失敗しました");
      }
      return;
    }

    if (mode === "solo") {
      try {
        const profiles = soloChars
          .map((charName) => getCharacterProfile(charName, soloWork.trim()))
          .filter((p): p is NonNullable<typeof p> => !!p);
        const result = buildSoloFullPrompt({
          direction: effectiveDirection,
          work: soloWork.trim(),
          characters: soloChars,
          detail: detail.trim() || undefined,
          characterProfiles: profiles.length > 0 ? profiles : undefined,
        });
        setPrompt(result);
      } catch {
        setError("プロンプト生成に失敗しました");
      }
    } else if (mode === "multi") {
      try {
        const works: MultiWork[] = multiWorks
          .filter((w) => w.workName.trim())
          .map((w) => {
            const profiles = w.characters
              .map((charName) => getCharacterProfile(charName, w.workName.trim()))
              .filter((p): p is NonNullable<typeof p> => !!p);
            return {
              workName: w.workName.trim(),
              characters: w.characters,
              role: w.role,
              freeRoleText: w.freeRoleText || undefined,
              characterProfiles: profiles.length > 0 ? profiles : undefined,
            };
          });
        const result = buildMultiFullPrompt({
          direction: effectiveDirection,
          works,
          detail: detail.trim() || undefined,
        });
        setPrompt(result);
      } catch {
        setError("プロンプト生成に失敗しました");
      }
    } else {
      trackCombo();
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            direction: effectiveDirection,
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
    const entry: Record<string, unknown> = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      prompt,
    };
    if (mode === "solo") {
      entry.mode = "solo";
      entry.input = { direction, work: soloWork, characters: soloChars, detail };
    } else if (mode === "multi") {
      entry.mode = "multi";
      entry.input = { direction, detail };
      entry.works = multiWorks.filter((w) => w.workName.trim());
    } else {
      entry.mode = "duo";
      entry.input = { direction, world, character, detail };
    }
    history.unshift(entry);
    if (history.length > 100) history.length = 100;
    localStorage.setItem("crossover-history", JSON.stringify(history));
    setCopiedField("saved");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // --- Feature 4: Save to favorites ---
  const saveToFavorites = () => {
    if (!prompt) return;
    const favorites = JSON.parse(localStorage.getItem("crossover-favorites") || "[]");
    const entry: Record<string, unknown> = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      prompt,
    };
    if (mode === "solo") {
      entry.mode = "solo";
      entry.input = { direction, work: soloWork, characters: soloChars, detail };
    } else if (mode === "multi") {
      entry.mode = "multi";
      entry.input = { direction, detail };
      entry.works = multiWorks.filter((w) => w.workName.trim());
    } else {
      entry.mode = "duo";
      entry.input = { direction, world, character, detail };
    }
    favorites.unshift(entry);
    if (favorites.length > 50) favorites.length = 50;
    localStorage.setItem("crossover-favorites", JSON.stringify(favorites));
    setCopiedField("favorited");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // --- Feature 6: Share URL ---
  const generateShareUrl = () => {
    const params = new URLSearchParams();
    if (direction) params.set("d", direction);
    if (detail) params.set("dt", detail);

    if (mode === "solo") {
      params.set("mode", "solo");
      if (soloWork) params.set("w", soloWork);
      if (soloChars.length > 0) params.set("c", soloChars.join("・"));
    } else if (mode === "multi") {
      params.set("mode", "multi");
      const filledWorks = multiWorks.filter((w) => w.workName.trim());
      filledWorks.forEach((w, i) => {
        params.set(`w${i + 1}`, w.workName);
        if (w.characters.length > 0) params.set(`c${i + 1}`, w.characters.join("・"));
        params.set(`r${i + 1}`, w.role);
        if (w.role === "free" && w.freeRoleText) params.set(`f${i + 1}`, w.freeRoleText);
      });
    } else {
      if (worldWork) params.set("wa", worldWork);
      if (charWork) params.set("wb", charWork);
      if (worldChars.length > 0) params.set("ca", worldChars.join("・"));
      if (charChars.length > 0) params.set("cb", charChars.join("・"));
    }
    const url = `${window.location.origin}?${params.toString()}`;
    copyText(url, "share");
  };

  // --- Feature 3: JSON parser ---
  const handleParseJson = () => {
    setJsonError(null);
    setExtractedPromptFull(null);
    setParsedPanels(null);
    setParsedEndingCaption(null);
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
      // パネルデータも抽出（後方互換: なくてもOK）
      if (parsed.panels && Array.isArray(parsed.panels)) {
        setParsedPanels(parsed.panels);
      }
      if (parsed.endingCaption) {
        setParsedEndingCaption(parsed.endingCaption);
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
              {mode === "solo"
                ? "1つの作品のキャラだけで4コマ漫画のプロンプトを生成します。"
                : mode === "multi"
                ? `${multiWorks.length}作品を選んで、マルチクロスオーバー4コマ漫画のプロンプトを生成します。`
                : "クロスオーバー4コマ漫画の画像生成プロンプトを作成します。AIに貼り付けてそのまま画像生成できます。"}
            </p>
          </div>
          <button
            onClick={handleRandom}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors shrink-0"
            title="ランダムで選ぶ"
          >
            {"🎲 ガチャ"}
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => setMode("solo")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "solo"
                ? "bg-green-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            1作品モード
          </button>
          <button
            onClick={() => setMode("duo")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "duo"
                ? "bg-blue-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            2作品クロスオーバー
          </button>
          <button
            onClick={() => setMode("multi")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "multi"
                ? "bg-purple-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            マルチ（3作品〜）
          </button>
          <button
            onClick={() => setMode("reverse")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              mode === "reverse"
                ? "bg-amber-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            逆引き
          </button>
        </div>

        {/* Reverse Mode */}
        {mode === "reverse" && (
          <div className="space-y-4">
            <WorkSelector
              label="作品を選んで、相性の良いクロスオーバー相手を探す"
              value={reverseWork}
              onChange={setReverseWork}
              characterValues={reverseChars}
              onCharacterChange={setReverseChars}
              placeholder="まず作品を選んでください"
              characterPlaceholder="キャラ指定（任意）"
            />

            {reverseWork.trim() && reverseDirections.length > 0 && (
              <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-amber-400">おすすめの方向性</h3>
                <div className="flex flex-wrap gap-2">
                  {reverseDirections.map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDirection(d);
                        setWorldWork(reverseWork);
                        setWorldChars([...reverseChars]);
                        setMode("duo");
                      }}
                      className="px-3 py-1.5 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700/50 rounded-lg text-sm text-amber-200 transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {reverseWork.trim() && reverseRecommendations.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-amber-400">おすすめのクロスオーバー相手</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {reverseRecommendations.map((rec) => (
                    <button
                      key={rec.work.name}
                      onClick={() => {
                        setWorldWork(reverseWork);
                        setWorldChars([...reverseChars]);
                        setCharWork(rec.work.name);
                        setCharChars([]);
                        if (rec.directions.length > 0) {
                          setDirection(rec.directions[Math.floor(Math.random() * rec.directions.length)]);
                        }
                        setMode("duo");
                      }}
                      className="text-left px-3 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors group"
                    >
                      <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                        {reverseWork} <span className="text-gray-500">×</span> {rec.work.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {rec.reason} ・ {rec.directions[0]}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600">クリックで2作品モードに移動して自動入力します</p>
              </div>
            )}

            {reverseWork.trim() && reverseRecommendations.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-4">
                作品を選択すると、おすすめの組み合わせが表示されます
              </div>
            )}
          </div>
        )}

        {/* Direction Presets (not shown in reverse mode) */}
        {mode !== "reverse" && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenDirection(!openDirection)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">方向性（テーマ・トーン）</span>
                {direction.trim() && (
                  <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/50 rounded text-xs text-blue-300 truncate max-w-48">
                    {direction.trim()}
                  </span>
                )}
              </div>
              <span className="text-gray-500 text-sm">{openDirection ? "▲" : "▼"}</span>
            </button>
            {openDirection && (
              <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DIRECTION_PRESETS.map((p) => {
                    const example = p.combos[0];
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setDirection(p.label);
                          if (mode === "solo") {
                            // ソロモード: 方向性だけセット（作品は変えない）
                          } else if (mode === "multi") {
                            const combo = p.combos[Math.floor(Math.random() * p.combos.length)];
                            const used = new Set([combo.workA, combo.workB]);
                            const extraWorks: string[] = [];
                            for (let ei = 2; ei < multiWorks.length; ei++) {
                              let pick = WORKS[Math.floor(Math.random() * WORKS.length)];
                              let attempts = 0;
                              while (used.has(pick.name) && attempts < 100) {
                                pick = WORKS[Math.floor(Math.random() * WORKS.length)];
                                attempts++;
                              }
                              used.add(pick.name);
                              extraWorks.push(pick.name);
                            }
                            const allWorkNames = [combo.workA, combo.workB, ...extraWorks];
                            setMultiWorks(multiWorks.map((w, i) => ({
                              ...w,
                              workName: allWorkNames[i] || "",
                              characters: [],
                              role: DEFAULT_ROLES[i] || "free" as CharacterRole,
                              freeRoleText: "",
                            })));
                          } else {
                            const combo = p.combos[Math.floor(Math.random() * p.combos.length)];
                            setWorldWork(combo.workA);
                            setWorldChars([]);
                            setCharWork(combo.workB);
                            setCharChars([]);
                          }
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
                <textarea
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  placeholder="プリセットを選ぶか、テーマ・トーンを自由に入力（例: 「放課後の教室でのほのぼの日常」「修行中に起きたハプニング」「料理対決で予想外の展開」）"
                  rows={2}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                />
              </div>
            )}
          </div>
        )}

        {/* Story Templates (not shown in reverse mode) */}
        {mode !== "reverse" && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenTemplate(!openTemplate)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">ストーリーテンプレート（任意）</span>
                {selectedTemplate && (
                  <span className="px-2 py-0.5 bg-amber-600/20 border border-amber-500/50 rounded text-xs text-amber-300 truncate max-w-48">
                    {STORY_TEMPLATES.find(t => t.id === selectedTemplate)?.label}
                  </span>
                )}
              </div>
              <span className="text-gray-500 text-sm">{openTemplate ? "▲" : "▼"}</span>
            </button>
            {openTemplate && (
              <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-2">
                <div className="flex flex-wrap gap-1 mb-1">
                  {STORY_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setStoryCategory(cat)}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${
                        storyCategory === cat
                          ? "bg-amber-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (selectedTemplate === t.id) {
                          setSelectedTemplate(null);
                        } else {
                          setSelectedTemplate(t.id);
                          setDetail(t.scenario);
                        }
                      }}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                        selectedTemplate === t.id
                          ? "bg-amber-600/20 border-amber-500 text-amber-200 ring-1 ring-amber-500/50"
                          : "bg-gray-900 border-gray-700 text-gray-300 hover:border-amber-600/50 hover:bg-gray-800"
                      }`}
                    >
                      <div className="font-medium">{selectedTemplate === t.id ? "✓ " : ""}{t.label}</div>
                      <div className="text-xs opacity-50 mt-0.5 line-clamp-1">{t.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Solo Mode: Single Work */}
        {mode === "solo" && (
          <div>
            <WorkSelector
              label="作品を選択"
              value={soloWork}
              onChange={setSoloWork}
              characterValues={soloChars}
              onCharacterChange={setSoloChars}
              placeholder="作品名を選択 or 入力"
              characterPlaceholder="キャラ指定（複数可・「・」区切り）"
            />
          </div>
        )}

        {/* Duo Mode: World & Character */}
        {mode === "duo" && (
          <>
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
          </>
        )}

        {/* Multi Mode: N Works */}
        {mode === "multi" && (
          <div className="space-y-4">
            {multiWorks.map((mw, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-400">
                    作品{index + 1}
                  </span>
                  {multiWorks.length > 2 && (
                    <button
                      onClick={() => removeMultiWork(index)}
                      className="text-gray-500 hover:text-red-400 text-sm transition-colors"
                    >
                      ✕ 削除
                    </button>
                  )}
                </div>
                <WorkSelector
                  label=""
                  value={mw.workName}
                  onChange={(v) => updateMultiWork(index, { workName: v, characters: [] })}
                  characterValues={mw.characters}
                  onCharacterChange={(v) => updateMultiWork(index, { characters: v })}
                  placeholder="作品名を選択 or 入力"
                  characterPlaceholder="キャラ指定（複数可・「・」区切り）"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={mw.role}
                    onChange={(e) => updateMultiWork(index, { role: e.target.value as CharacterRole })}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {CHARACTER_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                  {mw.role === "free" && (
                    <input
                      type="text"
                      value={mw.freeRoleText}
                      onChange={(e) => updateMultiWork(index, { freeRoleText: e.target.value })}
                      placeholder="役割を入力"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={addMultiWork}
              className="w-full py-3 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl text-sm text-gray-500 hover:text-purple-400 transition-colors"
            >
              + 作品を追加（現在{multiWorks.length}作品）
            </button>
          </div>
        )}

        {/* Feature 5: Popular Combos Ranking (duo only) */}
        {mode === "duo" && topCombos.length > 0 && (
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

        {/* Detail (not shown in reverse mode) */}
        {mode !== "reverse" && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              具体的な要望・イメージ（任意）
            </label>
            <textarea
              value={detail}
              onChange={(e) => {
                setDetail(e.target.value);
                if (!e.target.value.trim()) setSelectedTemplate(null);
              }}
              placeholder={'例: たぬきち商店でローンを組まされる。「天下の大将軍ですよ」「ンォフゥッ」'}
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
        )}

        {/* Generate + Share Buttons (not shown in reverse mode) */}
        {mode !== "reverse" && (
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
        )}

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

                {/* セリフパネルUI */}
                {parsedPanels && parsedPanels.length > 0 && (
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <DialoguePanel panels={parsedPanels} />
                    {parsedEndingCaption && (
                      <p className="text-center text-sm text-gray-400 mt-3 italic">— {parsedEndingCaption} —</p>
                    )}
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

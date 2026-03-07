import type { CharacterRole } from "./types";

export interface RoleDefinition {
  id: CharacterRole;
  label: string;
  description: string;
  promptEn: string;
}

export const CHARACTER_ROLES: RoleDefinition[] = [
  {
    id: "protagonist",
    label: "主役",
    description: "メインの話を展開するキャラ",
    promptEn: "main character / protagonist",
  },
  {
    id: "tsukkomi",
    label: "ツッコミ役",
    description: "ボケにツッコむ常識人",
    promptEn: "straight man / tsukkomi (reacts with retorts)",
  },
  {
    id: "boke",
    label: "ボケ役",
    description: "ボケて笑いを生む",
    promptEn: "funny man / boke (creates comedy through absurdity)",
  },
  {
    id: "rival",
    label: "ライバル",
    description: "対抗・競争関係",
    promptEn: "rival / competitor",
  },
  {
    id: "makikomare",
    label: "巻き込まれ役",
    description: "異世界に巻き込まれた側",
    promptEn: "dragged-in character (unwillingly involved)",
  },
  {
    id: "guide",
    label: "案内人",
    description: "世界観を説明・案内する",
    promptEn: "guide / narrator (explains the world)",
  },
  {
    id: "troublemaker",
    label: "トラブルメーカー",
    description: "混乱を引き起こす",
    promptEn: "troublemaker (causes chaos)",
  },
  {
    id: "observer",
    label: "観察者",
    description: "状況を見守り解説する",
    promptEn: "observer / commentator (watches and comments)",
  },
  {
    id: "heroine",
    label: "ヒロイン",
    description: "物語の中心となる女性キャラ",
    promptEn: "heroine / main female character",
  },
  {
    id: "villain",
    label: "悪役・ラスボス",
    description: "敵対・悪巧みをする",
    promptEn: "villain / final boss",
  },
  {
    id: "mentor",
    label: "師匠",
    description: "導き教える存在",
    promptEn: "mentor / master (teaches and guides)",
  },
  {
    id: "mascot",
    label: "マスコット",
    description: "可愛い癒し枠・サイドキック",
    promptEn: "mascot / cute sidekick",
  },
  {
    id: "mastermind",
    label: "黒幕",
    description: "裏で糸を引く策略家",
    promptEn: "mastermind / schemer (pulls strings behind the scenes)",
  },
  {
    id: "victim",
    label: "被害者",
    description: "いつも割を食う・とばっちり",
    promptEn: "victim (always suffers the consequences)",
  },
  {
    id: "wildcard",
    label: "暴走キャラ",
    description: "予測不能な行動をする",
    promptEn: "wildcard / loose cannon (acts unpredictably)",
  },
  {
    id: "free",
    label: "自由設定",
    description: "自分で役割を記述",
    promptEn: "custom role",
  },
];

export function getRoleLabel(roleId: CharacterRole): string {
  return CHARACTER_ROLES.find((r) => r.id === roleId)?.label || "自由設定";
}

export function getRolePromptEn(roleId: CharacterRole, freeText?: string): string {
  if (roleId === "free" && freeText) {
    return freeText;
  }
  return CHARACTER_ROLES.find((r) => r.id === roleId)?.promptEn || "supporting character";
}

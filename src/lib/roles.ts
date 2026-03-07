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

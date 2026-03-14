import { z } from "zod";

export const DialogueSchema = z.object({
  character: z.string(),
  line: z.string(),
  emotion: z.string(),
});

export const PanelSchema = z.object({
  number: z.number(),
  beat: z.string(),
  description: z.string(),
  dialogue: z.array(DialogueSchema),
});

export const CrossoverPromptSchema = z.object({
  main_title: z.string(),
  subtitle: z.string(),
  prompt_full: z.string(),
  scene_description: z.string(),
  panels: z.array(PanelSchema),
  style_mix: z.string(),
  visual_effects: z.array(z.string()),
});

export type CrossoverPrompt = z.infer<typeof CrossoverPromptSchema>;
export type Panel = z.infer<typeof PanelSchema>;
export type Dialogue = z.infer<typeof DialogueSchema>;

// セリフスタイル（フォント演出に使用）
export type SpeechStyleType = "normal" | "shout" | "whisper" | "mumble" | "dramatic" | "comedic" | "inner";

// キャラクターDB用の型定義
export interface CharacterProfile {
  id: string;                    // "todoroki_shoto"
  name: string;                  // "轟焦凍"
  nameEn: string;                // "Shoto Todoroki"
  workId: string;                // "mha" → works.tsのWork.idとリンク
  personalityTraits: string[];
  speech: {
    firstPerson: string;         // "俺", "僕", "オラ"
    sentenceEndings: string[];   // ["だ", "ぜ", "なのだ"]
    verbalTics: string[];        // ["悪くない", "めんどくさ"]
    speechInstructions: string;  // ★最重要: AIプロンプトに注入する口調指示
  };
  visual: {
    description: string;         // 英語のビジュアル説明（画像プロンプト用）
    chibiTraits: string;         // ちびキャラ時の特徴
  };
  fontStyleId: string;           // fontThemesのキー（"mha", "evangelion"等）
}

// 拡張ダイアログスキーマ（新フィールドは全てoptional → 後方互換）
export const EnhancedDialogueSchema = DialogueSchema.extend({
  emotionIntensity: z.number().min(0).max(10).optional(),
  speechStyle: z.enum(["normal", "shout", "whisper", "mumble", "dramatic", "comedic", "inner"]).optional(),
  reactionTo: z.string().nullable().optional(),
  visualDirection: z.string().optional(),
});

export const EnhancedPanelSchema = PanelSchema.extend({
  dialogue: z.array(EnhancedDialogueSchema),
  visualDirection: z.string().optional(),
});

export const EnhancedCrossoverPromptSchema = CrossoverPromptSchema.extend({
  panels: z.array(EnhancedPanelSchema),
  geminiImagePrompt: z.string().optional(),
  endingCaption: z.string().optional(),
});

export type EnhancedCrossoverPrompt = z.infer<typeof EnhancedCrossoverPromptSchema>;
export type EnhancedPanel = z.infer<typeof EnhancedPanelSchema>;
export type EnhancedDialogue = z.infer<typeof EnhancedDialogueSchema>;

export interface GenerateInput {
  direction: string;
  world: string;
  character: string;
  detail?: string;
  characterProfiles?: CharacterProfile[];
}

// ソロモード用（1作品）
export interface SoloGenerateInput {
  direction: string;
  work: string;
  characters: string[];
  detail?: string;
  characterProfiles?: CharacterProfile[];
}

// マルチモード用
export type CharacterRole =
  | "protagonist"
  | "tsukkomi"
  | "boke"
  | "rival"
  | "makikomare"
  | "guide"
  | "troublemaker"
  | "observer"
  | "heroine"
  | "villain"
  | "mentor"
  | "mascot"
  | "mastermind"
  | "victim"
  | "wildcard"
  | "free";

export interface MultiWork {
  workName: string;
  characters: string[];
  role: CharacterRole;
  freeRoleText?: string;
  characterProfiles?: CharacterProfile[];
}

export interface MultiGenerateInput {
  direction: string;
  works: MultiWork[];
  detail?: string;
}

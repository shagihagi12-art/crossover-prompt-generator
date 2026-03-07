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

export interface GenerateInput {
  direction: string;
  world: string;
  character: string;
  detail?: string;
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
  | "free";

export interface MultiWork {
  workName: string;
  characters: string[];
  role: CharacterRole;
  freeRoleText?: string;
}

export interface MultiGenerateInput {
  direction: string;
  works: MultiWork[];
  detail?: string;
}

import { z } from "zod";

export const DialogueSchema = z.object({
  character: z.string(),
  line: z.string(),
  emotion: z.string(),
});

export const AlternativeAngleSchema = z.object({
  angle: z.string(),
  description: z.string(),
});

export const CrossoverPromptSchema = z.object({
  title: z.string(),
  prompt_en: z.string(),
  prompt_ja: z.string(),
  scene_description: z.string(),
  dialogue: z.array(DialogueSchema),
  visual_notes: z.array(z.string()),
  style_tags: z.array(z.string()),
  alternative_angles: z.array(AlternativeAngleSchema),
});

export type CrossoverPrompt = z.infer<typeof CrossoverPromptSchema>;

export interface GenerateInput {
  direction: string;
  world: string;
  character: string;
  detail?: string;
}

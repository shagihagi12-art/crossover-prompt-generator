import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts";
import type { GenerateInput } from "./types";

/**
 * AIに渡すための完成されたプロンプトを生成する（API不要）
 * ユーザーがこのプロンプトをコピーして、任意のAI（ChatGPT/Gemini/Claude等）に貼り付けて使う
 */
export function buildFullPrompt(input: GenerateInput): string {
  const userPrompt = buildUserPrompt(input);

  return `${SYSTEM_PROMPT}

---

${userPrompt}`;
}

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

/**
 * ストーリーテンプレートのみで4コマプロンプトを生成する
 * 作品・キャラクターはAIに選ばせる
 */
export function buildTemplateOnlyPrompt(
  scenario: string,
  templateLabel?: string,
  direction?: string,
): string {
  const lines = [
    "以下のシナリオで4コマ漫画クロスオーバーの画像生成プロンプトを作成してください。",
    "",
    "※作品・キャラクターの指定はありません。このシナリオに最もマッチし、面白いギャップが生まれる2〜3作品のキャラクターを選んでください。",
    "※有名なアニメ・漫画・ゲーム作品から選ぶと、キャラの描写が正確になります。",
    "",
  ];

  if (templateLabel) {
    lines.push(`【ストーリーテンプレート】${templateLabel}`);
  }
  lines.push(`【シナリオ】${scenario}`);

  if (direction) {
    lines.push(`【方向性・テーマ】${direction}`);
  }

  lines.push(
    "",
    "★重要: まず最適な2〜3作品を選び、それぞれのキャラクターを作品Aの世界観側・作品Bの迷い込む側として設定してください。",
    "★重要: prompt_full は必ず冒頭に「A single vertical strip of EXACTLY 4 panels arranged in ONE column from top to bottom」で始めてください。",
    "★重要: パネルは [Panel 1 - TOP] 〜 [Panel 4 - BOTTOM] の形式で区切ってください。",
    "★重要: 吹き出しの位置指定（tail pointing to, placed above on the left等）は入れないでください。",
    "★重要: 全キャラを必ずチビ/ミニキャラ（2〜3頭身、大きな頭、小さな体）で描いてください。通常の人体比率は禁止です。写真調・3DCG調も禁止です。",
    "★重要: プロのイラストレーター品質で描いてください。キラキラした瞳（ハイライト・反射あり）、強弱のある線画、柔らかい影とハイライト、ダイナミックなポーズ、大げさな表情（喜怒哀楽をオーバーに）。",
    "★重要: 各キャラの服装・髪型・髪色・持ち物を原作に忠実に詳細描写してください。",
    "★重要: 選んだ作品の画風の違いを明確に描き分けてください。",
    "",
    "上記の条件に基づいて、JSON形式で出力してください。"
  );

  return `${SYSTEM_PROMPT}\n\n---\n\n${lines.join("\n")}`;
}

import type { GenerateInput, CharacterProfile } from "./types";

export const SYSTEM_PROMPT = `あなたはアニメ・漫画・ゲームのクロスオーバー4コマ漫画の画像生成プロンプトを作成する専門家です。

ユーザーから「方向性」「作品A（世界観・舞台）」「作品B（迷い込むキャラ）」「具体的な要望」を受け取り、Geminiの画像生成AIにそのまま貼り付けて4コマ漫画画像を生成できるプロンプトを作成します。

## 4コマ漫画のルール
- 起承転結の4コマ構成（Panel 1:状況設定、Panel 2:展開、Panel 3:転換、Panel 4:オチ）
- 必ず4コマちょうど。5コマ以上・3コマ以下は絶対NG
- 各コマに1〜2個のセリフを入れる（キャラの口癖・名セリフを活用）
- セリフは全体で6〜8個程度（多すぎるとGeminiがレイアウトを崩す）
- （）内のト書き補足を適宜入れる（「（青ざめて）」「（泣）」「（心の中で）」）
- オチは必ず笑えるか意外性のあるものにする

## ★ レイアウト最重要ルール（必ず守ること）
- 4コマは必ず「縦1列 × 4段」のレイアウト
- パネルは上から下に1列で並べる（横に並べない）
- 画像全体は縦長（ポートレート、アスペクト比 約2:5）
- 各パネルは横長の長方形を縦に積む
- 2x2のグリッド配置は絶対禁止
- 2x3のグリッド配置は絶対禁止
- タイトルは最上部、サブタイトルは最下部

## 画風ミックス（最重要）
- 全キャラをチビ/ミニキャラ（2〜3頭身）で描く
- **プロのイラストレーターが描いたような高品質なチビキャラ**を目指す
- 作品Aのキャラは作品Aのカラーリング・服装・髪型・アクセサリーを忠実に保ちつつチビ化
- 作品Bのキャラは作品Bのカラーリング・服装・髪型・アクセサリーを忠実に保ちつつチビ化
- 異なる画風のチビキャラが同じコマ内に共存する
- 画風のギャップ＋可愛いチビ体型のギャグ効果を狙う
- **表情は豊かでオーバーリアクション**（目の大きさ変化、汗マーク、怒りマーク等を活用）
- **ポーズはダイナミックに**（棒立ち禁止、感情に合った全身のポーズ）

## タイトル
- メインタイトル（上部）: 基本形「『作品A』の世界に、〇〇が迷い込んだ」（バリエーション自由）
- サブタイトル（下部）: シーンのオチや状況を端的に表す一言（形式自由、面白ければOK）

## セリフの書き方（シンプルに）
- キャラの外見描写の直後にセリフを書く
- 形式: {キャラ名} says: 「セリフ」
- 吹き出しの詳細な位置指定（left/right/above/tail pointing to等）は入れない（Geminiが混乱してレイアウトを崩す原因になる）
- 複数キャラがいる場合、キャラごとにまとめて書く

## 禁止事項
- prompt_fullに「起」「承」「転」「結」の漢字を含めない（Geminiがコマの横にラベルとして描いてしまうため）
- コマ間の矢印を示す指示を入れない
- キャラ名を吹き出しの横にラベルとして描く指示を入れない
- パネルを2列に配置する指示を入れない（2x2グリッド禁止）
- 4コマ以上のパネルを作らない（EXACTLY 4 panels）
- 吹き出し配置の細かい位置指定（"placed above on the left", "tail pointing to", "on the left side"等）を入れない
- "Speech bubble with tail pointing to" のようなフレーズを使わない
- prompt_fullに「photorealistic」「photo」「realistic rendering」「3D」「CGI」「hyper-realistic」などの写実的スタイルを示す語句を含めない

## prompt_full 生成ルール（Geminiで正しい4コマが出力されるために）
- prompt_fullは英語ベース（日本語セリフ・タイトルはそのまま混ぜてOK）

### 冒頭（必ずこの内容で始める）:
A single vertical strip of EXACTLY 4 panels arranged in ONE column from top to bottom, like a traditional Japanese 4-koma (4コマ漫画). The image is a tall portrait format (aspect ratio approximately 2:5). Each panel is a wide horizontal rectangle stacked vertically. Thick black borders separate each panel. There is a title area above the first panel and a subtitle area below the last panel. Drawn in **premium-quality chibi/super-deformed anime style** — all characters have oversized heads (2-3 head-to-body ratio), tiny rounded bodies, stubby limbs, and expressive cute facial features with large shiny eyes (with highlights and reflections). **Professional illustration quality**: clean precise ink outlines with varying line weight (thicker outlines, thinner details), smooth cel-shaded coloring with subtle gradients and soft shadows, vibrant saturated color palette with careful color harmony. Each character's design must be faithful to their original series (accurate hair color, costume details, accessories, signature items). Expressions should be exaggerated and lively — big sparkly eyes for joy, comically tiny dot-eyes for shock, sharp teeth for anger, waterfall tears for sadness. Dynamic poses that convey emotion through the whole body, not just the face. NOT photorealistic. NOT 3D rendered. NOT normal human proportions. IMPORTANT: Do NOT arrange panels in a grid (no 2x2, no 2x3). All 4 panels must be in a single vertical column.

### パネル区切り形式:
[Panel 1 - TOP]:
[Panel 2 - UPPER MIDDLE]:
[Panel 3 - LOWER MIDDLE]:
[Panel 4 - BOTTOM]:

### 各パネルの記述テンプレート:
[Panel N - POSITION]: {場所・状況の簡潔な描写}.
{キャラA名} ({外見特徴, 画風指定}), {ポーズ・表情}. {キャラA名} says: 「セリフ」
{キャラB名} ({外見特徴, 画風指定}), {ポーズ・表情}. {キャラB名} says: 「セリフ」

### キャラ初回登場時:
外見を具体的かつ詳細に描写。以下を必ず含める:
- 髪型・髪色（具体的な色名: 例 "spiky black hair", "long pink hair with twin tails"）
- 服装の詳細（色・デザイン・特徴的なパーツ）
- 持ち物・アクセサリー（武器、帽子、マント等のアイコニックなアイテム）
- 画風（所属作品の画風タッチを明記）
- 全キャラ chibi/super-deformed style (oversized head, tiny body, 2-3 head ratio, premium quality with shiny eyes and dynamic pose)

### 効果音:
Sound effect text: "効果音"

### 末尾のStyle指定（必ず含める）:
- Style: Premium-quality chibi/super-deformed anime style, like professional manga merchandise or official chibi spin-off art. {作品Aの画風特徴} meets {作品Bの画風特徴}, contrasting art styles coexisting in the same panels. ALL characters must be drawn as adorable chibi with oversized heads, tiny rounded bodies, and 2-3 head-to-body ratio. Professional-grade line art with varying line weight, smooth cel-shaded coloring with subtle shadows and highlights, shiny detailed eyes with light reflections, vibrant and harmonious color palette. Characters must have exaggerated expressive faces and dynamic full-body poses. Absolutely NOT photorealistic, NOT 3D CGI, NOT normal human proportions.
- "Do NOT draw any labels, arrows, or text outside the panels. Only the title at the top and subtitle at the bottom should appear outside the panel borders."
- "Do NOT write character names as labels next to speech bubbles."
- "CRITICAL LAYOUT: This MUST be a SINGLE VERTICAL COLUMN of exactly 4 panels. Never arrange as 2x2 grid or 2x3 grid. The overall image must be taller than it is wide (portrait orientation, approximately 2:5 aspect ratio)."

## 出力形式
純粋なJSONのみを返してください。説明文やバッククォート不要。

{
  "main_title": "メインタイトル（白文字・黒縁取り用）",
  "subtitle": "サブタイトル（面白い一言）",
  "prompt_full": "Geminiにそのまま貼れる完成プロンプト（英語ベース、日本語セリフ混在）",
  "scene_description": "シーンの状況説明（日本語2-3文）",
  "panels": [
    {
      "number": 1,
      "beat": "起",
      "description": "コマ1の視覚的描写（日本語）",
      "dialogue": [
        {
          "character": "キャラ名",
          "line": "セリフ",
          "emotion": "表情",
          "emotionIntensity": 7,
          "speechStyle": "normal",
          "reactionTo": null,
          "visualDirection": "汗マークを浮かべて後ずさり"
        }
      ],
      "visualDirection": "パネル全体の構図・カメラアングルの指示（任意）"
    }
  ],
  "style_mix": "画風ミックスの指定（作品Aの画風特徴 × 作品Bの画風特徴）",
  "visual_effects": ["効果音やリアクション記号のリスト"],
  "geminiImagePrompt": "prompt_fullの要約版（Geminiに画像生成させる短縮プロンプト、任意）",
  "endingCaption": "4コマの締め一言（例: つづかない）"
}

### dialogue の追加フィールド説明（全てoptional）:
- emotionIntensity: 感情の強度 0-10（0=無表情、10=絶叫）
- speechStyle: セリフの演出スタイル（"normal" | "shout" | "whisper" | "mumble" | "dramatic" | "comedic" | "inner"）
- reactionTo: 誰/何へのリアクションか（null=独白）
- visualDirection: このセリフの絵的な演出指示

## ★ セリフ品質チェックリスト（AIは生成後にこれを自問すること）
1. そのキャラの一人称は正しいか？（「オラ」「僕」「あたし」等）
2. 語尾・口癖はキャラらしいか？（「〜だゾ」「〜なのよ」「〜でござる」等）
3. 異なるキャラが同じ口調になっていないか？
4. キャラクター固有の名セリフや決め台詞を活用しているか？
5. 感情表現はキャラの性格に一致しているか？`;

/** キャラプロフィールをプロンプト用テキストに変換 */
function formatCharacterProfiles(profiles: CharacterProfile[]): string {
  if (profiles.length === 0) return "";

  const sections = profiles.map((p) => {
    return `### ${p.name}（${p.nameEn}）
- 性格: ${p.personalityTraits.join("、")}
- ビジュアル: ${p.visual.description}
- ちびキャラ: ${p.visual.chibiTraits}
- 口調指示: ${p.speech.speechInstructions}`;
  });

  return `\n## ★ キャラクター口調・外見ガイド（必ず従うこと）\n以下のキャラは口調・一人称・語尾を厳密に守ってください。prompt_fullの外見描写にもビジュアル情報を使ってください。\n\n${sections.join("\n\n")}`;
}

export function buildUserPrompt(input: GenerateInput): string {
  const lines = [
    "以下の条件で4コマ漫画クロスオーバーの画像生成プロンプトを作成してください。",
    "",
    `【方向性】${input.direction}`,
    `【作品A（世界観・舞台）】${input.world}`,
    `【作品B（迷い込むキャラ）】${input.character}`,
  ];

  if (input.detail) {
    lines.push(`【具体的な要望】${input.detail}`);
  }

  // キャラプロフィール注入
  if (input.characterProfiles && input.characterProfiles.length > 0) {
    lines.push(formatCharacterProfiles(input.characterProfiles));
  }

  lines.push(
    "",
    "★重要: prompt_full は必ず冒頭に「A single vertical strip of EXACTLY 4 panels arranged in ONE column from top to bottom」で始めてください。",
    "★重要: パネルは [Panel 1 - TOP] 〜 [Panel 4 - BOTTOM] の形式で区切ってください。",
    "★重要: 吹き出しの位置指定（tail pointing to, placed above on the left等）は入れないでください。",
    "★重要: 全キャラを必ずチビ/ミニキャラ（2〜3頭身、大きな頭、小さな体）で描いてください。通常の人体比率は禁止です。写真調・3DCG調も禁止です。",
    "★重要: プロのイラストレーター品質で描いてください。キラキラした瞳（ハイライト・反射あり）、強弱のある線画、柔らかい影とハイライト、ダイナミックなポーズ、大げさな表情（喜怒哀楽をオーバーに）。",
    "★重要: 各キャラの服装・髪型・髪色・持ち物を原作に忠実に詳細描写してください。",
    "",
    "上記の条件に基づいて、JSON形式で出力してください。"
  );

  return lines.join("\n");
}

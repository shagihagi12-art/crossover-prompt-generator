import { WORKS, type Work } from "./works";

// ジャンル間の相性マップ（対比が面白いペア）
const GENRE_CONTRAST: Record<string, string[]> = {
  "バトル・少年": ["日常・ほのぼの", "ギャグ・コメディ", "恋愛・青春"],
  "日常・ほのぼの": ["バトル・少年", "ホラー・ダーク", "SF・メカ"],
  "ファンタジー・異世界": ["日常・ほのぼの", "SF・メカ", "ギャグ・コメディ"],
  "SF・メカ": ["ファンタジー・異世界", "日常・ほのぼの", "少女・魔法少女"],
  "ホラー・ダーク": ["日常・ほのぼの", "ギャグ・コメディ", "少女・魔法少女"],
  "恋愛・青春": ["バトル・少年", "ホラー・ダーク", "ギャグ・コメディ"],
  "ギャグ・コメディ": ["ホラー・ダーク", "バトル・少年", "SF・メカ"],
  "推理・サスペンス": ["ギャグ・コメディ", "日常・ほのぼの", "少女・魔法少女"],
  "スポーツ": ["バトル・少年", "ギャグ・コメディ", "ファンタジー・異世界"],
  "少女・魔法少女": ["バトル・少年", "ホラー・ダーク", "SF・メカ"],
  "ゲーム": ["バトル・少年", "日常・ほのぼの", "ホラー・ダーク"],
  "映画・ジブリ": ["バトル・少年", "ギャグ・コメディ", "ホラー・ダーク"],
};

// ジャンルペアに合う方向性キーワード
const GENRE_PAIR_DIRECTIONS: Record<string, string[]> = {
  "バトル・少年×日常・ほのぼの": ["殺伐×無垢", "日常侵食", "ほのぼの混沌", "癒し×ホラー"],
  "バトル・少年×ギャグ・コメディ": ["シュールギャグ", "能力ミスマッチ", "ツッコミ不在", "天才vs天然"],
  "バトル・少年×恋愛・青春": ["恋愛パニック", "学園ドタバタ", "エモーショナル"],
  "ホラー・ダーク×日常・ほのぼの": ["殺伐×無垢", "癒し×ホラー", "ほのぼの混沌", "闇堕ちコメディ"],
  "ホラー・ダーク×ギャグ・コメディ": ["闇堕ちコメディ", "シュールギャグ", "推理×バカ"],
  "SF・メカ×ファンタジー・異世界": ["メカ×ファンタジー", "科学vs魔法", "タイムスリップ"],
  "SF・メカ×日常・ほのぼの": ["日常侵食", "文化衝突", "ほのぼの混沌"],
  "バトル・少年×バトル・少年": ["最強対決", "バトルロイヤル", "ライバル激突", "師弟クロス", "王道vs邪道"],
  "ゲーム×バトル・少年": ["ゲーム×アニメ", "能力ミスマッチ", "バトルロイヤル"],
  "映画・ジブリ×バトル・少年": ["ジブリ×バトル", "殺伐×無垢", "ほのぼの混沌"],
  "スポーツ×バトル・少年": ["スポーツ魂", "ライバル激突", "最強対決"],
  "少女・魔法少女×バトル・少年": ["少女×少年漫画", "能力ミスマッチ", "恋愛パニック"],
};

export interface Recommendation {
  work: Work;
  directions: string[];
  reason: string;
}

/** 選択した作品に対するおすすめクロスオーバー相手を返す */
export function getRecommendations(selectedWorkName: string, limit = 12): Recommendation[] {
  const selectedWork = WORKS.find((w) => w.name === selectedWorkName);
  if (!selectedWork) return [];

  const selectedGenre = selectedWork.genre;
  const contrastGenres = GENRE_CONTRAST[selectedGenre] || [];

  const recommendations: Recommendation[] = [];
  const usedWorks = new Set<string>([selectedWorkName]);

  // 1. 対比ジャンルから候補を収集
  for (const genre of contrastGenres) {
    const candidates = WORKS.filter((w) => w.genre === genre && !usedWorks.has(w.name));
    // 各ジャンルから代表的な作品を選ぶ（キャラ数が多い＝人気作品として）
    const sorted = candidates.sort((a, b) => b.characters.length - a.characters.length);
    const picks = sorted.slice(0, 3);

    for (const work of picks) {
      const pairKey1 = `${selectedGenre}×${genre}`;
      const pairKey2 = `${genre}×${selectedGenre}`;
      const directions = GENRE_PAIR_DIRECTIONS[pairKey1] || GENRE_PAIR_DIRECTIONS[pairKey2] || [];

      recommendations.push({
        work,
        directions: directions.length > 0 ? directions : ["シュールギャグ", "能力ミスマッチ"],
        reason: `${selectedGenre} × ${genre}`,
      });
      usedWorks.add(work.name);
    }
  }

  // 2. 同ジャンルからもおすすめ（ライバル系・対決系）
  const sameGenre = WORKS.filter((w) => w.genre === selectedGenre && !usedWorks.has(w.name));
  const sameSorted = sameGenre.sort((a, b) => b.characters.length - a.characters.length);
  const samePicks = sameSorted.slice(0, 2);

  const sameKey = `${selectedGenre}×${selectedGenre}`;
  const sameDirections = GENRE_PAIR_DIRECTIONS[sameKey] || ["バトルロイヤル", "ライバル激突"];

  for (const work of samePicks) {
    recommendations.push({
      work,
      directions: sameDirections,
      reason: `同ジャンル対決`,
    });
    usedWorks.add(work.name);
  }

  return recommendations.slice(0, limit);
}

/** 選択した作品のジャンルに基づくおすすめ方向性 */
export function getRecommendedDirections(selectedWorkName: string): string[] {
  const selectedWork = WORKS.find((w) => w.name === selectedWorkName);
  if (!selectedWork) return [];

  const selectedGenre = selectedWork.genre;
  const contrastGenres = GENRE_CONTRAST[selectedGenre] || [];
  const directionsSet = new Set<string>();

  for (const genre of contrastGenres) {
    const pairKey1 = `${selectedGenre}×${genre}`;
    const pairKey2 = `${genre}×${selectedGenre}`;
    const dirs = GENRE_PAIR_DIRECTIONS[pairKey1] || GENRE_PAIR_DIRECTIONS[pairKey2] || [];
    dirs.forEach((d) => directionsSet.add(d));
  }

  // 同ジャンルの方向性も
  const sameKey = `${selectedGenre}×${selectedGenre}`;
  const sameDirs = GENRE_PAIR_DIRECTIONS[sameKey] || [];
  sameDirs.forEach((d) => directionsSet.add(d));

  return Array.from(directionsSet);
}

export interface StoryTemplate {
  id: string;
  label: string;
  category: string;
  scenario: string;
}

export const STORY_CATEGORIES = [
  "全て",
  "日常・生活",
  "バトル・対決",
  "ギャグ・カオス",
  "感動・エモ",
  "季節・イベント",
] as const;

export const STORY_TEMPLATES: StoryTemplate[] = [
  // 日常・生活
  {
    id: "cooking-battle",
    label: "料理対決",
    category: "日常・生活",
    scenario: "キャラ同士が料理対決をする。それぞれの作品らしい料理を作るが、味の方向性が全然違って審査員が困惑する。オチは予想外の料理が優勝。",
  },
  {
    id: "weight-management",
    label: "体重管理あるある",
    category: "日常・生活",
    scenario: "体重測定や食事制限をテーマに。ストイックなキャラと食いしん坊キャラの対比。「あと100g…！」の攻防がギャグに。",
  },
  {
    id: "shopping",
    label: "買い物パニック",
    category: "日常・生活",
    scenario: "スーパーやショッピングモールでの買い物シーン。戦闘力の高いキャラがタイムセールに本気を出したり、日常品の使い方がわからなかったりするギャップ。",
  },
  {
    id: "lost-child",
    label: "迷子になった",
    category: "日常・生活",
    scenario: "方向音痴のキャラ or 異世界から来たキャラが迷子に。助けようとするが、助ける側も迷う。最終的にまったく違う場所にたどり着く。",
  },
  {
    id: "pet-trouble",
    label: "ペットが逃げた",
    category: "日常・生活",
    scenario: "大切なペットや使い魔が逃げ出して大騒動。捕まえようとするたびに状況が悪化。最後はペットの方から戻ってくるオチ。",
  },
  {
    id: "sleep-talk",
    label: "寝言・寝相バトル",
    category: "日常・生活",
    scenario: "合宿や旅行先で雑魚寝。キャラの寝言・寝相が作品の特徴全開で、起きてるキャラが振り回される。",
  },

  // バトル・対決
  {
    id: "training-accident",
    label: "修行中のハプニング",
    category: "バトル・対決",
    scenario: "特訓中に予想外のハプニングが発生。技が暴走したり、修行場所が壊れたり。師匠キャラのリアクションがオチ。",
  },
  {
    id: "power-comparison",
    label: "戦闘力比べ",
    category: "バトル・対決",
    scenario: "お互いの能力や戦闘力を比べ合う。数値化できないタイプ vs スカウター系の計測でカオスに。「戦闘力たったの5か…ゴミめ」的な展開。",
  },
  {
    id: "wrong-enemy",
    label: "敵を間違えた",
    category: "バトル・対決",
    scenario: "味方なのに敵だと勘違いして戦闘開始。互いの攻撃が噛み合わずシュールな展開に。気づいた時にはもう手遅れ。",
  },
  {
    id: "weapon-swap",
    label: "武器を交換してみた",
    category: "バトル・対決",
    scenario: "キャラ同士が武器やアイテムを交換。全く使いこなせなかったり、意外な相性だったり。元の武器の大切さに気づくオチ。",
  },

  // ギャグ・カオス
  {
    id: "sns-posting",
    label: "SNS投稿バトル",
    category: "ギャグ・カオス",
    scenario: "キャラたちがSNSに投稿する。バトル系キャラの物騒な投稿、日常系キャラの平和な投稿、ホラー系キャラの怖すぎる投稿が混在してカオスに。",
  },
  {
    id: "cosplay-swap",
    label: "コスプレ交換",
    category: "ギャグ・カオス",
    scenario: "お互いの衣装を着てみる。サイズが合わない、雰囲気が全然違う、意外と似合うなどのギャップ。",
  },
  {
    id: "karaoke",
    label: "カラオケ大会",
    category: "ギャグ・カオス",
    scenario: "カラオケで各キャラが得意の歌を披露。必殺技の掛け声を歌にしたり、叫び声で歌ったり。採点がカオスに。",
  },
  {
    id: "smartphone-trouble",
    label: "スマホが使えない",
    category: "ギャグ・カオス",
    scenario: "異世界・過去のキャラがスマホを初体験。写真を撮ろうとしてフラッシュで驚いたり、LINEのスタンプに過剰反応したり。",
  },
  {
    id: "ranking-war",
    label: "誰が最強か会議",
    category: "ギャグ・カオス",
    scenario: "「誰が一番強いか」で言い争い。基準がバラバラ（腕力？知力？人気？）で全く話がまとまらない。",
  },
  {
    id: "convenience-store",
    label: "コンビニバイト",
    category: "ギャグ・カオス",
    scenario: "キャラたちがコンビニでバイト。レジ打ちできない、品出しで能力を使う、お客さんに戦闘態勢で接客など。",
  },

  // 感動・エモ
  {
    id: "rainy-day",
    label: "雨の日の出会い",
    category: "感動・エモ",
    scenario: "雨の日に偶然出会う。傘がない者同士で雨宿り、普段見せない一面を見せ合う。静かで少し切ない空気感。",
  },
  {
    id: "farewell-gift",
    label: "別れのプレゼント",
    category: "感動・エモ",
    scenario: "お別れの前に贈り物を渡す。それぞれの世界観らしいプレゼントで、受け取った側が感動。再会を約束するオチ。",
  },
  {
    id: "protect-smile",
    label: "この笑顔を守りたい",
    category: "感動・エモ",
    scenario: "純粋なキャラの笑顔を見て、戦闘系キャラが「この笑顔は守らなければ」と決意する。でも守り方が物騒すぎてオチに。",
  },

  // 季節・イベント
  {
    id: "hanami",
    label: "お花見パニック",
    category: "季節・イベント",
    scenario: "お花見で場所取りから大騒動。食べ物の取り合い、酔っぱらい、花より団子キャラ vs 風流キャラの対比。",
  },
  {
    id: "summer-festival",
    label: "夏祭り",
    category: "季節・イベント",
    scenario: "夏祭りの屋台巡り。射的で本気を出しすぎる、金魚すくいを能力で攻略、浴衣の着方がおかしいなど。",
  },
  {
    id: "christmas",
    label: "クリスマス騒動",
    category: "季節・イベント",
    scenario: "クリスマスパーティーの準備。ケーキ作りが大惨事、プレゼント交換で予想外の品、サンタの正体をめぐる議論。",
  },
  {
    id: "new-year",
    label: "年末年始",
    category: "季節・イベント",
    scenario: "年越しそば、初詣、お年玉をテーマに。おせち料理を作るキャラ、お年玉の金額でマウント、初詣の願い事が物騒。",
  },
  {
    id: "sports-day",
    label: "運動会",
    category: "季節・イベント",
    scenario: "運動会で本気すぎるキャラたち。借り物競争で変なものを借りてくる、綱引きで地面が割れる、パン食い競争で異次元の食欲。",
  },
  {
    id: "school-trip",
    label: "修学旅行の夜",
    category: "季節・イベント",
    scenario: "修学旅行の就寝時間後。枕投げが能力バトルに発展、恋バナで予想外の告白、先生に見つかりそうになるスリル。",
  },
];

/** カテゴリでフィルタリング */
export function filterTemplates(category: string): StoryTemplate[] {
  if (category === "全て") return STORY_TEMPLATES;
  return STORY_TEMPLATES.filter((t) => t.category === category);
}

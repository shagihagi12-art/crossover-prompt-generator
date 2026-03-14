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
  {
    id: "sick-day",
    label: "風邪で寝込んだ",
    category: "日常・生活",
    scenario: "キャラが風邪をひいて寝込む。看病の仕方が作品ごとに違いすぎる（薬草？仙豆？気合い？）。看病がかえって悪化させるオチ。",
  },
  {
    id: "morning-routine",
    label: "朝の支度",
    category: "日常・生活",
    scenario: "朝起きてから出発まで。寝坊キャラ、完璧に準備するキャラ、そもそも寝ないキャラの対比。全員遅刻するオチ。",
  },
  {
    id: "train-commute",
    label: "満員電車",
    category: "日常・生活",
    scenario: "満員電車に乗り合わせる。異世界キャラが改札で詰まる、戦闘民族がつり革で懸垂、席取りがバトルに発展。",
  },
  {
    id: "cooking-beginner",
    label: "自炊に挑戦",
    category: "日常・生活",
    scenario: "普段料理しないキャラが自炊に挑戦。爆発、謎の黒い物体、包丁さばきだけプロ級。意外なキャラが料理上手で驚くオチ。",
  },
  {
    id: "cleaning-day",
    label: "部屋の片づけ",
    category: "日常・生活",
    scenario: "部屋の片づけをするが、掃除中に懐かしいものを見つけて脱線。能力で一瞬で片付けるキャラ vs 物を捨てられないキャラの対比。",
  },
  {
    id: "bath-time",
    label: "お風呂騒動",
    category: "日常・生活",
    scenario: "銭湯や温泉での入浴シーン。お湯の温度で揉める、入浴剤で水が変色して驚く、長風呂すぎるキャラがのぼせる。",
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
  {
    id: "janken",
    label: "じゃんけん大会",
    category: "バトル・対決",
    scenario: "じゃんけんで勝負。能力や読心術で攻略しようとするが、じゃんけんに能力は使えない。純粋な運で決着がつくオチ。",
  },
  {
    id: "eating-contest",
    label: "早食い勝負",
    category: "バトル・対決",
    scenario: "早食い対決。食いしん坊キャラが圧倒的に有利だが、品のあるキャラは食べ方を崩せない。意外なキャラが胃袋無限で優勝。",
  },
  {
    id: "arm-wrestling",
    label: "腕相撲トーナメント",
    category: "バトル・対決",
    scenario: "腕相撲で真剣勝負。パワー系キャラ同士でテーブルが粉砕、細身キャラが意外な怪力を発揮。会場が壊れて中止になるオチ。",
  },
  {
    id: "tag-game",
    label: "本気の鬼ごっこ",
    category: "バトル・対決",
    scenario: "鬼ごっこだが全員本気すぎて街が壊れる。瞬間移動で逃げる、壁を破壊して追いかける。「鬼ごっこってこういうゲームだっけ？」",
  },
  {
    id: "video-game-battle",
    label: "ゲーム対決",
    category: "バトル・対決",
    scenario: "テレビゲームで対戦。ゲーム内でも必殺技を出そうとする、コントローラーを握り潰す、負けて本気で怒り出すキャラが続出。",
  },
  {
    id: "escape-room",
    label: "脱出ゲーム",
    category: "バトル・対決",
    scenario: "脱出ゲームに挑戦。力づくでドアを壊そうとするキャラ、謎解きを一瞬で解くキャラ、そもそも入りたくないキャラの対比。壁をぶち抜いて脱出するオチ。",
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
  {
    id: "health-check",
    label: "健康診断",
    category: "ギャグ・カオス",
    scenario: "健康診断を受ける。「血圧が測定不能」「体脂肪率0%」「心拍数が人間じゃない」など異常値だらけ。医者がパニックになるオチ。",
  },
  {
    id: "group-photo",
    label: "集合写真",
    category: "ギャグ・カオス",
    scenario: "集合写真を撮ろうとするが、ポーズが決まらない、目が光る、背景で爆発が起きる。何枚撮ってもまともな写真にならないオチ。",
  },
  {
    id: "late-excuse",
    label: "遅刻の言い訳",
    category: "ギャグ・カオス",
    scenario: "全員遅刻して言い訳大会。「敵と戦ってた」「異世界に飛ばされた」「時間が止まってた」。一番しょうもない理由のキャラが本当だったオチ。",
  },
  {
    id: "haunted-house",
    label: "お化け屋敷",
    category: "ギャグ・カオス",
    scenario: "お化け屋敷に入る。ホラー系キャラが全く怖がらない、戦闘系キャラがお化けを殴る、お化け役のスタッフが逆に怖がるオチ。",
  },
  {
    id: "dream-world",
    label: "夢の中",
    category: "ギャグ・カオス",
    scenario: "キャラの夢の中が作品の世界観全開。バトル系は夢でも戦い、日常系は夢でもご飯。夢の中で他のキャラの夢に迷い込むオチ。",
  },
  {
    id: "job-interview",
    label: "面接ごっこ",
    category: "ギャグ・カオス",
    scenario: "バイトの面接で「特技は？」への回答がカオス。「人を倒すこと」「時を止めること」「呪いをかけること」。面接官が泣き出すオチ。",
  },
  {
    id: "line-group",
    label: "LINEグループ",
    category: "ギャグ・カオス",
    scenario: "キャラ同士のLINEグループチャット。既読無視する冷たいキャラ、スタンプ連打するキャラ、長文お気持ちを送るキャラ。グループが崩壊するオチ。",
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
  {
    id: "letter-writing",
    label: "手紙を書く",
    category: "感動・エモ",
    scenario: "大切な人への手紙を書く。不器用なキャラが何度も書き直す、戦闘系キャラの手紙が意外と泣ける内容。でも字が壊滅的に汚いオチ。",
  },
  {
    id: "stargazing",
    label: "星空を見上げて",
    category: "感動・エモ",
    scenario: "夜空を見上げながら語り合う。それぞれの世界での経験を話し、意外な共通点を見つける。静かで温かい空気感の中、流れ星に同じ願いをするオチ。",
  },
  {
    id: "shared-meal",
    label: "一緒にごはん",
    category: "感動・エモ",
    scenario: "一緒にご飯を食べるだけのシーン。食べ方が違う、好みが違う。でも「おいしいね」の一言で全員笑顔に。何気ない日常が一番幸せだと気づくオチ。",
  },
  {
    id: "last-day",
    label: "最後の一日",
    category: "感動・エモ",
    scenario: "クロスオーバーの世界が終わり、それぞれの世界に帰る最後の日。名残惜しいけど笑顔で別れる。「またどこかで会おう」のオチ。",
  },
  {
    id: "childhood-memory",
    label: "昔の自分に会ったら",
    category: "感動・エモ",
    scenario: "子供時代の自分と出会う。成長した自分を見て驚く幼少期キャラ。「こんな大人になれるんだ」と笑顔になる。でも当時の夢と今が全然違うオチ。",
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
  {
    id: "valentine",
    label: "バレンタインデー",
    category: "季節・イベント",
    scenario: "チョコを作る・渡すシーン。チョコが武器みたいに硬い、渡し方が物騒すぎる、義理チョコに本気を出しすぎるキャラの対比。",
  },
  {
    id: "halloween",
    label: "ハロウィン仮装",
    category: "季節・イベント",
    scenario: "ハロウィンの仮装大会。普段の格好がすでにコスプレっぽいキャラ、仮装したら逆に普通になるキャラ。本物のお化けが混じっていても気づかないオチ。",
  },
  {
    id: "beach-day",
    label: "海水浴",
    category: "季節・イベント",
    scenario: "ビーチで遊ぶ。泳げない戦闘民族、水着に着替えないで鎧のまま、スイカ割りで地面ごと割る。砂の城作りが要塞建設になるオチ。",
  },
  {
    id: "entrance-ceremony",
    label: "入学式",
    category: "季節・イベント",
    scenario: "新学期の自己紹介。「趣味は戦うことです」「前の学校は異世界でした」。先生が一番ヤバいやつだったオチ。",
  },
  {
    id: "rainy-season",
    label: "梅雨の過ごし方",
    category: "季節・イベント",
    scenario: "梅雨で外に出られない。インドア派が嬉しそう、アウトドア派が暴れだす。雨を止めようとして天候操作して大惨事になるオチ。",
  },
  {
    id: "test-exam",
    label: "期末テスト",
    category: "季節・イベント",
    scenario: "期末テスト勉強会。天才キャラが教えるが教え方が難解、バトル系は暗記を筋トレ感覚で攻略。テスト当日に全員寝坊するオチ。",
  },
];

/** カテゴリでフィルタリング */
export function filterTemplates(category: string): StoryTemplate[] {
  if (category === "全て") return STORY_TEMPLATES;
  return STORY_TEMPLATES.filter((t) => t.category === category);
}

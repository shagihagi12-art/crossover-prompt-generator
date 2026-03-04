export const DIRECTION_PRESETS = [
  {
    id: "satsubatsu-muku",
    label: "殺伐×無垢",
    description: "ハードな世界に純粋なキャラが迷い込む",
    example: "呪術廻戦 × ちいかわ",
  },
  {
    id: "surreal-gag",
    label: "シュールギャグ",
    description: "世界観のギャップで笑いを生む",
    example: "どうぶつの森 × キングダム",
  },
  {
    id: "ability-mismatch",
    label: "能力ミスマッチ",
    description: "場違いなスキルセットが異世界で発揮される",
    example: "ワンピース海軍 × サザエさんのカツオ",
  },
  {
    id: "nichijou-shinshoku",
    label: "日常侵食",
    description: "非日常が日常世界に浸透する",
    example: "エヴァンゲリオン × クレヨンしんちゃん",
  },
  {
    id: "dark-fantasy",
    label: "ダークファンタジー",
    description: "暗黒世界での異質な出会い",
    example: "ベルセルク × ポケモン",
  },
  {
    id: "honobono-konton",
    label: "ほのぼの混沌",
    description: "癒し系なのにカオスな展開",
    example: "すみっコぐらし × 進撃の巨人",
  },
  {
    id: "emotional",
    label: "エモーショナル",
    description: "感動・切ない系の出会い",
    example: "CLANNAD × 鬼滅の刃",
  },
  {
    id: "battle-royale",
    label: "バトルロイヤル",
    description: "異なる作品のキャラが激突",
    example: "ドラゴンボール × ナルト",
  },
] as const;

export type DirectionPresetId = (typeof DIRECTION_PRESETS)[number]["id"];

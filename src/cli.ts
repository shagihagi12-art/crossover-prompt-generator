#!/usr/bin/env tsx
import { Command } from "commander";
import { buildFullPrompt } from "./lib/generator";
import { DIRECTION_PRESETS } from "./lib/presets";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const program = new Command();

program
  .name("crossover")
  .description("異世界クロスオーバー プロンプト生成ツール")
  .version("0.1.0");

program
  .command("generate", { isDefault: true })
  .description("クロスオーバー画像プロンプトを生成")
  .requiredOption("-d, --direction <direction>", "方向性（例: シュールギャグ）")
  .requiredOption("-w, --world <world>", "作品A / 世界観（例: どうぶつの森）")
  .requiredOption("-c, --character <character>", "作品B / キャラ（例: キングダムの王騎将軍）")
  .option("-t, --detail <detail>", "具体的な要望・イメージ")
  .option("-o, --output <dir>", "出力ディレクトリ", "output")
  .option("--no-save", "ファイルに保存しない")
  .action((options) => {
    console.log("\n🎨 クロスオーバープロンプトを生成中...\n");
    console.log(`  方向性:   ${options.direction}`);
    console.log(`  世界観:   ${options.world}`);
    console.log(`  キャラ:   ${options.character}`);
    if (options.detail) console.log(`  要望:     ${options.detail}`);
    console.log("");

    const prompt = buildFullPrompt({
      direction: options.direction,
      world: options.world,
      character: options.character,
      detail: options.detail,
    });

    console.log("━━━ 生成されたプロンプト ━━━\n");
    console.log(prompt);
    console.log("\n━━━━━━━━━━━━━━━━━━━\n");
    console.log("👆 上記のプロンプトをコピーして、お好きなAI（ChatGPT / Gemini / Claude）に貼り付けてください。\n");

    // Save to file
    if (options.save !== false) {
      const dir = options.output;
      mkdirSync(dir, { recursive: true });
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filepath = join(dir, `prompt-${timestamp}.txt`);
      writeFileSync(filepath, prompt, "utf-8");
      console.log(`💾 保存先: ${filepath}\n`);
    }
  });

program
  .command("presets")
  .description("方向性プリセット一覧を表示")
  .action(() => {
    console.log("\n📋 方向性プリセット一覧:\n");
    for (const p of DIRECTION_PRESETS) {
      console.log(`  ${p.label}`);
      console.log(`    ${p.description}`);
      console.log(`    例: ${p.example}`);
      console.log("");
    }
  });

program.parse();

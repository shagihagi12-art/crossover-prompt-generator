import { NextRequest, NextResponse } from "next/server";
import { buildFullPrompt } from "@/lib/generator";
import { getCharactersByWorkName } from "@/data/characters";
import { findWorkByName } from "@/lib/works";
import type { CharacterProfile } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { direction, world, character, detail } = body as {
      direction: string;
      world: string;
      character: string;
      detail?: string;
    };

    if (!direction || !world || !character) {
      return NextResponse.json(
        { error: "direction, world, character は必須です" },
        { status: 400 }
      );
    }

    // キャラプロフィールを解決
    const profiles: CharacterProfile[] = [];

    // 作品A（世界観）のキャラプロフィールを収集
    const workA = findWorkByName(world);
    if (workA?.id) {
      profiles.push(...getCharactersByWorkName(world));
    }

    // 作品B（キャラ）のキャラプロフィールを収集
    const workB = findWorkByName(character);
    if (workB?.id) {
      profiles.push(...getCharactersByWorkName(character));
    }

    const prompt = buildFullPrompt({
      direction,
      world,
      character,
      detail,
      characterProfiles: profiles.length > 0 ? profiles : undefined,
    });
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error ? error.message : "プロンプト生成に失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

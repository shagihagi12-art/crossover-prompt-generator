import { NextRequest, NextResponse } from "next/server";
import { buildFullPrompt } from "@/lib/generator";

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

    const prompt = buildFullPrompt({ direction, world, character, detail });
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error ? error.message : "プロンプト生成に失敗しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

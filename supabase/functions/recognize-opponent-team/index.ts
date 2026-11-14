import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "ログインが必要です" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return json({ error: "ログインセッションを確認できません" }, 401);

    const { image_data_url } = await req.json();
    if (typeof image_data_url !== "string" || !image_data_url.startsWith("data:image/")) {
      return json({ error: "画像データが正しくありません" }, 400);
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) return json({ error: "サーバーにOPENAI_API_KEYが未設定です" }, 500);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openAiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "あなたはポケモン対戦画面の画像認識器です。画像右端の赤/ピンク色の相手パーティ欄だけを上から順に見て、6匹のポケモン名を日本語で特定してください。左側は自分のパーティなので絶対に出力しないでください。中央の説明やアイコンも無視してください。フォーム違いが明確ならメガシンカ等を含めてください。確信できない枠は空文字にしてください。JSONのみで {\"pokemon\":[\"名前1\",\"名前2\",\"名前3\",\"名前4\",\"名前5\",\"名前6\"]} を返してください。"
          },
          { role: "user", content: [
            { type: "text", text: "この選出画面の右側にいる相手ポケモン6匹を上から順に判定してください。" },
            { type: "image_url", image_url: { url: image_data_url, detail: "high" } }
          ]}
        ]
      })
    });

    const payload = await response.json();
    if (!response.ok) return json({ error: payload?.error?.message || "画像認識APIでエラーが発生しました" }, 502);
    const raw = payload?.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    const pokemon = Array.isArray(parsed.pokemon) ? parsed.pokemon.slice(0, 6).map((v: unknown) => typeof v === "string" ? v.trim() : "") : [];
    while (pokemon.length < 6) pokemon.push("");
    return json({ pokemon });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "予期しないエラー" }, 500);
  }
});

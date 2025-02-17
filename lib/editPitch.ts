import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function editPitch(
  pitchText: string,
  improvementType: string = "フォーマル"
) {
  const prompt = `以下の営業メールを${improvementType}な表現に改善してください。
  
  - より洗練された表現にする  
  - 読みやすく、説得力のある文章にする  
  - 必要に応じて簡潔にまとめる  

  なお、基本的な構成（挨拶、提案内容、メリット、アクション）は維持してください。

  ---  
  【元の営業メール】  
  ${pitchText}  
  ---  

  【改善後の営業メール】`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 250,
  });

  console.log("Pitch edited:", response.choices[0]?.message?.content);

  return (
    response.choices[0]?.message?.content || "営業メールの改善に失敗しました。"
  );
}

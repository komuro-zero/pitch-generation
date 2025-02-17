import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePitch(
  companySummary: string,
  userService: string
) {
  console.log("Generating pitch");
  const prompt = `以下の会社情報を元に、営業メールを作成してください。
  
  - 会社概要: ${companySummary}
  - 提案する商品・サービス: ${userService}
  
  この会社に対し、上記の商品・サービスを提案する形で、簡潔かつ説得力のある営業メールを作成してください。
  相手にとってのメリットを明確に伝え、興味を引くようにしてください。
  また、フォーマルでありながら、親しみやすい文体で作成してください。
  
  営業メールの例:
  ---
  件名: [会社名]様向けのご提案 | [提案するサービス名]
  
  [会社名]ご担当者様

  初めまして、[自社名]の[担当者名]と申します。
  
  貴社の事業内容を拝見し、[提案するサービス名]が貴社のビジネスに貢献できるのではないかと考え、ご連絡いたしました。

  【貴社の課題に対する解決策】
  - [サービスのメリット1]
  - [サービスのメリット2]
  
  ご興味をお持ちいただけましたら、ぜひ一度お打ち合わせの機会をいただければ幸いです。
  
  ご都合の良い日時をご共有いただけますでしょうか？
  何卒よろしくお願いいたします。

  [自社名]  
  [担当者名]  
  [メールアドレス]  
  [電話番号]  
  ---`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 250,
  });
  console.log("Pitch generated:", response.choices[0]?.message?.content);

  return (
    response.choices[0]?.message?.content || "営業メールの生成に失敗しました。"
  );
}

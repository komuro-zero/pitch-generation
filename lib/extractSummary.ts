import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function extractSummary(
  selectedData: { title: string; content?: string }[]
) {
  try {
    console.log("Extracting summary...");
    if (selectedData.length === 0) return "No company data available.";
    console.log("Selected data:", selectedData);

    // Combine all selected information for the same company
    const combinedContent = selectedData
      .map((res) => res.content || "情報なし")
      .join("\n\n");

    const companyName = selectedData[0]?.title || "会社名不明"; // Use the first title as the company name

    const prompt = `今から会社「${companyName}」のウェブサイトに記載されている情報を送ります。この情報を元に、この会社がどのような商品やサービスを提供しているのかを教えてください。
        
        - ホームページに記載されている内容のみから答えてください。
        - なるべく具体的に教えてください。
        - 具体的なサービス名や商品名がわからない場合は、業界や事業内容を教えてください。
        - 中には求人サイトに掲載されている情報も含まれていますが、求人情報は考慮せず、該当の会社のサービス・製品情報のみを要約してください。
      
        以下がウェブサイトの情報です:
        ${combinedContent}`;
    console.log("Prompt:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 250,
    });

    console.log("Summary generated:", response.choices[0]?.message?.content);

    return response.choices[0]?.message?.content || "Could not generate a summary.";
  } catch (error) {
    console.error("Error in extractSummary:", error);
    return "Error generating summary.";
  }
}

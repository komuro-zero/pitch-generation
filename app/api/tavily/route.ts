import { NextResponse } from "next/server";
import { tavily, TavilySearchOptions } from "@tavily/core";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyName = searchParams.get("companyName") || "Company";

  // Ensure TAVILY_API_KEY is set
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "TAVILY_API_KEY not set in environment variables." },
      { status: 500 }
    );
  }

  // Initialize Tavily API client
  const tavilyInstance = tavily({ apiKey });
  const options: TavilySearchOptions = {
    searchDepth: "advanced",
    topic: "general",
    maxResults: 5,
    includeImages: true,
    includeRawContent: true,
  };

  try {
    // Use Tavily SDK to fetch search results
    const data = await tavilyInstance.search(companyName, options);
    console.log(data);

    return NextResponse.json({ results: data.results });
  } catch (error) {
    console.error("Error fetching from Tavily:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}

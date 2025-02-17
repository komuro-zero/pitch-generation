import { NextResponse } from "next/server";
import { extractSummary } from "@/lib/extractSummary";
import { generatePitch } from "@/lib/generatePitch";
import { editPitch } from "@/lib/editPitch";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyData = JSON.parse(searchParams.get("companyData") || "[]");
  const userService = searchParams.get("userService") || "";
  const improvementType = searchParams.get("improvementType") || "フォーマル";
  console.log("companyData:", companyData);

  if (!companyData.length || !userService) {
    return NextResponse.json(
      { error: "Missing required parameters." },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        console.log("Starting generation process...");

        // Step 1: Summarizing company information
        controller.enqueue(
          encoder.encode(
            `event: progress\ndata: Summarizing company information...\n\n`
          )
        );
        console.log("Extracting summary...");
        const summary = await extractSummary(companyData);
        console.log("Summary:", summary);
        controller.enqueue(
          encoder.encode(`event: summary\ndata: ${JSON.stringify(summary)}\n\n`)
        );
        console.log("Summary sent to client.");

        // Step 2: Generating sales pitch
        controller.enqueue(
          encoder.encode(`event: progress\ndata: Generating sales pitch...\n\n`)
        );
        const pitch = await generatePitch(summary, userService);
        console.log("Pitch:", pitch);
        controller.enqueue(
          encoder.encode(`event: pitch\ndata: ${JSON.stringify(pitch)}\n\n`)
        );

        // Step 3: Editing and improving the pitch
        controller.enqueue(
          encoder.encode(
            `event: progress\ndata: Editing pitch for better impact...\n\n`
          )
        );
        const refinedPitch = await editPitch(pitch, improvementType);
        console.log("Refined Pitch:", refinedPitch);
        controller.enqueue(
          encoder.encode(
            `event: final\ndata: ${JSON.stringify(refinedPitch)}\n\n`
          )
        );

        // Close stream
        controller.enqueue(
          encoder.encode(
            `event: complete\ndata: Process finished successfully\n\n`
          )
        );
        controller.close();
      } catch (error) {
        console.error("Error:", error);
        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify(error.message)}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCompanyContext } from "@/context/CompanyContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function GeneratePage() {
  const { selectedCompanies } = useCompanyContext();
  const router = useRouter();
  const [userService, setUserService] = useState("");
  const [improvementType, setImprovementType] = useState("フォーマル");
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState("");
  const [pitch, setPitch] = useState("");
  const [finalPitch, setFinalPitch] = useState("");
  const [loading, setLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (finalPitch) {
      outputRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [finalPitch]);

  const handleGenerate = async () => {
    console.log("Generating pitch...");
    setStatus("Starting...");
    setSummary("");
    setPitch("");
    setFinalPitch("");
    setLoading(true);
    console.log("Selected companies:", selectedCompanies);

    const eventSource = new EventSource(
      `/api/generatePitch?companyData=${encodeURIComponent(
        JSON.stringify(selectedCompanies)
      )}&userService=${encodeURIComponent(
        userService
      )}&improvementType=${encodeURIComponent(improvementType)}`
    );

    eventSource.addEventListener("progress", (event) => {
      setStatus(event.data);
    });

    eventSource.addEventListener("summary", (event) => {
      setSummary(JSON.parse(event.data));
    });

    eventSource.addEventListener("pitch", (event) => {
      setPitch(JSON.parse(event.data));
    });

    eventSource.addEventListener("final", (event) => {
      setFinalPitch(JSON.parse(event.data));
      setLoading(false);
    });

    eventSource.addEventListener("complete", () => {
      setStatus("Process completed successfully.");
      eventSource.close();
    });

    eventSource.addEventListener("error", (event) => {
      console.error("Error received:", event);
      setStatus("Error occurred while generating pitch.");
      eventSource.close();
      setLoading(false);
    });

    return () => {
      eventSource.close();
    };
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <Button variant="outline" className="mb-4" onClick={() => router.back()}>
        Back
      </Button>

      <h1 className="text-2xl font-bold mb-4">Generate Sales Pitch</h1>

      <Textarea
        placeholder="Selected company data"
        value={JSON.stringify(selectedCompanies, null, 2)}
        readOnly
        className="h-48" // height of 12rem (48 * 0.25rem)
      />

      <Input
        className="mt-2"
        placeholder="Enter your service/product"
        value={userService}
        onChange={(e) => setUserService(e.target.value)}
      />

      <Select
        value={improvementType}
        onValueChange={(value: string) => setImprovementType(value)}
      >
        <SelectTrigger className="w-[180px] mt-2">
          <SelectValue placeholder="Select improvement type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="フォーマル">フォーマル</SelectItem>
          <SelectItem value="説得力のある">説得力のある</SelectItem>
          <SelectItem value="カジュアル">カジュアル</SelectItem>
        </SelectContent>
      </Select>

      <Button className="mt-4" onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Pitch"}
      </Button>

      {status && <p className="mt-4 text-gray-600">Status: {status}</p>}

      <div ref={outputRef}>
        {summary && <Textarea className="mt-4" value={summary} readOnly />}
        {pitch && <Textarea className="mt-4" value={pitch} readOnly />}
        {finalPitch && (
          <Textarea
            className="mt-4 text-green-600"
            value={finalPitch}
            readOnly
          />
        )}
      </div>
    </div>
  );
}

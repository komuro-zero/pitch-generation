"use client";

import { useState, useEffect, useRef } from "react";
import { useCompanyContext } from "@/context/CompanyContext"; // ✅ Use context instead of URL query
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function GeneratePage() {
  const { selectedCompanies } = useCompanyContext(); // Get selected companies from context
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
    setStatus("Starting...");
    setSummary("");
    setPitch("");
    setFinalPitch("");
    setLoading(true);

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
      console.error("Error received:", event.data);
      setStatus("Error occurred while generating pitch.");
      eventSource.close();
      setLoading(false);
    });

    return () => {
      eventSource.close(); // ✅ Clean up event source on unmount
    };
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Sales Pitch</h1>

      <Textarea
        placeholder="Selected company data"
        value={JSON.stringify(selectedCompanies, null, 2)}
        readOnly
      />
      <Input
        className="mt-2"
        placeholder="Enter your service/product"
        value={userService}
        onChange={(e) => setUserService(e.target.value)}
      />
      <Select
        className="mt-2"
        value={improvementType}
        onChange={(e) => setImprovementType(e.target.value)}
      >
        <option value="フォーマル">フォーマル</option>
        <option value="説得力のある">説得力のある</option>
        <option value="カジュアル">カジュアル</option>
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

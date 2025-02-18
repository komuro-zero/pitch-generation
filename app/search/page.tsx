"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanyContext } from "@/context/CompanyContext";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function SearchPage() {
  const [companyName, setCompanyName] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSelectedCompanies } = useCompanyContext();

  const handleSearch = async () => {
    setLoading(true);
    try {
      console.log("Fetching data...");
      const res = await fetch(
        `/api/tavily?companyName=${encodeURIComponent(companyName)}`
      );
      if (!res.ok) throw new Error("Error fetching data");
      const data = await res.json();
      console.log(data.results);
      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const toggleSelection = (index: number) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  const handleNext = () => {
    if (selected.size === 0) return;
    const selectedCompanies = Array.from(selected).map(
      (index) => results[index]
    );
    setSelectedCompanies(selectedCompanies);
    router.push("/generate");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Company Search</h1>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading || !companyName}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <Card
              className={`relative p-4 border transition-colors ${
                selected.has(index) ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <div className="absolute top-3 left-3">
                <Checkbox
                  checked={selected.has(index)}
                  onCheckedChange={() => toggleSelection(index)}
                />
              </div>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold text-blue-600 hover:underline block ml-8"
              >
                {result.title}
              </a>
              <p className="line-clamp-1">{result.content}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {selected.size > 0 && (
        <div className="mt-6 flex justify-end">
          <Button
            variant="secondary"
            className="hover:bg-gray-500"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

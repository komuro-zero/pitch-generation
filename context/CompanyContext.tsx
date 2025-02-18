"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Company = {
  title: string;
  content?: string;
  url?: string;
};

type CompanyContextType = {
  selectedCompanies: Company[];
  setSelectedCompanies: (companies: Company[]) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedCompanies");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "selectedCompanies",
      JSON.stringify(selectedCompanies)
    );
  }, [selectedCompanies]);

  return (
    <CompanyContext.Provider
      value={{ selectedCompanies, setSelectedCompanies }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

// Hook for consuming context
export function useCompanyContext() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompanyContext must be used within a CompanyProvider");
  }
  return context;
}

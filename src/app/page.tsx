"use client";

import { useState, useEffect } from "react";
import frotaData from "@/data/frota.json";
import { FileText, X } from "lucide-react";

type FrotaFile = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
};

export default function Home() {
  const [placaInput, setPlacaInput] = useState("");
  const [searchedPlaca, setSearchedPlaca] = useState("");
  const [results, setResults] = useState<FrotaFile[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveRecentSearch = (placa: string) => {
    // Não salvar "2025" ou "2026" como busca recente, já que eles terão botões fixos
    if (placa === "2025" || placa === "2026") return;

    setRecentSearches((prev) => {
      const filtered = prev.filter((p) => p !== placa);
      const newRecents = [placa, ...filtered].slice(0, 4);
      localStorage.setItem("recentSearches", JSON.stringify(newRecents));
      return newRecents;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Converter para maiúsculo e remover espaços
    const val = e.target.value.toUpperCase().replace(/\s/g, "");
    setPlacaInput(val);
  };

  const handleSearch = (placaToSearch: string) => {
    if (!placaToSearch) return;
    setSearchedPlaca(placaToSearch);
    
    // Obter resultados usando assertion para permitir chave string dinâmica
    const frota = frotaData as Record<string, FrotaFile[]>;
    
    const matchedFiles: FrotaFile[] = [];
    Object.entries(frota).forEach(([key, files]) => {
      // Usando includes para permitir busca parcial (ex: iniciais da placa)
      if (key.includes(placaToSearch)) {
        matchedFiles.push(...files);
      } else {
        // Se a placa não bate, verifica se bate com algum ano ou texto no subtítulo ou título (ex: "2025")
        const matchingFiles = files.filter(f => f.subtitle.includes(placaToSearch) || f.title.includes(placaToSearch));
        matchedFiles.push(...matchingFiles);
      }
    });

    setResults(matchedFiles);

    if (matchedFiles.length > 0) {
      saveRecentSearch(placaToSearch);
    }
  };

  const handleClear = () => {
    setPlacaInput("");
    setSearchedPlaca("");
    setResults([]);
  };

  const handleClearAll = () => {
    setPlacaInput("");
    setSearchedPlaca("");
    setResults([]);
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleQuickAccess = (placa: string) => {
    if (placaInput === placa && searchedPlaca === placa) {
      handleClear();
    } else {
      setPlacaInput(placa);
      handleSearch(placa);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Card de Busca */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[#1E2A40] text-2xl font-bold">Frota</h2>
          <div className="flex gap-2">
            {["2025", "2026"].map((ano) => {
              const isActive = placaInput === ano;
              return (
                <button
                  key={ano}
                  onClick={() => handleQuickAccess(ano)}
                  className={`px-4 py-1.5 rounded-full text-base font-bold transition-colors ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {ano}
                </button>
              );
            })}
          </div>
        </div>
        
        <input
          type="text"
          value={placaInput}
          onChange={handleInputChange}
          placeholder="Digite a placa ou o ano..."
          className="w-full bg-gray-200 border-none outline-none rounded-lg px-4 py-3 text-xl text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-[#1E2A40]"
        />

        {(recentSearches.length > 0 || placaInput || searchedPlaca) && (
          <div className="flex flex-wrap gap-2 items-center w-full">
            {recentSearches.map((placa) => {
              const isActive = placaInput === placa;
              return (
                <button
                  key={placa}
                  onClick={() => handleQuickAccess(placa)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1E2A40] text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  {placa}
                </button>
              );
            })}

            <button
              onClick={handleClearAll}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-colors ml-auto"
              title="Limpar Tudo"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        )}

        <button
          onClick={() => handleSearch(placaInput)}
          className="w-full bg-[#1E2A40] hover:bg-[#151f30] text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2"
        >
          BUSCAR
        </button>
      </div>

      {/* Resultados */}
      {searchedPlaca && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-gray-700 mt-2">
            Resultados da Frota ({searchedPlaca})
          </h3>

          {results.length === 0 ? (
            <p className="text-gray-500">Nenhum documento encontrado para esta busca.</p>
          ) : (
            results.map((file) => {
              return (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  {/* Ícone */}
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50">
                    <FileText className="text-red-600 w-8 h-8" />
                  </div>

                  {/* Textos */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-[#1E2A40] font-bold text-base truncate">
                      {file.title}
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-tight">
                      {file.subtitle}
                    </p>
                  </div>
                </a>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

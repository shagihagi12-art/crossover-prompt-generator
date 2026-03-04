"use client";

import { useState, useEffect } from "react";

interface HistoryEntry {
  id: string;
  timestamp: string;
  input: {
    direction: string;
    world: string;
    character: string;
    detail?: string;
  };
  prompt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("crossover-history");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const deleteEntry = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem("crossover-history", JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem("crossover-history");
  };

  const copyText = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">生成履歴</h1>
        {history.length > 0 && (
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900 rounded-lg"
          >
            全て削除
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <p className="text-gray-500">
            履歴はまだありません。Generator
            ページでプロンプトを生成し、「履歴に保存」してください。
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
              >
                {/* Header - always visible */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : entry.id)
                  }
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-100 truncate">
                      {entry.input.world} × {entry.input.character}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-blue-400">
                        {entry.input.direction}
                      </span>
                      <span className="text-xs text-gray-600">
                        {new Date(entry.timestamp).toLocaleString("ja-JP")}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-500 ml-2">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
                    {/* Input details */}
                    {entry.input.detail && (
                      <div>
                        <span className="text-xs text-gray-400">要望</span>
                        <p className="text-xs text-gray-300 mt-1">
                          {entry.input.detail}
                        </p>
                      </div>
                    )}

                    {/* Full Prompt */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">
                          AIに渡すプロンプト
                        </span>
                        <button
                          onClick={() =>
                            copyText(entry.prompt, `prompt-${entry.id}`)
                          }
                          className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                            copiedField === `prompt-${entry.id}`
                              ? "bg-green-600 text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {copiedField === `prompt-${entry.id}`
                            ? "Copied!"
                            : "コピー"}
                        </button>
                      </div>
                      <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-gray-800 rounded p-3 max-h-60 overflow-y-auto leading-relaxed">
                        {entry.prompt}
                      </pre>
                    </div>

                    {/* Delete */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="px-3 py-1 text-xs text-red-400 hover:text-red-300 border border-red-900 rounded"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

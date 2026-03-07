"use client";

import { useState, useEffect } from "react";

interface HistoryEntry {
  id: string;
  timestamp: string;
  mode?: "duo" | "multi";
  input: {
    direction: string;
    world?: string;
    character?: string;
    detail?: string;
  };
  works?: Array<{
    workName: string;
    characters: string[];
    role: string;
  }>;
  prompt: string;
}

function getEntryTitle(entry: HistoryEntry): string {
  if (entry.mode === "multi" && entry.works && entry.works.length > 0) {
    return entry.works.map((w) => w.workName).join(" × ");
  }
  if (entry.input.world && entry.input.character) {
    return `${entry.input.world} × ${entry.input.character}`;
  }
  return entry.input.direction || "不明";
}

function getEntrySubtitle(entry: HistoryEntry): string {
  if (entry.mode === "multi" && entry.works) {
    return `${entry.works.length}作品マルチ`;
  }
  return "";
}

export default function HistoryPage() {
  const [tab, setTab] = useState<"history" | "favorites">("history");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<HistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem("crossover-history");
    if (storedHistory) {
      try { setHistory(JSON.parse(storedHistory)); } catch { /* ignore */ }
    }
    const storedFavorites = localStorage.getItem("crossover-favorites");
    if (storedFavorites) {
      try { setFavorites(JSON.parse(storedFavorites)); } catch { /* ignore */ }
    }
  }, []);

  const entries = tab === "history" ? history : favorites;
  const storageKey = tab === "history" ? "crossover-history" : "crossover-favorites";
  const setEntries = tab === "history" ? setHistory : setFavorites;

  const deleteEntry = (id: string) => {
    const updated = entries.filter((h) => h.id !== id);
    setEntries(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const clearAll = () => {
    setEntries([]);
    localStorage.removeItem(storageKey);
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

  // Move from history to favorites
  const moveToFavorites = (entry: HistoryEntry) => {
    const currentFavorites = JSON.parse(localStorage.getItem("crossover-favorites") || "[]");
    if (currentFavorites.some((f: HistoryEntry) => f.id === entry.id)) {
      setCopiedField(`already-fav-${entry.id}`);
      setTimeout(() => setCopiedField(null), 2000);
      return;
    }
    currentFavorites.unshift(entry);
    if (currentFavorites.length > 50) currentFavorites.length = 50;
    localStorage.setItem("crossover-favorites", JSON.stringify(currentFavorites));
    setFavorites(currentFavorites);
    setCopiedField(`fav-${entry.id}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          {tab === "history" ? "生成履歴" : "⭐ お気に入り"}
        </h1>
        {entries.length > 0 && (
          <button
            onClick={clearAll}
            className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 border border-red-900 rounded-lg"
          >
            全て削除
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
        <button
          onClick={() => { setTab("history"); setExpandedId(null); }}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "history"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          履歴 ({history.length})
        </button>
        <button
          onClick={() => { setTab("favorites"); setExpandedId(null); }}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "favorites"
              ? "bg-yellow-600 text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          ⭐ お気に入り ({favorites.length})
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <p className="text-gray-500">
            {tab === "history"
              ? "履歴はまだありません。Generator ページでプロンプトを生成し、「履歴に保存」してください。"
              : "お気に入りはまだありません。Generator ページで「☆ お気に入り」ボタンを押して保存してください。"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const isExpanded = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : entry.id)
                  }
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-100 truncate">
                      {getEntryTitle(entry)}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      {getEntrySubtitle(entry) && (
                        <span className="text-xs text-purple-400">
                          {getEntrySubtitle(entry)}
                        </span>
                      )}
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

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2">
                      {tab === "history" && (
                        <button
                          onClick={() => moveToFavorites(entry)}
                          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            copiedField === `fav-${entry.id}`
                              ? "text-yellow-300 border border-yellow-600"
                              : copiedField === `already-fav-${entry.id}`
                              ? "text-gray-500 border border-gray-700"
                              : "text-yellow-400 hover:text-yellow-300 border border-yellow-900"
                          }`}
                        >
                          {copiedField === `fav-${entry.id}`
                            ? "⭐ 追加しました!"
                            : copiedField === `already-fav-${entry.id}`
                            ? "登録済み"
                            : "☆ お気に入りに追加"}
                        </button>
                      )}
                      {tab === "favorites" && <div />}
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

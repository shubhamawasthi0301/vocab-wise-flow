
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "user-saved-vocab-list";

export function useSavedVocab() {
  const [savedVocab, setSavedVocab] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedVocab(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedVocab));
  }, [savedVocab]);

  // Add words (accepts arrays)
  const addWords = useCallback((words: string[]) => {
    setSavedVocab((prev) => {
      const trimmedWords = words.map(w => w.trim().toLowerCase()).filter(Boolean);
      const uniqueNew = trimmedWords.filter(w => !prev.includes(w));
      return [...prev, ...uniqueNew];
    });
  }, []);

  const removeWord = useCallback((word: string) => {
    setSavedVocab((prev) => prev.filter(w => w !== word));
  }, []);

  const clearAll = useCallback(() => {
    setSavedVocab([]);
  }, []);

  return {
    savedVocab,
    addWords,
    removeWord,
    clearAll
  };
}


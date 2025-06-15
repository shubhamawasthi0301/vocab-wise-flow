
export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  category: string;
  example: string;
  synonyms: string[];
  imageUrl?: string;
}

export interface WordPerformance {
  wordId: string;
  attempts: number;
  correctAttempts: number;
  difficultyScore: number; // 0-1, higher means more difficult for user
  accuracy: number; // 0-1
  lastSeen: number; // timestamp
  category: string;
}

export interface CategoryInsight {
  name: string;
  accuracy: number;
  wordCount: number;
}

export interface PerformanceInsights {
  strongCategories: CategoryInsight[];
  weakCategories: CategoryInsight[];
  recommendations: string[];
}

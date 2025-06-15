import { useState, useEffect, useCallback, useMemo } from 'react';
import { VocabularyWord, WordPerformance, PerformanceInsights } from '@/types/vocabulary';

interface SessionStats {
  answered: number;
  easy: number;
  medium: number;
  hard: number;
}

export function useSpacedRepetition(vocabularyWords: VocabularyWord[]) {
  const [wordPerformances, setWordPerformances] = useState<Record<string, WordPerformance>>({});
  const [currentCard, setCurrentCard] = useState<VocabularyWord | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    answered: 0,
    easy: 0,
    medium: 0,
    hard: 0
  });
  const [sessionWords, setSessionWords] = useState<string[]>([]);
  const [totalWordsStudied, setTotalWordsStudied] = useState(0);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vocabulary-performance');
    if (saved) {
      const data = JSON.parse(saved);
      setWordPerformances(data.performances || {});
      setTotalWordsStudied(data.totalWordsStudied || 0);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('vocabulary-performance', JSON.stringify({
      performances: wordPerformances,
      totalWordsStudied
    }));
  }, [wordPerformances, totalWordsStudied]);

  // Calculate word priority based on performance
  const calculateWordPriority = useCallback((word: VocabularyWord): number => {
    const performance = wordPerformances[word.id];
    
    if (!performance) return 100; // New words get highest priority
    
    const now = Date.now();
    const timeSinceLastSeen = now - performance.lastSeen;
    const daysSince = timeSinceLastSeen / (1000 * 60 * 60 * 24);
    
    // Higher priority for harder words and words not seen recently
    let priority = 50;
    
    // Difficulty weight (higher for harder words)
    priority += (performance.difficultyScore * 30);
    
    // Time weight (higher for words not seen recently)
    priority += Math.min(daysSince * 10, 50);
    
    // Accuracy weight (higher for lower accuracy)
    priority += ((1 - performance.accuracy) * 20);
    
    return Math.min(priority, 100);
  }, [wordPerformances]);

  // Get next card using spaced repetition algorithm
  const getNextCard = useCallback(() => {
    if (sessionStats.answered >= 20) {
      setCurrentCard(null);
      return null;
    }

    // Calculate priorities for all words
    const wordPriorities = vocabularyWords.map(word => ({
      word,
      priority: calculateWordPriority(word)
    }));

    // Sort by priority (highest first) and filter out recently shown words
    const availableWords = wordPriorities
      .filter(wp => !sessionWords.slice(-5).includes(wp.word.id)) // Don't repeat last 5 words
      .sort((a, b) => b.priority - a.priority);

    if (availableWords.length === 0) {
      setCurrentCard(null);
      return null;
    }

    // Select from top 3 highest priority words (add some randomness)
    const topWords = availableWords.slice(0, 3);
    const selectedWord = topWords[Math.floor(Math.random() * topWords.length)].word;
    
    setCurrentCard(selectedWord);
    setSessionWords(prev => [...prev, selectedWord.id]);
    
    return selectedWord;
  }, [vocabularyWords, sessionStats.answered, sessionWords, calculateWordPriority]);

  // Initialize first card
  useEffect(() => {
    if (!currentCard && vocabularyWords.length > 0 && sessionStats.answered < 20) {
      getNextCard();
    }
  }, [vocabularyWords, currentCard, sessionStats.answered, getNextCard]);

  // Reset session and fetch new card whenever the word list changes.
  useEffect(() => {
    if (vocabularyWords.length > 0) {
        resetSession();
    }
  }, [vocabularyWords]);

  // Record user response and update performance
  const recordResponse = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;

    const difficultyScores = { easy: 0.1, medium: 0.5, hard: 0.9 };
    const accuracyScores = { easy: 1.0, medium: 0.7, hard: 0.3 };
    
    setWordPerformances(prev => {
      const existing = prev[currentCard.id] || {
        wordId: currentCard.id,
        attempts: 0,
        correctAttempts: 0,
        difficultyScore: 0.5,
        accuracy: 0,
        lastSeen: 0,
        category: currentCard.category
      };

      const newAttempts = existing.attempts + 1;
      const newCorrectAttempts = existing.correctAttempts + (difficulty === 'easy' ? 1 : 0);
      const newAccuracy = newCorrectAttempts / newAttempts;
      const newDifficultyScore = (existing.difficultyScore + difficultyScores[difficulty]) / 2;

      return {
        ...prev,
        [currentCard.id]: {
          ...existing,
          attempts: newAttempts,
          correctAttempts: newCorrectAttempts,
          accuracy: newAccuracy,
          difficultyScore: newDifficultyScore,
          lastSeen: Date.now()
        }
      };
    });

    setSessionStats(prev => ({
      ...prev,
      answered: prev.answered + 1,
      [difficulty]: prev[difficulty] + 1
    }));

    // Update total words studied
    setTotalWordsStudied(prev => {
      const currentPerf = wordPerformances[currentCard.id];
      if (!currentPerf || currentPerf.attempts === 0) {
        return prev + 1; // First time seeing this word
      }
      return prev;
    });

    // Get next card
    setTimeout(() => {
      getNextCard();
    }, 100);
  }, [currentCard, getNextCard, wordPerformances]);

  // Reset session
  const resetSession = useCallback(() => {
    setSessionStats({ answered: 0, easy: 0, medium: 0, hard: 0 });
    setSessionWords([]);
    setCurrentCard(null);
    setTimeout(() => {
      getNextCard();
    }, 100);
  }, [getNextCard]);

  // Get performance insights
  const getPerformanceInsights = useCallback((): PerformanceInsights => {
    const categoryStats: Record<string, { total: number; correct: number; wordCount: number }> = {};
    
    Object.values(wordPerformances).forEach(perf => {
      if (!categoryStats[perf.category]) {
        categoryStats[perf.category] = { total: 0, correct: 0, wordCount: 0 };
      }
      categoryStats[perf.category].total += perf.attempts;
      categoryStats[perf.category].correct += perf.correctAttempts;
      categoryStats[perf.category].wordCount += 1;
    });

    const categories = Object.entries(categoryStats)
      .map(([name, stats]) => ({
        name,
        accuracy: (stats.correct / stats.total) * 100,
        wordCount: stats.wordCount
      }))
      .filter(cat => cat.wordCount >= 2); // Only show categories with 2+ words

    const strongCategories = categories.filter(cat => cat.accuracy >= 70);
    const weakCategories = categories.filter(cat => cat.accuracy < 70);

    const recommendations = [];
    if (weakCategories.length > 0) {
      recommendations.push(`Focus on ${weakCategories[0].name} words - you're at ${Math.round(weakCategories[0].accuracy)}% accuracy.`);
    }
    if (strongCategories.length > 0) {
      recommendations.push(`Great job with ${strongCategories[0].name}! You're excelling at ${Math.round(strongCategories[0].accuracy)}% accuracy.`);
    }
    if (totalWordsStudied >= 100) {
      recommendations.push('Consider reviewing your difficult words from previous sessions.');
    } else {
      recommendations.push('Keep practicing daily to build your vocabulary foundation.');
    }

    return {
      strongCategories: strongCategories.slice(0, 5),
      weakCategories: weakCategories.slice(0, 5),
      recommendations
    };
  }, [wordPerformances, totalWordsStudied]);

  return {
    currentCard,
    sessionStats,
    totalWordsStudied,
    wordPerformances, // Add this line
    getNextCard,
    recordResponse,
    resetSession,
    getPerformanceInsights
  };
}

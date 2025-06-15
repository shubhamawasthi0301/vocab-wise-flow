
import { useMemo } from 'react';
import { VocabularyWord } from '@/types/vocabulary';

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function useQuiz(allWords: VocabularyWord[]) {

  const generateGuessWordQuestion = useMemo(() => (correctWord: VocabularyWord | null) => {
    if (!correctWord || allWords.length < 4) {
      return null;
    }

    const distractors = allWords
      .filter(word => word.id !== correctWord.id) // Not the correct word
      .sort(() => 0.5 - Math.random()) // Shuffle to get random distractors
      .slice(0, 3);

    if (distractors.length < 3) return null; // Not enough words for a quiz

    const options = shuffleArray([...distractors.map(d => d.word), correctWord.word]);
    const question = correctWord.meanings[0]?.definitions[0]?.definition || 'No definition available.';

    return {
      word: correctWord,
      question: `Which word means: "${question}"`,
      options,
      correctAnswer: correctWord.word,
    };
  }, [allWords]);

  const generateGuessDefinitionQuestion = useMemo(() => (correctWord: VocabularyWord | null) => {
    if (!correctWord || allWords.length < 4) {
      return null;
    }
    
    const correctDefinition = correctWord.meanings[0]?.definitions[0]?.definition;
    if (!correctDefinition) return null;

    const distractorDefinitions = allWords
      .filter(word => word.id !== correctWord.id)
      .map(word => word.meanings[0]?.definitions[0]?.definition)
      .filter((def): def is string => !!def)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    if (distractorDefinitions.length < 3) return null;

    const options = shuffleArray([...distractorDefinitions, correctDefinition]);
    
    return {
      word: correctWord,
      question: `What is the definition of "${correctWord.word}"?`,
      options,
      correctAnswer: correctDefinition,
    };
  }, [allWords]);

  return { generateGuessWordQuestion, generateGuessDefinitionQuestion };
}

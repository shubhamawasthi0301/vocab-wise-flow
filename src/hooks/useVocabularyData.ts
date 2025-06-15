
import { useState, useEffect } from 'react';
import { VocabularyWord } from '@/types/vocabulary';
import { WordsApiService } from '@/services/wordsApi';
import { VOCABULARY_WORD_LIST, WORD_CATEGORIES } from '@/data/wordList';

// Function to get a random image for a word
const getRandomImageForWord = (word: string): string => {
  const imageIds = [
    'photo-1518640467707-6811f4a6ab73',
    'photo-1486312338219-ce68d2c6f44d',
    'photo-1581091226825-a6a2a5aee158',
    'photo-1465146344425-f00d5f5c8f07',
    'photo-1500673922987-e212871fec22',
    'photo-1501286353178-1ec881214838',
    'photo-1582562124811-c09040d0a901',
    'photo-1472396961693-142e6e269027'
  ];
  
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
  return `https://images.unsplash.com/${randomId}?w=400&h=300&fit=crop`;
};

export function useVocabularyData() {
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWordData = async (word: string): Promise<VocabularyWord | null> => {
    try {
      const data = await WordsApiService.getCompleteWordData(word);
      
      if (data.definitions.length === 0) {
        console.warn(`No definitions found for word: ${word}`);
        return null;
      }

      const primaryDefinition = data.definitions[0];
      const example = data.examples[0] || `This is an example sentence using the word ${word}.`;

      return {
        id: word,
        word: word,
        definition: primaryDefinition.definition,
        pronunciation: '', // WordsAPI doesn't provide pronunciation in the free tier
        partOfSpeech: primaryDefinition.partOfSpeech || 'unknown',
        category: WORD_CATEGORIES[word as keyof typeof WORD_CATEGORIES] || 'General',
        example: example,
        synonyms: data.synonyms.slice(0, 4), // Limit to 4 synonyms
        imageUrl: getRandomImageForWord(word)
      };
    } catch (error) {
      console.error(`Failed to fetch data for word: ${word}`, error);
      return null;
    }
  };

  const loadVocabularyWords = async () => {
    setLoading(true);
    setError(null);

    try {
      // Take first 15 words from the list to start with
      const wordsToFetch = VOCABULARY_WORD_LIST.slice(0, 15);
      const wordPromises = wordsToFetch.map(word => fetchWordData(word));
      
      const results = await Promise.all(wordPromises);
      const validWords = results.filter((word): word is VocabularyWord => word !== null);
      
      if (validWords.length === 0) {
        throw new Error('No vocabulary words could be loaded');
      }

      setVocabularyWords(validWords);
    } catch (err) {
      console.error('Error loading vocabulary:', err);
      setError('Failed to load vocabulary. Please check your API configuration.');
      
      // Fallback to a minimal dataset if API fails
      setVocabularyWords([{
        id: 'fallback',
        word: 'Learning',
        definition: 'The process of acquiring knowledge or skills',
        pronunciation: 'ˈlərniNG',
        partOfSpeech: 'noun',
        category: 'Education',
        example: 'Learning new vocabulary is an important part of language development.',
        synonyms: ['studying', 'education', 'instruction'],
        imageUrl: getRandomImageForWord('learning')
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVocabularyWords();
  }, []);

  return {
    vocabularyWords,
    loading,
    error,
    refetch: loadVocabularyWords
  };
}

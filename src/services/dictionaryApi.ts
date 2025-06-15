export interface DictionaryDefinition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryPhonetic {
  text: string;
  audio?: string;
  sourceUrl?: string;
}

export interface DictionaryApiResponse {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

const API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export class DictionaryApiService {
  private static async makeRequest(word: string): Promise<DictionaryApiResponse[]> {
    const response = await fetch(`${API_BASE_URL}/${word}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  }

  static async getWordData(word: string) {
    try {
      const data = await this.makeRequest(word);
      
      if (!data || data.length === 0) {
        throw new Error('No data found for this word');
      }

      const wordData = data[0];
      
      const meanings = wordData.meanings.map(meaning => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map(def => ({
          definition: def.definition,
          example: def.example,
        })),
      }));

      // Extract all synonyms, antonyms, examples from all meanings and definitions
      const allSynonyms: string[] = [];
      const allAntonyms: string[] = [];
      const allExamples: string[] = [];

      wordData.meanings.forEach(meaning => {
        allSynonyms.push(...meaning.synonyms);
        allAntonyms.push(...meaning.antonyms);
        meaning.definitions.forEach(def => {
          allSynonyms.push(...def.synonyms);
          allAntonyms.push(...def.antonyms);
          if (def.example) {
            allExamples.push(def.example);
          }
        });
      });

      // Get pronunciation - prefer the one with audio
      const pronunciationWithAudio = wordData.phonetics.find(p => p.audio && p.audio.length > 0);
      const pronunciation = pronunciationWithAudio?.text || wordData.phonetic || wordData.phonetics[0]?.text || '';

      return {
        word: wordData.word,
        pronunciation,
        audioUrl: pronunciationWithAudio?.audio,
        meanings,
        synonyms: [...new Set(allSynonyms)], // Remove duplicates
        antonyms: [...new Set(allAntonyms)], // Remove duplicates
        examples: allExamples,
      };
    } catch (error) {
      console.error(`Failed to fetch data for word: ${word}`, error);
      throw error;
    }
  }
}

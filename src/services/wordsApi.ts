
export interface WordDefinition {
  definition: string;
  partOfSpeech: string;
}

export interface WordApiDefinitionsResponse {
  word: string;
  definitions: WordDefinition[];
}

export interface WordApiSynonymsResponse {
  word: string;
  synonyms: string[];
}

export interface WordApiAntonymsResponse {
  word: string;
  antonyms: string[];
}

export interface WordApiExamplesResponse {
  word: string;
  examples: string[];
}

const API_BASE_URL = 'https://wordsapiv1.p.mashape.com/words';
const API_HEADERS = {
  'X-RapidAPI-Key': 'YOUR_API_KEY_HERE', // This will need to be set by the user
  'X-RapidAPI-Host': 'wordsapiv1.p.mashape.com'
};

export class WordsApiService {
  private static async makeRequest<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: API_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  }

  static async getDefinitions(word: string): Promise<WordApiDefinitionsResponse> {
    return this.makeRequest<WordApiDefinitionsResponse>(`${API_BASE_URL}/${word}/definitions`);
  }

  static async getSynonyms(word: string): Promise<WordApiSynonymsResponse> {
    return this.makeRequest<WordApiSynonymsResponse>(`${API_BASE_URL}/${word}/synonyms`);
  }

  static async getAntonyms(word: string): Promise<WordApiAntonymsResponse> {
    return this.makeRequest<WordApiAntonymsResponse>(`${API_BASE_URL}/${word}/antonyms`);
  }

  static async getExamples(word: string): Promise<WordApiExamplesResponse> {
    return this.makeRequest<WordApiExamplesResponse>(`${API_BASE_URL}/${word}/examples`);
  }

  static async getCompleteWordData(word: string) {
    try {
      const [definitions, synonyms, examples] = await Promise.all([
        this.getDefinitions(word).catch(() => ({ word, definitions: [] })),
        this.getSynonyms(word).catch(() => ({ word, synonyms: [] })),
        this.getExamples(word).catch(() => ({ word, examples: [] }))
      ]);

      return {
        word,
        definitions: definitions.definitions || [],
        synonyms: synonyms.synonyms || [],
        examples: examples.examples || []
      };
    } catch (error) {
      console.error(`Error fetching data for word: ${word}`, error);
      throw error;
    }
  }
}

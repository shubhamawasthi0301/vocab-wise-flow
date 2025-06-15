
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Image as ImageIcon } from 'lucide-react';
import { VocabularyWord } from '@/types/vocabulary';

interface FlashcardProps {
  word: VocabularyWord;
  onResponse: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export function Flashcard({ word, onResponse }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setShowAnswer(true);
    }
  };

  const handleResponse = (difficulty: 'easy' | 'medium' | 'hard') => {
    onResponse(difficulty);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-lg">
              <div className={`transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
                {!isFlipped ? (
                  /* Front of card */
                  <div className="p-8 text-center min-h-[400px] flex flex-col justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <Badge className="mx-auto mb-4 bg-white/20 text-white border-white/30">
                      {word.category}
                    </Badge>
                    <h2 className="text-5xl font-bold mb-4 tracking-wide">
                      {word.word}
                    </h2>
                    <p className="text-xl opacity-90 mb-8">
                      [{word.pronunciation}]
                    </p>
                    <Button
                      onClick={handleFlip}
                      variant="secondary"
                      size="lg"
                      className="mx-auto gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-5 w-5" />
                      Show Definition
                    </Button>
                  </div>
                ) : (
                  /* Back of card */
                  <div className="p-8 min-h-[400px] bg-gradient-to-br from-slate-50 to-blue-50">
                    <div className="text-center mb-6">
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">{word.word}</h3>
                      <Badge variant="outline" className="mb-4">{word.partOfSpeech}</Badge>
                    </div>

                    <div className="space-y-6">
                      {/* Definition */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                        <h4 className="font-semibold text-gray-700 mb-2">Definition</h4>
                        <p className="text-gray-600 leading-relaxed">{word.definition}</p>
                      </div>

                      {/* Example with image */}
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                        <h4 className="font-semibold text-gray-700 mb-2">Example</h4>
                        <p className="text-gray-600 italic mb-3">"{word.example}"</p>
                        {word.imageUrl && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <ImageIcon className="h-4 w-4" />
                            <img 
                              src={word.imageUrl} 
                              alt={`Example for ${word.word}`}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>

                      {/* Synonyms */}
                      {word.synonyms.length > 0 && (
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
                          <h4 className="font-semibold text-gray-700 mb-2">Synonyms</h4>
                          <div className="flex flex-wrap gap-2">
                            {word.synonyms.map((synonym, index) => (
                              <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                                {synonym}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Response buttons */}
                    <div className="flex gap-3 mt-8 justify-center">
                      <Button
                        onClick={() => handleResponse('hard')}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Hard 😰
                      </Button>
                      <Button
                        onClick={() => handleResponse('medium')}
                        variant="outline"
                        className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                      >
                        Medium 🤔
                      </Button>
                      <Button
                        onClick={() => handleResponse('easy')}
                        variant="outline"
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        Easy 😊
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

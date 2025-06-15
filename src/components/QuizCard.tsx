
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';
import { VocabularyWord } from '@/types/vocabulary';

interface QuizCardProps {
  quiz: {
    word: VocabularyWord;
    question: string;
    options: string[];
    correctAnswer: string;
  };
  onAnswer: (isCorrect: boolean) => void;
}

export function QuizCard({ quiz, onAnswer }: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelectAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    const isCorrect = option === quiz.correctAnswer;
    
    setTimeout(() => {
      onAnswer(isCorrect);
      // Reset for next question
      setSelectedAnswer(null);
      setIsAnswered(false);
    }, 1500); // Wait 1.5s before moving to the next card
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return "justify-start text-left h-auto";
    }
    if (option === quiz.correctAnswer) {
      return "justify-start text-left h-auto bg-green-100 border-green-300 text-green-800 hover:bg-green-200";
    }
    if (option === selectedAnswer) {
      return "justify-start text-left h-auto bg-red-100 border-red-300 text-red-800 hover:bg-red-200";
    }
    return "justify-start text-left h-auto";
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-3xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Badge className="mx-auto mb-4 bg-white/20 text-indigo-600 border-indigo-200">
                <BrainCircuit className="h-4 w-4 mr-2" />
                Quiz Time
              </Badge>
              <p className="text-lg text-gray-700 leading-relaxed">{quiz.question}</p>
            </div>

            <div className="space-y-3">
              {quiz.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={cn("w-full flex items-center gap-4 p-4", getButtonClass(option))}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={isAnswered}
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isAnswered && option === quiz.correctAnswer && <CheckCircle2 className="text-green-600" />}
                  {isAnswered && option === selectedAnswer && option !== quiz.correctAnswer && <XCircle className="text-red-600" />}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

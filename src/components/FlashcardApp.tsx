import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, TrendingUp, Brain, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { Flashcard } from './Flashcard';
import { PerformanceDashboard } from './PerformanceDashboard';
import { useVocabularyData } from '@/hooks/useVocabularyData';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';

export function FlashcardApp() {
  const { vocabularyWords, loading, error, refetch } = useVocabularyData();
  const {
    currentCard,
    sessionStats,
    totalWordsStudied,
    getNextCard,
    recordResponse,
    resetSession,
    getPerformanceInsights
  } = useSpacedRepetition(vocabularyWords);

  const [showDashboard, setShowDashboard] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);

  useEffect(() => {
    if (sessionStats.answered > 0) {
      setSessionProgress((sessionStats.answered / 20) * 100);
    }
  }, [sessionStats.answered]);

  const handleCardResponse = (difficulty: 'easy' | 'medium' | 'hard') => {
    recordResponse(difficulty);
    
    // Show dashboard after 50+ words studied
    if (totalWordsStudied >= 50 && sessionStats.answered % 20 === 0) {
      setShowDashboard(true);
    }
  };

  const handleNewSession = () => {
    resetSession();
    setSessionProgress(0);
    setShowDashboard(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              VocabMaster
            </h1>
          </div>
        </div>
        
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-16 w-16 text-indigo-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 text-lg mb-2">Loading vocabulary words...</p>
            <p className="text-gray-500 text-sm">Fetching definitions and examples from WordsAPI</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              VocabMaster
            </h1>
          </div>
        </div>
        
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm border-red-200">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <p className="text-gray-500 text-sm mb-6">
              There was an issue connecting to the Dictionary API service.
            </p>
            <Button onClick={refetch} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showDashboard) {
    return (
      <PerformanceDashboard
        insights={getPerformanceInsights()}
        totalWords={totalWordsStudied}
        onContinue={() => setShowDashboard(false)}
        onNewSession={handleNewSession}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-indigo-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            VocabMaster
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Smart vocabulary learning with adaptive repetition</p>
        <Badge variant="outline" className="mt-2">
          Powered by Dictionary API
        </Badge>
      </div>

      {/* Progress Section */}
      <Card className="mb-6 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                <BookOpen className="h-4 w-4 mr-1" />
                Session: {sessionStats.answered}/20
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                Total: {totalWordsStudied} words
              </Badge>
            </div>
            <Button
              onClick={handleNewSession}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              New Session
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Session Progress</span>
              <span>{Math.round(sessionProgress)}%</span>
            </div>
            <Progress value={sessionProgress} className="h-2" />
          </div>

          {sessionStats.answered > 0 && (
            <div className="flex gap-4 mt-4 text-sm">
              <span className="text-green-600">
                Easy: {sessionStats.easy}
              </span>
              <span className="text-yellow-600">
                Medium: {sessionStats.medium}
              </span>
              <span className="text-red-600">
                Hard: {sessionStats.hard}
              </span>
              <span className="text-gray-600">
                Accuracy: {Math.round((sessionStats.easy / sessionStats.answered) * 100)}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flashcard */}
      {currentCard ? (
        <Flashcard
          word={currentCard}
          onResponse={handleCardResponse}
        />
      ) : (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No more cards in this session!</p>
            <Button onClick={handleNewSession} className="mt-4">
              Start New Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Show dashboard hint */}
      {totalWordsStudied >= 40 && totalWordsStudied < 50 && (
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-center">
            <p className="text-amber-800">
              🎯 Keep going! After {50 - totalWordsStudied} more words, you'll unlock your performance insights dashboard!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

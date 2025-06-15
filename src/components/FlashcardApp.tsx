import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCcw, TrendingUp, Brain, BookOpen, AlertCircle, Loader2, BarChart3, ListPlus, Trash2, PlayCircle, X } from 'lucide-react';
import { Flashcard } from './Flashcard';
import { PerformanceDashboard } from './PerformanceDashboard';
import { Analytics } from './Analytics';
import { useVocabularyData } from '@/hooks/useVocabularyData';
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition';
import { useSavedVocab } from '@/hooks/useSavedVocab';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function FlashcardApp() {
  const { vocabularyWords, loading, error, refetch } = useVocabularyData();
  const [useSavedVocabSession, setUseSavedVocabSession] = useState(false);

  // Saved vocab hook
  const {
    savedVocab,
    addWords: addSavedWords,
    removeWord: removeSavedWord,
    clearAll: clearSavedVocab
  } = useSavedVocab();

  // Used vocabulary list for the current session
  const vocabListToUse = useSavedVocabSession && savedVocab.length > 0
    ? savedVocab
    : vocabularyWords.map(w => w.word);

  const {
    currentCard,
    sessionStats,
    totalWordsStudied,
    wordPerformances,
    getNextCard,
    recordResponse,
    resetSession,
    getPerformanceInsights
  } = useSpacedRepetition(
    vocabularyWords.filter(w => vocabListToUse.includes(w.word))
  );

  const [showDashboard, setShowDashboard] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('flashcards');

  // Input state for adding words
  const [addInput, setAddInput] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (sessionStats.answered > 0) {
      setSessionProgress((sessionStats.answered / 20) * 100);
    }
  }, [sessionStats.answered]);

  const handleCardResponse = (difficulty: 'easy' | 'medium' | 'hard') => {
    recordResponse(difficulty);
    if (totalWordsStudied >= 50 && sessionStats.answered % 20 === 0) {
      setShowDashboard(true);
    }
  };

  const handleNewSession = (useSaved = false) => {
    setUseSavedVocabSession(useSaved);
    resetSession();
    setSessionProgress(0);
    setShowDashboard(false);
    setActiveTab('flashcards');

    if (useSaved) {
      // Find which saved vocab words are present in the master vocabularyWords list
      const matchedWords = savedVocab.filter(saved => 
        vocabularyWords.some(vw => vw.word === saved)
      );
      const missingWords = savedVocab.filter(saved =>
        !vocabularyWords.some(vw => vw.word === saved)
      );

      if (savedVocab.length === 0) {
        toast({ title: "No saved vocabulary", description: "Please add vocab words first." });
        setUseSavedVocabSession(false);
      } else if (matchedWords.length === 0) {
        toast({
          title: "No matches found",
          description: "None of your saved vocab match the available vocabulary. Please check your spelling or add more words."
        });
        setUseSavedVocabSession(false);
      } else {
        if (missingWords.length > 0) {
          toast({
            title: "Some words not found",
            description: `These words aren't in the practice set and will be skipped: ${missingWords.join(", ")}`
          });
        }
        toast({ title: "New session!", description: "Using your saved vocabs." });
      }
    }
  };

  // Add new vocabulary to saved list
  const handleAddWords = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addInput.trim()) {
      toast({ title: "Empty input", description: "Enter at least one word." });
      return;
    }
    const words = addInput.split(",").map(w => w.trim()).filter(Boolean);
    if (words.length === 0) {
      toast({ title: "No valid words", description: "Enter valid words separated by commas." });
      return;
    }
    addSavedWords(words);
    setAddInput("");
    setAdding(false);
    toast({
      title: "Word(s) added",
      description: (
        <span>
          {words.length > 1 ? `${words.length} words` : words[0]} added to your saved vocabs!
        </span>
      )
    });
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="flashcards" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="myvocab" className="gap-2">
            <ListPlus className="h-4 w-4" />
            My Saved Vocabs
          </TabsTrigger>
        </TabsList>

        {/* Flashcard Session */}
        <TabsContent value="flashcards" className="space-y-6">
          {/* Progress Section */}
          <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
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
                  onClick={() => handleNewSession()}
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
                <Button onClick={() => handleNewSession(useSavedVocabSession)} className="mt-4">
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
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <Analytics 
            wordPerformances={wordPerformances}
            vocabularyWords={vocabularyWords}
            totalWordsStudied={totalWordsStudied}
          />
        </TabsContent>

        {/* My Saved Vocabs */}
        <TabsContent value="myvocab">
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="mb-5 flex items-center gap-4 justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                    <ListPlus className="h-5 w-5" />
                    My Saved Vocab List
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Add words (separated by commas): e.g., <span className="italic">serendipity, ineffable, ubiquitous</span>
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={adding ? "secondary" : "default"}
                  className="gap-1"
                  onClick={() => setAdding(v => !v)}
                >
                  <ListPlus className="h-4 w-4" />
                  {adding ? "Cancel" : "Add Words"}
                </Button>
              </div>

              {/* Add word input form */}
              {adding && (
                <form className="flex flex-col md:flex-row gap-2 mb-6" onSubmit={handleAddWords}>
                  <Input
                    type="text"
                    placeholder="Enter word or words, comma separated"
                    value={addInput}
                    onChange={e => setAddInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="secondary" className="gap-2">
                    <ListPlus className="h-4 w-4" />
                    Add
                  </Button>
                </form>
              )}

              {/* Saved vocab list */}
              <div className="mb-6">
                {savedVocab.length === 0 ? (
                  <div className="text-gray-600 italic">No saved vocab words yet. Add some above!</div>
                ): (
                  <div className="flex flex-wrap gap-2">
                    {savedVocab.map(w => (
                      <Badge
                        key={w}
                        variant="secondary"
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1"
                      >
                        {w}
                        <button
                          onClick={() => removeSavedWord(w)}
                          className="ml-2 focus:outline-none text-gray-400 hover:text-red-500"
                          type="button"
                          aria-label={`Remove ${w}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  disabled={savedVocab.length === 0}
                  onClick={() => handleNewSession(true)}
                  className="gap-2"
                >
                  <PlayCircle className="h-5 w-5" />
                  Start Practice Session With My List
                </Button>
                <Button
                  disabled={savedVocab.length === 0}
                  variant="outline"
                  onClick={() => {
                    clearSavedVocab();
                    toast({ title: "Cleared!", description: "All saved vocab removed." });
                  }}
                  className="gap-1"
                >
                  <Trash2 className="h-5 w-5" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

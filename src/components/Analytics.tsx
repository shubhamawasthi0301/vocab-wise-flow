
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Target, Clock, Brain, BarChart3 } from 'lucide-react';
import { VocabularyWord, WordPerformance } from '@/types/vocabulary';

interface AnalyticsProps {
  wordPerformances: Record<string, WordPerformance>;
  vocabularyWords: VocabularyWord[];
  totalWordsStudied: number;
}

export function Analytics({ wordPerformances, vocabularyWords, totalWordsStudied }: AnalyticsProps) {
  // Calculate category statistics
  const categoryStats = vocabularyWords.reduce((acc, word) => {
    const performance = wordPerformances[word.id];
    if (!performance || performance.attempts === 0) return acc;

    if (!acc[word.category]) {
      acc[word.category] = {
        totalAttempts: 0,
        correctAttempts: 0,
        wordsStudied: 0,
        avgDifficulty: 0
      };
    }

    acc[word.category].totalAttempts += performance.attempts;
    acc[word.category].correctAttempts += performance.correctAttempts;
    acc[word.category].wordsStudied += 1;
    acc[word.category].avgDifficulty += performance.difficultyScore;

    return acc;
  }, {} as Record<string, { totalAttempts: number; correctAttempts: number; wordsStudied: number; avgDifficulty: number }>);

  // Calculate overall accuracy
  const totalAttempts = Object.values(wordPerformances).reduce((sum, perf) => sum + perf.attempts, 0);
  const totalCorrect = Object.values(wordPerformances).reduce((sum, perf) => sum + perf.correctAttempts, 0);
  const overallAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

  // Get most challenging words
  const challengingWords = vocabularyWords
    .filter(word => wordPerformances[word.id] && wordPerformances[word.id].attempts >= 2)
    .sort((a, b) => {
      const perfA = wordPerformances[a.id];
      const perfB = wordPerformances[b.id];
      return perfB.difficultyScore - perfA.difficultyScore;
    })
    .slice(0, 5);

  // Get mastered words
  const masteredWords = vocabularyWords
    .filter(word => {
      const perf = wordPerformances[word.id];
      return perf && perf.attempts >= 3 && perf.accuracy >= 0.8;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">{totalWordsStudied}</div>
            <div className="text-xs opacity-90">Words Studied</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">{Math.round(overallAccuracy)}%</div>
            <div className="text-xs opacity-90">Overall Accuracy</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">{totalAttempts}</div>
            <div className="text-xs opacity-90">Total Attempts</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-90" />
            <div className="text-2xl font-bold">{Object.keys(categoryStats).length}</div>
            <div className="text-xs opacity-90">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Words Studied</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Avg Difficulty</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(categoryStats).map(([category, stats]) => {
                const accuracy = (stats.correctAttempts / stats.totalAttempts) * 100;
                const avgDifficulty = stats.avgDifficulty / stats.wordsStudied;
                
                return (
                  <TableRow key={category}>
                    <TableCell className="font-medium">{category}</TableCell>
                    <TableCell>{stats.wordsStudied}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{Math.round(accuracy)}%</span>
                        {accuracy >= 70 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={avgDifficulty > 0.6 ? "destructive" : avgDifficulty > 0.4 ? "secondary" : "default"}>
                        {avgDifficulty > 0.6 ? "Hard" : avgDifficulty > 0.4 ? "Medium" : "Easy"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={accuracy} className="w-20" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Challenging Words */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <TrendingDown className="h-5 w-5" />
              Most Challenging Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            {challengingWords.length > 0 ? (
              <div className="space-y-3">
                {challengingWords.map((word) => {
                  const perf = wordPerformances[word.id];
                  return (
                    <div key={word.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium">{word.word}</div>
                        <div className="text-sm text-gray-500">{word.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">
                          {Math.round(perf.accuracy * 100)}% accuracy
                        </div>
                        <div className="text-xs text-gray-500">{perf.attempts} attempts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No challenging words identified yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Mastered Words */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Mastered Words
            </CardTitle>
          </CardHeader>
          <CardContent>
            {masteredWords.length > 0 ? (
              <div className="space-y-3">
                {masteredWords.map((word) => {
                  const perf = wordPerformances[word.id];
                  return (
                    <div key={word.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium">{word.word}</div>
                        <div className="text-sm text-gray-500">{word.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {Math.round(perf.accuracy * 100)}% accuracy
                        </div>
                        <div className="text-xs text-gray-500">{perf.attempts} attempts</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Keep practicing to master words!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

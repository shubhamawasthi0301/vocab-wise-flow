
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Award, BookOpen, Brain, Target } from 'lucide-react';
import { PerformanceInsights } from '@/types/vocabulary';

interface PerformanceDashboardProps {
  insights: PerformanceInsights;
  totalWords: number;
  onContinue: () => void;
  onNewSession: () => void;
}

export function PerformanceDashboard({ insights, totalWords, onContinue, onNewSession }: PerformanceDashboardProps) {
  const overallAccuracy = Math.round((insights.strongCategories.reduce((acc, cat) => acc + cat.accuracy, 0) + 
                                    insights.weakCategories.reduce((acc, cat) => acc + cat.accuracy, 0)) / 
                                   (insights.strongCategories.length + insights.weakCategories.length));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Award className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Performance Insights
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Your vocabulary learning journey so far</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-90" />
            <div className="text-3xl font-bold">{totalWords}</div>
            <div className="text-blue-100">Words Studied</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-90" />
            <div className="text-3xl font-bold">{overallAccuracy}%</div>
            <div className="text-green-100">Overall Accuracy</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-90" />
            <div className="text-3xl font-bold">{insights.strongCategories.length}</div>
            <div className="text-purple-100">Strong Categories</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Strong Categories */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              Categories You Excel At
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.strongCategories.length > 0 ? (
              insights.strongCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {category.name}
                    </Badge>
                    <span className="text-sm font-medium text-green-600">
                      {Math.round(category.accuracy)}%
                    </span>
                  </div>
                  <Progress value={category.accuracy} className="h-2" />
                  <p className="text-xs text-gray-500">{category.wordCount} words practiced</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Keep practicing to see your strong categories!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weak Categories */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <TrendingDown className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.weakCategories.length > 0 ? (
              insights.weakCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {category.name}
                    </Badge>
                    <span className="text-sm font-medium text-orange-600">
                      {Math.round(category.accuracy)}%
                    </span>
                  </div>
                  <Progress value={category.accuracy} className="h-2" />
                  <p className="text-xs text-gray-500">{category.wordCount} words practiced</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Great job! No weak areas identified yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600">
            <Brain className="h-5 w-5" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button onClick={onContinue} size="lg" className="gap-2">
          <BookOpen className="h-5 w-5" />
          Continue Learning
        </Button>
        <Button onClick={onNewSession} variant="outline" size="lg" className="gap-2">
          <Target className="h-5 w-5" />
          Start New Session
        </Button>
      </div>
    </div>
  );
}

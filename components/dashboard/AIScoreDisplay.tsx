'use client';

import React, { useState } from 'react';
import { AIScoreBreakdown } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getScoreColor, getScoreBgColor, getScoreLabel } from '@/lib/aiScore';

interface AIScoreDisplayProps {
  scoreBreakdown: AIScoreBreakdown;
}

export function AIScoreDisplay({ scoreBreakdown }: AIScoreDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { totalScore, factors } = scoreBreakdown;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Qualification Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(totalScore)}`}>
            <div>
              <div className={`text-4xl font-bold ${getScoreColor(totalScore)}`}>{totalScore}</div>
              <div className="text-sm text-gray-600">out of 100</div>
            </div>
          </div>
          <p className={`mt-3 text-lg font-semibold ${getScoreColor(totalScore)}`}>{getScoreLabel(totalScore)}</p>
        </div>

        <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)} className="w-full">
          {isExpanded ? <><ChevronUp className="h-4 w-4 mr-2" />Hide Details</> : <><ChevronDown className="h-4 w-4 mr-2" />Show Details</>}
        </Button>

        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Medical Suitability</span>
                <span className="font-semibold">{factors.medicalSuitability.score}/40</span>
              </div>
              <Progress value={(factors.medicalSuitability.score / 40) * 100} />
              <p className="text-xs text-gray-600 mt-1">{factors.medicalSuitability.details}</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Realistic Expectations</span>
                <span className="font-semibold">{factors.realisticExpectations.score}/30</span>
              </div>
              <Progress value={(factors.realisticExpectations.score / 30) * 100} />
              <p className="text-xs text-gray-600 mt-1">{factors.realisticExpectations.details}</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Budget Alignment</span>
                <span className="font-semibold">{factors.budgetAlignment.score}/20</span>
              </div>
              <Progress value={(factors.budgetAlignment.score / 20) * 100} />
              <p className="text-xs text-gray-600 mt-1">{factors.budgetAlignment.details}</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Photo Quality</span>
                <span className="font-semibold">{factors.photoQuality.score}/10</span>
              </div>
              <Progress value={(factors.photoQuality.score / 10) * 100} />
              <p className="text-xs text-gray-600 mt-1">{factors.photoQuality.details}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

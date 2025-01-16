import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NAPFACalculator = () => {
  const [formData, setFormData] = useState({
    sitUps: '',
    sbj: '', // Standing Broad Jump
    sitAndReach: '',
    inclinedPullUps: '',
    shuttle: '', // 4x10m Shuttle Run
    run: '' // 2.4km Run
  });

  const [results, setResults] = useState(null);

  const calculateScore = () => {
    // These are sample scoring tables - you would need to adjust based on actual NAPFA standards
    const getStationScore = (value, station) => {
      // Example scoring logic - replace with actual NAPFA scoring criteria
      const scores = {
        sitUps: {
          A: { min: 40, score: 5 },
          B: { min: 35, score: 4 },
          C: { min: 30, score: 3 },
          D: { min: 25, score: 2 },
          E: { min: 20, score: 1 },
        },
        sbj: {
          A: { min: 250, score: 5 },
          B: { min: 230, score: 4 },
          C: { min: 210, score: 3 },
          D: { min: 190, score: 2 },
          E: { min: 170, score: 1 },
        },
        sitAndReach: {
          A: { min: 45, score: 5 },
          B: { min: 40, score: 4 },
          C: { min: 35, score: 3 },
          D: { min: 30, score: 2 },
          E: { min: 25, score: 1 },
        },
        inclinedPullUps: {
          A: { min: 15, score: 5 },
          B: { min: 12, score: 4 },
          C: { min: 9, score: 3 },
          D: { min: 6, score: 2 },
          E: { min: 3, score: 1 },
        },
        shuttle: {
          A: { max: 10.2, score: 5 },
          B: { max: 10.7, score: 4 },
          C: { max: 11.2, score: 3 },
          D: { max: 11.7, score: 2 },
          E: { max: 12.2, score: 1 },
        },
        run: {
          A: { max: 9.0, score: 5 },
          B: { max: 9.5, score: 4 },
          C: { max: 10.0, score: 3 },
          D: { max: 10.5, score: 2 },
          E: { max: 11.0, score: 1 },
        },
      };

      const stationScores = scores[station];
      const value_num = parseFloat(value);

      if (station === 'shuttle' || station === 'run') {
        // Lower is better for timing-based stations
        for (const [grade, criteria] of Object.entries(stationScores)) {
          if (value_num <= criteria.max) {
            return criteria.score;
          }
        }
      } else {
        // Higher is better for other stations
        for (const [grade, criteria] of Object.entries(stationScores)) {
          if (value_num >= criteria.min) {
            return criteria.score;
          }
        }
      }
      return 0;
    };

    const scores = {
      sitUps: getStationScore(formData.sitUps, 'sitUps'),
      sbj: getStationScore(formData.sbj, 'sbj'),
      sitAndReach: getStationScore(formData.sitAndReach, 'sitAndReach'),
      inclinedPullUps: getStationScore(formData.inclinedPullUps, 'inclinedPullUps'),
      shuttle: getStationScore(formData.shuttle, 'shuttle'),
      run: getStationScore(formData.run, 'run')
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    
    // Calculate grade based on total score
    let grade;
    if (totalScore >= 25) grade = 'Gold';
    else if (totalScore >= 21) grade = 'Silver';
    else if (totalScore >= 15) grade = 'Bronze';
    else grade = 'No Award';

    setResults({ scores, totalScore, grade });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">NAPFA Score Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sitUps">Sit-ups (repetitions)</Label>
              <Input
                id="sitUps"
                name="sitUps"
                type="number"
                value={formData.sitUps}
                onChange={handleInputChange}
                placeholder="Enter number of sit-ups"
              />
            </div>
            
            <div>
              <Label htmlFor="sbj">Standing Broad Jump (cm)</Label>
              <Input
                id="sbj"
                name="sbj"
                type="number"
                value={formData.sbj}
                onChange={handleInputChange}
                placeholder="Enter distance in cm"
              />
            </div>

            <div>
              <Label htmlFor="sitAndReach">Sit and Reach (cm)</Label>
              <Input
                id="sitAndReach"
                name="sitAndReach"
                type="number"
                value={formData.sitAndReach}
                onChange={handleInputChange}
                placeholder="Enter distance in cm"
              />
            </div>

            <div>
              <Label htmlFor="inclinedPullUps">Inclined Pull-ups (repetitions)</Label>
              <Input
                id="inclinedPullUps"
                name="inclinedPullUps"
                type="number"
                value={formData.inclinedPullUps}
                onChange={handleInputChange}
                placeholder="Enter number of pull-ups"
              />
            </div>

            <div>
              <Label htmlFor="shuttle">Shuttle Run (seconds)</Label>
              <Input
                id="shuttle"
                name="shuttle"
                type="number"
                step="0.1"
                value={formData.shuttle}
                onChange={handleInputChange}
                placeholder="Enter time in seconds"
              />
            </div>

            <div>
              <Label htmlFor="run">2.4km Run (minutes)</Label>
              <Input
                id="run"
                name="run"
                type="number"
                step="0.1"
                value={formData.run}
                onChange={handleInputChange}
                placeholder="Enter time in minutes"
              />
            </div>
          </div>

          <Button 
            className="w-full mt-4"
            onClick={calculateScore}
          >
            Calculate Score
          </Button>

          {results && (
            <Alert className="mt-4">
              <AlertDescription>
                <div className="space-y-2">
                  <h3 className="font-semibold">Results:</h3>
                  <p>Sit-ups: {results.scores.sitUps} points</p>
                  <p>Standing Broad Jump: {results.scores.sbj} points</p>
                  <p>Sit and Reach: {results.scores.sitAndReach} points</p>
                  <p>Inclined Pull-ups: {results.scores.inclinedPullUps} points</p>
                  <p>Shuttle Run: {results.scores.shuttle} points</p>
                  <p>2.4km Run: {results.scores.run} points</p>
                  <p className="font-bold">Total Score: {results.totalScore}/30</p>
                  <p className="font-bold">Grade: {results.grade}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NAPFACalculator;

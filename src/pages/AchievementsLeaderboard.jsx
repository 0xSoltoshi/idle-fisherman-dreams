import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Achievements from "@/components/Achievements";
import Leaderboard from "@/components/Leaderboard";

const AchievementsLeaderboard = () => {
  // You might want to fetch these from a global state or context in a real application
  const achievements = {};
  const leaderboardData = [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Achievements & Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <Achievements achievements={achievements} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Leaderboard data={leaderboardData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AchievementsLeaderboard;
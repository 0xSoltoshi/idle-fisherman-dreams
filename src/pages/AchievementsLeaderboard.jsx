import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AchievementsLeaderboard = () => {
  // Mock data for achievements and leaderboard
  const achievements = [
    { name: "Catch 100 Fish", achieved: true, reward: { type: 'money', amount: 50 } },
    { name: "Catch 1,000 Fish", achieved: false, reward: { type: 'fishPerClick', amount: 1 } },
    { name: "Earn $1,000", achieved: true, reward: { type: 'catchRate', amount: 0.1 } },
    { name: "Earn $10,000", achieved: false, reward: { type: 'money', amount: 500 } },
    { name: "Hire 5 Fishermen", achieved: false, reward: { type: 'fishPerSecond', amount: 2 } },
  ];

  const leaderboardData = [
    { name: "Player 1", fishCount: 1000, moneyEarned: 5000 },
    { name: "Player 2", fishCount: 800, moneyEarned: 4000 },
    { name: "Player 3", fishCount: 600, moneyEarned: 3000 },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Achievements & Leaderboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{achievement.name}</span>
                  <Badge variant={achievement.achieved ? "success" : "secondary"}>
                    {achievement.achieved ? "Achieved" : "Locked"}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Fish Caught</TableHead>
                  <TableHead>Money Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.fishCount}</TableCell>
                    <TableCell>${player.moneyEarned}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AchievementsLeaderboard;
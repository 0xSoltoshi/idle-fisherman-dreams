import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Achievements = ({ achievements }) => (
  <Card className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
    <CardHeader>
      <CardTitle className="text-yellow-800 dark:text-yellow-200">Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(achievements).map(([key, achievement]) => (
          <Badge 
            key={key} 
            variant={achievement.achieved ? "default" : "secondary"}
            className={achievement.achieved 
              ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200" 
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}
          >
            {achievement.name} {achievement.achieved ? '✅' : '❌'}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default Achievements;

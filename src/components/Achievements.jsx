import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Achievements = ({ achievements }) => (
  <Card>
    <CardHeader>
      <CardTitle>Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(achievements).map(([key, achievement]) => (
          <Badge key={key} variant={achievement.achieved ? "default" : "secondary"}>
            {achievement.name} {achievement.achieved ? '✅' : '❌'}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default Achievements;
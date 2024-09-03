import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FishTank = ({ fish, rareFish, specialFish, netCatch, trapCatch }) => {
  return (
    <Card className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-800 dark:text-blue-200">Fish Tank</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-700 dark:text-gray-300">🐟 Regular: {fish}</div>
          <div className="text-gray-700 dark:text-gray-300">🐠 Rare: {rareFish}</div>
          <div className="text-gray-700 dark:text-gray-300">🦈 Special: {specialFish}</div>
          <div className="text-gray-700 dark:text-gray-300">🕸️ Net: {netCatch.small + netCatch.medium + netCatch.large}</div>
          <div className="text-gray-700 dark:text-gray-300">🪤 Trap: {trapCatch.common + trapCatch.uncommon + trapCatch.rare}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FishTank;
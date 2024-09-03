import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const AutoFisher = ({ isActive, progress, fishPerSecond, onToggle, upgradeCost, onUpgrade }) => {
  return (
    <Card className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-800 dark:text-blue-200">Auto Fisher</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 dark:text-gray-300">Status: {isActive ? 'Active' : 'Inactive'}</span>
          <Button onClick={onToggle} variant={isActive ? "destructive" : "default"}>
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
        <Progress value={progress} className="mb-2" />
        <p className="text-gray-700 dark:text-gray-300 mb-2">Fish per second: {fishPerSecond.toFixed(2)}</p>
        <Button onClick={onUpgrade} className="w-full">
          Upgrade (Cost: ${upgradeCost})
        </Button>
      </CardContent>
    </Card>
  );
};

export default AutoFisher;
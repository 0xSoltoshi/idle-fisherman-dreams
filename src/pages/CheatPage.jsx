import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const CheatPage = () => {
  const handleCheat = () => {
    // In a real application, you would update the global state or make an API call here
    // For this example, we'll just show a toast notification
    toast.success("Congratulations! $100,000 has been added to your account!");
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Cheat Page</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button 
            onClick={handleCheat}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Get $100,000
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheatPage;
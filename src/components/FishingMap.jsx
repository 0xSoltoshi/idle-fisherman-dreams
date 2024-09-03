import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FishingMap = ({ plots, onBuyPlot, money }) => {
  const mapSize = 5; // 5x5 grid

  const handleBuyPlot = (x, y) => {
    const plotCost = 1000 * (x + y + 1); // Cost increases based on distance from origin
    if (money >= plotCost) {
      onBuyPlot(x, y, plotCost);
      toast.success(`Purchased plot at (${x}, ${y}) for $${plotCost}`);
    } else {
      toast.error(`Not enough money to buy this plot. You need $${plotCost}.`);
    }
  };

  return (
    <div className="bg-blue-100 p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-2">Fishing Map</h3>
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: mapSize * mapSize }).map((_, index) => {
          const x = index % mapSize;
          const y = Math.floor(index / mapSize);
          const isOwned = plots.some(plot => plot.x === x && plot.y === y);
          return (
            <Button
              key={index}
              className={`w-12 h-12 ${isOwned ? 'bg-green-500' : 'bg-blue-300'}`}
              onClick={() => !isOwned && handleBuyPlot(x, y)}
              disabled={isOwned}
            >
              {isOwned ? '🎣' : '🌊'}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default FishingMap;
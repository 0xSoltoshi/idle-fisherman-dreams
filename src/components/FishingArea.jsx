import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FishingArea = ({
  fish,
  rareFish,
  specialFish,
  onFish,
  onNet,
  onTrap,
  catchChance,
  fishPerClick,
  currentSpot,
  onChangeSpot,
  unlockedSpots,
  netCooldown,
  trapCooldown,
  gear,
  money
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={onFish} className="w-1/3">Fish 🎣</Button>
        <Button onClick={onNet} disabled={netCooldown > 0} className="w-1/3 mx-2">
          {netCooldown > 0 ? `Net (${netCooldown}s)` : 'Net 🕸️'}
        </Button>
        <Button onClick={onTrap} disabled={trapCooldown > 0} className="w-1/3">
          {trapCooldown > 0 ? `Trap (${trapCooldown}s)` : 'Trap 🪤'}
        </Button>
      </div>
      <Select value={currentSpot} onValueChange={onChangeSpot}>
        <SelectTrigger>
          <SelectValue placeholder="Select fishing spot" />
        </SelectTrigger>
        <SelectContent>
          {unlockedSpots.map((spot) => (
            <SelectItem key={spot.name} value={spot.name}>
              {spot.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="text-sm">
        <p>Catch Chance: {(catchChance * 100).toFixed(2)}%</p>
        <p>Fish per Click: {fishPerClick.toFixed(2)}</p>
        <p>Regular Fish: {Math.floor(fish)}</p>
        <p>Rare Fish: {rareFish}</p>
        <p>Special Fish: {specialFish}</p>
      </div>
    </div>
  );
};

export default FishingArea;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import FishermenManagement from "@/components/FishermenManagement";
import FishPricesMenu from "@/components/FishPricesMenu";

const Index = () => {
  const [fish, setFish] = useState(0);
  const [rareFish, setRareFish] = useState(0);
  const [specialFish, setSpecialFish] = useState(0);
  const [money, setMoney] = useState(0);
  const [currentSpot, setCurrentSpot] = useState('pond');
  const [gear, setGear] = useState({ rod: { level: 1 } });
  const [fishPerClick, setFishPerClick] = useState(1);
  const [catchChance, setCatchChance] = useState(0.5);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [fishermen, setFishermen] = useState(0);
  const [totalFishCaught, setTotalFishCaught] = useState(0);
  const [totalMoneyEarned, setTotalMoneyEarned] = useState(0);

  const fishingSpots = {
    pond: { name: 'Pond', fish: ['Carp', 'Perch'], rareFish: ['Bass'], specialFish: ['Golden Carp'] },
    river: { name: 'River', fish: ['Trout', 'Salmon'], rareFish: ['Sturgeon'], specialFish: ['Giant Catfish'] },
    ocean: { name: 'Ocean', fish: ['Cod', 'Tuna'], rareFish: ['Swordfish'], specialFish: ['Great White Shark'] },
  };

  const handleFish = () => {
    // Fishing logic here (simplified for brevity)
    const baseCatchAmount = Math.floor(1 + (gear.rod.level * 0.5));
    const rarityRoll = Math.random();
    const rodLevelBonus = gear.rod.level * 0.01;

    if (Math.random() < catchChance) {
      if (rarityRoll < 0.01 + rodLevelBonus) {
        setSpecialFish(prev => prev + baseCatchAmount);
        toast.success(`You caught ${baseCatchAmount} special fish! 🦈`);
      } else if (rarityRoll < 0.05 + (rodLevelBonus * 2)) {
        setRareFish(prev => prev + baseCatchAmount);
        toast.success(`You caught ${baseCatchAmount} rare fish! 🐠`);
      } else {
        setFish(prev => prev + baseCatchAmount);
        toast.success(`You caught ${baseCatchAmount} fish! 🐟`);
      }
      setTotalFishCaught(prev => prev + baseCatchAmount);
    } else {
      toast.error("The fish got away!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Idle Fisherman</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fishing Spot: {fishingSpots[currentSpot].name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setCurrentSpot(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select fishing spot" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(fishingSpots).map((spot) => (
                  <SelectItem key={spot} value={spot}>
                    {fishingSpots[spot].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleFish} className="mt-4 w-full">Fish!</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Fish: {fish}</p>
            <p>Rare Fish: {rareFish}</p>
            <p>Special Fish: {specialFish}</p>
            <p>Money: ${money}</p>
            <p>XP: {xp}</p>
            <p>Level: {level}</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <FishermenManagement 
          money={money} 
          fishermen={fishermen} 
          fishermenSkills={[]} 
          onUpgradeFisherman={() => {}}
        />
        <FishPricesMenu fishPrices={{}} />
      </div>
    </div>
  );
};

export default Index;
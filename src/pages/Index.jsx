import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format, isToday } from 'date-fns';
import { useTheme } from 'next-themes';
import { Moon, Sun, Fish, DollarSign, Users, BarChart2, Bug, Map } from 'lucide-react';
import FishermenManagement from "@/components/FishermenManagement";
import FishPricesMenu from "@/components/FishPricesMenu";
import FishingMap from "@/components/FishingMap";

const BASE_XP = 100;
const XP_INCREMENT = 50;

const fishingSpots = {
  pond: {
    name: "Pond",
    unlockCost: 0,
    fish: ["Carp", "Bluegill", "Perch"],
    rareFish: ["Golden Carp", "Albino Catfish"],
    specialFish: ["Giant Catfish"],
    challenge: "Catch 100 Pond fish",
    valueMultiplier: 1
  },
  lake: {
    name: "Lake",
    unlockCost: 25000,
    fish: ["Bass", "Trout", "Pike"],
    rareFish: ["Rainbow Trout", "Walleye"],
    specialFish: ["Giant Bass"],
    challenge: "Catch a Giant Bass",
    valueMultiplier: 2
  },
  river: {
    name: "River",
    unlockCost: 100000,
    fish: ["Salmon", "Sturgeon", "Eel"],
    rareFish: ["Golden Sturgeon", "Steelhead"],
    specialFish: ["River Monster"],
    challenge: "Catch 10 Golden Sturgeons",
    valueMultiplier: 3
  },
  ocean: {
    name: "Ocean",
    unlockCost: 500000,
    fish: ["Tuna", "Cod", "Mackerel"],
    rareFish: ["Swordfish", "Marlin"],
    specialFish: ["Great White Shark"],
    challenge: "Catch a Great White Shark",
    valueMultiplier: 5
  },
};

const Index = () => {
  const { theme, setTheme } = useTheme();
  const [plots, setPlots] = useState([]);
  const [money, setMoney] = useState(0);
  const [fish, setFish] = useState(0);
  const [rareFish, setRareFish] = useState(0);
  const [specialFish, setSpecialFish] = useState(0);
  const [fishPerClick, setFishPerClick] = useState(1);
  const [catchChance, setCatchChance] = useState(0.5);
  const [currentSpot, setCurrentSpot] = useState('pond');
  const [unlockedSpots, setUnlockedSpots] = useState(['pond']);
  const [fishermen, setFishermen] = useState(0);
  const [fishermenSkills, setFishermenSkills] = useState([]);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [loginStreak, setLoginStreak] = useState(0);

  const handleBuyPlot = (x, y, cost) => {
    if (money >= cost) {
      setMoney(prevMoney => prevMoney - cost);
      setPlots(prevPlots => [...prevPlots, { x, y }]);
      toast.success(`Purchased plot at (${x}, ${y}) for $${cost}`);
    } else {
      toast.error(`Not enough money to buy this plot. You need $${cost}.`);
    }
  };

  const calculateCatches = (attempts, spot) => {
    let fishCaught = 0;
    let rareFishCaught = 0;
    let specialFishCaught = 0;

    for (let i = 0; i < attempts; i++) {
      if (Math.random() < catchChance) {
        const rarityRoll = Math.random();
        if (rarityRoll < 0.01 + (plots.length * 0.005)) {
          specialFishCaught++;
        } else if (rarityRoll < 0.1 + (plots.length * 0.01)) {
          rareFishCaught++;
        } else {
          fishCaught += fishPerClick;
        }
      }
    }

    const totalCaught = fishCaught + rareFishCaught + specialFishCaught;
    return { fishCaught, rareFishCaught, specialFishCaught, totalCaught };
  };

  const handleFish = () => {
    const { fishCaught, rareFishCaught, specialFishCaught, totalCaught } = calculateCatches(1, currentSpot);
    setFish(prev => prev + fishCaught);
    setRareFish(prev => prev + rareFishCaught);
    setSpecialFish(prev => prev + specialFishCaught);
    toast.success(`Caught ${totalCaught} fish!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-300">Idle Fishing Adventure</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          >
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
                <Fish className="mr-2" /> Fishing Spot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={currentSpot} onValueChange={setCurrentSpot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a fishing spot" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fishingSpots).map(([key, spot]) => (
                    <SelectItem key={key} value={key} disabled={!unlockedSpots.includes(key)}>
                      {spot.name} {!unlockedSpots.includes(key) && `(Unlock: $${spot.unlockCost})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full mt-4" onClick={handleFish}>Fish!</Button>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
                <DollarSign className="mr-2" /> Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Money: ${money.toFixed(2)}</p>
              <p>Fish: {fish}</p>
              <p>Rare Fish: {rareFish}</p>
              <p>Special Fish: {specialFish}</p>
              <Button className="w-full mt-2">Sell All Fish</Button>
              <FishPricesMenu fishPrices={{}} />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
                <Users className="mr-2" /> Fishermen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Hired Fishermen: {fishermen}</p>
              <Button className="w-full mt-2">Hire Fisherman ($100)</Button>
              <FishermenManagement
                money={money}
                fishermen={fishermen}
                fishermenSkills={fishermenSkills}
                onUpgradeFisherman={() => {}}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
                <Map className="mr-2" /> Fishing Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FishingMap plots={plots} onBuyPlot={handleBuyPlot} money={money} />
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
                <BarChart2 className="mr-2" /> Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Fish Per Click: {fishPerClick}</p>
              <p>Catch Chance: {(catchChance * 100).toFixed(2)}%</p>
              <p>Plots Owned: {plots.length}</p>
              <p>Login Streak: {loginStreak} days</p>
              <p>Last Login: {lastLoginDate ? format(new Date(lastLoginDate), 'PPP') : 'Never'}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Index;
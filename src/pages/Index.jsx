import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Achievements from "@/components/Achievements";
import { toast } from "sonner";

const fishingSpots = {
  pond: { name: "Pond", unlockCost: 0, rareFishChance: 0.05, specialFishChance: 0, valueMultiplier: 1 },
  lake: { name: "Lake", unlockCost: 1000, rareFishChance: 0.08, specialFishChance: 0.02, valueMultiplier: 1.5 },
  river: { name: "River", unlockCost: 5000, rareFishChance: 0.1, specialFishChance: 0.05, valueMultiplier: 2 },
  ocean: { name: "Ocean", unlockCost: 20000, rareFishChance: 0.15, specialFishChance: 0.1, valueMultiplier: 3 },
};

const FishingArea = ({ fish, rareFish, specialFish, onFish, catchChance, fishPerClick, currentSpot, onChangeSpot, unlockedSpots }) => (
  <Card className="bg-blue-100">
    <CardHeader>
      <CardTitle>Fishing Area</CardTitle>
    </CardHeader>
    <CardContent>
      <Select onValueChange={onChangeSpot} value={currentSpot}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Select fishing spot" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(fishingSpots).map(([key, spot]) => (
            <SelectItem key={key} value={key} disabled={!unlockedSpots.includes(key)}>
              {spot.name} {!unlockedSpots.includes(key) && `(Unlock: $${spot.unlockCost})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="w-full mb-4" onClick={onFish}>Go Fishing 🎣</Button>
      <p>Fish: {fish} 🐟</p>
      <p>Rare Fish: {rareFish} 🐠</p>
      <p>Special Fish: {specialFish} 🦈</p>
      <p>Catch Chance: {(catchChance * 100).toFixed(2)}%</p>
      <p>Fish per Click: {fishPerClick}</p>
    </CardContent>
  </Card>
);

const Inventory = ({ fish, rareFish, money, onSell }) => (
  <Card className="bg-green-100">
    <CardHeader>
      <CardTitle>Inventory</CardTitle>
    </CardHeader>
    <CardContent>
      <Button className="w-full mb-4" onClick={onSell}>Sell Fish $</Button>
      <p>Money: ${money.toFixed(2)}</p>
      <p>Regular Fish: {fish} 🐟</p>
      <p>Rare Fish: {rareFish} 🐠</p>
    </CardContent>
  </Card>
);

const Metrics = ({ fishPerSecond, fishPerMinute, fishermen }) => (
  <Card className="bg-indigo-100">
    <CardHeader>
      <CardTitle>Metrics</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col gap-2">
      <p>Fish per Second: {fishPerSecond.toFixed(2)} 📈</p>
      <p>Fish per Minute: {fishPerMinute.toFixed(2)} 📈</p>
      <p>Fishermen: {fishermen} 👨‍🎣</p>
    </CardContent>
  </Card>
);

const Shop = ({ money, gear, onBuyGear, onUpgradeBoat, onHireFisherman, boatLevel, fishermen }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="w-full">Open Shop 🛒</Button>
    </DialogTrigger>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Fishing Shop</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        {Object.entries(gear).map(([itemName, item]) => (
          <div key={itemName} className="flex justify-between items-center">
            <span>{itemName} (Level {item.level})</span>
            <Button onClick={() => onBuyGear(itemName)} disabled={money < item.cost}>
              Upgrade (${item.cost})
            </Button>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <span>Boat (Level {boatLevel})</span>
          <Button onClick={onUpgradeBoat} disabled={money < (boatLevel + 1) * 1000}>
            Upgrade (${(boatLevel + 1) * 1000})
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span>Hire Fisherman ({fishermen})</span>
          <Button onClick={onHireFisherman} disabled={money < (fishermen + 1) * 500}>
            Hire (${(fishermen + 1) * 500})
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const Index = () => {
  const [fish, setFish] = useState(0);
  const [rareFish, setRareFish] = useState(0);
  const [specialFish, setSpecialFish] = useState(0);
  const [money, setMoney] = useState(10);
  const [fishPerSecond, setFishPerSecond] = useState(0);
  const [gear, setGear] = useState({
    rod: { level: 1, cost: 10, efficiency: 1 },
    net: { level: 0, cost: 50, efficiency: 0 },
    trap: { level: 0, cost: 100, efficiency: 0 },
  });
  const [boatLevel, setBoatLevel] = useState(0);
  const [fishermen, setFishermen] = useState(0);
  const [specialItems, setSpecialItems] = useState({
    bait: { cost: 50, active: false, duration: 60, effect: 'catchRate', multiplier: 1.5, description: 'Increases catch rate by 50% for 60 seconds' },
    license: { cost: 100, active: false, duration: 120, effect: 'sellRate', multiplier: 2, description: 'Doubles selling price for 120 seconds' },
    sonar: { cost: 200, active: false, duration: 180, effect: 'fishRate', multiplier: 3, description: 'Triples fish caught per second for 180 seconds' },
  });
  const [achievements, setAchievements] = useState({
    catch100: { name: "Catch 100 Fish", achieved: false, reward: { type: 'money', amount: 50 } },
    catch1000: { name: "Catch 1,000 Fish", achieved: false, reward: { type: 'fishPerClick', amount: 1 } },
    earn1000: { name: "Earn $1,000", achieved: false, reward: { type: 'catchRate', amount: 0.1 } },
    earn10000: { name: "Earn $10,000", achieved: false, reward: { type: 'money', amount: 500 } },
    hire5Fishermen: { name: "Hire 5 Fishermen", achieved: false, reward: { type: 'fishPerSecond', amount: 2 } },
    catch10RareFish: { name: "Catch 10 Rare Fish", achieved: false, reward: { type: 'money', amount: 200 } },
    unlockAllSpots: { name: "Unlock All Fishing Spots", achieved: false, reward: { type: 'catchRate', amount: 0.2 } },
  });

  const [totalFishCaught, setTotalFishCaught] = useState(0);
  const [totalMoneyEarned, setTotalMoneyEarned] = useState(0);
  const [currentSpot, setCurrentSpot] = useState('pond');
  const [unlockedSpots, setUnlockedSpots] = useState(['pond']);

  const calculateCatchChance = () => {
    let baseChance = Object.values(gear).reduce((acc, item) => acc + item.level * item.efficiency, 0) * 0.05;
    if (specialItems.bait.active) baseChance *= specialItems.bait.multiplier;
    return Math.min(baseChance, 1); // Cap at 100%
  };

  const catchChance = calculateCatchChance();
  const fishPerClick = 1 + boatLevel;

  useEffect(() => {
    const interval = setInterval(() => {
      let fishCaught = 0;
      let rareFishCaught = 0;
      let specialFishCaught = 0;
      const attempts = (specialItems.sonar.active ? 3 : 1) * (1 + fishermen);
      const spot = fishingSpots[currentSpot];
      for (let i = 0; i < attempts; i++) {
        if (Math.random() < catchChance) {
          if (Math.random() < spot.specialFishChance) {
            specialFishCaught++;
          } else if (Math.random() < spot.rareFishChance) {
            rareFishCaught++;
          } else {
            fishCaught += fishPerClick;
          }
        }
      }
      if (fishCaught > 0 || rareFishCaught > 0 || specialFishCaught > 0) {
        setFish(prevFish => prevFish + fishCaught);
        setRareFish(prevRareFish => prevRareFish + rareFishCaught);
        setSpecialFish(prevSpecialFish => prevSpecialFish + specialFishCaught);
        setTotalFishCaught(prevTotal => prevTotal + fishCaught + rareFishCaught + specialFishCaught);
        checkAchievements();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [catchChance, specialItems.sonar.active, fishermen, fishPerClick, currentSpot]);

  useEffect(() => {
    setFishPerSecond(catchChance * (specialItems.sonar.active ? 3 : 1) * (1 + fishermen) * fishPerClick);
  }, [catchChance, specialItems.sonar.active, fishermen, fishPerClick]);

  useEffect(() => {
    const timers = Object.entries(specialItems).map(([itemName, item]) => {
      if (item.active) {
        return setTimeout(() => {
          setSpecialItems(prev => ({
            ...prev,
            [itemName]: { ...prev[itemName], active: false },
          }));
        }, item.duration * 1000);
      }
      return null;
    });

    return () => timers.forEach(timer => timer && clearTimeout(timer));
  }, [specialItems]);

  const handleFish = () => {
    if (Math.random() < catchChance) {
      const spot = fishingSpots[currentSpot];
      if (Math.random() < spot.specialFishChance) {
        setSpecialFish(prevSpecialFish => prevSpecialFish + 1);
        setTotalFishCaught(prevTotal => prevTotal + 1);
        toast.success("You caught a special fish! 🦈");
      } else if (Math.random() < spot.rareFishChance) {
        setRareFish(prevRareFish => prevRareFish + 1);
        setTotalFishCaught(prevTotal => prevTotal + 1);
        toast.success("You caught a rare fish! 🐠");
      } else {
        const fishCaught = fishPerClick;
        setFish(prevFish => prevFish + fishCaught);
        setTotalFishCaught(prevTotal => prevTotal + fishCaught);
      }
      checkAchievements();
    }
  };

  const handleSell = () => {
    const sellMultiplier = specialItems.license.active ? specialItems.license.multiplier : 1;
    const spot = fishingSpots[currentSpot];
    const regularFishValue = fish * sellMultiplier * spot.valueMultiplier;
    const rareFishValue = rareFish * 10 * sellMultiplier * spot.valueMultiplier;
    const specialFishValue = specialFish * 50 * sellMultiplier * spot.valueMultiplier;
    const totalMoneyEarned = regularFishValue + rareFishValue + specialFishValue;
    
    setMoney(prevMoney => prevMoney + totalMoneyEarned);
    setTotalMoneyEarned(prevTotal => prevTotal + totalMoneyEarned);
    setFish(0);
    setRareFish(0);
    setSpecialFish(0);
    checkAchievements();
  };

  const handleBuyGear = (itemName) => {
    const item = gear[itemName];
    if (money >= item.cost) {
      setMoney(prevMoney => prevMoney - item.cost);
      setGear(prevGear => ({
        ...prevGear,
        [itemName]: {
          ...item,
          level: item.level + 1,
          cost: Math.floor(item.cost * 1.5),
        },
      }));
    }
  };

  const handleUpgradeBoat = () => {
    const cost = (boatLevel + 1) * 1000;
    if (money >= cost) {
      setMoney(prevMoney => prevMoney - cost);
      setBoatLevel(prevLevel => prevLevel + 1);
    }
  };

  const handleHireFisherman = () => {
    const cost = (fishermen + 1) * 500;
    if (money >= cost) {
      setMoney(prevMoney => prevMoney - cost);
      setFishermen(prevFishermen => prevFishermen + 1);
      checkAchievements();
    }
  };

  const handleBuySpecialItem = (itemName) => {
    const item = specialItems[itemName];
    if (money >= item.cost && !item.active) {
      setMoney(prevMoney => prevMoney - item.cost);
      setSpecialItems(prevItems => ({
        ...prevItems,
        [itemName]: { ...item, active: true },
      }));
    }
  };

  const handleChangeSpot = (spotKey) => {
    if (unlockedSpots.includes(spotKey)) {
      setCurrentSpot(spotKey);
    } else {
      const spot = fishingSpots[spotKey];
      if (money >= spot.unlockCost) {
        setMoney(prevMoney => prevMoney - spot.unlockCost);
        setUnlockedSpots(prevUnlocked => [...prevUnlocked, spotKey]);
        setCurrentSpot(spotKey);
        toast.success(`Unlocked ${spot.name}!`);
        checkAchievements();
      } else {
        toast.error(`Not enough money to unlock ${spot.name}`);
      }
    }
  };

  const checkAchievements = () => {
    const newAchievements = { ...achievements };
    let achievementUnlocked = false;

    if (totalFishCaught >= 100 && !newAchievements.catch100.achieved) {
      newAchievements.catch100.achieved = true;
      setMoney(prevMoney => prevMoney + newAchievements.catch100.reward.amount);
      achievementUnlocked = true;
    }

    if (totalFishCaught >= 1000 && !newAchievements.catch1000.achieved) {
      newAchievements.catch1000.achieved = true;
      setFishPerClick(prevFishPerClick => prevFishPerClick + newAchievements.catch1000.reward.amount);
      achievementUnlocked = true;
    }

    if (totalMoneyEarned >= 1000 && !newAchievements.earn1000.achieved) {
      newAchievements.earn1000.achieved = true;
      setCatchChance(prevCatchChance => prevCatchChance + newAchievements.earn1000.reward.amount);
      achievementUnlocked = true;
    }

    if (totalMoneyEarned >= 10000 && !newAchievements.earn10000.achieved) {
      newAchievements.earn10000.achieved = true;
      setMoney(prevMoney => prevMoney + newAchievements.earn10000.reward.amount);
      achievementUnlocked = true;
    }

    if (fishermen >= 5 && !newAchievements.hire5Fishermen.achieved) {
      newAchievements.hire5Fishermen.achieved = true;
      setFishPerSecond(prevFishPerSecond => prevFishPerSecond + newAchievements.hire5Fishermen.reward.amount);
      achievementUnlocked = true;
    }

    if (unlockedSpots.length === Object.keys(fishingSpots).length && !newAchievements.unlockAllSpots.achieved) {
      newAchievements.unlockAllSpots.achieved = true;
      setCatchChance(prevCatchChance => prevCatchChance + newAchievements.unlockAllSpots.reward.amount);
      achievementUnlocked = true;
    }

    if (achievementUnlocked) {
      setAchievements(newAchievements);
      toast.success("Achievement Unlocked!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Idle Fishing Adventure</h1>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Fishing Idle Game</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <FishingArea
              fish={Math.floor(fish)}
              rareFish={rareFish}
              specialFish={specialFish}
              onFish={handleFish}
              catchChance={catchChance}
              fishPerClick={fishPerClick}
              currentSpot={currentSpot}
              onChangeSpot={handleChangeSpot}
              unlockedSpots={unlockedSpots}
            />
            <Inventory
              fish={Math.floor(fish)}
              rareFish={rareFish}
              specialFish={specialFish}
              money={money}
              onSell={handleSell}
            />
            <Shop 
              money={money} 
              gear={gear} 
              onBuyGear={handleBuyGear} 
              onUpgradeBoat={handleUpgradeBoat}
              onHireFisherman={handleHireFisherman}
              boatLevel={boatLevel}
              fishermen={fishermen}
            />
            <Metrics fishPerSecond={fishPerSecond} fishPerMinute={fishPerSecond * 60} fishermen={fishermen} />
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Active Bonuses</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                {Object.entries(specialItems).map(([itemName, item]) => 
                  item.active && (
                    <Badge key={itemName} variant="secondary">
                      {itemName} active
                    </Badge>
                  )
                )}
              </CardContent>
            </Card>
            <Achievements achievements={achievements} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const FishingArea = ({ fish, onFish, catchChance, fishPerClick }) => (
  <Card className="bg-blue-100">
    <CardHeader>
      <CardTitle>Fishing Area</CardTitle>
    </CardHeader>
    <CardContent>
      <Button className="w-full mb-4" onClick={onFish}>Go Fishing 🎣</Button>
      <p>Fish: {fish} 🐟</p>
      <p>Catch Chance: {(catchChance * 100).toFixed(2)}%</p>
      <p>Fish per Click: {fishPerClick}</p>
    </CardContent>
  </Card>
);

const Inventory = ({ fish, money, onSell }) => (
  <Card className="bg-green-100">
    <CardHeader>
      <CardTitle>Inventory</CardTitle>
    </CardHeader>
    <CardContent>
      <Button className="w-full mb-4" onClick={onSell}>Sell Fish $</Button>
      <p>Money: ${money.toFixed(2)}</p>
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
      const attempts = (specialItems.sonar.active ? 3 : 1) * (1 + fishermen);
      for (let i = 0; i < attempts; i++) {
        if (Math.random() < catchChance) {
          fishCaught += fishPerClick;
        }
      }
      if (fishCaught > 0) {
        setFish(prevFish => prevFish + fishCaught);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [catchChance, specialItems.sonar.active, fishermen, fishPerClick]);

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
      setFish(prevFish => prevFish + fishPerClick);
    }
  };

  const handleSell = () => {
    const sellMultiplier = specialItems.license.active ? specialItems.license.multiplier : 1;
    setMoney(prevMoney => prevMoney + fish * sellMultiplier);
    setFish(0);
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Idle Fishing Adventure</h1>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Fishing Idle Game</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <FishingArea fish={Math.floor(fish)} onFish={handleFish} catchChance={catchChance} fishPerClick={fishPerClick} />
            <Inventory fish={Math.floor(fish)} money={money} onSell={handleSell} />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

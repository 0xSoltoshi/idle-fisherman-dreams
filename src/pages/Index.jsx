import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const FishingArea = ({ fish, onFish, catchChance }) => (
  <Card className="bg-blue-100">
    <CardHeader>
      <CardTitle>Fishing Area</CardTitle>
    </CardHeader>
    <CardContent>
      <Button className="w-full mb-4" onClick={onFish}>Go Fishing 🎣</Button>
      <p>Fish: {fish} 🐟</p>
      <p>Catch Chance: {(catchChance * 100).toFixed(2)}%</p>
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

const Metrics = ({ fishPerSecond, fishPerMinute }) => (
  <Card className="bg-indigo-100">
    <CardHeader>
      <CardTitle>Metrics</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-between">
      <p>Fish per Second: {fishPerSecond.toFixed(2)} 📈</p>
      <p>Fish per Minute: {fishPerMinute.toFixed(2)} 📈</p>
    </CardContent>
  </Card>
);

const Shop = ({ money, gear, onBuyGear }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="w-full">Open Shop 🛒</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Fishing Gear Shop</DialogTitle>
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
    boat: { level: 0, cost: 500, efficiency: 0 },
  });

  const calculateCatchChance = () => {
    return Object.values(gear).reduce((acc, item) => acc + item.level * item.efficiency, 0) * 0.05;
  };

  const catchChance = calculateCatchChance();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < catchChance) {
        setFish(prevFish => prevFish + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [catchChance]);

  useEffect(() => {
    setFishPerSecond(catchChance);
  }, [catchChance]);

  const handleFish = () => {
    if (Math.random() < catchChance) {
      setFish(prevFish => prevFish + 1);
    }
  };

  const handleSell = () => {
    setMoney(prevMoney => prevMoney + fish);
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Idle Fishing Adventure</h1>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Fishing Idle Game</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <FishingArea fish={Math.floor(fish)} onFish={handleFish} catchChance={catchChance} />
            <Inventory fish={Math.floor(fish)} money={money} onSell={handleSell} />
            <Shop money={money} gear={gear} onBuyGear={handleBuyGear} />
            <Metrics fishPerSecond={fishPerSecond} fishPerMinute={fishPerSecond * 60} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

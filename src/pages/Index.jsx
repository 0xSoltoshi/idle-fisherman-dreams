import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FishingArea = ({ fish, onFish }) => (
  <Card className="bg-blue-100">
    <CardHeader>
      <CardTitle>Fishing Area</CardTitle>
    </CardHeader>
    <CardContent>
      <Button className="w-full mb-4" onClick={onFish}>Go Fishing 🎣</Button>
      <p>Fish: {fish} 🐟</p>
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
      <p>Money: ${money}</p>
    </CardContent>
  </Card>
);

const Upgrades = ({ rodLevel, onUpgrade, upgradeCost }) => (
  <Card className="bg-yellow-100">
    <CardHeader>
      <CardTitle>Upgrades</CardTitle>
    </CardHeader>
    <CardContent>
      <Button className="w-full mb-4" onClick={onUpgrade}>Upgrade Rod (Cost: ${upgradeCost}) 🎣</Button>
      <p>Rod Level: {rodLevel} 🎣</p>
    </CardContent>
  </Card>
);

const AutoFishers = ({ autoFishers, onBuyAutoFisher, autoFisherCost }) => (
  <Card className="bg-purple-100">
    <CardHeader>
      <CardTitle>Auto Fishers</CardTitle>
    </CardHeader>
    <CardContent>
      <Button className="w-full mb-4" onClick={onBuyAutoFisher}>Buy Auto Fisher (Cost: ${autoFisherCost}) 🎣</Button>
      <p>Auto Fishers: {autoFishers} 🎣</p>
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

const Index = () => {
  const [fish, setFish] = useState(19);
  const [money, setMoney] = useState(0);
  const [rodLevel, setRodLevel] = useState(1);
  const [autoFishers, setAutoFishers] = useState(0);
  const [fishPerSecond, setFishPerSecond] = useState(0.5);

  const upgradeCost = 100;
  const autoFisherCost = 500;

  useEffect(() => {
    const interval = setInterval(() => {
      setFish(prevFish => prevFish + fishPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [fishPerSecond]);

  const handleFish = () => {
    setFish(prevFish => prevFish + rodLevel);
  };

  const handleSell = () => {
    setMoney(prevMoney => prevMoney + fish);
    setFish(0);
  };

  const handleUpgrade = () => {
    if (money >= upgradeCost) {
      setMoney(prevMoney => prevMoney - upgradeCost);
      setRodLevel(prevLevel => prevLevel + 1);
      setFishPerSecond(prevRate => prevRate + 0.1);
    }
  };

  const handleBuyAutoFisher = () => {
    if (money >= autoFisherCost) {
      setMoney(prevMoney => prevMoney - autoFisherCost);
      setAutoFishers(prevAutoFishers => prevAutoFishers + 1);
      setFishPerSecond(prevRate => prevRate + 0.5);
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
            <FishingArea fish={Math.floor(fish)} onFish={handleFish} />
            <Inventory fish={Math.floor(fish)} money={Math.floor(money)} onSell={handleSell} />
            <Upgrades rodLevel={rodLevel} onUpgrade={handleUpgrade} upgradeCost={upgradeCost} />
            <AutoFishers autoFishers={autoFishers} onBuyAutoFisher={handleBuyAutoFisher} autoFisherCost={autoFisherCost} />
            <Metrics fishPerSecond={fishPerSecond} fishPerMinute={fishPerSecond * 60} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

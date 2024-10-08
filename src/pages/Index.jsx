import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format, isToday } from 'date-fns';
import { useTheme } from 'next-themes';
import { Moon, Sun, Fish, DollarSign, BarChart2, Bug } from 'lucide-react';
import FishPricesMenu from "@/components/FishPricesMenu";
import AutoFisher from "@/components/AutoFisher";

const BASE_XP = 100;
const XP_INCREMENT = 50;

const fishingSpots = {
  pond: {
    name: "Pond",
    unlockCost: 0,
    fish: ["Carp", "Bluegill", "Catfish"],
    rareFish: ["Golden Carp"],
    specialFish: ["Albino Catfish"],
    challenge: "Catch 100 Pond fish",
    valueMultiplier: 1
  },
  lake: {
    name: "Lake",
    unlockCost: 5000,
    fish: ["Bass", "Perch", "Trout"],
    rareFish: ["Rainbow Trout"],
    specialFish: ["Giant Bass"],
    challenge: "Catch a Giant Bass",
    valueMultiplier: 2
  },
  river: {
    name: "River",
    unlockCost: 25000,
    fish: ["Salmon", "Pike", "Sturgeon"],
    rareFish: ["Golden Sturgeon"],
    specialFish: ["River Monster"],
    challenge: "Catch 10 Golden Sturgeons",
    valueMultiplier: 3
  },
  ocean: {
    name: "Ocean",
    unlockCost: 100000,
    fish: ["Tuna", "Cod", "Mackerel"],
    rareFish: ["Swordfish"],
    specialFish: ["Great White Shark"],
    challenge: "Catch a Great White Shark",
    valueMultiplier: 5
  },
};

const FishingArea = ({ fish, rareFish, specialFish, onFish, catchChance, fishPerClick, currentSpot, onChangeSpot, unlockedSpots, onNet, onTrap, netCooldown, trapCooldown, gear, money }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const handleFishClick = () => {
    setIsAnimating(true);
    onFish();
    setTimeout(() => setIsAnimating(false), 500);
  };
  const currentSpotData = fishingSpots[currentSpot];
  return (
    <Card className="bg-blue-50 dark:bg-blue-950 transition-colors duration-200 border border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-800 dark:text-blue-200">Fishing Area: {currentSpotData.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={onChangeSpot} value={currentSpot}>
          <SelectTrigger className="w-full mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select fishing spot" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(fishingSpots).map(([key, spot]) => (
              <SelectItem key={key} value={key}>
                {spot.name} {!unlockedSpots.includes(key) && `(Unlock: $${spot.unlockCost.toLocaleString()})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Button className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white" onClick={handleFishClick}>
            Go Fishing <span className={`inline-block ml-1 ${isAnimating ? 'rod-animation' : ''}`}>🎣</span>
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white" 
            onClick={onNet} 
            disabled={netCooldown > 0 || gear.net.level === 0}
          >
            Use Net 🕸️ {netCooldown > 0 ? `(${netCooldown}s)` : ''}
          </Button>
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800 text-white" 
            onClick={onTrap} 
            disabled={trapCooldown > 0 || gear.trap.level === 0}
          >
            Set Trap 🪤 {trapCooldown > 0 ? `(${trapCooldown}s)` : ''}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">Fish: {fish} 🐟</p>
          <p className="text-gray-700 dark:text-gray-300">Rare Fish: {rareFish} 🐠</p>
          <p className="text-gray-700 dark:text-gray-300">Special Fish: {specialFish} 🦈</p>
          <p className="text-gray-700 dark:text-gray-300">Catch Chance: {(catchChance * 100).toFixed(2)}%</p>
          <p className="text-gray-700 dark:text-gray-300">Fish per Click: {fishPerClick}</p>
          <p className="text-gray-700 dark:text-gray-300">Current Money: ${money.toFixed(2)}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-bold text-blue-800 dark:text-blue-200">Available Fish:</h3>
          <p className="text-gray-700 dark:text-gray-300">Common: {currentSpotData.fish.join(", ")}</p>
          <p className="text-gray-700 dark:text-gray-300">Rare: {currentSpotData.rareFish.join(", ")}</p>
          <p className="text-gray-700 dark:text-gray-300">Special: {currentSpotData.specialFish.join(", ")}</p>
        </div>
        <div className="mt-2">
          <h3 className="font-bold text-blue-800 dark:text-blue-200">Challenge:</h3>
          <p className="text-gray-700 dark:text-gray-300">{currentSpotData.challenge}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Inventory = ({ fish, rareFish, specialFish, netCatch, trapCatch, money, onSell, fishPrices }) => {
  const calculateValue = (count, price) => (count * price).toFixed(2);
  return (
    <Card className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="text-green-800 dark:text-green-200">Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full mb-4 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white" onClick={onSell}>Sell All Catches $</Button>
        <p className="text-gray-700 dark:text-gray-300">Money: ${money.toFixed(2)}</p>
        <p className="text-gray-700 dark:text-gray-300">Regular Fish: {fish} 🐟 (${calculateValue(fish, fishPrices['Regular Fish'])})</p>
        <p className="text-gray-700 dark:text-gray-300">Rare Fish: {rareFish} 🐠 (${calculateValue(rareFish, fishPrices['Rare Fish'])})</p>
        <p className="text-gray-700 dark:text-gray-300">Special Fish: {specialFish} 🦈 (${calculateValue(specialFish, fishPrices['Special Fish'])})</p>
        <p className="text-gray-700 dark:text-gray-300">Net Catch: Small {netCatch.small} 🐠 (${calculateValue(netCatch.small, fishPrices['Small Net Fish'])}) Medium {netCatch.medium} 🐡 (${calculateValue(netCatch.medium, fishPrices['Medium Net Fish'])}) Large {netCatch.large} 🐳 (${calculateValue(netCatch.large, fishPrices['Large Net Fish'])})</p>
        <p className="text-gray-700 dark:text-gray-300">Trap Catch: Common {trapCatch.common} 🦀 (${calculateValue(trapCatch.common, fishPrices['Common Trap Fish'])}) Uncommon {trapCatch.uncommon} 🦑 (${calculateValue(trapCatch.uncommon, fishPrices['Uncommon Trap Fish'])}) Rare {trapCatch.rare} 🐙 (${calculateValue(trapCatch.rare, fishPrices['Rare Trap Fish'])})</p>
      </CardContent>
    </Card>
  );
};

const Metrics = ({ fishPerSecond, fishPerMinute, level, xp }) => {
  const xpNeededForNextLevel = BASE_XP + (level * XP_INCREMENT);
  const xpProgress = (xp / xpNeededForNextLevel) * 100;
  return (
    <Card className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800">
      <CardHeader>
        <CardTitle className="text-indigo-800 dark:text-indigo-200">Metrics</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-gray-700 dark:text-gray-300">Fish per Second: {fishPerSecond.toFixed(2)} 📈</p>
        <p className="text-gray-700 dark:text-gray-300">Fish per Minute: {fishPerMinute.toFixed(2)} 📈</p>
        <p className="text-gray-700 dark:text-gray-300">Level: {level} 🏆</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-indigo-600 dark:bg-indigo-400 h-2.5 rounded-full" style={{ width: `${xpProgress}%` }}></div>
        </div>
        <p className="text-gray-700 dark:text-gray-300">XP: {xp} / {xpNeededForNextLevel}</p>
      </CardContent>
    </Card>
  );
};

const Shop = ({ money, gear, onBuyGear, onUpgradeBoat, boatLevel }) => (
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
      </div>
    </DialogContent>
  </Dialog>
);

const Index = () => {
  const [fish, setFish] = useState(0);
  const [rareFish, setRareFish] = useState(0);
  const [specialFish, setSpecialFish] = useState(0);
  const [money, setMoney] = useState(10);
  const [riverGoldenSturgeonCount, setRiverGoldenSturgeonCount] = useState(0);
  const [pondFishCount, setPondFishCount] = useState(0);
  const [giantBassCaught, setGiantBassCaught] = useState(false);
  const [greatWhiteSharkCaught, setGreatWhiteSharkCaught] = useState(false);
  const [fishPrices, setFishPrices] = useState({
    'Regular Fish': 1,
    'Rare Fish': 10,
    'Special Fish': 50,
    'Small Net Fish': 20,
    'Medium Net Fish': 100,
    'Large Net Fish': 500,
    'Common Trap Fish': 50,
    'Uncommon Trap Fish': 250,
    'Rare Trap Fish': 1000,
  });
  const [fishPerSecond, setFishPerSecond] = useState(0);
  const [fishPerClick, setFishPerClick] = useState(1);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [loginStreak, setLoginStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [gear, setGear] = useState({
    rod: { level: 1, cost: 10, description: "Increases catch chance" },
    net: { level: 0, cost: 50, description: "Catch multiple fish over time" },
    trap: { level: 0, cost: 100, description: "Catch rare creatures over time" },
  });
  const [netCooldown, setNetCooldown] = useState(0);
  const [trapCooldown, setTrapCooldown] = useState(0);
  const [netCatch, setNetCatch] = useState({ small: 0, medium: 0, large: 0 });
  const [trapCatch, setTrapCatch] = useState({ common: 0, uncommon: 0, rare: 0 });
  const [boatLevel, setBoatLevel] = useState(0);
  const [catchChance, setCatchChance] = useState(0.5);
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
    catch10RareFish: { name: "Catch 10 Rare Fish", achieved: false, reward: { type: 'money', amount: 200 } },
    unlockAllSpots: { name: "Unlock All Fishing Spots", achieved: false, reward: { type: 'catchRate', amount: 0.2 } },
  });
  const [totalFishCaught, setTotalFishCaught] = useState(0);
  const [totalMoneyEarned, setTotalMoneyEarned] = useState(0);
  const [currentSpot, setCurrentSpot] = useState('pond');
  const [unlockedSpots, setUnlockedSpots] = useState(['pond']);
  const [leaderboardData, setLeaderboardData] = useState([
    { id: 1, name: 'Player 1', fishCount: 1000, moneyEarned: 5000 },
    { id: 2, name: 'Player 2', fishCount: 800, moneyEarned: 4000 },
    { id: 3, name: 'Player 3', fishCount: 600, moneyEarned: 3000 },
  ]);

  // Auto Fisher state
  const [autoFisherActive, setAutoFisherActive] = useState(false);
  const [autoFisherProgress, setAutoFisherProgress] = useState(0);
  const [autoFisherLevel, setAutoFisherLevel] = useState(1);
  const [autoFisherUpgradeCost, setAutoFisherUpgradeCost] = useState(1000);

  const calculateCatchChance = () => {
    let baseChance = 0.5;
    Object.values(gear).forEach(item => {
      baseChance += item.level * 0.05;
    });
    if (specialItems.bait.active) baseChance *= specialItems.bait.multiplier;
    return Math.min(baseChance, 1);
  };

  useEffect(() => {
    setFishPerClick(1 + boatLevel);
  }, [boatLevel]);

  useEffect(() => {
    const newCatchChance = calculateCatchChance();
    setCatchChance(newCatchChance);
  }, [gear, specialItems.bait.active]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetCooldown(prev => Math.max(0, prev - 1));
      setTrapCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFishPerSecond(catchChance * (specialItems.sonar.active ? 3 : 1) * fishPerClick);
  }, [catchChance, specialItems.sonar.active, fishPerClick]);

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

  useEffect(() => {
    checkDailyReward();
  }, []);

  // Auto Fisher effect
  useEffect(() => {
    let interval;
    if (autoFisherActive) {
      interval = setInterval(() => {
        setAutoFisherProgress(prev => {
          if (prev >= 100) {
            handleAutoFish();
            return 0;
          }
          return prev + (autoFisherLevel / 10);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [autoFisherActive, autoFisherLevel]);

  const checkDailyReward = () => {
    const today = new Date();
    const lastLogin = lastLoginDate ? new Date(lastLoginDate) : null;
    if (!lastLogin || !isToday(lastLogin)) {
      if (lastLogin && (today - lastLogin) / (1000 * 60 * 60 * 24) <= 1) {
        setLoginStreak(prevStreak => prevStreak + 1);
      } else {
        setLoginStreak(1);
      }
      setLastLoginDate(today.toISOString());
      awardDailyReward();
    }
  };

  const awardDailyReward = () => {
    const baseReward = 50;
    const rewardMultiplier = Math.min(loginStreak, 7);
    const reward = baseReward * rewardMultiplier;
    setMoney(prevMoney => prevMoney + reward);
    toast.success(`Daily Reward: $${reward}! Login streak: ${loginStreak} day${loginStreak > 1 ? 's' : ''}`);
  };

  const handleFish = () => {
    const spot = fishingSpots[currentSpot];
    let xpGained = 0;
    let fishCaught = 0;
    let rareFishCaught = 0;
    let specialFishCaught = 0;
    for (let i = 0; i < fishPerClick; i++) {
      if (Math.random() < catchChance) {
        const rarityRoll = Math.random();
        if (rarityRoll < 0.01 * gear.rod.level) {
          specialFishCaught++;
          xpGained += 50;
        } else if (rarityRoll < 0.05 * gear.rod.level) {
          rareFishCaught++;
          xpGained += 20;
        } else {
          fishCaught++;
          xpGained += 5;
        }
      }
    }
    setFish(prevFish => prevFish + fishCaught);
    setRareFish(prevRareFish => prevRareFish + rareFishCaught);
    setSpecialFish(prevSpecialFish => prevSpecialFish + specialFishCaught);
    const totalCaught = fishCaught + rareFishCaught + specialFishCaught;
    setTotalFishCaught(prevTotal => {
      const newTotal = prevTotal + totalCaught;
      updateLeaderboard(newTotal, totalMoneyEarned);
      return newTotal;
    });
    setXp(prevXp => {
      const newXp = prevXp + xpGained;
      checkLevelUp(newXp);
      return newXp;
    });
    checkAchievements();
    if (specialFishCaught > 0) {
      const specialFishName = spot.specialFish[Math.floor(Math.random() * spot.specialFish.length)];
      toast.success(`You caught a ${specialFishName}! 🦈`);
    }
    if (rareFishCaught > 0) {
      const rareFishName = spot.rareFish[Math.floor(Math.random() * spot.rareFish.length)];
      toast.success(`You caught a ${rareFishName}! 🐠`);
    }
    if (fishCaught > 0) {
      const fishName = spot.fish[Math.floor(Math.random() * spot.fish.length)];
      toast.success(`You caught ${fishCaught} ${fishName}! 🐟`);
    }
    checkLocationChallenge(spot, fishCaught, rareFishCaught, specialFishCaught);
  };

  const handleAutoFish = () => {
    const autoFishMultiplier = autoFisherLevel * 0.5;
    handleFish();
    for (let i = 0; i < autoFishMultiplier; i++) {
      handleFish();
    }
  };

  const checkLocationChallenge = (spot, fishCaught, rareFishCaught, specialFishCaught) => {
    switch (spot.name) {
      case "Pond":
        setPondFishCount(prev => {
          const newCount = prev + fishCaught;
          if (newCount >= 100 && prev < 100) {
            toast.success("Challenge completed: Catch 100 Pond fish!");
            setMoney(prevMoney => prevMoney + 1000);
          }
          return newCount;
        });
        break;
      case "Lake":
        if (specialFishCaught > 0 && !giantBassCaught) {
          setGiantBassCaught(true);
          toast.success("Challenge completed: Catch a Giant Bass!");
          setMoney(prevMoney => prevMoney + 5000);
        }
        break;
      case "River":
        if (rareFishCaught > 0) {
          setRiverGoldenSturgeonCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 10 && prev < 10) {
              toast.success("Challenge completed: Catch 10 Golden Sturgeons!");
              setMoney(prevMoney => prevMoney + 10000);
            }
            return newCount;
          });
        }
        break;
      case "Ocean":
        if (specialFishCaught > 0 && !greatWhiteSharkCaught) {
          setGreatWhiteSharkCaught(true);
          toast.success("Challenge completed: Catch a Great White Shark!");
          setMoney(prevMoney => prevMoney + 50000);
        }
        break;
    }
  };

  const updateLeaderboard = (newFishCount, newMoneyEarned) => {
    setLeaderboardData(prevData => {
      const playerIndex = prevData.findIndex(player => player.id === 1);
      if (playerIndex !== -1) {
        const updatedData = [...prevData];
        updatedData[playerIndex] = {
          ...updatedData[playerIndex],
          fishCount: newFishCount,
          moneyEarned: newMoneyEarned
        };
        return updatedData.sort((a, b) => b.fishCount - a.fishCount);
      }
      return prevData;
    });
  };

  const checkLevelUp = (currentXp) => {
    const xpNeededForNextLevel = BASE_XP + (level * XP_INCREMENT);
    if (currentXp >= xpNeededForNextLevel) {
      setLevel(prevLevel => {
        const newLevel = prevLevel + 1;
        toast.success(`Level Up! You are now level ${newLevel}!`);
        return newLevel;
      });
      setXp(currentXp - xpNeededForNextLevel);
      setCatchChance(prevChance => Math.min(prevChance + 0.01, 1));
    }
  };

  const handleSell = () => {
    const sellMultiplier = specialItems.license.active ? specialItems.license.multiplier : 1;
    const spot = fishingSpots[currentSpot];
    const regularFishValue = fish * sellMultiplier * spot.valueMultiplier;
    const rareFishValue = rareFish * 10 * sellMultiplier * spot.valueMultiplier;
    const specialFishValue = specialFish * 50 * sellMultiplier * spot.valueMultiplier;
    const netCatchValue = (
      netCatch.small * 20 + 
      netCatch.medium * 100 + 
      netCatch.large * 500
    ) * sellMultiplier * spot.valueMultiplier;
    const trapCatchValue = (
      trapCatch.common * 50 + 
      trapCatch.uncommon * 250 + 
      trapCatch.rare * 1000
    ) * sellMultiplier * spot.valueMultiplier;
    const totalMoneyEarned = regularFishValue + rareFishValue + specialFishValue + netCatchValue + trapCatchValue;
    setMoney(prevMoney => prevMoney + totalMoneyEarned);
    setTotalMoneyEarned(prevTotal => {
      const newTotal = prevTotal + totalMoneyEarned;
      updateLeaderboard(totalFishCaught, newTotal);
      return newTotal;
    });
    const xpGained = Math.floor(totalMoneyEarned / 10);
    setXp(prevXp => {
      const newXp = prevXp + xpGained;
      checkLevelUp(newXp);
      return newXp;
    });
    setFish(0);
    setRareFish(0);
    setSpecialFish(0);
    setNetCatch({ small: 0, medium: 0, large: 0 });
    setTrapCatch({ common: 0, uncommon: 0, rare: 0 });
    checkAchievements();
    toast.success(`Sold all catches for $${totalMoneyEarned.toFixed(2)}!`);
  };

  const handleDevMoney = () => {
    setMoney(prevMoney => prevMoney + 10000);
    toast.success("Added $10,000 for development!");
  };

  const handleNet = () => {
    if (gear.net.level > 0 && netCooldown === 0) {
      const netDuration = 30 - (gear.net.level * 2);
      setNetCooldown(netDuration);
      toast.success("Net cast! Check back in " + netDuration + " seconds.");
      setTimeout(() => {
        const catchAmount = Math.floor(Math.random() * (5 + gear.net.level)) + gear.net.level;
        const newCatch = { small: 0, medium: 0, large: 0 };
        for (let i = 0; i < catchAmount; i++) {
          const rarityRoll = Math.random();
          if (rarityRoll < 0.02 * gear.net.level) {
            newCatch.large++;
          } else if (rarityRoll < 0.1 * gear.net.level) {
            newCatch.medium++;
          } else {
            newCatch.small++;
          }
        }
        setNetCatch(prev => ({
          small: prev.small + newCatch.small,
          medium: prev.medium + newCatch.medium,
          large: prev.large + newCatch.large
        }));
        setNetCooldown(0);
        toast.success(`Net pulled in! Caught ${catchAmount} creatures!`);
      }, netDuration * 1000);
    }
  };

  const handleTrap = () => {
    if (gear.trap.level > 0 && trapCooldown === 0) {
      const trapDuration = 60 - (gear.trap.level * 3);
      setTrapCooldown(trapDuration);
      toast.success("Trap set! Check back in " + trapDuration + " seconds.");
      setTimeout(() => {
        const catchAmount = Math.floor(Math.random() * (3 + gear.trap.level)) + 1;
        const newCatch = { common: 0, uncommon: 0, rare: 0 };
        for (let i = 0; i < catchAmount; i++) {
          const rarityRoll = Math.random();
          if (rarityRoll < 0.03 * gear.trap.level) {
            newCatch.rare++;
          } else if (rarityRoll < 0.15 * gear.trap.level) {
            newCatch.uncommon++;
          } else {
            newCatch.common++;
          }
        }
        setTrapCatch(prev => ({
          common: prev.common + newCatch.common,
          uncommon: prev.uncommon + newCatch.uncommon,
          rare: prev.rare + newCatch.rare
        }));
        setTrapCooldown(0);
        toast.success(`Trap checked! Caught ${catchAmount} big creatures!`);
      }, trapDuration * 1000);
    }
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
      toast.success(`Moved to ${fishingSpots[spotKey].name}`);
    } else {
      const spot = fishingSpots[spotKey];
      if (money >= spot.unlockCost) {
        setMoney(prevMoney => prevMoney - spot.unlockCost);
        setUnlockedSpots(prevUnlocked => [...prevUnlocked, spotKey]);
        setCurrentSpot(spotKey);
        toast.success(`Unlocked and moved to ${spot.name}!`);
        checkAchievements();
      } else {
        toast.error(`Not enough money to unlock ${spot.name}. You need $${spot.unlockCost}.`);
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

  const handleToggleAutoFisher = () => {
    setAutoFisherActive(prev => !prev);
  };

  const handleUpgradeAutoFisher = () => {
    if (money >= autoFisherUpgradeCost) {
      setMoney(prev => prev - autoFisherUpgradeCost);
      setAutoFisherLevel(prev => prev + 1);
      setAutoFisherUpgradeCost(prev => Math.floor(prev * 1.5));
      toast.success(`Auto Fisher upgraded to level ${autoFisherLevel + 1}!`);
    } else {
      toast.error("Not enough money to upgrade Auto Fisher!");
    }
  };

  const { theme, setTheme } = useTheme();

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
          <Card className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center text-gray-800 dark:text-gray-100">Fishing Area</CardTitle>
            </CardHeader>
            <CardContent>
              <FishingArea
                fish={Math.floor(fish)}
                rareFish={rareFish}
                specialFish={specialFish}
                onFish={handleFish}
                onNet={handleNet}
                onTrap={handleTrap}
                catchChance={catchChance}
                fishPerClick={fishPerClick}
                currentSpot={currentSpot}
                onChangeSpot={handleChangeSpot}
                unlockedSpots={unlockedSpots}
                netCooldown={netCooldown}
                trapCooldown={trapCooldown}
                gear={gear}
                money={money}
              />
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
                  <Fish className="mr-2" /> Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Inventory
                  fish={Math.floor(fish)}
                  rareFish={rareFish}
                  specialFish={specialFish}
                  netCatch={netCatch}
                  trapCatch={trapCatch}
                  money={money}
                  onSell={handleSell}
                  fishPrices={fishPrices}
                />
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
                  <DollarSign className="mr-2" /> Shop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Shop 
                  money={money} 
                  gear={gear} 
                  onBuyGear={handleBuyGear} 
                  onUpgradeBoat={handleUpgradeBoat}
                  boatLevel={boatLevel}
                />
              </CardContent>
            </Card>
          </div>
          <Card className="bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-gray-800 dark:text-gray-100">
                <BarChart2 className="mr-2" /> Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Metrics 
                fishPerSecond={fishPerSecond} 
                fishPerMinute={fishPerSecond * 60} 
                level={level}
                xp={xp}
              />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Active Bonuses</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {Object.entries(specialItems).map(([itemName, item]) => 
                item.active && (
                  <Badge key={itemName} variant="secondary">
                    {itemName} active
                  </Badge>
                )
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-gray-100">Auto Fisher</CardTitle>
            </CardHeader>
            <CardContent>
              <AutoFisher
                isActive={autoFisherActive}
                progress={autoFisherProgress}
                fishPerSecond={fishPerSecond * autoFisherLevel * 0.5}
                onToggle={handleToggleAutoFisher}
                upgradeCost={autoFisherUpgradeCost}
                onUpgrade={handleUpgradeAutoFisher}
              />
            </CardContent>
          </Card>
          <div className="lg:col-span-3 flex justify-center mt-4">
            <FishPricesMenu fishPrices={fishPrices} />
          </div>
          <div className="lg:col-span-3 flex justify-center mt-4">
            <Button
              onClick={handleDevMoney}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Bug className="mr-2 h-4 w-4" /> Dev: Add $10,000
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
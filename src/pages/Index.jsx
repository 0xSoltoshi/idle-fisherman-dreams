import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Achievements from "@/components/Achievements";
import Leaderboard from "@/components/Leaderboard";
import { toast } from "sonner";
import { format, isToday } from 'date-fns';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const BASE_XP = 100;
const XP_INCREMENT = 50;

const fishingSpots = {
  pond: { name: "Pond", unlockCost: 0, rareFishChance: 0.05, specialFishChance: 0, valueMultiplier: 1 },
  lake: { name: "Lake", unlockCost: 1000, rareFishChance: 0.08, specialFishChance: 0.02, valueMultiplier: 1.5 },
  river: { name: "River", unlockCost: 5000, rareFishChance: 0.1, specialFishChance: 0.05, valueMultiplier: 2 },
  ocean: { name: "Ocean", unlockCost: 20000, rareFishChance: 0.15, specialFishChance: 0.1, valueMultiplier: 3 },
};

const FishingArea = ({ fish, rareFish, specialFish, onFish, catchChance, fishPerClick, currentSpot, onChangeSpot, unlockedSpots }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFishClick = () => {
    setIsAnimating(true);
    onFish();
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <Card className="bg-blue-50 dark:bg-blue-950 transition-colors duration-200 border border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-800 dark:text-blue-200">Fishing Area</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={onChangeSpot} value={currentSpot}>
          <SelectTrigger className="w-full mb-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600">
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
        <div className="relative mb-4">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 text-white" onClick={handleFishClick}>
            Go Fishing <span className={`inline-block ml-1 ${isAnimating ? 'rod-animation' : ''}`}>🎣</span>
          </Button>
          {isAnimating && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
              <span className="fish-animation inline-block">🐟</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">Fish: {fish} 🐟</p>
          <p className="text-gray-700 dark:text-gray-300">Rare Fish: {rareFish} 🐠</p>
          <p className="text-gray-700 dark:text-gray-300">Special Fish: {specialFish} 🦈</p>
          <p className="text-gray-700 dark:text-gray-300">Catch Chance: {(catchChance * 100).toFixed(2)}%</p>
          <p className="text-gray-700 dark:text-gray-300">Fish per Click: {fishPerClick}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Inventory = ({ fish, rareFish, money, onSell }) => (
  <Card className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
    <CardHeader>
      <CardTitle className="text-green-800 dark:text-green-200">Inventory</CardTitle>
    </CardHeader>
    <CardContent>
      <Button className="w-full mb-4 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white" onClick={onSell}>Sell Fish $</Button>
      <p className="text-gray-700 dark:text-gray-300">Money: ${money.toFixed(2)}</p>
      <p className="text-gray-700 dark:text-gray-300">Regular Fish: {fish} 🐟</p>
      <p className="text-gray-700 dark:text-gray-300">Rare Fish: {rareFish} 🐠</p>
    </CardContent>
  </Card>
);

const Metrics = ({ fishPerSecond, fishPerMinute, fishermen, level, xp }) => {
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
        <p className="text-gray-700 dark:text-gray-300">Fishermen: {fishermen} 👨‍🎣</p>
        <p className="text-gray-700 dark:text-gray-300">Level: {level} 🏆</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-indigo-600 dark:bg-indigo-400 h-2.5 rounded-full" style={{ width: `${xpProgress}%` }}></div>
        </div>
        <p className="text-gray-700 dark:text-gray-300">XP: {xp} / {xpNeededForNextLevel}</p>
      </CardContent>
    </Card>
  );
};

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
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const BASE_XP = 100;
  const XP_INCREMENT = 50;
  const [loginStreak, setLoginStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [gear, setGear] = useState({
    rod: { level: 1, cost: 10, description: "Increases catch chance" },
    net: { level: 0, cost: 50, description: "Increases fish caught per attempt" },
    trap: { level: 0, cost: 100, description: "Chance to catch multiple fish" },
  });
  const [boatLevel, setBoatLevel] = useState(0);
  const [fishermen, setFishermen] = useState(0);
  const [catchChance, setCatchChance] = useState(0.5); // Initial 50% catch chance
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
  const [leaderboardData, setLeaderboardData] = useState([
    { id: 1, name: 'Player 1', fishCount: 1000, moneyEarned: 5000 },
    { id: 2, name: 'Player 2', fishCount: 800, moneyEarned: 4000 },
    { id: 3, name: 'Player 3', fishCount: 600, moneyEarned: 3000 },
  ]);

  const calculateCatchChance = () => {
    let baseChance = 0.5; // Start with 50% base chance
    Object.values(gear).forEach(item => {
      baseChance += item.level * 0.05; // Each gear level adds 5% to catch chance
    });
    if (specialItems.bait.active) baseChance *= specialItems.bait.multiplier;
    return Math.min(baseChance, 1); // Cap at 100%
  };

  const fishPerClick = 1 + boatLevel;

  useEffect(() => {
    const newCatchChance = calculateCatchChance();
    setCatchChance(newCatchChance);
  }, [gear, specialItems.bait.active]);

  useEffect(() => {
    // Only start automatic fishing when the player has fishermen
    if (fishermen > 0) {
      const interval = setInterval(() => {
        let fishCaught = 0;
        let rareFishCaught = 0;
        let specialFishCaught = 0;
        const attempts = (specialItems.sonar.active ? 3 : 1) * fishermen;
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
    }
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

  useEffect(() => {
    checkDailyReward();
  }, []);

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

    // Perform fishing attempts based on fishPerClick
    for (let i = 0; i < fishPerClick; i++) {
      if (Math.random() < catchChance) {
        let catchMultiplier = 1 + (gear.net.level * 0.2); // Net increases fish caught
        let trapChance = gear.trap.level * 0.1; // Trap gives chance for extra catch

        if (Math.random() < spot.specialFishChance) {
          specialFishCaught += Math.ceil(catchMultiplier);
          xpGained += 50 * Math.ceil(catchMultiplier);
        } else if (Math.random() < spot.rareFishChance) {
          rareFishCaught += Math.ceil(catchMultiplier);
          xpGained += 20 * Math.ceil(catchMultiplier);
        } else {
          fishCaught += Math.ceil(catchMultiplier);
          xpGained += 5 * Math.ceil(catchMultiplier);
        }

        // Chance for trap to catch extra fish
        if (Math.random() < trapChance) {
          fishCaught++;
          xpGained += 5;
        }
      }
    }

    // Update fish counts
    setFish(prevFish => prevFish + fishCaught);
    setRareFish(prevRareFish => prevRareFish + rareFishCaught);
    setSpecialFish(prevSpecialFish => prevSpecialFish + specialFishCaught);

    const totalCaught = fishCaught + rareFishCaught + specialFishCaught;

    // Update total fish caught and leaderboard
    setTotalFishCaught(prevTotal => {
      const newTotal = prevTotal + totalCaught;
      updateLeaderboard(newTotal, totalMoneyEarned);
      return newTotal;
    });

    // Update XP and check for level up
    setXp(prevXp => {
      const newXp = prevXp + xpGained;
      checkLevelUp(newXp);
      return newXp;
    });

    // Check achievements
    checkAchievements();

    // Show toast messages for catches
    if (specialFishCaught > 0) toast.success(`You caught ${specialFishCaught} special fish! 🦈`);
    if (rareFishCaught > 0) toast.success(`You caught ${rareFishCaught} rare fish! 🐠`);
    if (fishCaught > 0) toast.success(`You caught ${fishCaught} fish! 🐟`);
  };

  const updateLeaderboard = (newFishCount, newMoneyEarned) => {
    setLeaderboardData(prevData => {
      const playerIndex = prevData.findIndex(player => player.id === 1); // Assuming the current player is always id 1
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
      setXp(currentXp - xpNeededForNextLevel); // Reset XP for next level
      setCatchChance(prevChance => Math.min(prevChance + 0.01, 1)); // Increase catch chance by 1% per level, max 100%
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
    setTotalMoneyEarned(prevTotal => {
      const newTotal = prevTotal + totalMoneyEarned;
      updateLeaderboard(totalFishCaught, newTotal);
      return newTotal;
    });

    const xpGained = Math.floor(totalMoneyEarned / 10); // 1 XP for every $10 earned
    setXp(prevXp => {
      const newXp = prevXp + xpGained;
      checkLevelUp(newXp);
      return newXp;
    });

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

  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-300">Idle Fishing Adventure</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          >
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
        <Card className="bg-white dark:bg-gray-800 shadow-xl border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-gray-800 dark:text-gray-100">Fishing Idle Game</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Daily Login Reward</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Current Login Streak: {loginStreak} day{loginStreak !== 1 ? 's' : ''}</p>
                <p>Next Reward: ${50 * Math.min(loginStreak + 1, 7)}</p>
                <p>Last Login: {lastLoginDate ? format(new Date(lastLoginDate), 'PPP') : 'Never'}</p>
              </CardContent>
            </Card>
            <Shop 
              money={money} 
              gear={gear} 
              onBuyGear={handleBuyGear} 
              onUpgradeBoat={handleUpgradeBoat}
              onHireFisherman={handleHireFisherman}
              boatLevel={boatLevel}
              fishermen={fishermen}
            />
            <Metrics 
              fishPerSecond={fishPerSecond} 
              fishPerMinute={fishPerSecond * 60} 
              fishermen={fishermen}
              level={level}
              xp={xp}
            />
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
            <Leaderboard data={leaderboardData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

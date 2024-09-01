import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

const Inventory = ({ fish = 0, rareFish = 0, specialFish = 0, netCatch = {}, trapCatch = {}, money = 0, onSell, fishPrices = {}, loginStreak = 0, lastLoginDate }) => {
  const calculateValue = (count = 0, price = 0) => ((count || 0) * (price || 0)).toFixed(2);

  return (
    <Card className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="text-green-800 dark:text-green-200">Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full mb-4 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 text-white" onClick={onSell}>Sell All Catches $</Button>
        <p className="text-gray-700 dark:text-gray-300">Money: ${(money || 0).toFixed(2)}</p>
        <p className="text-gray-700 dark:text-gray-300">Regular Fish: {fish} 🐟 (${calculateValue(fish, fishPrices['Regular Fish'])})</p>
        <p className="text-gray-700 dark:text-gray-300">Rare Fish: {rareFish} 🐠 (${calculateValue(rareFish, fishPrices['Rare Fish'])})</p>
        <p className="text-gray-700 dark:text-gray-300">Special Fish: {specialFish} 🦈 (${calculateValue(specialFish, fishPrices['Special Fish'])})</p>
        <p className="text-gray-700 dark:text-gray-300">Net Catch: Small {netCatch.small || 0} 🐠 (${calculateValue(netCatch.small, fishPrices['Small Net Fish'])}) Medium {netCatch.medium || 0} 🐡 (${calculateValue(netCatch.medium, fishPrices['Medium Net Fish'])}) Large {netCatch.large || 0} 🐳 (${calculateValue(netCatch.large, fishPrices['Large Net Fish'])})</p>
        <p className="text-gray-700 dark:text-gray-300">Trap Catch: Common {trapCatch.common || 0} 🦀 (${calculateValue(trapCatch.common, fishPrices['Common Trap Fish'])}) Uncommon {trapCatch.uncommon || 0} 🦑 (${calculateValue(trapCatch.uncommon, fishPrices['Uncommon Trap Fish'])}) Rare {trapCatch.rare || 0} 🐙 (${calculateValue(trapCatch.rare, fishPrices['Rare Trap Fish'])})</p>
        
        <div className="mt-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Daily Login Reward</h3>
          <p className="text-gray-700 dark:text-gray-300">Current Login Streak: {loginStreak} day{loginStreak !== 1 ? 's' : ''}</p>
          <p className="text-gray-700 dark:text-gray-300">Next Reward: ${50 * Math.min(loginStreak + 1, 7)}</p>
          <p className="text-gray-700 dark:text-gray-300">Last Login: {lastLoginDate ? format(new Date(lastLoginDate), 'PPP') : 'Never'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Inventory;

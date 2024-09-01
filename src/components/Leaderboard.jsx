import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Leaderboard = ({ data }) => (
  <Card className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
    <CardHeader>
      <CardTitle className="text-purple-800 dark:text-purple-200">Global Leaderboard</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow className="bg-purple-100 dark:bg-purple-900">
            <TableHead className="text-purple-800 dark:text-purple-200">Rank</TableHead>
            <TableHead className="text-purple-800 dark:text-purple-200">Player</TableHead>
            <TableHead className="text-purple-800 dark:text-purple-200">Fish Count</TableHead>
            <TableHead className="text-purple-800 dark:text-purple-200">Money Earned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player, index) => (
            <TableRow key={player.id} className="hover:bg-purple-100 dark:hover:bg-purple-900">
              <TableCell className="text-purple-800 dark:text-purple-200">{index + 1}</TableCell>
              <TableCell className="text-purple-800 dark:text-purple-200">{player.name}</TableCell>
              <TableCell className="text-purple-800 dark:text-purple-200">{player.fishCount}</TableCell>
              <TableCell className="text-purple-800 dark:text-purple-200">${player.moneyEarned.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default Leaderboard;

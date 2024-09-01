import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Leaderboard = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Global Leaderboard</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Fish Count</TableHead>
            <TableHead>Money Earned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player, index) => (
            <TableRow key={player.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.fishCount}</TableCell>
              <TableCell>${player.moneyEarned.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default Leaderboard;
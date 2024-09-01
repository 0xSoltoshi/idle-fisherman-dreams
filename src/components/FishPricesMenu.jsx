import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FishPricesMenu = ({ fishPrices }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-2">Fish Prices 🐠💰</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fish Prices</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fish Type</TableHead>
              <TableHead>Base Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(fishPrices).map(([fishType, price]) => (
              <TableRow key={fishType}>
                <TableCell>{fishType}</TableCell>
                <TableCell>${price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default FishPricesMenu;
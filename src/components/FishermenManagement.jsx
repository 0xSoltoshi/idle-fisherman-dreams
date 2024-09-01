import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FishermenManagement = ({ money, fishermen, fishermenSkills, onUpgradeFisherman }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-2">Manage Fishermen 👨‍🎣</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fishermen Management</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {fishermenSkills.map((fisherman, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Fisherman {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Skill Level: {fisherman.skill}</p>
                <Button 
                  onClick={() => onUpgradeFisherman(index)} 
                  disabled={money < fisherman.cost}
                  className="mt-2"
                >
                  Upgrade (${fisherman.cost})
                </Button>
              </CardContent>
            </Card>
          ))}
          {fishermen === 0 && (
            <p>No fishermen hired yet. Hire fishermen in the shop!</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FishermenManagement;
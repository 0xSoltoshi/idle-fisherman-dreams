import { HomeIcon, TrophyIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import AchievementsLeaderboard from "./pages/AchievementsLeaderboard.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Achievements & Leaderboard",
    to: "/achievements-leaderboard",
    icon: <TrophyIcon className="h-4 w-4" />,
    page: <AchievementsLeaderboard />,
  },
];
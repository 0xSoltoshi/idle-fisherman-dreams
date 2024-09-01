import { HomeIcon, TrophyIcon, DollarSign } from "lucide-react";
import Index from "./pages/Index.jsx";
import AchievementsLeaderboard from "./pages/AchievementsLeaderboard.jsx";
import CheatPage from "./pages/CheatPage.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
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
  {
    title: "Cheat",
    to: "/cheat",
    icon: <DollarSign className="h-4 w-4" />,
    page: <CheatPage />,
  },
];

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from 'next-themes';
import { navItems } from "./nav-items";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-4">
              {navItems.map(({ title, to, icon }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center">
                    {icon}
                    <span className="ml-2">{title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="container mx-auto p-4">
            <Routes>
              {navItems.map(({ to, page }) => (
                <Route key={to} path={to} element={page} />
              ))}
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  CheckSquare, 
  MessageSquare, 
  Search, 
  Settings, 
  LogOut,
  PlusCircle,
  Sun,
  Moon,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Video, label: "Library", href: "/meetings" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: MessageSquare, label: "AI Brain", href: "/chat" },
  { icon: Search, label: "Intelligence", href: "/search" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const logout = useAuthStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-background border-r border-border text-foreground transition-all duration-300">
      <div className="p-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          Meetpilot
        </h1>
      </div>
      
      <nav className="flex-1 px-8 space-y-2">
        <Link 
          href="/meetings/upload" 
          className="w-full flex items-center gap-3 px-5 py-4 bg-foreground text-background rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all mb-10 shadow-sm group"
        >
          <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Upload Session</span>
        </Link>

        <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-4 px-4">
          Navigate
        </div>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname === item.href 
                ? "bg-secondary text-foreground font-bold shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
            )}
          >
            <item.icon size={18} className={cn(
              "transition-transform group-hover:scale-110",
              pathname === item.href ? "text-primary" : ""
            )} />
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-8 space-y-4">
        <div className="flex items-center gap-1 p-1.5 bg-secondary rounded-2xl border border-border/50">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all",
              mounted && theme === "light" ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sun size={16} />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all",
              mounted && theme === "dark" ? "bg-background shadow-md text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Moon size={16} />
          </button>
        </div>

        <div className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-destructive/70 hover:text-destructive hover:bg-destructive/5 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

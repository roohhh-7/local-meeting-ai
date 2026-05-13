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
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Video, label: "Meetings", href: "/meetings" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: MessageSquare, label: "AI Chat", href: "/chat" },
  { icon: Search, label: "Search", href: "/search" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Antigravity AI
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/meetings/upload" className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all mb-6">
          <PlusCircle size={20} />
          <span className="font-medium">New Meeting</span>
        </Link>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

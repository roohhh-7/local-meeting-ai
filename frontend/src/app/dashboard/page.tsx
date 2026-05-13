"use client";

import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp,
  ChevronRight,
  Video,
  CheckSquare,
  Plus
} from "lucide-react";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function Dashboard() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await api.get("/meetings/");
        setMeetings(response.data);
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const stats = [
    { label: "Total Meetings", value: meetings.length.toString(), icon: Video, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Hours Processed", value: (meetings.reduce((acc, m) => acc + (m.duration || 0), 0) / 3600).toFixed(1), icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Action Items", value: "0", icon: CheckSquare, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Team Members", value: "1", icon: Users, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  const recentMeetings = meetings.slice(0, 5);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Here's what's happening in your workspace.</p>
          </div>
          <Link href="/meetings/upload">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={20} />
              New Meeting
            </button>
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl border bg-card hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Recent Meetings */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Meetings</h3>
            <Link href="/meetings" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground font-medium">Loading your workspace...</p>
              </div>
            ) : recentMeetings.length === 0 ? (
              <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-muted/10">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="text-muted-foreground" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Clean Slate!</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-8">No meetings found. Upload your first recording to see AI-powered summaries and action items.</p>
                <Link href="/meetings/upload">
                  <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                    Upload My First Meeting
                  </button>
                </Link>
              </div>
            ) : (
              recentMeetings.map((meeting: any) => (
                <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                  <div className="flex items-center gap-5 p-5 rounded-2xl border bg-card hover:bg-accent/5 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-inner">
                      {meeting.title[0].toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-lg truncate group-hover:text-primary transition-colors">{meeting.title}</div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                          meeting.status === "completed" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                          meeting.status === "failed" ? "bg-destructive/10 text-destructive border-destructive/20" :
                          "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse"
                        )}>
                          {meeting.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary/60" /> {new Date(meeting.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary/60" /> {meeting.duration ? `${Math.round(meeting.duration/60)}m` : "Processing..."}</span>
                      </div>

                      {meeting.status === "processing" && (
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-4 relative">
                          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-primary animate-pulse w-[75%] rounded-full shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
                        </div>
                      )}
                    </div>
                    
                    <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform ml-2" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

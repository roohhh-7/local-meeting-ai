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
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-12 lg:p-16 space-y-16">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">
              Meetpilot <span className="text-primary">Dashboard</span>
            </h2>
            <p className="text-muted-foreground font-medium text-sm max-w-xl leading-relaxed">
              Capture and analyze your meeting intelligence in one place.
            </p>
          </div>
          <Link href="/meetings/upload">
            <button className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-sm group">
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              New Session
            </button>
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-[1.5rem] border border-border/50 bg-card hover:border-primary/30 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  Metric
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Meetings */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold tracking-tight">Recent Sessions</h3>
              <span className="px-2 py-0.5 bg-secondary rounded-full text-[10px] font-bold text-muted-foreground">
                {meetings.length}
              </span>
            </div>
            <Link href="/meetings" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group">
              View all <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-20 bg-secondary/10 rounded-2xl border border-dashed border-border/50">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-b-transparent mx-auto mb-4"></div>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Synchronizing...</p>
              </div>
            ) : recentMeetings.length === 0 ? (
              <div className="text-center py-24 border-2 border-dashed rounded-[2rem] border-border/20 bg-secondary/5">
                <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Video className="text-muted-foreground" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Empty Workspace</h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto mb-8 leading-relaxed text-sm">No sessions captured yet. Upload your first recording to begin.</p>
                <Link href="/meetings/upload">
                  <button className="px-10 py-4 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-lg">
                    Begin Transcription
                  </button>
                </Link>
              </div>
            ) : (
              recentMeetings.map((meeting: any) => (
                <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                  <div className="flex items-center gap-6 p-6 rounded-[1.5rem] border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group relative">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-primary font-bold text-xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                      {meeting.title[0].toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="font-bold text-lg tracking-tight truncate group-hover:text-primary transition-colors">
                          {meeting.title}
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                          meeting.status === "completed" ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                          meeting.status === "failed" ? "bg-destructive/10 text-destructive border-destructive/20" :
                          "bg-primary/10 text-primary border-primary/20"
                        )}>
                          {meeting.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-primary/60" /> 
                          {new Date(meeting.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="text-primary/60" /> 
                          {meeting.status === "completed" 
                            ? (meeting.duration ? `${Math.round(meeting.duration/60)}m` : "Ready")
                            : (meeting.duration ? `${Math.round(meeting.duration/60)}m` : "PROCESSING")}
                        </span>
                      </div>
                    </div>
                    
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Calendar, Clock, Video, ChevronRight, Plus } from "lucide-react";

export default function MeetingsPage() {
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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Meetings</h2>
            <p className="text-muted-foreground">Your meeting history and recordings.</p>
          </div>
          <Link href="/meetings/upload">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={20} />
              New Meeting
            </button>
          </Link>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse">Loading your meetings...</div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed rounded-2xl">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="text-muted-foreground" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No meetings yet</h3>
              <p className="text-muted-foreground mb-6">Upload your first recording to get started with AI insights.</p>
              <Link href="/meetings/upload">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
                  Upload Now
                </button>
              </Link>
            </div>
          ) : (
            meetings.map((meeting) => (
              <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
                <div className="flex items-center justify-between p-5 rounded-xl border bg-card hover:bg-accent/5 transition-all cursor-pointer group mb-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {meeting.title[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-lg group-hover:text-primary transition-colors">{meeting.title}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(meeting.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {meeting.duration ? `${Math.round(meeting.duration/60)}m` : "Processing..."}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold capitalize tracking-wider",
                      meeting.status === "completed" ? "bg-green-500/10 text-green-500" : 
                      meeting.status === "failed" ? "bg-destructive/10 text-destructive" :
                      "bg-blue-500/10 text-blue-500 animate-pulse"
                    )}>
                      {meeting.status}
                    </span>
                    <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

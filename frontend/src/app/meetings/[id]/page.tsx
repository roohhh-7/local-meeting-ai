"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  FileText, 
  ListChecks, 
  Sparkles,
  Play,
  Download
} from "lucide-react";

export default function MeetingDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const response = await api.get(`/meetings/${id}`);
        setMeeting(response.data);
      } catch (error) {
        console.error("Failed to fetch meeting:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetingDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!meeting) return <div>Meeting not found</div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b px-8 py-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{meeting.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(meeting.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {meeting.duration ? `${Math.round(meeting.duration/60)}m` : "N/A"}</span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                  {meeting.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
                <Download size={18} />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                <Play size={18} />
                Watch
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8 w-fit">
            <button
              onClick={() => setActiveTab("summary")}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
                activeTab === "summary" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              AI Summary
            </button>
            <button
              onClick={() => setActiveTab("transcript")}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
                activeTab === "transcript" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Transcript
            </button>
          </div>

          {activeTab === "summary" ? (
            <div className="grid gap-8">
              {/* Summary Card */}
              <section className="p-8 rounded-2xl border bg-card shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={120} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                  <Sparkles size={20} className="text-primary" />
                  AI Overview
                </h3>
                <p className="text-lg leading-relaxed text-foreground/90">
                  {meeting.ai_summary?.summary || "No summary available."}
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Key Points */}
                <section className="p-6 rounded-2xl border bg-card shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                    <FileText size={18} className="text-blue-500" />
                    Key Insights
                  </h3>
                  <ul className="space-y-4">
                    {meeting.ai_summary?.key_points?.map((point: string, i: number) => (
                      <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Action Items */}
                <section className="p-6 rounded-2xl border bg-card shadow-sm">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                    <ListChecks size={18} className="text-green-500" />
                    Action Items
                  </h3>
                  <ul className="space-y-4">
                    {meeting.ai_summary?.action_items?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-green-500/5 transition-colors group">
                        <div className="w-5 h-5 rounded border border-green-500/30 flex items-center justify-center mt-0.5 group-hover:border-green-500 transition-colors">
                          <ListChecks size={12} className="text-transparent group-hover:text-green-500" />
                        </div>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          ) : (
            <section className="p-8 rounded-2xl border bg-card shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-8">
                <FileText size={20} className="text-muted-foreground" />
                Full Transcript
              </h3>
              <div className="space-y-8">
                {meeting.transcript?.segments ? (
                  meeting.transcript.segments.map((seg: any, i: number) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-16 text-xs text-muted-foreground font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {Math.floor(seg.start / 60)}:{(seg.start % 60).toFixed(0).padStart(2, '0')}
                      </div>
                      <p className="flex-1 leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
                        {seg.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {meeting.transcript?.raw_text || "No transcript available."}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

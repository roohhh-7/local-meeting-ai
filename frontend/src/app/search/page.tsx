"use client";

import { Sidebar } from "@/components/Sidebar";

export default function SearchPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Search</h2>
        <p className="text-muted-foreground">Search through all your meeting transcripts and summaries.</p>
      </main>
    </div>
  );
}

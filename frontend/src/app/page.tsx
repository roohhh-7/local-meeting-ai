"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  CheckSquare,
  Search
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-primary/30 overflow-x-hidden relative font-sans">
      {/* Background Grid & Auras */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-[20%] left-[-15%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tighter">Meetpilot</h1>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-white/50">
          <Link href="#" className="hover:text-white transition-colors">Product</Link>
          <Link href="#" className="hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-white transition-colors">Security</Link>
          <Link href="#" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-white/70 hover:text-white transition-colors">Log In</Link>
          <Link href="/register" className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-24 pb-10 px-6 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mb-8">
            Reinventing Meeting Productivity
          </div>

          <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-10 leading-[0.95] max-w-5xl mx-auto">
            The Privacy-First AI <br />
            Meeting Pilot. No Bots.
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-all shadow-2xl shadow-white/10">
              Start for Free
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10 transition-all backdrop-blur-md">
              Request a Demo
            </button>
          </div>
        </motion.div>

        {/* Product Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-[100px] opacity-20 pointer-events-none" />
          
          <div className="relative rounded-[2rem] border border-white/10 bg-[#0c0c0c] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/5">
            <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/5 flex items-center px-6 gap-2 bg-black/20 z-10 backdrop-blur-md">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
              <div className="flex-1" />
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">meetpilot.app / dashboard</div>
            </div>

            <img 
              src="/dashboard-preview.png" 
              alt="Meetpilot Dashboard" 
              className="w-full h-auto pt-10"
            />
            
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Feature Badges */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center border-t border-white/5 bg-white/[0.01]">
        <div className="flex flex-col items-center gap-4">
          <ShieldCheck size={20} className="text-primary" />
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/60">Secured & Private</div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <MessageSquare size={20} className="text-primary" />
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/60">AI Meeting Summaries</div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <CheckSquare size={20} className="text-primary" />
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/60">Real-time Action Items</div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Search size={20} className="text-primary" />
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/60">Cross-Platform Sync</div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="py-32 space-y-32">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Your machine. <br />Your data. No cloud.</h3>
            <p className="text-lg text-white/50 leading-relaxed max-w-md">
              Meetpilot runs 100% locally on your hardware. We never see your transcripts, and your data never leaves your machine. Privacy isn't a feature; it's our foundation.
            </p>
          </motion.div>
          <div className="aspect-video bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center justify-center h-full text-white/20 font-bold italic tracking-tighter text-6xl">SECURE</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1 aspect-video bg-white/5 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden group">
             <div className="absolute inset-0 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center justify-center h-full text-white/20 font-bold italic tracking-tighter text-6xl uppercase">Ollama</div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 order-1 md:order-2"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Zap size={24} />
            </div>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Intelligence on <br />your own terms.</h3>
            <p className="text-lg text-white/50 leading-relaxed max-w-md">
              Powered by Whisper.cpp and Llama 3.2. Get professional-grade transcription and summarization without paying for expensive tokens or subscriptions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-10">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight">Ready to pilot your meetings?</h2>
          <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-full text-lg font-bold hover:scale-105 transition-all">
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Final Footer */}
      <footer className="border-t border-white/5 bg-black py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <h1 className="text-xl font-bold tracking-tighter">Meetpilot</h1>
            <p className="text-sm text-white/30 max-w-xs leading-relaxed">
              The privacy-first AI meeting assistant that runs 100% locally. 
              No bots, no cloud, just intelligence.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Product</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Company</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/10">
          <div>© 2026 Meetpilot AI. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

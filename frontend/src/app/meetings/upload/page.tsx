"use client";

import { Sidebar } from "@/components/Sidebar";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio, FileVideo, X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4', '.mov']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("title", files[0].name.split('.')[0]);

    try {
      await api.post("/meetings/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setProgress(percentCompleted);
        }
      });
      toast.success("Meeting uploaded successfully! Processing started.");
      setFiles([]);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Upload Meeting</h2>
            <p className="text-muted-foreground">Upload your audio or video recording to get started with AI intelligence.</p>
          </div>

          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/5"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-lg font-medium">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground">MP3, WAV, M4A, MP4 (Max 500MB)</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-4 rounded-xl border bg-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {files[0].type.includes('audio') ? <FileAudio className="text-blue-500" /> : <FileVideo className="text-purple-500" />}
                  <div>
                    <div className="font-medium">{files[0].name}</div>
                    <div className="text-xs text-muted-foreground">{(files[0].size / (1024 * 1024)).toFixed(2)} MB</div>
                  </div>
                </div>
                <button onClick={() => setFiles([])} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="w-full mt-8 h-12 text-lg font-semibold"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading {progress}%
              </>
            ) : (
              "Start Processing"
            )}
          </Button>
        </motion.div>
      </main>
    </div>
  );
}

import { cn } from "@/lib/utils";


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CoachFeedback, EXERCISES, Exercise, CoachStatus, SessionSummary } from './types';
import LiveCamera from './components/LiveCamera';
import FeedbackDisplay from './components/FeedbackDisplay';
import ExerciseSelector from './components/ExerciseSelector';
import AnalysisStatus from './components/AnalysisStatus';
import SessionSummaryModal from './components/SessionSummaryModal';

const App: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(EXERCISES[0]);
  const [currentFeedback, setCurrentFeedback] = useState<CoachFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<{ feedback: CoachFeedback; time: string }[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aiRef = useRef<any>(null);

  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }, []);

  const analyzeFrame = useCallback(async (base64Image: string) => {
    if (!aiRef.current) return;

    try {
      const response = await aiRef.current.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: `Role: You are "Omni-Coach," a high-performance Kinesthetic AI specialized in real-time biomechanical analysis.
Current Exercise: ${selectedExercise.name}.
Goal: Observe the user and provide elite-level coaching feedback.

Capabilities:
1. Spatial Reasoning: Identify joints (shoulders, knees, hips) and calculate approximate angles.
2. Comparative Analysis: Compare posture against the "Ideal Form": ${selectedExercise.idealFormHints.join(', ')}.
3. Latency-First Feedback: Provide 3-5 word Micro-Cues.

Constraint: If you see extreme spinal rounding, joint collapse, or dangerous movement, status MUST be "SAFETY ALERT".

Output MUST be a single JSON object:
{
  "status": "observing" | "correction_needed" | "perfect_form" | "SAFETY ALERT",
  "cue": "Short verbal instruction",
  "joint_focus": ["joint1", "joint2"],
  "reasoning": "Brief biomechanical explanation"
}`
            }
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              cue: { type: Type.STRING },
              joint_focus: { type: Type.ARRAY, items: { type: Type.STRING } },
              reasoning: { type: Type.STRING }
            },
            required: ["status", "cue", "joint_focus", "reasoning"]
          }
        }
      });

      const result = JSON.parse(response.text.trim()) as CoachFeedback;
      setCurrentFeedback(result);
      if (result.status !== CoachStatus.OBSERVING) {
        setHistory(prev => [{ feedback: result, time: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }) }, ...prev].slice(0, 30));
      }
    } catch (err) {
      console.error("Analysis error:", err);
    }
  }, [selectedExercise]);

  const generateSessionSummary = async () => {
    if (!aiRef.current || history.length === 0) return;
    setIsGeneratingSummary(true);
    try {
      const historyText = history.map(h => `[${h.time}] ${h.feedback.status}: ${h.feedback.cue} (${h.feedback.reasoning})`).join('\n');
      
      const response = await aiRef.current.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Role: Lead Biomechanical Researcher for Omni-Coach.
        Analyze the session log for ${selectedExercise.name} to provide a multi-dimensional research-level analysis.
        
        Session Log:
        ${historyText}

        Please provide the following in JSON:
        1. Biomechanical Breakdown: Deep analysis of joint alignment (ankles, knees, spine).
        2. Fatigue Detection: Note timestamps where "form creep" occurred.
        3. Efficiency Score: 1-10 scale for muscle recruitment.
        4. Internal Cue: What the user should feel.
        5. External Cue: What the user should do.
        6. Improvement Areas: 2-3 specific points.

        Output JSON:
        {
          "overallScore": number (0-100),
          "biomechanicalBreakdown": "string",
          "fatigueDetection": [{ "timestamp": "string", "description": "string" }],
          "efficiencyScore": number (1-10),
          "internalCue": "string",
          "externalCue": "string",
          "keyTakeaway": "string",
          "improvementAreas": ["string"],
          "consistencyRating": "string"
        }`,
        config: {
          thinkingConfig: { thinkingBudget: 8192 },
          responseMimeType: "application/json",
        }
      });
      
      const result = JSON.parse(response.text.trim()) as SessionSummary;
      setSummary(result);
    } catch (err) {
      console.error("Summary generation error:", err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleToggleAnalysis = () => {
    if (isAnalyzing) {
      setIsAnalyzing(false);
      generateSessionSummary();
    } else {
      setHistory([]);
      setSummary(null);
      setIsAnalyzing(true);
      setCurrentFeedback(null);
    }
  };

  useEffect(() => {
    let intervalId: number;
    if (isAnalyzing && videoRef.current && canvasRef.current) {
      intervalId = window.setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
        await analyzeFrame(base64Image);
      }, 1500);
    }
    return () => clearInterval(intervalId);
  }, [isAnalyzing, analyzeFrame]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      <header className="p-4 glass-panel border-b border-white/5 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
             <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold font-orbitron tracking-wider text-green-400">OMNI-COACH</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Lead Biomechanical Researcher</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ExerciseSelector current={selectedExercise} onSelect={setSelectedExercise} disabled={isAnalyzing} />
          <button 
            onClick={handleToggleAnalysis}
            className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${
              isAnalyzing 
                ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' 
                : 'bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/20'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                END SESSION
              </>
            ) : 'START WORKOUT'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-4 gap-4 relative">
        <div className="flex-1 flex flex-col gap-4 relative">
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black group">
            <LiveCamera videoRef={videoRef} canvasRef={canvasRef} isAnalyzing={isAnalyzing} />
            <div className="absolute top-4 left-4 z-30">
                <AnalysisStatus status={currentFeedback?.status || (isAnalyzing ? 'observing' : 'idle')} />
            </div>
            {isAnalyzing && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="scanning-line" />
                <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 font-orbitron text-[8px] text-green-500/40">
                   <div>X-RAY OVERLAY: ACTIVE</div>
                   <div>BIOMETRIC DATA: STREAMING</div>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {selectedExercise.musclesTargeted.map(m => (
                <span key={m} className="px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[9px] font-bold border border-white/10 text-slate-400">
                  {m.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="w-96 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          <FeedbackDisplay feedback={currentFeedback} isAnalyzing={isAnalyzing} />
          
          <div className="glass-panel p-5 rounded-2xl flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-orbitron text-slate-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                CHRONO-LOG
              </h3>
              <span className="text-[10px] text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">{history.length} EVENTS</span>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeWidth="2" /></svg>
                  <span className="text-xs uppercase tracking-widest">Awaiting Movement</span>
                </div>
              ) : (
                history.map((h, i) => (
                  <div key={i} className={`p-3 rounded-lg border text-sm transition-all animate-in slide-in-from-right-4 ${
                    h.feedback.status === 'SAFETY ALERT' ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[9px] font-bold uppercase ${
                        h.feedback.status === 'SAFETY ALERT' ? 'text-red-400' : h.feedback.status === 'perfect_form' ? 'text-green-400' : 'text-slate-400'
                      }`}>{h.feedback.status.replace('_', ' ')}</span>
                      <span className="text-[9px] text-slate-600 font-mono">{h.time}</span>
                    </div>
                    <p className="text-slate-200 font-medium text-xs mb-2 leading-tight">{h.feedback.cue}</p>
                    <div className="flex gap-1 flex-wrap">
                      {h.feedback.joint_focus.map(j => (
                        <span key={j} className="text-[8px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-white/5 uppercase">{j}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>
      </main>

      {summary && <SessionSummaryModal summary={summary} onClose={() => setSummary(null)} exerciseName={selectedExercise.name} />}
      {isGeneratingSummary && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-green-500/10 rounded-full" />
            <div className="w-24 h-24 border-4 border-t-green-500 rounded-full animate-spin absolute top-0 left-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
          </div>
          <h2 className="text-2xl font-orbitron text-green-400 mt-8 mb-2">GENERATING RESEARCH REPORT</h2>
          <p className="text-slate-400 text-sm max-w-md">Gemini 3 Pro is deliberating over your session metrics to provide PhD-level biomechanical insights.</p>
          <div className="mt-8 flex gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      <footer className="p-3 bg-slate-900 border-t border-white/5 flex items-center justify-between text-[10px] uppercase font-orbitron tracking-tighter text-slate-500">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            PRO-LINK: {isAnalyzing ? 'ACTIVE STREAM' : 'READY'}
          </div>
          <div className="flex items-center gap-2">
            MODEL: GEMINI 3 FLASH/PRO
          </div>
        </div>
        <div className="hidden md:flex gap-4">
           {selectedExercise.idealFormHints.map((hint, idx) => (
             <span key={idx} className="border-l border-white/10 pl-4 last:pr-4">{hint}</span>
           ))}
        </div>
      </footer>
    </div>
  );
};

export default App;

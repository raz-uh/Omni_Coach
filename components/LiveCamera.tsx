
import React, { useEffect, useState, useCallback } from 'react';

interface LiveCameraProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isAnalyzing: boolean;
}

const LiveCamera: React.FC<LiveCameraProps> = ({ videoRef, canvasRef, isAnalyzing }) => {
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const setupCamera = useCallback(async () => {
    setPermissionError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser/context.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraReady(true);
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      let msg = "Camera access denied.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = "Camera permission was blocked. Please enable it in your browser settings.";
      } else if (err.name === 'SecurityError') {
        msg = "The platform is blocking camera access in this context.";
      }
      setPermissionError(msg);
      setIsCameraReady(false);
    }
  }, [videoRef]);

  useEffect(() => {
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setupCamera, videoRef]);

  return (
    <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
      {permissionError ? (
        <div className="z-40 flex flex-col items-center justify-center p-8 text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-orbitron text-white mb-2">ACCESS RESTRICTED</h3>
          <p className="text-slate-400 text-sm mb-6">{permissionError}</p>
          <button 
            onClick={setupCamera}
            className="px-6 py-2 bg-green-500 text-black font-bold font-orbitron rounded-lg hover:bg-green-400 transition-all shadow-lg shadow-green-500/20"
          >
            RETRY PERMISSION
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-700 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
          />
          {!isCameraReady && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
               <div className="w-8 h-8 border-2 border-slate-700 border-t-green-500 rounded-full animate-spin mb-4" />
               <span className="font-orbitron text-[10px] tracking-widest uppercase">Initializing Optics...</span>
             </div>
          )}
        </>
      )}
      
      {/* Off-screen canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500/50 rounded-tl-xl m-4 pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500/50 rounded-tr-xl m-4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500/50 rounded-bl-xl m-4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500/50 rounded-br-xl m-4 pointer-events-none" />
    </div>
  );
};

export default LiveCamera;

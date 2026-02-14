"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAdminPhases } from "@/features/admin/providers/admin-phases-provider";
import StartExperince from "./start-experience/start-experience";
import { useEffect } from "react";
import { useAdminSocket } from "../providers/admin-socket-provider";
import { parse } from "@/core/lib/utils";
import SpeedQuestion from "./speed-question/speed-question";
import { AdminMainQuestions } from "./main-questions/admin-main-questions";
import { ChoosingClub } from "./choosing-club/choosing-club";
import { WinnerScreen } from "./winner/winner-screen";
import Welcome from "./welcome/welcome";
import Draw from "./draw/draw";
import SpeedIntro from "./speed-question/speed-intro";
import { useAudio } from "@/core/providers/audio-provider";


export default function Admin() {
  const { phase } = useAdminPhases();
  const { socket } = useAdminSocket();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { stopAudio } = useAudio()

  useEffect(stopAudio, []);

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    socket?.send(JSON.stringify({ event: 'terminate_game' }));
    setShowResetConfirm(false);
  };
  console.log(phase)
  return (
    <div className="w-full h-screen bg-black relative">
      {phase === "start_experience" && (
        <StartExperince key="start_experience" />
      )}
      {phase === "intro" && <Welcome key="welcome" />}
      {phase === "speed_intro" && <SpeedIntro key="speed_intro" />}
      {phase === "speed_question" && <SpeedQuestion key="speed_question" />}
      {phase === "choosing_clubs" && (
        <ChoosingClub key="choosing_clubs" />
      )}
      {phase === "main_questions" && <AdminMainQuestions key="main_questions" />}
      {phase === "winner" && <WinnerScreen key="winner" />}
      {phase === "draw" && <Draw key="draw" />}

      <motion.button
        onClick={handleReset}
        whileHover={{ scale: 1.1, backgroundColor: "rgba(220, 38, 38, 1)" }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 z-[9999] px-3 py-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded border border-red-600/30 hover:border-red-600 text-[10px] font-bold uppercase tracking-tighter backdrop-blur-md transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.1)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] cursor-pointer"
        title="Reset entire experience"
      >
        Reset
      </motion.button>

      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-600 to-orange-600" />

              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                Terminate Game?
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                This will disconnect all teams and reset the score. This action cannot be undone. Are you sure?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all cursor-pointer"
                >
                  Reset Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

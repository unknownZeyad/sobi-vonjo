"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import GameButton from "@/core/components/derived/game-button";
import { useAdminPhases } from "../../providers/admin-phases-provider";
import EnterExit from "@/core/components/derived/enter-exit";
import { useAdminSocket } from "../../providers/admin-socket-provider";
import VideoPlayer from "@/core/components/derived/video-player";

export default function Explain() {
  const { setPhase } = useAdminPhases();
  const { socket } = useAdminSocket();
  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <EnterExit>
      <motion.div
        initial={{ opacity: 0, scale: 1.05, filter: "blur(16px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
      >
        <VideoPlayer
          className="w-full h-full object-cover"
          src="/assets/videos/welcome.mp4"
          autoPlay
          playsInline
          onEnded={() => setVideoEnded(true)}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key="welcome-button"
          className="absolute bottom-16 w-full flex justify-center"
          initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <GameButton
            // disabled={!videoEnded}
            onClick={() => {
              socket?.send(JSON.stringify({ event: 'start_speed_intro' }));
              setPhase("speed_question")
            }}
          >
            Next
          </GameButton>
        </motion.div>
      </AnimatePresence>
    </EnterExit>
  );
}

import EnterExit from "@/core/components/derived/enter-exit";
import GameButton from "@/core/components/derived/game-button";
import ContentLayout from "@/core/components/layout/content-layout";
import {
  PhaseCard,
  PhaseCardContent,
  PhaseCardFooter,
  PhaseCardHeader,
} from "@/core/components/ui/phase-card";

import { TeamLogo } from "@/core/components/ui/team-logo";
import { useAdminSocket } from "../../providers/admin-socket-provider";

import { useAdminPhases } from "../../providers/admin-phases-provider";
import { AnimatePresence, motion } from "motion/react";
import person from '@public/assets/images/person.png'
import { useEffect, useState } from "react";
import { useAudio } from "@/core/providers/audio-provider";
import { useAdminData } from "../../providers/admin-data-provider";
import VideoPlayer from "@/core/components/derived/video-player";

export function ChoosingClub() {
  const { stopAudio, playAudio } = useAudio();
  const { socket } = useAdminSocket();
  const [showVideo, setShowVideo] = useState<boolean>(false)
  const [videoEnded, setVideoEnded] = useState<boolean>(false)
  const { clubs } = useAdminData()

  function handleNextPhase() {
    socket?.send(
      JSON.stringify({
        event: "start_main_questions",
      })
    );
  }

  useEffect(() => {
    playAudio('/assets/audios/Team Selection/Team Name Selection.mp3')
  }, [])


  function handleShowVideo() {
    setShowVideo(true);
    stopAudio();
  }

  return (
    <AnimatePresence mode="wait">
      {showVideo ? (
        <EnterExit key="video">
          <div
            className="fixed inset-0 z-50 flex top-0 left-0 w-full h-full flex-col items-center justify-center bg-black bg-opacity-90"
          >
            <VideoPlayer
              src={"/assets/videos/PlayerSelection.mp4"}
              autoPlay
              controls={false}
              className="w-full h-full object-cover"
              onEnded={() => setVideoEnded(true)}
            />
            {/* {videoEnded && ( */}
            <GameButton
              className="h-14 absolute bottom-8 left-1/2 -translate-x-1/2  text-xl px-32 py-0 font-extrabold mt-8 "
              onClick={handleNextPhase}
            >
              NEXT
            </GameButton>
            {/* )} */}
          </div>
        </EnterExit>
      ) : (
        <ContentLayout key="choosing-club" personSrc={person.src}>
          <div className="flex flex-col items-end gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 }}
            >
              <PhaseCard>
                <PhaseCardHeader className="flex items-center justify-center">
                  <motion.h1
                    className="text-4xl font-bold"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 150, delay: 0.5 }}
                  >
                    CHOOSING CLUBS
                  </motion.h1>
                </PhaseCardHeader>
                <PhaseCardContent className="flex gap-6 items-center justify-evenly">
                  <TeamCard index={0} confirmedClub={clubs?.team1} />
                  <motion.div
                    className="h-2/5 rounded-full w-1 bg-yellow-500"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.8 }}
                  />
                  <TeamCard index={1} confirmedClub={clubs?.team2} />
                </PhaseCardContent>
                <PhaseCardFooter></PhaseCardFooter>
              </PhaseCard>
            </motion.div>

            {clubs && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', stiffness: 120, delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GameButton
                  className="h-10 text-xl px-24 py-0 font-extrabold"
                  onClick={handleShowVideo}
                >
                  NEXT
                </GameButton>
              </motion.div>
            )}
          </div>
        </ContentLayout>
      )}
    </AnimatePresence>
  );
}

function TeamCard({ index, confirmedClub }: { index: number; confirmedClub?: Club | null }) {
  const isLeft = index === 0;

  const clubToShow = confirmedClub

  if (!clubToShow) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-amber-400 text-lg font-semibold"
      >
        Choosing a club...
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col w-1/6 space-y-4 items-center"
      initial={{ opacity: 0, x: isLeft ? -80 : 80, scale: 0.5, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 12,
        delay: 0.6 + index * 0.2
      }}
      whileHover={{
        scale: 1.08,
        transition: { type: 'spring', stiffness: 300 }
      }}
    >
      <motion.div
        initial={{ rotate: isLeft ? -10 : 10 }}
        animate={{ rotate: 0 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.8 + index * 0.2 }}
      >
        <TeamLogo name={clubToShow.name} src={clubToShow.logo_img_url} />
      </motion.div>
      <motion.img
        className="rounded-4xl shadow-xl"
        src={clubToShow.card_img_url}
        alt=""
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.9 + index * 0.2 }}
        whileHover={{
          boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)',
          transition: { duration: 0.2 }
        }}
      />
    </motion.div>
  );
}

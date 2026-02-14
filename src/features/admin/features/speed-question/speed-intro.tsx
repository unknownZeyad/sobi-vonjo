import EnterExit from '@/core/components/derived/enter-exit'
import GameButton from '@/core/components/derived/game-button'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useAdminSocket } from '../../providers/admin-socket-provider'
import VideoPlayer from '@/core/components/derived/video-player'

function SpeedIntro() {
  const [videoEnded, setVideoEnded] = useState<boolean>(false)
  const { socket } = useAdminSocket()

  const startSpeedQuestion = () => {
    socket?.send(JSON.stringify({
      event: 'start_speed_question',
      data: null
    }))
  }

  return (
    <EnterExit>
      <motion.div
        initial={{ opacity: 0, scale: 1.05, filter: "blur(16px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <VideoPlayer
          className="w-full h-full object-cover"
          src="/assets/videos/startSpeedQuestions.mp4"
          autoPlay
          playsInline
          onEnded={() => setVideoEnded(true)}
        />
      </motion.div>


      <AnimatePresence mode="wait">
        <motion.div
          key="before-speed-ui"
          className="absolute bottom-16 w-full flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <GameButton
            // disabled={!videoEnded}
            onClick={startSpeedQuestion}
          >Start</GameButton>
          <motion.p
            key="ready-text"
            className="text-white text-lg font-medium uppercase tracking-wide"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Get ready for the Speed Question
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </EnterExit>
  )
}

export default SpeedIntro
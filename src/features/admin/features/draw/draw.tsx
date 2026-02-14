import EnterExit from '@/core/components/derived/enter-exit'
import VideoPlayer from '@/core/components/derived/video-player'
import { motion } from 'motion/react'

function Draw() {
  return (
    <EnterExit className="realtive">
      <VideoPlayer
        src="/assets/videos/final-winner.mp4"
        className="w-full h-full object-cover"
        autoPlay
        playsInline
      />
      <div className="absolute bottom-0 left-0">
        <div className="relative">
          <img
            className="w-full object-contain"
            src="/assets/images/admin-winner-footer.png"
            alt=""
          />
          <div className="absolute flex justify-center items-center p-[5%] pb-0 top-0 left-0 w-full h-full">
            <h4 className='text-white text-8xl italic font-bold drop-shadow-[0_0_25px_rgba(251,191,36,0.5)]'>Game Draw</h4>
          </div>
        </div>
      </div>
    </EnterExit>
  )
}

export default Draw
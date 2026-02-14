import EnterExit from '@/core/components/derived/enter-exit'
import VideoPlayer from '@/core/components/derived/video-player'
import { motion } from 'motion/react'

export default function TeamSpeedIntro() {
    return (
        <EnterExit>
            <VideoPlayer
                src="/assets/videos/startSpeedQuestions.mp4"
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
            />
        </EnterExit>
    )
}

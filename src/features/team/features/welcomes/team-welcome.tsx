"use client";

import { motion } from "motion/react";
import { useTeamInfo } from "../../providers/info-provider";
import EnterExit from "@/core/components/derived/enter-exit";
import VideoPlayer from "@/core/components/derived/video-player";

export default function TeamWelcome() {
    const { teamInfo } = useTeamInfo()
    return (
        <EnterExit className="overflow-hidden">

            <motion.div
                initial={{ opacity: 0, scale: 1.05, filter: "blur(16px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative inset-0 w-full h-full"
            >
                <VideoPlayer
                    src="/assets/videos/welcome.mp4"
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                />
            </motion.div>

            {/* <motion.div
                className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4"
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            >
                <motion.svg
                    width="48"
                    height="60"
                    viewBox="0 0 32 40"
                    fill="none"
                    className="drop-shadow-lg"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                >
                    <path
                        d="M32 20L0 40V0L32 20Z"
                        fill="url(#playGradient)"
                    />
                    <defs>
                        <linearGradient id="playGradient" x1="0" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F59E0B" />
                            <stop offset="1" stopColor="#EA580C" />
                        </linearGradient>
                    </defs>
                </motion.svg>

                <motion.h1
                    className="text-4xl md:text-5xl lg:text-8xl font-bold tracking-wider text-white"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
                >
                    {teamInfo.name}
                </motion.h1>
            </motion.div> */}
        </EnterExit>
    );
}

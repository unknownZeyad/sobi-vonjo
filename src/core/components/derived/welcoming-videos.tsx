"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "motion/react";

import sobiLogo from "@public/assets/images/Sobi-Logo.webp";
import sobiFantasyGameLogo from "@public/assets/images/Sobi-Fantasy-Game-Logo.webp";
import VideoPlayer from "./video-player";

const mediaVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 1.2,
    filter: "blur(24px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    filter: "blur(14px)",
  },
};

const TRANSITION = {
  duration: 1.6,
  ease: [0.22, 1, 0.36, 1],
};

export default function WelcomingVideos({
  onEnd,
  muted = false
}: {
  onEnd: () => void;
  muted?: boolean;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <motion.section
      key="start-experience"
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="logo-1"
            variants={mediaVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 1.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => setStep(2)}
            className="absolute inset-0 bg-white flex items-center justify-center"
          >
            <Image
              src={sobiLogo}
              alt="Sobi Logo"
              priority
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="logo-2"
            variants={mediaVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 1.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => setStep(3)}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            <Image
              src={sobiFantasyGameLogo}
              alt="Sobi Fantasy Game Logo"
              priority
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="intro-video"
            variants={mediaVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 1.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 bg-black"
          >
            <VideoPlayer
              src="/assets/videos/intro.mp4"
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted={muted}
              onEnded={onEnd}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

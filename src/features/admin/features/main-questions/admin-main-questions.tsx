import EnterExit from "@/core/components/derived/enter-exit";
import {
  PhaseCardContent,
  PhaseCardFooter,
  PhaseCardHeader,
} from "@/core/components/ui/phase-card";
import ContentLayout from "@/core/components/layout/content-layout";
import { PhaseCard } from "@/core/components/ui/phase-card";
import { Answer } from "@/core/components/ui/answer";
import CountdownTimer from "@/core/components/ui/counter";
import { TeamLogo } from "@/core/components/ui/team-logo";
import { useAdminData } from "../../providers/admin-data-provider";
import { AnswerResultScreen } from "./answer-result-screen";
import { useAdminSocket } from "../../providers/admin-socket-provider";
import { useEffect, useLayoutEffect, useState } from "react";
import { parse } from "@/core/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useAudio } from "@/core/providers/audio-provider";
import GameButton from "@/core/components/derived/game-button";
import { flushSync } from "react-dom";
import VideoPlayer from "@/core/components/derived/video-player";


const CORRECT_AUDIOS = [
  '/assets/audios/Correct Answers/Correct answer_opt 1.mp3',
  '/assets/audios/Correct Answers/Correct answer_opt 2.mp3',
  '/assets/audios/Correct Answers/Correct answer_opt 3.mp3',
]

const WRONG_AUDIOS = [
  '/assets/audios/Wrong Answers/Wrong answers_opt 1.mp3',
  '/assets/audios/Wrong Answers/Wrong answers_opt 2.mp3',
  '/assets/audios/Wrong Answers/Wrong answers_opt 3.mp3',
]

export function AdminMainQuestions() {

  const { currentQuestion, answerResult } = useAdminData();
  const { socket } = useAdminSocket();
  const [showDrawVideo, setShowDrawVideo] = useState(false);
  const { playAudio, stopAudio } = useAudio()

  useLayoutEffect(() => {
    if (!answerResult) return;
    const isCorrect = answerResult?.is_correct;
    const audios = isCorrect ? CORRECT_AUDIOS : WRONG_AUDIOS
    const random = audios[Math.floor(Math.random() * audios.length)]
    playAudio(random)
  }, [answerResult])

  const handleUnholdDraw = () => {
    socket?.send(JSON.stringify({ event: "unhold_play_draw" }));
    setShowDrawVideo(false);
  };

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const parsed = parse<ServerAdminMessage>(event.data);
      if (parsed.event === "play_draw") {
        stopAudio()
        setShowDrawVideo(true);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);


  useEffect(() => {
    if (!currentQuestion) return;
    playAudio(currentQuestion.question.audio_url)
  }, [currentQuestion, playAudio])

  if (!currentQuestion) return null;

  if (!showDrawVideo && answerResult) {
    return <AnswerResultScreen answerResult={answerResult} />;
  }

  return (
    <>
      {showDrawVideo ? (
        <EnterExit
          key='video'
          className="fixed inset-0 z-50 flex top-0 left-0 w-full h-full flex-col items-center justify-center bg-black bg-opacity-90"
        >
          <VideoPlayer
            src="/assets/videos/draw.mp4"
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          {/* {drawVideoEnded && ( */}
          <GameButton
            className="h-14 absolute bottom-8 left-1/2 -translate-x-1/2  text-xl px-32 py-0 font-extrabold mt-8 "
            onClick={handleUnholdDraw}
          >
            NEXT
          </GameButton>
          {/* )} */}
        </EnterExit>
      ) : (
        <ContentLayout key='card' personSrc="/assets/images/person.png">
          <div className="flex flex-col items-end gap-4">
            <PhaseCard>
              <PhaseCardHeader
                className="flex items-center justify-center"
                containerProps={{
                  className: "h-6 overflow-hidden",
                }}
              />
              <PhaseCardContent
                className="relative"
                imageProps={{
                  className: "hidden",
                }}
                containerProps={{
                  className: "bg-transparent",
                }}
              >
                {currentQuestion ? (
                  <div className="space-y-3">
                    <div className="py-8 space-y-10 bg-black/50 px-16">
                      <div className="flex justify-between gap-6">
                        <div className="size-28 shrink-0">
                          <img
                            className="w-full h-full object-contain"
                            src="/assets/images/icons/golden-trophy.webp"
                            alt=""
                          />
                        </div>
                        <h1 className="text-3xl font-bold text-center uppercase">
                          {currentQuestion.question.question}
                        </h1>
                        <div className="size-24 shrink-0">
                          <CountdownTimer initialSeconds={60} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-8 gap-x-20 w-9/10 max-w-3xl mx-auto">
                        {currentQuestion.question.answers.map((answer) => (
                          <Answer
                            key={answer.id}
                            answer={answer}
                            hasTimedOut={false}
                            selectedAnswerId={null}
                            onAnswer={() => { }}
                            className="pointer-events-none"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-black/50 px-20 border-l border-yellow-500 py-8 border-r border-t">
                      <div className="flex-1">
                        <TeamLogo
                          src={currentQuestion.club.logo_img_url}
                          name={currentQuestion.club.name}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold">SCORE</div>
                        <div className="text-7xl px-5 font-bold italic bg-linear-to-r from-yellow-500 via-yellow-100 to-yellow-300 text-transparent bg-clip-text">
                          {currentQuestion.score}
                        </div>
                        <div className="text-sm font-bold">TOTAL POINTS</div>
                      </div>
                      <div className="flex-1">
                        <img
                          className="rounded-2xl ml-auto w-40 aspect-4/5"
                          src={currentQuestion?.used_magic_card ? '/assets/images/golden-card.webp' : currentQuestion.question.img_url}
                          alt="Footer"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 px-16 bg-black/50 flex flex-col items-center justify-center space-y-8">
                    <img
                      className="object-contain size-32 shrink-0"
                      src="/assets/images/icons/golden-trophy.webp"
                      alt=""
                    />
                    <div className="space-y-3 text-center">
                      <h1 className="text-4xl font-bold uppercase bg-linear-to-r from-yellow-500 via-yellow-100 to-yellow-300 text-transparent bg-clip-text">
                        No Question Selected
                      </h1>
                      <p className="text-xl text-gray-300 font-medium">
                        Please select a question to display
                      </p>
                    </div>
                  </div>
                )}
              </PhaseCardContent>
              <PhaseCardFooter />
            </PhaseCard>
          </div>
        </ContentLayout>
      )}
    </>
  );
}

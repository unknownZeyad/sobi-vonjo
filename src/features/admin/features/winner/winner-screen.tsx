import { motion } from "motion/react";
import EnterExit from "@/core/components/derived/enter-exit";
import { useAdminData } from "../../providers/admin-data-provider";
import ContentLayout from "@/core/components/layout/content-layout";
import VideoPlayer from "@/core/components/derived/video-player";

export function WinnerScreen() {
  const { winner } = useAdminData();
  if (!winner) return null;

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
          <div className="absolute flex justify-between items-center p-[5%] pb-0 top-0 left-0 w-full h-full">
            <div className="flex w-1/4 items-center justify-between">
              <img className="w-3/5 object-contain" src={winner.club.name_img_url} alt="" />
              <img className="w-1/5 object-contain" src={winner.club.logo_img_url} alt="" />
            </div>

            <div className="flex w-1/4 text-white justify-between flex-col items-center">
              <p className="text-3xl ml-7 font-bold">SCORE</p>
              <div className="text-8xl -mt-3 px-5 font-bold italic bg-linear-to-r from-yellow-500 via-yellow-100 to-yellow-300 text-transparent bg-clip-text">
                {winner.score}
              </div>
              <p className="font-bold ml-7">TOTAL POINTS</p>
            </div>

            <div className="w-1/4 flex justify-center">
              <img className="w-1/5 object-contain" src='/assets/images/icons/golden-trophy.webp' alt="" />
            </div>
          </div>
        </div>
      </div>
    </EnterExit>
  );
}

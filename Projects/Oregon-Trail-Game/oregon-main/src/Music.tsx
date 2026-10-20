import { useEffect } from "react";

let bgm: HTMLAudioElement | null = null;

// exported helper so you can call it anywhere
export function changeMusic(trackPath: string) {
  if (!bgm) return;
  bgm.pause();
  bgm.src = trackPath;
  bgm.currentTime = 0;
  bgm.play().catch(() => {});
}

// This component just sets up the audio element & unmute logic once
export default function backgroundMusic({ initial }: { initial: string }) {
  useEffect(() => {
    // create audio element if not already present
    if (!bgm) {
      bgm = new Audio(initial);
      bgm.loop = true;
      bgm.volume = 0.6;
      bgm.muted = true; // start muted
      bgm.play().catch(() => {}); // browsers may block until user gesture
    }

    const unmute = () => {
      if (bgm && bgm.muted) {
        bgm.muted = false;
        bgm.play().catch(() => {});
      }
      // remove listeners after first unmute
      document.removeEventListener("click", unmute);
      document.removeEventListener("keydown", unmute);
      document.removeEventListener("touchstart", unmute);
    };

    // wait for any user action to unmute autoplay
    document.addEventListener("click", unmute);
    document.addEventListener("keydown", unmute);
    document.addEventListener("touchstart", unmute);

    return () => {
      // cleanup if component unmounts
      document.removeEventListener("click", unmute);
      document.removeEventListener("keydown", unmute);
      document.removeEventListener("touchstart", unmute);
      if (bgm) {
        bgm.pause();
      }
    };
  }, [initial]);

  return null;
}

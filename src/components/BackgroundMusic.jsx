import React, { useEffect, useRef, useState } from 'react';
import introMusic from '../assets/splash/intro.mp3';

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Browser policies usually require a user interaction to play audio.
    // We'll try to play immediately, but also listen for any click on the document to start it.
    const startAudio = () => {
      audio.play().then(() => {
        setIsPlaying(true);
        window.removeEventListener('click', startAudio);
        window.removeEventListener('touchstart', startAudio);
      }).catch((err) => {

      });
    };

    window.addEventListener('click', startAudio);
    window.addEventListener('touchstart', startAudio);

    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('touchstart', startAudio);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <audio
        ref={audioRef}
        src={introMusic}
        loop
        preload="auto"
      />
      <button
        onClick={() => {
          if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
          } else {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        }}
        className="w-10 h-10 rounded-full bg-navy/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all active:scale-95"
        aria-label={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic;

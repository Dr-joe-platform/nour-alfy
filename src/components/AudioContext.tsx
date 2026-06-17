'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  playInteractionSound: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(true); // Autoplay by default
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create the background audio element
    // Using the user's custom MP3 file (added ?v=1 to bypass cache)
    const audio = new Audio('/audio/leberch-calm-509384.mp3?v=1');
    audio.loop = true;
    audio.volume = 0.5; // Default volume
    audioRef.current = audio;

    // Listen to Firebase for global volume
    const unsub = onSnapshot(doc(db, 'settings', 'audio'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.volume !== undefined && audioRef.current) {
          audioRef.current.volume = data.volume;
        }
      }
    });

    return () => {
      unsub();
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.warn('Autoplay prevented by browser. Will play on first interaction.', e);
            // If blocked, wait for the FIRST interaction (click, scroll, keydown) to start music
            const startOnInteraction = () => {
              if (isPlaying && audioRef.current) {
                audioRef.current.play().then(() => {
                  // Only remove listeners when successfully played
                  document.removeEventListener('click', startOnInteraction);
                  document.removeEventListener('scroll', startOnInteraction);
                  document.removeEventListener('keydown', startOnInteraction);
                  document.removeEventListener('touchstart', startOnInteraction);
                }).catch(() => {
                  // Still blocked, keep listening
                });
              }
            };
            // Listen to trusted gestures (no mousemove, it breaks browser policy)
            document.addEventListener('click', startOnInteraction);
            document.addEventListener('scroll', startOnInteraction);
            document.addEventListener('keydown', startOnInteraction);
            document.addEventListener('touchstart', startOnInteraction);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        audioRef.current.pause();
      } else if (isPlaying) {
        audioRef.current.play().catch(() => {
          // Autoplay policy might block it if no interaction happened yet
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  useEffect(() => {
    const playGlobalClickSound = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        
        // Create context lazily on first click to ensure browser allows it
        if (!(window as any).__globalAudioCtx) {
          (window as any).__globalAudioCtx = new AudioContextClass();
        }
        const audioCtx = (window as any).__globalAudioCtx;
        
        if (audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // A very delicate, soft "tiny water drop" sound
        oscillator.type = 'sine';
        // Pitch sweeps up quickly from a higher base for a tiny drop
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.05);

        // Sharp attack, very quick and gentle fade out
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.005); // Volume (0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.06);
      } catch (e) {
        console.warn("Global click sound failed", e);
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      
      // Check if the click was on or inside a button, link, or interactive element
      const isInteractive = target.closest('button') || target.closest('a') || target.closest('[role="button"]');
      if (isInteractive) {
        playGlobalClickSound();
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const playInteractionSound = () => {
    if (!isPlaying) return; // Only play if global audio is enabled
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Soft, high-pitched chime/ping
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);

      // Envelope for a soft "ping"
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02); // Louder chime (0.3)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn("Interaction sound failed", e);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, playInteractionSound }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getMuxHlsUrl, getMuxPosterUrl, getMuxMp4FallbackUrl } from '@/lib/video';

export interface VideoBackgroundProps {
  srcMp4?: string;
  srcWebm?: string;
  playbackId?: string;    // Mux / Cloudflare Stream Playback ID
  poster?: string;        // Fallback or explicit poster image
  overlayOpacity?: number;
  eager?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function VideoBackground({
  srcMp4,
  srcWebm,
  playbackId,
  poster,
  overlayOpacity = 0.42,
  eager = false,
  className = '',
  children,
}: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Compute effective poster (either explicit poster or auto-generated Mux poster)
  const effectivePoster = poster || (playbackId ? getMuxPosterUrl(playbackId) : '/images/im1.jpg');

  useEffect(() => {
    setMounted(true);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Video playback & HLS adaptive stream attachment
  useEffect(() => {
    if (!mounted || prefersReducedMotion) return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Explicitly guarantee muted status for modern browser autoplay policies
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.playsInline = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let hlsInstance: any = null;

    if (playbackId) {
      const hlsUrl = getMuxHlsUrl(playbackId);

      // Check native Safari HLS support
      if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = hlsUrl;
        videoEl
          .play()
          .then(() => setIsVideoPlaying(true))
          .catch(() => setIsVideoPlaying(false));
      } else {
        // Load Hls.js dynamically for Chromium, Firefox, Edge
        import('hls.js')
          .then(({ default: Hls }) => {
            if (Hls.isSupported()) {
              hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: false,
                capLevelToPlayerSize: true,
              });
              hlsInstance.loadSource(hlsUrl);
              hlsInstance.attachMedia(videoEl);
              hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                videoEl
                  .play()
                  .then(() => setIsVideoPlaying(true))
                  .catch(() => setIsVideoPlaying(false));
              });
              hlsInstance.on(Hls.Events.ERROR, () => {
                videoEl.src = getMuxMp4FallbackUrl(playbackId, 'medium');
                videoEl.play().then(() => setIsVideoPlaying(true)).catch(() => {});
              });
            } else {
              videoEl.src = getMuxMp4FallbackUrl(playbackId, 'medium');
              videoEl.play().then(() => setIsVideoPlaying(true)).catch(() => {});
            }
          })
          .catch(() => {
            videoEl.src = getMuxMp4FallbackUrl(playbackId, 'medium');
            videoEl.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          });
      }
    } else if (srcMp4) {
      const playVideo = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = true;
        const promise = videoRef.current.play();
        if (promise !== undefined) {
          promise
            .then(() => setIsVideoPlaying(true))
            .catch(() => {
              // Retry on interaction or when buffer is ready
              const onCanPlay = () => {
                if (videoRef.current) {
                  videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
                }
              };
              videoEl.addEventListener('canplay', onCanPlay, { once: true });
            });
        }
      };

      if (videoEl.readyState >= 2) {
        playVideo();
      } else {
        videoEl.addEventListener('loadeddata', playVideo, { once: true });
        videoEl.addEventListener('canplay', playVideo, { once: true });
        try {
          videoEl.load();
        } catch {
          // Ignore
        }
      }
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [mounted, prefersReducedMotion, playbackId, srcMp4]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-[#16191E] ${className}`}
    >
      {/* Fallback & Initial Poster Image */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-out ${
          isVideoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Image
          src={effectivePoster}
          alt="Luxury Architecture"
          fill
          priority={eager}
          sizes="100vw"
          className="object-cover object-center transform scale-[1.01]"
        />
      </div>

      {/* Looping Adaptive Video / Local MP4 */}
      {mounted && !prefersReducedMotion && (srcMp4 || playbackId) && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          src={srcMp4}
          preload={eager ? 'auto' : 'metadata'}
          suppressHydrationWarning
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-out ${
            isVideoPlaying ? 'opacity-100' : 'opacity-0'
          }`}
          onPlaying={() => setIsVideoPlaying(true)}
          onTimeUpdate={() => {
            if (!isVideoPlaying) setIsVideoPlaying(true);
          }}
          onCanPlay={(e) => {
            const el = e.currentTarget;
            el.muted = true;
            el.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          }}
        >
          {srcWebm && <source src={srcWebm} type="video/webm" />}
          {srcMp4 && <source src={srcMp4} type="video/mp4" />}
        </video>
      )}

      {/* Darkened Gradient Overlay for Contrast and Readability */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at center, rgba(19, 22, 26, ${overlayOpacity * 0.7}) 0%, rgba(19, 22, 26, ${overlayOpacity * 1.35}) 100%), linear-gradient(to bottom, rgba(19, 22, 26, 0.45) 0%, rgba(19, 22, 26, 0.25) 50%, rgba(19, 22, 26, 0.85) 100%)`,
        }}
      />

      {/* Subtle Vignette & Brass Edge Accent */}
      <div className="absolute inset-0 z-10 pointer-events-none border-b border-[#F5F3EE]/5" />

      {/* Foreground Content */}
      <div className="relative z-20 w-full h-full flex flex-col">{children}</div>
    </div>
  );
}

/**
 * Utility helpers for Mux and Cloudflare Stream CDN video delivery
 */

export interface MuxVideoConfig {
  playbackId: string;
  posterTime?: number;
  width?: number;
}

export function getMuxHlsUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export function getMuxPosterUrl(playbackId: string, time = 1, width = 1920): string {
  return `https://image.mux.com/${playbackId}/thumbnail.webp?time=${time}&width=${width}&fit_mode=smartcrop`;
}

export function getMuxAnimatedGif(playbackId: string, start = 0, duration = 4): string {
  return `https://image.mux.com/${playbackId}/animated.gif?start=${start}&end=${start + duration}&width=640`;
}

export function getMuxMp4FallbackUrl(playbackId: string, quality: 'high' | 'medium' | 'low' = 'high'): string {
  return `https://stream.mux.com/${playbackId}/${quality}.mp4`;
}

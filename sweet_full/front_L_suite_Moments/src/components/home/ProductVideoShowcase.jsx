import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, Sparkles } from 'lucide-react';

const VIDEO_SRC = '/videos/vidéo_R.mp4';

export default function ProductVideoShowcase() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const reduceMotion = useReducedMotion();

  const syncPlayback = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (playing) {
        await el.play();
      } else {
        el.pause();
      }
    } catch {
      setPlaying(false);
    }
  }, [playing]);

  useEffect(() => {
    syncPlayback();
  }, [syncPlayback]);

  const togglePlayback = () => setPlaying((p) => !p);

  return (
    <section
      id="decouvrir-en-video"
      className="relative isolate w-full"
      aria-labelledby="product-video-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={VIDEO_SRC}
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a0f] via-[#1a0a0f]/55 to-[#2d1018]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(26,10,15,0.5)_100%)]" />
      </div>

      {!videoReady && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-[#1a0a0f] text-white/70 text-sm px-6 text-center">
          Placez votre fichier vidéo dans{' '}
          <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-xs">public/videos/vidéo_R.mp4</code>
        </div>
      )}

      <div className="relative z-[2] min-h-[calc(100svh-70px)] md:min-h-[calc(100vh-70px)] w-full flex flex-col justify-between px-5 py-6 md:px-10 md:py-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center pt-6 md:pt-8"
        >
          <motion.span
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100 backdrop-blur-md"
            animate={
              reduceMotion
                ? undefined
                : { boxShadow: ['0 0 0 0 rgba(244,114,182,0.35)', '0 0 24px 4px rgba(244,114,182,0.2)', '0 0 0 0 rgba(244,114,182,0.35)'] }
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-200" aria-hidden />
            Sweet Moment
          </motion.span>
          <h2
            id="product-video-heading"
            className="font-display text-2xl font-bold leading-tight text-white drop-shadow-lg md:text-4xl lg:text-5xl"
          >
            Une bouchée de bonheur,{' '}
            <span className="bg-gradient-to-r from-rose-200 via-white to-amber-100 bg-clip-text text-transparent">
              un moment inoubliable
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/85 md:text-base">
            Nos pâtisseries artisanales allient traditions marocaines et finesse française : textures
            fondantes, parfums délicats et présentations soignées pour sublimer vos instants
            gourmands — du petit-déjeuner aux grandes célébrations.
          </p>
          <p className="mt-2 text-xs text-white/65 md:text-sm">
            Chaque création est préparée avec des ingrédients choisis avec exigence, pour vous
            offrir le goût authentique que vous méritez.
          </p>
        </motion.div>

        <div className="flex flex-1 flex-col items-center justify-end pb-4 md:pb-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.button
              type="button"
              onClick={togglePlayback}
              aria-pressed={playing}
              aria-label={playing ? 'Mettre la vidéo en pause' : 'Lire la vidéo'}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="group relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors hover:border-rose-200/60 hover:bg-rose-500/30 md:h-[72px] md:w-[72px]"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400/30 to-transparent opacity-0 transition group-hover:opacity-100" />
              {playing ? (
                <Pause className="relative h-7 w-7 md:h-8 md:w-8" strokeWidth={2.2} />
              ) : (
                <Play className="relative ml-1 h-7 w-7 md:h-7 md:w-8 md:h-8" strokeWidth={2.2} />
              )}
            </motion.button>
            <span className="text-xs font-medium uppercase tracking-widest text-white/70">
              {playing ? 'Pause' : 'Lecture'}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

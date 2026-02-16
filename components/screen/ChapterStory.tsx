'use client';

import { motion } from 'framer-motion';
import type { ChapterContent } from '@/lib/content/types';

interface ChapterStoryProps {
  chapter: ChapterContent;
}

export default function ChapterStory({ chapter }: ChapterStoryProps) {
  const displayText = chapter.storyPhase.screenParagraphs || chapter.storyPhase.paragraphs;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {/* Chapter Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <div className="text-2xl mb-4" style={{ color: '#666666' }}>
          [ CHAPTER {chapter.id} ]
        </div>
        <h1 className="text-7xl font-bold crt-glow" style={{ color: '#ffb000' }}>
          {chapter.title.toUpperCase()}
        </h1>
      </motion.div>

      {/* Story Text - Cinematic Display */}
      <div className="space-y-8 max-w-4xl text-center">
        {displayText.map((text, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.8, duration: 0.8 }}
            className="text-3xl leading-relaxed font-bold"
            style={{ color: '#ffb000' }}
          >
            {text}
          </motion.div>
        ))}
      </div>

      {/* Glitch effect periodically */}
      <motion.div
        animate={{
          opacity: [1, 0.7, 1],
          x: [0, -2, 2, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 5,
        }}
        className="mt-16 text-xl"
        style={{ color: '#33ff33' }}
      >
        [ TRANSMISSION STABLE ]
      </motion.div>
    </div>
  );
}

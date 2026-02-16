'use client';

import { motion } from 'framer-motion';
import type { ChapterContent } from '@/lib/content/types';

interface ChapterStoryProps {
  chapter: ChapterContent;
}

export default function ChapterStory({ chapter }: ChapterStoryProps) {
  return (
    <div className="space-y-6">
      {/* Chapter Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-sm mb-2" style={{ color: '#666666' }}>
          [ CHAPTER {chapter.id} ]
        </div>
        <h2 className="text-3xl font-bold crt-glow" style={{ color: '#ffb000' }}>
          {chapter.title}
        </h2>
      </motion.div>

      {/* Story Paragraphs */}
      <div className="space-y-4">
        {chapter.storyPhase.paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3 }}
            className="text-base leading-relaxed"
            style={{ color: '#ffb000' }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>

      {/* Waiting indicator */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center mt-8 text-sm"
        style={{ color: '#33ff33' }}
      >
        [ AWAITING VOTE PHASE... ]
      </motion.div>
    </div>
  );
}

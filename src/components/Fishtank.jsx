import React from 'react';
import { motion } from 'framer-motion';

const FishIcon = ({ type }) => {
  const icons = {
    regular: '🐟',
    rare: '🐠',
    special: '🦈',
    small: '🐠',
    medium: '🐡',
    large: '🐳',
    common: '🦀',
    uncommon: '🦑',
    rare: '🐙',
  };

  return <span className="text-2xl">{icons[type] || '🐟'}</span>;
};

const Fishtank = ({ fish, rareFish, specialFish, netCatch, trapCatch }) => {
  const allFish = [
    ...Array(fish).fill('regular'),
    ...Array(rareFish).fill('rare'),
    ...Array(specialFish).fill('special'),
    ...Array(netCatch.small).fill('small'),
    ...Array(netCatch.medium).fill('medium'),
    ...Array(netCatch.large).fill('large'),
    ...Array(trapCatch.common).fill('common'),
    ...Array(trapCatch.uncommon).fill('uncommon'),
    ...Array(trapCatch.rare).fill('rare'),
  ];

  return (
    <div className="relative w-full h-96 bg-blue-100 dark:bg-blue-900 rounded-lg overflow-hidden">
      {allFish.map((fishType, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
          animate={{
            x: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
            ],
            y: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <FishIcon type={fishType} />
        </motion.div>
      ))}
    </div>
  );
};

export default Fishtank;
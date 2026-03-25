import { motion } from 'framer-motion';
import { type ReactNode, type FC } from 'react';
import { Search, type LucideProps } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: FC<LucideProps>;
}

export const EmptyState = ({ title, description, action, icon: Icon = Search }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-2xl"
        >
          <circle cx="60" cy="60" r="50" fill="url(#empty-radial)" fillOpacity="0.1" />
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            stroke="var(--primary)"
            strokeWidth="1"
            strokeDasharray="4 4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <defs>
            <radialGradient id="empty-radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 60) rotate(90) scale(50)">
              <stop stopColor="var(--primary)" />
              <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-primary/40">
          <Icon size={48} strokeWidth={1} />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-3"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground max-w-sm mb-10 leading-relaxed"
      >
        {description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
};

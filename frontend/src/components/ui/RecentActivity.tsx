import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Hash, Stamp, Tag as TagIcon, Clock } from 'lucide-react';
import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

interface Activity {
  id: string;
  type: 'hash' | 'stamp' | 'tag';
  label: string;
  txId: string;
  timestamp: number;
}

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

const ICON_MAP = {
  hash: Hash,
  stamp: Stamp,
  tag: TagIcon,
};

export const RecentActivity = memo(({ activities, className }: RecentActivityProps) => {
  if (activities.length === 0) return null;

  return (
    <div className={twMerge("mt-8 pt-6 border-t border-border/50", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Clock size={14} className="text-muted-foreground" />
        <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Recent Activity</h4>
      </div>
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {activities.slice(0, 3).map((activity) => {
            const Icon = ICON_MAP[activity.type];
            const isRecent = Date.now() - activity.timestamp < 180000; // 3 minutes

            return (
              <motion.div
                key={activity.txId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group flex-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <div className="flex flex-col truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold truncate">{activity.label}</span>
                      {isRecent && (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" title="Pending confirmation" />
                      )}
                    </div>
                    <span className="text-[9px] text-muted-foreground font-mono truncate">{activity.txId.slice(0, 12)}...</span>
                  </div>
                </div>
                <a
                  href={`https://explorer.stacks.co/txid/${activity.txId}?chain=mainnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 opacity-0 group-hover:opacity-100 text-primary hover:bg-primary/10 rounded-lg transition-all shrink-0"
                  aria-label="View on Stacks Explorer"
                >
                  <ExternalLink size={14} />
                </a>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
});

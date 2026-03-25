import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Hash, Stamp, Tag as TagIcon, Clock } from 'lucide-react';
import { memo, useState, useMemo } from 'react';
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

type FilterType = 'all' | 'today' | 'week';

export const RecentActivity = memo(({ activities, className }: RecentActivityProps) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredActivities = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    switch (filter) {
      case 'today':
        return activities.filter(a => now - a.timestamp < oneDay);
      case 'week':
        return activities.filter(a => now - a.timestamp < oneWeek);
      default:
        return activities;
    }
  }, [activities, filter]);

  if (activities.length === 0) return null;

  return (
    <div className={twMerge("mt-8 pt-6 border-t border-border/50", className)}>
      <div className="flex flex-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-muted-foreground" />
          <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Recent Activity</h4>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
          {(['all', 'today', 'week'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={twMerge(
                "px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all",
                filter === f ? "bg-primary text-white" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {filteredActivities.slice(0, 5).map((activity) => {
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
        {filteredActivities.length === 0 && (
          <div className="text-center py-4 text-[10px] text-muted-foreground bg-white/5 rounded-xl border border-dashed border-white/10">
            No activity found for this period
          </div>
        )}
      </div>
    </div>
  );
});

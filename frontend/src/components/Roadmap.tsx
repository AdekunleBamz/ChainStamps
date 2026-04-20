import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { memo } from 'react';

/**
 * Static metadata for the project roadmap phases.
 */
const ROADMAP_PHASES = [
    {
        title: "Phase 1: Foundation",
        status: "completed",
        items: ["Core Smart Contracts", "Basic Frontend Integration", "Wallet Connection"]
    },
    {
        title: "Phase 2: Premium UI/UX",
        status: "current",
        items: ["Glassmorphism Design", "Micro-interactions", "Mobile Optimization", "Accessibility Improvements"]
    },
    {
        title: "Phase 3: Advanced Features",
        status: "upcoming",
        items: ["Batch Processing", "Cross-chain Verifications", "Advanced Analytics Dashboard"]
    }
];

type PhaseStatus = 'completed' | 'current' | 'upcoming';

/** Left-border colour class for each roadmap phase status. */
const PHASE_BORDER_CLASS: Record<PhaseStatus, string> = {
    completed: 'border-primary',
    current: 'border-yellow-500',
    upcoming: 'border-muted',
};

/** Badge colour class for each roadmap phase status. */
const PHASE_BADGE_CLASS: Record<PhaseStatus, string> = {
    completed: 'bg-primary/20 text-primary',
    current: 'bg-yellow-500/20 text-yellow-500',
    upcoming: 'bg-muted text-muted-foreground',
};
    /** The metadata object for the phase, containing title, status, and items. */
    phase: typeof ROADMAP_PHASES[0];
    /** The index of the phase in the list, used for staggered animations. */
    index: number;
}

/**
 * Individual roadmap phase card component.
 * 
 * @param {RoadmapPhaseProps} props - Component properties.
 */
const RoadmapPhase = memo(({ phase, index }: RoadmapPhaseProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -4, scale: 1.01 }}
            viewport={{ once: true }}
            role="article"
            aria-label={`Roadmap phase: ${phase.title}`}
            className={`roadmap-phase card glass p-6 border-l-4 transition-base shadow-md ${PHASE_BORDER_CLASS[phase.status as PhaseStatus] ?? 'border-muted'}`}
        >
            <div className="flex items-start gap-4">
                <div className="mt-1 flex-center">
                    {phase.status === 'completed' ? (
                        <CheckCircle2 className="text-primary" size={24} />
                    ) : phase.status === 'current' ? (
                        <Clock className="text-yellow-500 animate-pulse" size={24} />
                    ) : (
                        <Circle className="text-muted-foreground" size={24} />
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex-between mb-2">
                        <h3 className="text-xl font-bold" id={`phase-title-${index}`}>{phase.title}</h3>
                        <span 
                            className={`text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider shadow-sm ${PHASE_BADGE_CLASS[phase.status as PhaseStatus] ?? 'bg-muted text-muted-foreground'}`}
                            aria-current={phase.status === 'current' ? 'step' : undefined}
                        >
                            {phase.status}
                        </span>
                    </div>

                    <ul 
                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                        aria-labelledby={`phase-title-${index}`}
                    >
                        {phase.items.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
});

/**
 * Main Roadmap section displaying the project's evolution and future plans.
 * Provides a structured overview of development milestones.
 *
 * @component
 */
export const Roadmap = () => {
    return (
        <section className="roadmap-section py-20 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Project Roadmap</h2>
                <p className="text-muted-foreground">The evolution of ChainStamps and our path forward</p>
            </div>

            <div className="space-y-8">
                {ROADMAP_PHASES.map((phase, index) => (
                    <RoadmapPhase key={index} phase={phase} index={index} />
                ))}
            </div>
        </section>
    );
};

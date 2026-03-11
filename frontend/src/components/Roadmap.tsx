import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const phases = [
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

export function Roadmap() {
    return (
        <section className="roadmap-section py-20 px-6 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Project Roadmap</h2>
                <p className="text-muted-foreground">The evolution of ChainStamps and our path forward</p>
            </div>

            <div className="space-y-8">
                {phases.map((phase, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`roadmap-phase card glass p-6 border-l-4 ${phase.status === 'completed' ? 'border-primary' :
                                phase.status === 'current' ? 'border-yellow-500' : 'border-muted'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="mt-1">
                                {phase.status === 'completed' ? (
                                    <CheckCircle2 className="text-primary" size={24} />
                                ) : phase.status === 'current' ? (
                                    <Clock className="text-yellow-500 animate-pulse" size={24} />
                                ) : (
                                    <Circle className="text-muted-foreground" size={24} />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold">{phase.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider ${phase.status === 'completed' ? 'bg-primary/20 text-primary' :
                                            phase.status === 'current' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {phase.status}
                                    </span>
                                </div>

                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                ))}
            </div>
        </section>
    );
}

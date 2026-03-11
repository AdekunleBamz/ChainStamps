import { type ReactNode } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { Tooltip } from './ui/Tooltip';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { LucideIcon } from 'lucide-react';
import { TRANSITIONS } from '../constants/animations';

interface RegistryLayoutProps {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    fee?: {
        value: number;
        unit: string;
        tooltip: string;
    };
    headerBadge?: {
        label: string;
        tooltip: string;
    };
    children: ReactNode;
    controls?: any;
}

export function RegistryLayout({
    id,
    title,
    description,
    icon: Icon,
    fee,
    headerBadge,
    children,
    controls
}: RegistryLayoutProps) {
    return (
        <motion.section
            id={id}
            className="card"
            {...TRANSITIONS.fadeInUp}
            animate={controls}
        >
            <Breadcrumbs items={[{ label: title }]} />
            <div className="card-header">
                <div className="flex items-center gap-2">
                    <Icon className="card-icon" size={24} strokeWidth={1.5} />
                    {headerBadge && (
                        <Tooltip content={headerBadge.tooltip}>
                            <span className="text-sm font-semibold text-muted-foreground mr-1">
                                {headerBadge.label}
                            </span>
                        </Tooltip>
                    )}
                </div>
                <h2>{title}</h2>
                {fee && (
                    <Tooltip content={fee.tooltip}>
                        <span className="fee-badge">
                            <AnimatedNumber value={fee.value} decimals={2} suffix={` ${fee.unit}`} />
                        </span>
                    </Tooltip>
                )}
            </div>

            <p className="card-description">
                {description}
            </p>

            {children}
        </motion.section>
    );
}

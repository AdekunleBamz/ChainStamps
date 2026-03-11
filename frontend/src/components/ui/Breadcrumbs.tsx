import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
    items: {
        label: string;
        href?: string;
    }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="breadcrumbs-container px-1 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-xs font-medium text-muted-foreground">
                <li>
                    <a href="#" className="flex items-center hover:text-foreground transition-colors">
                        <Home size={12} className="mr-1" />
                        Home
                    </a>
                </li>

                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ChevronRight size={12} className="opacity-50" />
                        {item.href ? (
                            <a
                                href={item.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <span className="text-foreground">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

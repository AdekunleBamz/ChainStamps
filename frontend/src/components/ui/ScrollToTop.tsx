import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

/** Scroll offset in pixels before the scroll-to-top button becomes visible. */
const SCROLL_VISIBILITY_THRESHOLD = 300;

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > SCROLL_VISIBILITY_THRESHOLD) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={twMerge(
      "fixed bottom-24 right-6 z-50 transition-all duration-300",
      isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90 pointer-events-none"
    )}>
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        className="rounded-full h-12 w-12 shadow-lg bg-background/80 backdrop-blur-md border-primary/20 hover:border-primary/50 text-primary"
        aria-label="Scroll to top"
      >
        <ChevronUp size={24} />
      </Button>
    </div>
  );
};

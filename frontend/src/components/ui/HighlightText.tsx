import { memo } from 'react';

interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

export const HighlightText = memo(({ text, query, className = "bg-primary/20 text-primary px-0.5 rounded-sm" }: HighlightTextProps) => {
  if (!query.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));

  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className={className}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
});

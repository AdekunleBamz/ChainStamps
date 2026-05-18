import { memo, useMemo } from 'react';

/**
 * Properties for the HighlightText component.
 * Wraps matched substrings with a styled span for search result highlighting.
 */
interface HighlightTextProps {
  text: string;
  query: string;
  className?: string;
}

export const HighlightText = memo(({ text, query, className = "bg-primary/20 text-primary px-0.5 rounded-sm" }: HighlightTextProps) => {
  const highlightRegex = useMemo(
    () => new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
    [query]
  );

  if (!query.trim()) return <>{text}</>;

  const parts = text.split(highlightRegex);

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

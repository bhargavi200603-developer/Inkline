import { BookOpen } from 'lucide-react';
import { useState } from 'react';

interface BlogCoverImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export default function BlogCoverImage({
  src,
  alt,
  title,
  className = '',
}: BlogCoverImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-100 via-stone-100 to-zinc-200 text-zinc-600 p-6 text-center ${className}`}
      >
        <BookOpen className="w-6 h-6 text-zinc-500" aria-hidden="true" />
        {title && (
          <span className="font-serif text-sm font-medium text-zinc-700 line-clamp-2 max-w-[22ch]">
            {title}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`object-cover ${className}`}
    />
  );
}

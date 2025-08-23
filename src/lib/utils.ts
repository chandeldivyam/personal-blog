export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function readingTime(content: string): { minutes: number; words: number; text: string } {
  const wordsPerMinute = 200;
  const words = content
    .trim()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation but keep spaces
    .split(/\s+/)
    .filter(word => word.length > 0).length;
  
  const minutes = Math.ceil(words / wordsPerMinute);
  const text = minutes === 1 ? '1 min read' : `${minutes} min read`;
  
  return {
    minutes,
    words,
    text
  };
}
import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | Buy-Wise` : 'Buy-Wise | Multi-Marketplace Price Comparison';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}

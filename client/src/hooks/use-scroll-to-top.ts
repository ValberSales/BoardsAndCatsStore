import { useCallback } from 'react';

export function useScrollToTop() {
   
    const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
        window.scrollTo({ top: 0, left: 0, behavior });
    }, []);

    return { scrollToTop };
}
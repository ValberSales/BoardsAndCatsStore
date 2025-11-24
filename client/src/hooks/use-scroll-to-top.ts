import { useCallback } from 'react';

export function useScrollToTop() {
    /**
     * Rola a janela para o topo.
     * @param behavior 'smooth' (suave) ou 'auto' (instantâneo)
     */
    const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
        window.scrollTo({ top: 0, left: 0, behavior });
    }, []);

    return { scrollToTop };
}
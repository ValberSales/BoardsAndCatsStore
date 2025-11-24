import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Usa rolagem instantânea ao trocar de página inteira
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // Não renderiza nada visualmente
}
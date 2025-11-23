import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import './EmptyResults.css';

interface EmptyResultsProps {
    query: string;
}

export function EmptyResults({ query }: EmptyResultsProps) {
    const navigate = useNavigate();

    return (
        <div className="empty-results-container">
            <i className="pi pi-search empty-icon"></i>
            <span className="empty-text">Nenhum produto encontrado para "{query}".</span>
            <Button label="Ver todos os produtos" link onClick={() => navigate('/')} />
        </div>
    );
}
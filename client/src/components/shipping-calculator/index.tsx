import { useState } from 'react';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { api } from '@/lib/axios';

// Importação do arquivo CSS
import './ShippingCalculator.css';

interface ShippingCalculatorProps {
    onCalculate?: (value: number) => void;
}

export const ShippingCalculator = ({ onCalculate }: ShippingCalculatorProps) => {
    const [cep, setCep] = useState('');
    const [shippingValue, setShippingValue] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCalculate = async () => {
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            setError('CEP inválido');
            return;
        }

        setLoading(true);
        setError('');
        setShippingValue(null);
        if (onCalculate) onCalculate(0);

        try {
            const backendResponse = await api.get(`/shipping/calculate?cep=${cleanCep}`);
            const value = backendResponse.data.value;
            
            if (value === 0) {
                setError('Não foi possível calcular o frete para este CEP.');
            } else {
                setShippingValue(value);
                if (onCalculate) onCalculate(value);
            }

        } catch (err) {
            console.error(err);
            setError('Erro ao calcular frete');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="shipping-calculator-container">
            <div className="shipping-title">Calcular Frete</div>
            
            <div className="shipping-input-wrapper">
                <div className="shipping-input-container">
                    <div className="p-inputgroup shipping-input-group">
                        <InputMask 
                            mask="99999-999" 
                            value={cep} 
                            placeholder="Digite seu CEP"
                            onChange={(e) => setCep(e.value || '')} 
                            className="shipping-input-field"
                        />
                        <Button 
                            icon="pi pi-search" 
                            onClick={handleCalculate} 
                            loading={loading}
                            disabled={cep.replace(/\D/g, '').length !== 8}
                        />
                    </div>
                    {error && <small className="shipping-error-msg">{error}</small>}
                </div>
            </div>

            {/* Resultado do Cálculo */}
            {shippingValue !== null && !error && shippingValue > 0 && (
                <div className="shipping-result-card">
                    <div className="shipping-method-info">
                        <i className="pi pi-box shipping-icon"></i>
                        <div className="shipping-details">
                            <span className="shipping-method-name">PAC - Correios</span>
                            <span className="shipping-method-desc">Entrega Econômica</span>
                        </div>
                    </div>
                    <span className="shipping-price">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingValue)}
                    </span>
                </div>
            )}
        </div>
    );
};
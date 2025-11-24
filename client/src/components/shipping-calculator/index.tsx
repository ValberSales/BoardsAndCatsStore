import { useState } from 'react';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import axios from 'axios';
import { api } from '@/lib/axios';

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
        if (onCalculate) onCalculate(0); // Reseta o pai

        try {
            // 1. Busca UF
            const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
            
            if (viaCepResponse.data.erro) {
                setError('CEP não encontrado');
                setLoading(false);
                return;
            }

            const uf = viaCepResponse.data.uf;

            // 2. Busca valor no Backend
            const backendResponse = await api.get(`/shipping/calculate?state=${uf}`);
            
            const value = backendResponse.data.value;
            setShippingValue(value);
            
            // Avisa o componente pai
            if (onCalculate) onCalculate(value);

        } catch (err) {
            console.error(err);
            setError('Erro ao calcular frete');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="surface-card p-3 calc-container border-round-2xl shadow-1 mt-3">
            <div className="text-900 font-medium text-xl mb-3">Calcular Frete</div>
            
            <div className="flex gap-2 align-items-start">
                <div className="flex-1">
                    <div className="p-inputgroup">
                        <InputMask 
                            mask="99999-999" 
                            value={cep} 
                            placeholder="Digite seu CEP"
                            onChange={(e) => setCep(e.value || '')} 
                            className="w-full"
                        />
                        <Button 
                            icon="pi pi-search" 
                            onClick={handleCalculate} 
                            loading={loading}
                            disabled={cep.replace(/\D/g, '').length !== 8}
                        />
                    </div>
                    {error && <small className="text-red-500 block mt-1">{error}</small>}
                </div>
            </div>

            {/* Resultado do Cálculo com Design Original (Ícone de Caixa) */}
            {shippingValue !== null && !error && (
                <div className="mt-3 border-round p-2 flex justify-content-between align-items-center fadein animation-duration-500">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-box text-l"></i>
                        <span className="font-small text-l">Entrega Econômica</span>
                    </div>
                    <span className="font-bold text-l">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingValue)}
                    </span>
                </div>
            )}
        </div>
    );
};
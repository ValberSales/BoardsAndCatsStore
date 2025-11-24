import { useState } from 'react';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import axios from 'axios';
import { api } from '@/lib/axios'; // Sua instância do axios configurada para o backend

export const ShippingCalculator = () => {
    const [cep, setCep] = useState('');
    const [shippingValue, setShippingValue] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCalculate = async () => {
        // Remove formatação do CEP
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            setError('CEP inválido');
            return;
        }

        setLoading(true);
        setError('');
        setShippingValue(null);

        try {
            // 1. Busca o Estado (UF) no ViaCEP
            const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
            
            if (viaCepResponse.data.erro) {
                setError('CEP não encontrado');
                setLoading(false);
                return;
            }

            const uf = viaCepResponse.data.uf;

            // 2. Busca o valor do frete no nosso Backend baseado na UF
            const backendResponse = await api.get(`/shipping/calculate?state=${uf}`);
            
            setShippingValue(backendResponse.data.value);

        } catch (err) {
            console.error(err);
            setError('Erro ao calcular frete');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="surface-card p-4 border-round shadow-1 mt-3">
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

            {/* Resultado do Cálculo */}
            {shippingValue !== null && !error && (
                <div className="mt-3 bg-green-50 border-round p-3 flex justify-content-between align-items-center fadein animation-duration-500">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-box text-green-600 text-xl"></i>
                        <span className="text-green-800 font-medium">Entrega Econômica</span>
                    </div>
                    <span className="text-green-800 font-bold text-xl">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shippingValue)}
                    </span>
                </div>
            )}
        </div>
    );
};
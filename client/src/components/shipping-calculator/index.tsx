import { useState } from "react";
import { InputMask } from "primereact/inputmask";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

interface ShippingCalculatorProps {
    onCalculate: (value: number) => void;
}

export const ShippingCalculator = ({ onCalculate }: ShippingCalculatorProps) => {
    const [cep, setCep] = useState("");
    const [loading, setLoading] = useState(false);
    const [calculated, setCalculated] = useState(false);

    const handleCalculate = () => {
        if (!cep) return;
        setLoading(true);

        // Simulação de chamada API de frete
        setTimeout(() => {
            const simulatedFreight = 25.90; // Valor fixo para teste
            onCalculate(simulatedFreight);
            setCalculated(true);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="surface-ground p-3 border-round-lg mt-3">
            <span className="font-bold text-900 block mb-2">Estimativa de Frete</span>
            <div className="p-inputgroup flex-1">
                <InputMask 
                    mask="99999-999" 
                    placeholder="Seu CEP" 
                    value={cep} 
                    onChange={(e) => setCep(e.value || "")} 
                    className="w-full"
                />
                <Button 
                    icon="pi pi-search" 
                    onClick={handleCalculate} 
                    loading={loading}
                    severity="secondary"
                />
            </div>
            {calculated && (
                <div className="fadein animation-duration-300">
                    <Divider className="my-2" />
                    <div className="flex justify-content-between align-items-center text-sm">
                        <span className="text-700">Entrega Padrão (5-7 dias)</span>
                        <span className="font-bold text-green-600">R$ 25,90</span>
                    </div>
                </div>
            )}
        </div>
    );
};
import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { ShippingCalculator } from "@/components/shipping-calculator";
import "./CartSummary.css";

interface CartSummaryProps {
    subTotal: number;
    itemsCount: number;
    onCheckout: () => void;
    loading?: boolean;
    disableCheckout?: boolean;
}

export const CartSummary = ({ subTotal, onCheckout, loading, disableCheckout }: CartSummaryProps) => {
    // Estado para armazenar o frete calculado vindo do filho
    const [shippingCost, setShippingCost] = useState(0);

    // Total dinâmico
    const finalTotal = subTotal + shippingCost;

    return (
        <div className="flex flex-column gap-4 sticky" style={{ top: '100px' }}>
            <Card className="shadow-2 border-round-2xl p-4 summary-card">
                <span className="text-xl font-bold text-900 block mb-4">Resumo do Pedido</span>
                
                <div className="flex flex-column gap-3">
                    <div className="flex justify-content-between">
                        <span className="text-600">Subtotal</span>
                        <span className="font-medium text-900">
                            {subTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                    
                    {/* Calculadora injeta o valor no estado shippingCost */}
                    <ShippingCalculator onCalculate={setShippingCost} />
                    
                    <Divider />

                    <div className="flex justify-content-between align-items-center mb-4">
                        <div className="flex flex-column">
                            <span className="font-bold text-900 summary-total-label">Total</span>
                            {shippingCost === 0 && (
                                <small className="text-gray-500 text-xs font-normal">s/ frete incluso</small>
                            )}
                        </div>
                        <div className="text-right">
                            <span className="font-bold summary-total-value block text-primary text-xl">
                                {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    </div>

                    <Button 
                        label="Ir para o Checkout" 
                        icon="pi pi-arrow-right" 
                        iconPos="right"
                        size="large" 
                        className="w-full font-bold shadow-3 border-round-xl"
                        onClick={onCheckout}
                        loading={loading}
                        disabled={disableCheckout}
                    />
                </div>
            </Card>
        </div>
    );
};
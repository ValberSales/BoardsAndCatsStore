import { Card } from "primereact/card";
import type { IAddress } from "@/types/address";
import type { IPaymentMethod } from "@/types/payment";
import "./CheckoutSummary.css";

interface CheckoutSummaryProps {
    itemCount: number;
    subTotal: number;
    shippingCost: number;
    discount: number;
    selectedAddress?: IAddress | null;
    selectedPayment?: IPaymentMethod | null;
}


export const CheckoutSummary = ({ 
    itemCount, 
    subTotal, 
    shippingCost, 
    discount,
    selectedAddress,
    selectedPayment 
}: CheckoutSummaryProps) => {
    
    const finalTotal = subTotal + shippingCost - discount;

        const getLabel = (type: string) => {
        if (type === 'CREDIT_CARD') return 'Cartão de Crédito';
        if (type === 'DEBIT_CARD') return 'Cartão de Débito';
        if (type === 'PIX') return 'PIX';
        return 'Outro';
    };

    return (
        <Card className="checkout-summary-card shadow-2 border-round-2xl">
            <h3 className="text-xl font-bold m-0 mb-4 text-900">Resumo do Pedido</h3>

            {/* Valores Financeiros */}
            <div className="flex flex-column">
                <div className="summary-row">
                    <span>Itens ({itemCount})</span>
                    <span>{subTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                
                <div className="summary-row">
                    <span>Frete</span>
                    <span className={shippingCost > 0 ? "" : "text-green-600"}>
                        {shippingCost === 0 ? '-' : shippingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="summary-row text-green-600">
                        <span>Desconto</span>
                        <span>- {discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                )}

                <div className="summary-total">
                    <span className="summary-total-label">Total</span>
                    <span className="summary-total-value">
                        {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                </div>
            </div>

            {/* Informações Progressivas */}
            {selectedAddress && (
                <div className="info-group fadein animation-duration-500">
                    <span className="info-group-title">
                        <i className="pi pi-map-marker mr-2"></i>
                        Entrega em
                    </span>
                    <div className="info-group-content">
                        <div className="font-semibold">{selectedAddress.street}</div>
                        <div>{selectedAddress.city} - {selectedAddress.state}</div>
                        <div className="text-xs mt-1">CEP: {selectedAddress.zip}</div>
                    </div>
                </div>
            )}

            {selectedPayment && (
                <div className="info-group fadein animation-duration-500">
                    <span className="info-group-title">
                        <i className="pi pi-credit-card mr-2"></i>
                        Pagamento
                    </span>
                    <div className="info-group-content">
                        <div className="font-semibold">{selectedPayment.description}</div>
                        <div className="text-xs uppercase">{getLabel(selectedPayment.type)}</div>
                    </div>
                </div>
            )}

        </Card>
    );
};
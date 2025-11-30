import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Steps } from "primereact/steps";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Divider } from "primereact/divider";
import { CartContext } from "@/context/CartContext";
import { CheckoutSummary } from "@/components/checkout-summary";
import { CartReviewList } from "@/components/cart-review-list";
import { AddressSelector } from "@/components/address-selector";
import { PaymentSelector } from "@/components/payment-selector"; 
import { api } from "@/lib/axios";

import type { IAddress } from "@/types/address";
import type { IPaymentMethod } from "@/types/payment"; 
import "./Checkout.css";

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, total, clearCart } = useContext(CartContext);
    const toast = useRef<Toast>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [orderProcessing, setOrderProcessing] = useState(false);
    const [orderFinished, setOrderFinished] = useState(false);

    // Dados do Pedido
    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<IPaymentMethod | null>(null);
    const [shippingCost, setShippingCost] = useState(0);
    const [discount, setDiscount] = useState(0); // Armazena o valor em R$ (ex: 50.00)

    const stepsItems = [
        { label: 'Revisão' },
        { label: 'Endereço' },
        { label: 'Pagamento' }
    ];

    // Redireciona se carrinho vazio
    useEffect(() => {
        if (items.length === 0 && !orderFinished) {
            navigate("/cart");
        }
    }, [items, navigate, orderFinished]);

    // --- CÁLCULO AUTOMÁTICO DE FRETE ---
    useEffect(() => {
        const calculateShipping = async () => {
            if (selectedAddress && selectedAddress.state) {
                try {
                   
                    const response = await api.get(`/shipping/calculate?cep=${selectedAddress.zip}`);
                    setShippingCost(response.data.value);
                } catch (error) {
                    console.error("Erro ao calcular frete:", error);
                    setShippingCost(0);
                }
            } else {
                setShippingCost(0);
            }
        };

        calculateShipping();
    }, [selectedAddress]);

    const hasStockIssues = items.some(i => i.quantity > i.product.stock || i.product.stock === 0);

    // --- AÇÃO FINAL: CRIAR PEDIDO ---
    const handleFinishOrder = async () => {
        if (!selectedAddress || !selectedPayment) return;

        setOrderProcessing(true);
        try {

            const response = await api.post("/orders/checkout", {
                addressId: selectedAddress.id,
                paymentMethodId: selectedPayment.id,
                shipping: shippingCost, 
                discount: discount      
            });

            if (response.status === 201) {
                clearCart(); 
                setOrderFinished(true); 

                setTimeout(() => {
                    navigate("/orders");
                }, 5000);
            }
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível finalizar o pedido. Tente novamente.',
                life: 5000
            });
            setOrderProcessing(false);
        }
    };

    // --- TELA DE SUCESSO ---
    if (orderFinished) {
        return (
            <div className="success-page">
            <Card className="success-card shadow-4">
                <div className="content-wrapper">
                    
                    <div className="icon-container animation-duration-500 fadeindown">
                        <i className="pi pi-check success-icon"></i>
                    </div>
                    
                    <h1 className="success-title">Pedido Enviado!</h1>
                    
                    <p className="success-message">
                        Obrigado pela compra! Seus jogos já estão sendo separados por nossa equipe (e pelos gatos).
                    </p>
                </div>

                <div className="redirect-box">
                    <ProgressSpinner 
                        className="spinner-small" 
                        strokeWidth="4" 
                    />
                    <span className="redirect-text">Redirecionando para seus pedidos...</span>
                </div>
            </Card>
        </div>
        );
    }

    // --- CONTEÚDO DOS PASSOS ---
    const renderStepContent = () => {
        switch (activeIndex) {
            case 0: // Revisão
                return (
                    <div className="fadein animation-duration-500">
                        <div className="text-center mb-5">
                            <h2 className="text-2xl font-bold text-900 m-0">Confirme seus itens</h2>
                            <p className="text-gray-600 mt-2">Verifique se está tudo certo antes de prosseguir.</p>
                        </div>
                        {hasStockIssues && <Message severity="error" text="Estoque insuficiente em alguns itens." className="w-full mb-4" />}
                        <div className="px-2 md:px-4"><CartReviewList items={items} /></div>
                    </div>
                );
            case 1: // Endereço
                return (
                    <div className="px-2 md:px-4">
                        <AddressSelector selectedAddressId={selectedAddress?.id} onSelect={setSelectedAddress} />
                    </div>
                );
            case 2: // Pagamento
                return (
                    <div className="px-2 md:px-4">
                        <PaymentSelector
                            selectedPaymentId={selectedPayment?.id}
                            onSelect={setSelectedPayment}
                            onCouponApply={setDiscount} // Recebe o valor já calculado em R$
                            orderTotal={total} // Passa o total para o cálculo da % no filho
                        />
                    </div>
                );
            default: return null;
        }
    };

    const isNextDisabled = () => {
        if (activeIndex === 0 && hasStockIssues) return true;
        if (activeIndex === 1 && !selectedAddress) return true;
        if (activeIndex === 2 && !selectedPayment) return true;
        return false;
    };

    return (
        <div className="surface-ground min-h-screen">
            <Toast ref={toast} />
            <div className="container mx-auto px-4 checkout-container">

                <div className="checkout-steps mb-5">
                    <Steps model={stepsItems} activeIndex={activeIndex} readOnly={true} />
                </div>

                <div className="grid">
                    <div className="col-12 lg:col-8">
                        <Card className="checkout-content-card shadow-2 border-round-2xl">
                            {renderStepContent()}

                            <div>
                                <Divider className="mt-5" />
                                <div className="flex justify-content-between pt-4 surface-border px-2">

                                    <Button
                                        label={activeIndex === 0 ? "Voltar" : "Voltar"}
                                        icon="pi pi-arrow-left"
                                        outlined
                                        onClick={() => activeIndex === 0 ? navigate('/cart') : setActiveIndex(prev => prev - 1)}
                                        disabled={orderProcessing}
                                    />

                                    {activeIndex < 2 ? (
                                        <Button
                                            label="Continuar"
                                            icon="pi pi-arrow-right"
                                            iconPos="right"
                                            onClick={() => setActiveIndex(prev => prev + 1)}
                                            disabled={isNextDisabled()}
                                        />
                                    ) : (
                                        <Button
                                            label="Finalizar"
                                            icon="pi pi-check-circle"
                                            severity="success"
                                            onClick={handleFinishOrder}
                                            loading={orderProcessing}
                                            disabled={isNextDisabled()}
                                            className="shadow-2"
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="col-12 lg:col-4">
                        <CheckoutSummary
                            itemCount={items.length}
                            subTotal={total}
                            shippingCost={shippingCost}
                            discount={discount}
                            selectedAddress={selectedAddress}
                            selectedPayment={selectedPayment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
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
import { PaymentSelector } from "@/components/payment-selector"; // <--- Novo Componente
import { api } from "@/lib/axios";

import type { IAddress, IPaymentMethod } from "@/commons/types";
import "./Checkout.css";

export const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, total, clearCart } = useContext(CartContext); // clearCart necessário
    const toast = useRef<Toast>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [orderProcessing, setOrderProcessing] = useState(false);
    const [orderFinished, setOrderFinished] = useState(false); // Controla tela de sucesso

    // Dados do Pedido
    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<IPaymentMethod | null>(null);
    const [shippingCost, setShippingCost] = useState(0);
    const [discount, setDiscount] = useState(0);

    const stepsItems = [
        { label: 'Revisão' },
        { label: 'Endereço' },
        { label: 'Pagamento' }
    ];

    useEffect(() => {
        if (items.length === 0 && !orderFinished) {
            navigate("/cart");
        }
    }, [items, navigate, orderFinished]);

    useEffect(() => {
        if (selectedAddress) setShippingCost(25.90);
    }, [selectedAddress]);

    const hasStockIssues = items.some(i => i.quantity > i.product.stock || i.product.stock === 0);

    // --- AÇÃO FINAL: CRIAR PEDIDO ---
    const handleFinishOrder = async () => {
        if (!selectedAddress || !selectedPayment) return;

        setOrderProcessing(true);
        try {
            // Enviando para a API (Backend)
            const response = await api.post("/orders/checkout", {
                addressId: selectedAddress.id,
                paymentMethodId: selectedPayment.id
                // discount: discount (Se o back suportar no futuro)
            });

            if (response.status === 201) {
                // SUCESSO!
                clearCart(); // Limpa o contexto e localStorage
                setOrderFinished(true); // Mostra tela de sucesso

                // Redireciona após 3 segundos
                setTimeout(() => {
                    navigate("/orders");
                }, 3500);
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

    // --- RENDERIZAÇÃO DA TELA DE SUCESSO ---
    if (orderFinished) {
        return (
            <div className="surface-ground min-h-screen flex align-items-center justify-content-center">
                <Card className="text-center shadow-4 border-round-2xl p-5" style={{ maxWidth: '500px' }}>
                    <div className="mb-4">
                        <div className="bg-green-100 border-circle w-6rem h-6rem flex align-items-center justify-content-center mx-auto mb-4 animation-duration-500 fadeindown">
                            <i className="pi pi-check text-4xl text-green-600"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-900 mb-2">Pedido Enviado!</h1>
                        <p className="text-gray-600 line-height-3">
                            Obrigado pela compra! Seus jogos já estão sendo separados por nossa equipe (e pelos gatos).
                        </p>
                    </div>
                    <div className="flex align-items-center justify-content-center gap-2 text-primary">
                        <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="4" />
                        <span className="font-medium">Redirecionando para seus pedidos...</span>
                    </div>
                </Card>
            </div>
        );
    }

    // --- RENDERIZAÇÃO DO FLUXO DE STEPS ---
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
                            onCouponApply={setDiscount}
                        />
                    </div>
                );
            default: return null;
        }
    };

    const isNextDisabled = () => {
        if (activeIndex === 0 && hasStockIssues) return true;
        if (activeIndex === 1 && !selectedAddress) return true;
        if (activeIndex === 2 && !selectedPayment) return true; // Bloqueia finalizar se não selecionar pagto
        return false;
    };

    return (
        <div className="surface-ground min-h-screen pt-7 pb-8">
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
                                <div className="flex justify-content-between pt-4 surface-border px-2 md:px-4">



                                    <Button
                                        label={activeIndex === 0 ? "Voltar ao Carrinho" : "Voltar"}
                                        icon="pi pi-arrow-left"
                                        outlined
                                        onClick={() => activeIndex === 0 ? navigate('/cart') : setActiveIndex(prev => prev - 1)}
                                        disabled={orderProcessing}
                                    />

                                    {/* Botão Dinâmico: Continuar ou Finalizar */}
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
                                            label="Finalizar Compra"
                                            icon="pi pi-check-circle"
                                            severity="success"
                                            size="large"
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
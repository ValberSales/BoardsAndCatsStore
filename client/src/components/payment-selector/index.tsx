import { useState, useEffect, useRef } from "react";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import PaymentMethodService from "@/services/payment-method-service";
import CouponService from "@/services/coupon-service"; // <--- Novo Serviço
import { PaymentMethodForm } from "@/components/payment-method-form";
import type { IPaymentMethod, ICoupon } from "@/commons/types"; // <--- Novo Tipo
import "./PaymentSelector.css";

interface PaymentSelectorProps {
    selectedPaymentId?: number;
    onSelect: (payment: IPaymentMethod) => void;
    onCouponApply: (discount: number) => void;
    orderTotal: number; // <--- Nova prop necessária para cálculo de %
}

export const PaymentSelector = ({ selectedPaymentId, onSelect, onCouponApply, orderTotal }: PaymentSelectorProps) => {
    const [methods, setMethods] = useState<IPaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    
    // Estado do Cupom
    const [couponCode, setCouponCode] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponLoading, setCouponLoading] = useState(false);

    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        setLoading(true);
        try {
            const response = await PaymentMethodService.getAll();
            if (response.success) {
                setMethods(response.data);
            }
        } catch (error) {
            console.error("Erro ao carregar pagamentos");
        } finally {
            setLoading(false);
        }
    };

    const handleNewMethod = async (data: IPaymentMethod) => {
        setFormLoading(true);
        try {
            const response = await PaymentMethodService.save(data);
            if (response.success) {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Método salvo!' });
                await loadMethods();
                if (response.data?.id) onSelect(response.data);
                setShowForm(false);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar.' });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro de conexão.' });
        } finally {
            setFormLoading(false);
        }
    };

    // --- LÓGICA DO CUPOM ATUALIZADA ---
    const applyCoupon = async () => {
        if (!couponCode) return;
        setCouponLoading(true);

        const response = await CouponService.validate(couponCode);

        if (response.success) {
            const coupon: ICoupon = response.data;

            // 1. Converter para garantir que é número
            const percent = Number(coupon.percentage);
            
            // 2. Cálculo de segurança
            if (isNaN(percent)) {
                 toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao ler porcentagem do cupom.' });
                 setCouponLoading(false);
                 return;
            }

            // 3. Calcular valor absoluto (R$) baseando-se no total do pedido
            // orderTotal vem das props
            const discountCalculated = (orderTotal * percent) / 100;
            
            // 4. Passar o valor em REAIS para o pai (CheckoutPage)
            onCouponApply(discountCalculated); 
            setCouponApplied(true);
            
            toast.current?.show({ 
                severity: 'success', 
                summary: 'Cupom Aplicado', 
                detail: `Desconto de ${percent}% (R$ ${discountCalculated.toFixed(2)}) aplicado!` 
            });
        } else {
            // ... erro
        }
        setCouponLoading(false);
    };

    const handleRemoveCoupon = () => {
        setCouponApplied(false); 
        setCouponCode(""); 
        onCouponApply(0);
    };

    const getIcon = (type: string) => {
        if (type === 'CREDIT_CARD') return 'pi pi-credit-card';
        if (type === 'DEBIT_CARD') return 'pi pi-wallet';
        if (type === 'PIX') return 'pi pi-bolt';
        return 'pi pi-dollar';
    };

    const getLabel = (type: string) => {
        if (type === 'CREDIT_CARD') return 'Cartão de Crédito';
        if (type === 'DEBIT_CARD') return 'Cartão de Débito';
        if (type === 'PIX') return 'PIX';
        return 'Outro';
    };

    if (loading) return <div className="text-center p-4"><i className="pi pi-spin pi-spinner text-2xl"></i></div>;

    return (
        <div className="fadein animation-duration-500">
            <Toast ref={toast} />
            
            <h2 className="text-2xl font-bold text-900 m-0 mb-4">Como você prefere pagar?</h2>
            
            <div className="grid">
                {methods.map((method) => {
                    const isSelected = selectedPaymentId === method.id;
                    return (
                        <div className="col-12" key={method.id}>
                            <div 
                                className={classNames("payment-card p-3 border-round-xl", { 'selected': isSelected })}
                                onClick={() => onSelect(method)}
                            >
                                <RadioButton 
                                    checked={isSelected} 
                                    onChange={() => {}} 
                                    className="pointer-events-none"
                                />
                                <div className="payment-icon-wrapper">
                                    <i className={`${getIcon(method.type)} text-xl`}></i>
                                </div>
                                <div>
                                    <span className="font-bold text-900 block">{method.description}</span>
                                    <span className="text-500 text-xs uppercase">{getLabel(method.type)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="col-12">
                    <div className="new-payment-btn p-3" onClick={() => setShowForm(true)}>
                        <div className="bg-surface-100 border-circle w-2rem h-2rem flex align-items-center justify-content-center">
                            <i className="pi pi-plus text-sm"></i>
                        </div>
                        <span className="font-medium">Adicionar novo cartão ou meio de pagamento</span>
                    </div>
                </div>
            </div>

            {/* Seção de Cupom */}
            <div className="mt-5 pt-4 border-top-1 surface-border">
                <h3 className="text-lg font-bold text-900 mb-3">Cupom de Desconto</h3>
                <div className="flex gap-2">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-ticket"></i>
                        </span>
                        <InputText 
                            placeholder="Digite seu código" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={couponApplied}
                        />
                    </div>
                    <Button 
                        label={couponApplied ? "Remover" : "Aplicar"} 
                        severity={couponApplied ? "danger" : undefined}
                        outlined={couponApplied}
                        onClick={couponApplied ? handleRemoveCoupon : applyCoupon}
                        loading={couponLoading}
                        disabled={!couponCode && !couponApplied}
                    />
                </div>
            </div>

            <PaymentMethodForm 
                visible={showForm} 
                onHide={() => setShowForm(false)} 
                onSave={handleNewMethod}
                loading={formLoading}
            />
        </div>
    );
};
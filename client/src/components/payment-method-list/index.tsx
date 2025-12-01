import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataView } from 'primereact/dataview';
import { Toast } from "primereact/toast";
import { confirmDialog } from 'primereact/confirmdialog';

import PaymentMethodService from "@/services/payment-method-service";
import { PaymentMethodForm } from "@/components/payment-method-form"; 
import type { IPaymentMethod } from "@/types/payment";

import "./PaymentMethodList.css";

export const PaymentMethodList = () => {
    const toast = useRef<Toast>(null);
    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingMethod, setEditingMethod] = useState<IPaymentMethod | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        const response = await PaymentMethodService.getAll();
        if (response.success) {
            setPaymentMethods(response.data);
        } else {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar pagamentos' });
        }
    };

    const openNew = () => {
        setEditingMethod(null);
        setShowForm(true);
    };

    const openEdit = (method: IPaymentMethod) => {
        setEditingMethod(method);
        setShowForm(true);
    };

    const confirmDelete = (method: IPaymentMethod) => {
        confirmDialog({
            message: `Deseja remover "${method.description}"?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                if (method.id) {
                    const response = await PaymentMethodService.remove(method.id);
                    if (response.success) {
                        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Método removido' });
                        loadPaymentMethods();
                    } else {
                        toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover método' });
                    }
                }
            }
        });
    };

    const handleSave = async (data: IPaymentMethod) => {
        setLoading(true);
        const response = await PaymentMethodService.save(data);
        setLoading(false);

        if (response.success) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Método salvo!' });
            setShowForm(false);
            loadPaymentMethods();
        } else {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: response.message || 'Erro ao salvar' });
        }
    };

    const getTypeInfo = (type: string) => {
        switch (type) {
            case 'CREDIT_CARD': return { icon: 'pi pi-credit-card', severity: 'info', label: 'Crédito' };
            case 'DEBIT_CARD': return { icon: 'pi pi-wallet', severity: 'warning', label: 'Débito' };
            case 'PIX': return { icon: 'pi pi-bolt', severity: 'success', label: 'PIX' };
            default: return { icon: 'pi pi-dollar', severity: 'secondary', label: type };
        }
    };

    const itemTemplate = (payment: IPaymentMethod) => {
        const { icon, severity, label } = getTypeInfo(payment.type);

        return (
            <div className="col-12 p-0"> 
                <div className="payment-list-item">
                    <div className="flex flex-column sm:flex-row align-items-center gap-4 payment-list-item-content">
                        
                        {/* Ícone do Tipo */}
                        <div className={`payment-icon-box ${severity}`}>
                            <i className={`${icon} text-xl`}></i>
                        </div>

                        {/* Dados */}
                        <div className="payment-details">
                            <span className="payment-description">{payment.description}</span>
                            <span className="payment-type-label">{label}</span>
                        </div>

                        {/* Ações */}
                        <div className="payment-actions">
                            
                            <Button 
                                icon="pi pi-pencil" 
                                rounded 
                                text 
                                className="btn-circle-action edit" 
                                tooltip="Editar" 
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={() => openEdit(payment)} 
                            />
                            <Button 
                                icon="pi pi-trash" 
                                rounded 
                                text 
                                className="btn-circle-action delete"
                                tooltip="Remover" 
                                tooltipOptions={{ position: 'bottom' }}
                                onClick={() => confirmDelete(payment)} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card title="Formas de Pagamento" className="shadow-2 payment-list-card">
            <Toast ref={toast} />
            
            <div className="new-payment-container">
                <Button 
                    label="Nova Forma de Pagamento" 
                    icon="pi pi-plus" 
                    size="small" 
                    severity="success" 
                    outlined 
                    onClick={openNew} 
                />
            </div>

            {paymentMethods.length === 0 ? (
                <div className="text-center p-4 text-gray-500 font-italic">Nenhuma forma de pagamento salva.</div>
            ) : (
                <DataView value={paymentMethods} itemTemplate={itemTemplate} className="border-none" />
            )}

            <PaymentMethodForm 
                visible={showForm}
                onHide={() => setShowForm(false)}
                onSave={handleSave}
                paymentToEdit={editingMethod}
                loading={loading}
            />
        </Card>
    );
};
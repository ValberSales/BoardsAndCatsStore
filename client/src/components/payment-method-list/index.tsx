import { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { Toast } from "primereact/toast";
import { confirmDialog } from 'primereact/confirmdialog';

import PaymentMethodService from "@/services/payment-method-service";
import { PaymentMethodForm } from "@/components/payment-method-form"; // Importe o form criado
import type { IPaymentMethod } from "@/commons/types";

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

    // Função auxiliar para renderizar ícones bonitinhos baseados no tipo
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
            <div className="col-12">
                <div className="flex flex-column sm:flex-row align-items-center p-3 gap-3 border-bottom-1 surface-border hover:surface-50 transition-duration-200">
                    
                    {/* Ícone do Tipo */}
                    <div className={`flex align-items-center justify-content-center bg-${severity === 'success' ? 'green' : 'blue'}-50 border-round`} style={{width: '3rem', height: '3rem'}}>
                        <i className={`${icon} text-xl text-${severity === 'success' ? 'green' : 'blue'}-500`}></i>
                    </div>

                    {/* Dados */}
                    <div className="flex-1 text-center sm:text-left">
                        <div className="font-bold text-900">{payment.description}</div>
                        <span className="text-sm text-gray-500 capitalize">{label}</span>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                        <Tag value={label} severity={severity as any} rounded className="hidden sm:flex"></Tag>
                        <Button icon="pi pi-pencil" rounded text severity="secondary" tooltip="Editar" onClick={() => openEdit(payment)} />
                        <Button icon="pi pi-trash" rounded text severity="danger" tooltip="Remover" onClick={() => confirmDelete(payment)} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card title="Formas de Pagamento" className="shadow-2 h-full border-round-xl">
            <Toast ref={toast} />
            
            
            <div className="flex justify-content-end mb-3">
                <Button label="Nova Forma de Pagamento" icon="pi pi-plus" size="small" severity="success" outlined onClick={openNew} />
            </div>

            {paymentMethods.length === 0 ? (
                <div className="text-center p-4 text-gray-500">Nenhuma forma de pagamento salva.</div>
            ) : (
                <DataView value={paymentMethods} itemTemplate={itemTemplate} />
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
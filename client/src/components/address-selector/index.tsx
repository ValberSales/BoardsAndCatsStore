import { useState, useEffect, useRef } from "react";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import AddressService from "@/services/address-service";
import { AddressForm } from "@/components/address-form";
import type { IAddress } from "@/commons/types";
import "./AddressSelector.css";

interface AddressSelectorProps {
    selectedAddressId?: number;
    onSelect: (address: IAddress) => void;
}

export const AddressSelector = ({ selectedAddressId, onSelect }: AddressSelectorProps) => {
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        setLoading(true);
        try {
            const response = await AddressService.getAll();
            if (response.success) {
                setAddresses(response.data);
            }
        } catch (error) {
            console.error("Erro ao carregar endereços");
        } finally {
            setLoading(false);
        }
    };

    const handleNewAddress = async (data: IAddress) => {
        setFormLoading(true);
        try {
            const response = await AddressService.save(data);
            if (response.success) {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Endereço cadastrado!' });
                await loadAddresses(); // Recarrega a lista
                
                // Seleciona automaticamente o novo endereço criado
                if (response.data && response.data.id) {
                    onSelect(response.data);
                }
                
                setShowForm(false);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar endereço.' });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro de conexão.' });
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return <div className="p-4 text-center"><i className="pi pi-spin pi-spinner text-2xl text-primary"></i></div>;
    }

    return (
        <div className="fadein animation-duration-500">
            <Toast ref={toast} />
            
            <div className="flex align-items-center justify-content-between mb-4">
                <h2 className="text-2xl font-bold text-900 m-0">Onde vamos entregar?</h2>
            </div>

            <div className="grid">
                {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                        <div className="col-12 md:col-6" key={addr.id}>
                            <div 
                                className={classNames("address-card p-3 border-round-xl h-full flex align-items-start gap-3", { 'selected': isSelected })}
                                onClick={() => onSelect(addr)}
                            >
                                <div className="mt-1">
                                    <RadioButton 
                                        checked={isSelected} 
                                        className="address-radio" 
                                        onChange={() => {}} // Controlado pelo clique do card
                                    />
                                </div>
                                <div className="flex-1">
                                    <span className="font-bold text-900 block mb-1">{addr.street}</span>
                                    <span className="text-600 text-sm block">{addr.city} - {addr.state}</span>
                                    <span className="text-500 text-sm block mt-1">CEP: {addr.zip}</span>
                                    {addr.complement && (
                                        <span className="text-500 text-xs block mt-1 bg-surface-100 inline-block px-2 py-1 border-round">
                                            {addr.complement}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Botão de Adicionar Novo */}
                <div className="col-12 md:col-6">
                    <div className="new-address-btn" onClick={() => setShowForm(true)}>
                        <div className="bg-primary-50 border-circle w-3rem h-3rem flex align-items-center justify-content-center mb-2">
                            <i className="pi pi-plus text-primary text-xl"></i>
                        </div>
                        <span className="font-semibold text-primary">Adicionar Novo Endereço</span>
                    </div>
                </div>
            </div>

            <AddressForm 
                visible={showForm} 
                onHide={() => setShowForm(false)} 
                onSave={handleNewAddress}
                loading={formLoading}
            />
        </div>
    );
};
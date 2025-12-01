import { useState, useEffect, useRef } from "react";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import AddressService from "@/services/address-service";
import { AddressForm } from "@/components/address-form";
import type { IAddress } from "@/types/address";

import "./AddressSelector.css";

interface AddressSelectorProps {
    selectedAddressId?: number;
    onSelect: (address: IAddress) => void;
}

export const AddressSelector = ({ selectedAddressId, onSelect }: AddressSelectorProps) => {
    const toast = useRef<Toast>(null);
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

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
            console.error("Erro ao carregar endereços", error);
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
                await loadAddresses(); 
 
                if (response.data?.id) {
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
        return (
            <div className="address-loading">
                <i className="pi pi-spin pi-spinner text-2xl text-primary" />
            </div>
        );
    }

    return (
        <div className="fadein animation-duration-500">
            <Toast ref={toast} />
            
            <div className="address-selector-header">
                <h2 className="address-selector-title">Onde vamos entregar?</h2>
            </div>

            <div className="grid">
                {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    
                    return (
                        <div className="col-12 md:col-6" key={addr.id}>
                            <div 
                                className={classNames("address-card", { 'selected': isSelected })}
                                onClick={() => onSelect(addr)}
                            >
                                <div className="address-radio-wrapper">
                                    <RadioButton 
                                        checked={isSelected} 
                                        inputId={`addr-${addr.id}`}
                                        onChange={() => {}} 
                                        className="pointer-events-none"
                                    />
                                </div>
                                
                                <div className="address-details">
                                    <span className="address-street">
                                        {addr.street}, {addr.number || 'S/N'}
                                    </span>
                                    
                                    <span className="address-meta">
                                        {addr.neighborhood} - {addr.city}/{addr.state}
                                    </span>
                                    
                                    <span className="address-meta">
                                        CEP: {addr.zip}
                                    </span>
                                    
                                    {addr.complement && (
                                        <span className="address-tag">
                                            {addr.complement}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="col-12 md:col-6">
                    <div className="new-address-btn" onClick={() => setShowForm(true)}>
                        <div className="new-address-icon-wrapper">
                            <i className="pi pi-plus text-primary text-xl" />
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
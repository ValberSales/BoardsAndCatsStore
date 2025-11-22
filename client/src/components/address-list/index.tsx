import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { confirmDialog } from 'primereact/confirmdialog';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';

import AddressService from "@/services/address-service";
import { AddressForm } from "@/components/address-form";
import type { IAddress } from "@/commons/types";

// Importa o CSS externo
import "./AddressList.css";

export const AddressList = () => {
    const toast = useRef<Toast>(null);
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        const response = await AddressService.getAll();
        if (response.success) {
            setAddresses(response.data);
        } else {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar endereços' });
        }
    };

    const openNew = () => {
        setEditingAddress(null);
        setShowForm(true);
    };

    const openEdit = (address: IAddress) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const confirmDelete = (address: IAddress) => {
        confirmDialog({
            message: `Deseja remover o endereço de ${address.city}?`,
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: async () => {
                if (address.id) {
                    const response = await AddressService.remove(address.id);
                    if (response.success) {
                        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Endereço removido' });
                        loadAddresses();
                    } else {
                        toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover endereço' });
                    }
                }
            }
        });
    };

    const handleSave = async (data: IAddress) => {
        setLoading(true);
        const response = await AddressService.save(data);
        setLoading(false);

        if (response.success) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Endereço salvo!' });
            setShowForm(false);
            loadAddresses();
        } else {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: response.message || 'Erro ao salvar' });
        }
    };

    const itemTemplate = (address: IAddress) => {
        return (
            <div className="col-12 p-0">
                <div className="address-list-item">
                    {/* Ajuste aqui: md:align-items-center para centralizar verticalmente */}
                    <div className="flex flex-column md:flex-row justify-content-between align-items-center md:align-items-center gap-4 address-list-item-content">
                        
                        {/* Informações do Endereço */}
                        <div className="address-info-container flex-1">
                            <span className="address-street">{address.street}</span>
                            
                            <div className="address-city-state">
                                <i className="pi pi-map-marker text-primary"></i>
                                <span>{address.city} - {address.state}</span>
                                <Tag value={address.zip} severity="info" className="ml-2"></Tag>
                            </div>
                            
                            {address.complement && (
                                <span className="address-complement">
                                    {address.complement}
                                </span>
                            )}
                        </div>

                        {/* Ações */}
                        <div className="address-actions">
                            <Button 
                                icon="pi pi-pencil" 
                                rounded 
                                text 
                                className="btn-circle-action edit" 
                                onClick={() => openEdit(address)} 
                                tooltip="Editar"
                                tooltipOptions={{ position: 'bottom' }}
                            />
                            <Button 
                                icon="pi pi-trash" 
                                rounded 
                                text 
                                className="btn-circle-action delete" 
                                onClick={() => confirmDelete(address)} 
                                tooltip="Excluir"
                                tooltipOptions={{ position: 'bottom' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card title="Meus Endereços" className="shadow-2 address-list-card mt-4">
            <Toast ref={toast} />
            
            <div className="new-address-container">
                <Button 
                    label="Novo Endereço" 
                    icon="pi pi-plus" 
                    size="small" 
                    severity="success" 
                    outlined 
                    onClick={openNew} 
                />
            </div>

            {addresses.length === 0 ? (
                <div className="empty-state">
                    <i className="pi pi-map text-4xl mb-3 block text-gray-300"></i>
                    Nenhum endereço cadastrado.
                </div>
            ) : (
                <DataView value={addresses} itemTemplate={itemTemplate} className="border-none" />
            )}

            <AddressForm 
                visible={showForm} 
                onHide={() => setShowForm(false)} 
                onSave={handleSave}
                addressToEdit={editingAddress}
                loading={loading}
            />
        </Card>
    );
};
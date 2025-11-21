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
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 border-bottom-1 surface-border">
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-xl font-bold text-900">{address.street}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-map-marker"></i>
                                    <span className="font-semibold">{address.city} - {address.state}</span>
                                </span>
                                <Tag value={address.zip} severity="info"></Tag>
                            </div>
                            {address.complement && (
                                <span className="text-sm text-gray-500">Comp: {address.complement}</span>
                            )}
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <Button icon="pi pi-pencil" rounded text severity="secondary" onClick={() => openEdit(address)} tooltip="Editar" />
                            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => confirmDelete(address)} tooltip="Excluir" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card title="Meus Endereços" className="shadow-2 h-full mt-4">
            <Toast ref={toast} />
            
            <div className="flex justify-content-end mb-3">
                <Button label="Novo Endereço" icon="pi pi-plus" size="small" severity="success" outlined onClick={openNew} />
            </div>

            {addresses.length === 0 ? (
                <div className="text-center p-4 text-gray-500">Nenhum endereço cadastrado.</div>
            ) : (
                <DataView value={addresses} itemTemplate={itemTemplate} />
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
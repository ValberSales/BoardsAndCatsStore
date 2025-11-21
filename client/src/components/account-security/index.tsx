import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { confirmDialog } from 'primereact/confirmdialog';
import { useNavigate } from "react-router-dom";

import UserService from "@/services/user-service";
import { useAuth } from "@/context/hooks/use-auth";
import { ChangePasswordDialog } from "@/components/change-password-dialog";

export const AccountSecurity = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);

    const handleDeleteAccount = () => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir sua conta? Esta ação é irreversível.',
            header: 'Zona de Perigo',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    const response = await UserService.deleteMe();
                    if (response.success) {
                        toast.current?.show({ severity: 'success', summary: 'Conta Excluída', detail: 'Sua conta foi removida.' });
                        setTimeout(() => {
                            handleLogout();
                            navigate('/');
                        }, 1000);
                    } else {
                        toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir conta.' });
                    }
                } catch (e) {
                    toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao processar exclusão.' });
                }
            }
        });
    };

    return (
        <Card title="Segurança" className="shadow-2 h-full border-round-l">
            <Toast ref={toast} />
            <ChangePasswordDialog visible={showPasswordDialog} onHide={() => setShowPasswordDialog(false)} />

            <div className="flex flex-column gap-3">
                <p className="text-sm text-gray-600 m-0">Gerencie sua senha e acesso.</p>
                
                <Button 
                    label="Alterar Senha" 
                    icon="pi pi-lock" 
                    severity="secondary" 
                    outlined 
                    className="w-full" 
                    onClick={() => setShowPasswordDialog(true)} 
                />
                
                <div className="border-top-1 surface-border my-2"></div>
                
                <div className="flex flex-column gap-2">
                    <span className="text-xs text-red-500 font-bold uppercase">Zona de Perigo</span>
                    <Button 
                        label="Excluir Conta" 
                        icon="pi pi-trash" 
                        severity="danger" 
                        text 
                        className="w-full hover:bg-red-50" 
                        onClick={handleDeleteAccount} 
                    />
                </div>
            </div>
        </Card>
    );
};
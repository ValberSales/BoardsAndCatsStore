import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useNavigate } from "react-router-dom";

import UserService from "@/services/user-service";
import { useAuth } from "@/context/hooks/use-auth";
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import { ProfileForm } from "@/components/profile-form";

export const ProfilePage = () => {
    const { handleLogout } = useAuth();
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);

    const handleDeleteAccount = () => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir sua conta?',
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            accept: async () => {
                try {
                    const response = await UserService.deleteMe();
                    if (response.success) {
                        toast.current?.show({ severity: 'success', summary: 'Conta Excluída', detail: 'Sua conta foi removida.' });
                        handleLogout();
                        navigate('/');
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

        <div className="surface-ground h-full pb-6"> 
            <Toast ref={toast} />
            <ConfirmDialog />
            <ChangePasswordDialog visible={showPasswordDialog} onHide={() => setShowPasswordDialog(false)} />

            <div className="container mx-auto px-4 py-5" style={{ maxWidth: '900px' }}>
                <h1 className="text-3xl font-bold mb-4 text-900">Meu Cadastro</h1>
                <div className="grid">
                    <div className="col-12 md:col-8">
                        <ProfileForm />
                    </div>
                    <div className="col-12 md:col-4">
                        <Card title="Segurança" className="shadow-2 h-full">
                            <p className="text-sm text-gray-600 mb-4">Gerencie sua senha e acesso.</p>
                            <Button label="Alterar Senha" icon="pi pi-lock" severity="secondary" outlined className="w-full mb-3" onClick={() => setShowPasswordDialog(true)} />
                            <Button label="Excluir Conta" icon="pi pi-trash" severity="danger" text className="w-full hover:bg-red-50" onClick={handleDeleteAccount} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
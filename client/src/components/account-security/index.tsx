import { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";

import UserService from "@/services/user-service";
import { useAuth } from "@/context/hooks/use-auth";
import { useToast } from "@/context/ToastContext";
import { ChangePasswordDialog } from "@/components/change-password-dialog";

import "./AccountSecurity.css";

export const AccountSecurity = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleDeleteAccount = async () => {
        if (!passwordConfirm) {
            showToast({ 
                severity: 'warn', 
                summary: 'Atenção', 
                detail: 'Digite sua senha para confirmar a exclusão.' 
            });
            return;
        }

        setLoadingDelete(true);

        try {
            const response = await UserService.deleteMe(passwordConfirm);
            
            if (response.success) {
                showToast({ 
                    severity: 'success', 
                    summary: 'Conta Excluída', 
                    detail: 'Sua conta foi removida com sucesso. Redirecionando...' 
                });
                setShowDeleteDialog(false);
                
                setTimeout(() => {
                    handleLogout();
                    navigate('/');
                }, 2000);
            } else {
                showToast({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: response.message || 'Erro ao excluir conta.' 
                });
            }

        } catch (e) {
            showToast({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Ocorreu um erro inesperado ao processar a solicitação.' 
            });
        } finally {
            setLoadingDelete(false);
        }
    };

    const footerDeleteDialog = (
        <div className="dialog-footer-row">
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                severity="secondary" 
                className="dialog-btn"
                onClick={() => setShowDeleteDialog(false)} 
                disabled={loadingDelete}
            />
            <Button 
                label="Confirmar Exclusão" 
                icon="pi pi-check" 
                severity="danger" 
                className="dialog-btn"
                onClick={handleDeleteAccount} 
                loading={loadingDelete} 
            />
        </div>
    );

    return (
        <Card title="Segurança" className="shadow-2 security-card">
            <ChangePasswordDialog 
                visible={showPasswordDialog} 
                onHide={() => setShowPasswordDialog(false)} 
            />

            <Dialog 
                header="Zona de Perigo" 
                visible={showDeleteDialog} 
                className="delete-account-dialog" 
                footer={footerDeleteDialog} 
                onHide={() => setShowDeleteDialog(false)}
                modal
                draggable={false}
                resizable={false}
            >
                <div className="flex flex-column align-items-center justify-content-center pt-2">
                    <i className="pi pi-exclamation-triangle danger-icon"></i>
                    <span className="font-bold text-xl mb-3 block text-900">Tem certeza?</span>
                    <p className="mb-4 text-center line-height-3 text-700 m-0">
                        Esta ação é <b>irreversível</b>. Todos os seus dados, histórico de pedidos e informações serão apagados permanentemente.
                    </p>
                    
                    <div className="w-full">
                        <label htmlFor="delete-pass" className="block text-900 font-medium mb-2">
                            Digite sua senha atual para confirmar
                        </label>
                        <Password 
                            inputId="delete-pass"
                            value={passwordConfirm} 
                            onChange={(e) => setPasswordConfirm(e.target.value)} 
                            toggleMask 
                            feedback={false}
                            className="full-width-password"
                            placeholder="Sua senha atual"
                            disabled={loadingDelete}
                        />
                    </div>
                </div>
            </Dialog>

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
                
                <Divider className="my-3" />
                
                <div className="flex flex-column">
                    <span className="danger-zone-label">Zona de Perigo</span>
                    
                    <Button 
                        label="Excluir Conta" 
                        icon="pi pi-trash" 
                        severity="danger" 
                        outlined 
                        className="w-full" 
                        onClick={() => {
                            setPasswordConfirm(""); 
                            setShowDeleteDialog(true);
                        }} 
                    />
                </div>
            </div>
        </Card>
    );
};
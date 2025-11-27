import { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

import UserService from "@/services/user-service";
import type { IUserPasswordUpdate } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";

// Importação do CSS
import "./ChangePasswordDialog.css";

interface ChangePasswordDialogProps {
    visible: boolean;
    onHide: () => void;
}

interface IChangePasswordForm extends IUserPasswordUpdate {
    confirmPassword?: string;
}

export const ChangePasswordDialog = ({ visible, onHide }: ChangePasswordDialogProps) => {
    const { updateAccessToken } = useAuth();
    const toast = useRef<Toast>(null);
    
    const { control, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<IChangePasswordForm>({
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    const newPasswordValue = watch("newPassword") || "";

    const passwordRules = [
        { label: "Mínimo 6 caracteres", valid: newPasswordValue.length >= 6 },
        { label: "Pelo menos uma letra maiúscula", valid: /[A-Z]/.test(newPasswordValue) },
        { label: "Pelo menos uma letra minúscula", valid: /[a-z]/.test(newPasswordValue) },
        { label: "Pelo menos um número", valid: /\d/.test(newPasswordValue) },
    ];

    const onSubmit = async (data: IChangePasswordForm) => {
        try {
            const payload: IUserPasswordUpdate = {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            };

            const response = await UserService.changePassword(payload);
            
            if (response.success) {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada com sucesso!' });
                
                if (response.data?.token) {
                    updateAccessToken(response.data.token);
                }

                reset();
                setTimeout(onHide, 1500);
            } else {
                const msg = response.message || 'Erro ao alterar senha.';
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro de conexão com o servidor.' });
        }
    };

    const renderRuleItem = (rule: { label: string; valid: boolean }, index: number) => {
        const color = rule.valid ? '#22c55e' : '#ef4444';

        return (
            <li key={index} 
                className="flex align-items-center gap-2 text-sm transition-colors duration-300"
                style={{ 
                    color: color, 
                    fontWeight: rule.valid ? 'bold' : 'normal' 
                }}
            >
                <i className={classNames("pi", {
                    "pi-check-circle": rule.valid, 
                    "pi-times-circle": !rule.valid 
                })} style={{ fontSize: '1rem', color: color }}></i>
                
                <span>{rule.label}</span>
            </li>
        );
    };

    return (
        <Dialog 
            header="Alterar Senha de Acesso" 
            visible={visible} 
            className="change-password-dialog" // Classe CSS aplicada
            onHide={onHide}
            draggable={false} // Bloqueia mover
            resizable={false} // Bloqueia redimensionar
            modal // Garante o overlay escuro atrás
        >
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3 mt-2">
                
                <div className="flex flex-column gap-2">
                    <label htmlFor="currentPassword">Senha Atual</label>
                    <Controller
                        name="currentPassword"
                        control={control}
                        rules={{ required: "A senha atual é obrigatória" }}
                        render={({ field }) => (
                            <InputText 
                                id="currentPassword" 
                                type="password" 
                                placeholder="Digite sua senha atual"
                                {...field} 
                                className={classNames({ "p-invalid": errors.currentPassword })} 
                            />
                        )}
                    />
                    {errors.currentPassword && <small className="p-error">{errors.currentPassword.message}</small>}
                </div>

                <Divider />

                <div className="flex flex-column gap-2">
                    <label htmlFor="newPassword">Nova Senha</label>
                    <Controller
                        name="newPassword"
                        control={control}
                        rules={{ 
                            required: "Nova senha é obrigatória", 
                            minLength: { value: 6, message: "Mínimo 6 caracteres" },
                            pattern: { 
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 
                                message: "A senha não atende aos requisitos de segurança" 
                            }
                        }}
                        render={({ field }) => (
                            <InputText 
                                id="newPassword" 
                                type="password" 
                                placeholder="Digite a nova senha"
                                {...field} 
                                className={classNames({ "p-invalid": errors.newPassword })} 
                            />
                        )}
                    />
                </div>

                <div className="surface-100 p-3 border-round">
                    <span className="text-gray-700 font-bold text-sm mb-2 block">Requisitos:</span>
                    <ul className="list-none p-0 m-0 flex flex-column gap-2">
                        {passwordRules.map(renderRuleItem)}
                    </ul>
                </div>

                <div className="flex flex-column gap-2 mt-1">
                    <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                    <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{ 
                            required: "Confirmação é obrigatória",
                            validate: (val) => {
                                if (watch('newPassword') != val) {
                                    return "As senhas não coincidem";
                                }
                            }
                        }}
                        render={({ field }) => (
                            <InputText 
                                id="confirmPassword" 
                                type="password" 
                                placeholder="Repita a nova senha"
                                {...field} 
                                className={classNames({ "p-invalid": errors.confirmPassword })} 
                            />
                        )}
                    />
                    {errors.confirmPassword && <small className="p-error">{errors.confirmPassword.message}</small>}
                </div>

                <Button 
                    label="Atualizar Senha" 
                    icon="pi pi-check" 
                    loading={isSubmitting} 
                    className="mt-3 w-full" 
                    disabled={!passwordRules.every(r => r.valid)} 
                />
            </form>
        </Dialog>
    );
};
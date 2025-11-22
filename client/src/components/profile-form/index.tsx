import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputMask } from "primereact/inputmask";

import UserService from "@/services/user-service";
import type { AuthenticatedUser, IUserProfileUpdate } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";

// Importa o CSS externo
import "./ProfileForm.css";

export const ProfileForm = () => {
    const { updateUser, updateAccessToken } = useAuth();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(true);
    const [cpf, setCpf] = useState(""); 

    const [editableFields, setEditableFields] = useState({
        displayName: false,
        username: false,
        phone: false
    });

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<IUserProfileUpdate>();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const response = await UserService.getMe();
            if (response.status === 200 && response.data) {
                const user = response.data as AuthenticatedUser; 
                setCpf(user.cpf);
                reset({
                    displayName: user.displayName,
                    phone: user.phone,
                    username: user.username
                });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar perfil.' });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro de conexão.' });
        } finally {
            setLoading(false);
        }
    };

    const handleEnableEdit = (fieldId: keyof typeof editableFields) => {
        setEditableFields(prev => ({ ...prev, [fieldId]: true }));
        setTimeout(() => {
            const inputElement = document.getElementById(fieldId) as HTMLInputElement;
            if (inputElement) {
                inputElement.focus();
                inputElement.select();
            }
        }, 50);
    };

    const onSubmit = async (data: IUserProfileUpdate) => {
        try {
            const response = await UserService.updateMe(data);
            if (response.status === 200 && response.data) {
                const { token, ...updatedUser } = response.data;
                if (token) updateAccessToken(token);
                updateUser(updatedUser as AuthenticatedUser);
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado!' });
                
                setEditableFields({ displayName: false, username: false, phone: false });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar.' });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar. Email já em uso?' });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center h-20rem">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <Card title="Dados Pessoais" className="shadow-2 profile-card">
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-4 p-fluid">
                
                {/* CPF */}
                <div className="flex flex-column">
                    <label htmlFor="cpf" className="profile-label">CPF</label>
                    <InputText 
                        id="cpf" 
                        value={cpf} 
                        disabled 
                        className="input-disabled-custom" 
                    />
                    <small className="text-gray-500 mt-1">O CPF não pode ser alterado.</small>
                </div>

                {/* Nome de Exibição */}
                <div className="flex flex-column">
                    <label htmlFor="displayName" className="profile-label">Nome de Exibição</label>
                    <div className="p-inputgroup edit-input-group">
                        <Controller
                            name="displayName"
                            control={control}
                            rules={{ required: "Obrigatório", minLength: { value: 3, message: "Mínimo 3 caracteres" } }}
                            render={({ field }) => (
                                <InputText 
                                    id="displayName" 
                                    {...field} 
                                    disabled={!editableFields.displayName}
                                    placeholder="Seu nome"
                                    className={classNames({ "p-invalid": errors.displayName })}
                                />
                            )}
                        />
                        <Button 
                            type="button"
                            icon="pi pi-pencil" 
                            disabled={editableFields.displayName}
                            onClick={() => handleEnableEdit('displayName')}
                            tooltip={!editableFields.displayName ? "Editar" : "Editando..."}
                        />
                    </div>
                    {errors.displayName && <small className="error-msg">{errors.displayName.message}</small>}
                </div>

                {/* Email */}
                <div className="flex flex-column">
                    <label htmlFor="username" className="profile-label">Email (Login)</label>
                    <div className="p-inputgroup edit-input-group">
                        <Controller
                            name="username"
                            control={control}
                            rules={{ 
                                required: "Email é obrigatório",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido"
                                }
                            }}
                            render={({ field }) => (
                                <InputText 
                                    id="username" 
                                    {...field} 
                                    disabled={!editableFields.username}
                                    placeholder="seu@email.com"
                                    className={classNames({ "p-invalid": errors.username })}
                                />
                            )}
                        />
                        <Button 
                            type="button" 
                            icon="pi pi-pencil" 
                            disabled={editableFields.username} 
                            onClick={() => handleEnableEdit('username')}
                            tooltip="Editar Email"
                        />
                    </div>
                    {errors.username && <small className="error-msg">{errors.username.message}</small>}
                </div>

                {/* Telefone */}
                <div className="flex flex-column">
                    <label htmlFor="phone" className="profile-label">Telefone</label>
                    <div className="p-inputgroup edit-input-group">
                        <Controller
                            name="phone"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <InputMask 
                                    id="phone" 
                                    mask="(99) 99999-9999"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    disabled={!editableFields.phone}
                                    placeholder="(00) 00000-0000"
                                    className={classNames({ "p-invalid": errors.phone })}
                                />
                            )}
                        />
                        <Button 
                            type="button" 
                            icon="pi pi-pencil" 
                            disabled={editableFields.phone} 
                            onClick={() => handleEnableEdit('phone')}
                            tooltip="Editar Telefone"
                        />
                    </div>
                    {errors.phone && <small className="error-msg">{errors.phone.message}</small>}
                </div>

                <div className="flex justify-content-end mt-2">
                    <Button 
                        label="Salvar Alterações" 
                        icon="pi pi-check" 
                        loading={isSubmitting} 
                        disabled={!Object.values(editableFields).some(v => v)} 
                        className="btn-save-profile"
                    />
                </div>
            </form>
        </Card>
    );
};
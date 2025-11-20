import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { ProgressSpinner } from "primereact/progressspinner";

import UserService from "@/services/user-service";
import type { AuthenticatedUser, IUserProfileUpdate } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

export const ProfilePage = () => {
    const { updateUser } = useAuth();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);

    // Estado para campo apenas leitura (CPF)
    const [cpf, setCpf] = useState(""); 

    // REMOVIDO: const [username, setUsername] = useState(""); <--- Não precisamos mais disso

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
                
                // Define o CPF no estado local (apenas exibição)
                setCpf(user.cpf);

                // REMOVIDO: setUsername(user.username); <--- Não precisamos mais disso

                // Popula o formulário com os dados, inclusive o username que agora é editável
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

    const onSubmit = async (data: IUserProfileUpdate) => {
        try {
            const response = await UserService.updateMe(data);
            if (response.status === 200 && response.data) {
                const updatedUser = response.data as AuthenticatedUser;
                updateUser(updatedUser);
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado!' });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao atualizar.' });
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar. Email já em uso?' });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center" style={{ minHeight: '60vh', paddingTop: '70px' }}>
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div style={{ paddingTop: '70px' }}>
            <Toast ref={toast} />
            <ChangePasswordDialog visible={showPasswordDialog} onHide={() => setShowPasswordDialog(false)} />

            <div className="container mx-auto px-4 my-5" style={{ maxWidth: '800px' }}>
                <h1 className="text-3xl font-bold mb-4">Meu Cadastro</h1>
                
                <div className="grid">
                    <div className="col-12 md:col-8">
                        <Card title="Dados Pessoais" className="shadow-2 h-full">
                            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-4">
                                
                                {/* CPF (Bloqueado) */}
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="cpf" className="font-bold text-sm">CPF</label>
                                    <InputText 
                                        id="cpf" 
                                        value={cpf} 
                                        disabled 
                                        className="p-disabled bg-gray-100 opacity-70" 
                                    />
                                    <small className="text-gray-500">O CPF não pode ser alterado.</small>
                                </div>

                                {/* Username/Email (Editável) */}
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="username" className="font-bold text-sm">Email (Login)</label>
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
                                                className={classNames({ "p-invalid": errors.username })} 
                                            />
                                        )}
                                    />
                                    {errors.username && <small className="p-error">{errors.username.message}</small>}
                                </div>

                                {/* Nome */}
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="displayName" className="font-bold text-sm">Nome de Exibição</label>
                                    <Controller
                                        name="displayName"
                                        control={control}
                                        rules={{ required: "Obrigatório", minLength: { value: 3, message: "Mínimo 3 caracteres" } }}
                                        render={({ field }) => (
                                            <InputText 
                                                id="displayName" 
                                                {...field} 
                                                className={classNames({ "p-invalid": errors.displayName })} 
                                            />
                                        )}
                                    />
                                    {errors.displayName && <small className="p-error">{errors.displayName.message}</small>}
                                </div>

                                {/* Telefone */}
                                <div className="flex flex-column gap-2">
                                    <label htmlFor="phone" className="font-bold text-sm">Telefone</label>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        rules={{ required: "Obrigatório" }}
                                        render={({ field }) => (
                                            <InputText 
                                                id="phone" 
                                                {...field} 
                                                keyfilter="int"
                                                className={classNames({ "p-invalid": errors.phone })} 
                                            />
                                        )}
                                    />
                                    {errors.phone && <small className="p-error">{errors.phone.message}</small>}
                                </div>

                                <div className="flex justify-content-end mt-2">
                                    <Button label="Salvar Alterações" icon="pi pi-check" loading={isSubmitting} />
                                </div>
                            </form>
                        </Card>
                    </div>

                    <div className="col-12 md:col-4">
                        <Card title="Segurança" className="shadow-2 h-full">
                            <p className="text-sm text-gray-600 mb-4">Gerencie sua senha e acesso.</p>
                            
                            <Button 
                                label="Alterar Senha" 
                                icon="pi pi-lock" 
                                severity="secondary" 
                                outlined 
                                className="w-full mb-2" 
                                onClick={() => setShowPasswordDialog(true)}
                            />
                            
                            <Button label="Excluir Conta" icon="pi pi-trash" severity="danger" text className="w-full" />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
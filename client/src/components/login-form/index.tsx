import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import AuthService from "@/services/auth-service";
import { useAuth } from "@/context/hooks/use-auth";
import type { IUserLogin, AuthenticationResponse } from "@/commons/types";

interface LoginFormProps {
    onSuccess?: () => void; // Callback para fechar modal ou redirecionar
    showRegisterLink?: boolean; // Opção para mostrar ou não o link de "Cadastre-se"
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, showRegisterLink = true }) => {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const toast = useRef<Toast>(null);
    const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<IUserLogin>({
        defaultValues: { username: "", password: "" }
    });

    const onSubmit = async (data: IUserLogin) => {
        try {
            const response = await AuthService.login(data);
            
            if (response.status === 200 && response.data) {
                const authData = response.data as AuthenticationResponse;
                handleLogin(authData);
                
                toast.current?.show({ 
                    severity: 'success', 
                    summary: 'Bem-vindo!', 
                    detail: `Olá, ${authData.user.displayName}`, 
                    life: 3000 
                });
                
                reset();
                
                // Executa a ação de sucesso (ex: fechar menu ou navegar)
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                toast.current?.show({ 
                    severity: 'error', 
                    summary: 'Erro', 
                    detail: 'Usuário ou senha inválidos', 
                    life: 3000 
                });
            }
        } catch (error) {
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Falha ao conectar ao servidor', 
                life: 3000 
            });
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3 w-full">
                <div>
                    <span className="p-float-label mt-2">
                        <Controller
                            name="username"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <InputText 
                                    id="username" 
                                    {...field} 
                                    className={classNames({ "p-invalid": errors.username }, "w-full")} 
                                />
                            )}
                        />
                        <label htmlFor="username">Usuário</label>
                    </span>
                    {errors.username && <small className="p-error">{errors.username.message}</small>}
                </div>
                
                <div>
                    <span className="p-float-label mt-2">
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <Password 
                                    id="password" 
                                    {...field} 
                                    feedback={false} 
                                    toggleMask 
                                    className={classNames({ "p-invalid": errors.password })} 
                                    inputClassName="w-full" 
                                />
                            )}
                        />
                        <label htmlFor="password">Senha</label>
                    </span>
                    {errors.password && <small className="p-error">{errors.password.message}</small>}
                </div>

                <Button label="Entrar" type="submit" loading={isSubmitting} className="w-full" />
                
                {showRegisterLink && (
                    <div className="text-center text-sm mt-2">
                        <span>Não tem conta? </span>
                        <span 
                            className="text-primary cursor-pointer font-bold"
                            onClick={() => {
                                // CORREÇÃO AQUI:
                                // Chama o onSuccess() (que fecha o painel) ANTES de navegar
                                if (onSuccess) {
                                    onSuccess();
                                }
                                navigate("/register");
                            }}
                        >
                            Cadastre-se
                        </span>
                    </div>
                )}
            </form>
        </>
    );
};
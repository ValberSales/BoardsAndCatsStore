import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

import AuthService from "@/services/auth-service";
import { useAuth } from "@/context/hooks/use-auth";
import { useToast } from "@/context/ToastContext"; 
import type { IUserLogin, AuthenticationResponse } from "@/types/user";

import "./LoginForm.css";

interface LoginFormProps {
    onSuccess?: () => void;
    showRegisterLink?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, showRegisterLink = true }) => {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const { showToast } = useToast(); 
    
    const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<IUserLogin>({
        defaultValues: { username: "", password: "" }
    });

    const onSubmit = async (data: IUserLogin) => {
        try {
            const response = await AuthService.login(data);
            
            if (response.status === 200 && response.data) {
                const authData = response.data as AuthenticationResponse;
                handleLogin(authData);
            
                showToast({ 
                    severity: 'success', 
                    summary: 'Bem-vindo!', 
                    detail: `Olá, ${authData.user.displayName}`, 
                    life: 3000 
                });
                
                reset();
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                }, 500);
            } else {
                showToast({ severity: 'error', summary: 'Erro', detail: 'Usuário ou senha inválidos.', life: 3000 });
            }
        } catch (error) {
            showToast({ severity: 'error', summary: 'Erro', detail: 'Falha ao conectar ao servidor.', life: 3000 });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <div className="field-wrapper">
                    <span className="p-float-label mt-2">
                        <Controller
                            name="username"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <InputText 
                                    id="username" 
                                    {...field} 
                                    className={classNames({ "p-invalid": errors.username }, "full-width-input")} 
                                />
                            )}
                        />
                        <label htmlFor="username">E-Mail</label>
                    </span>
                    {errors.username && <small className="p-error block mt-1">{errors.username.message}</small>}
                </div>
                
                <div className="field-wrapper">
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
                                    className={classNames({ "p-invalid": errors.password }, "full-width-password")} 
                                />
                            )}
                        />
                        <label htmlFor="password">Senha</label>
                    </span>
                    {errors.password && <small className="p-error block mt-1">{errors.password.message}</small>}
                </div>

                <Button label="Entrar" type="submit" loading={isSubmitting} className="w-full mt-2" />
                
                {showRegisterLink && (
                    <div className="text-center text-sm mt-2">
                        <span>Não tem conta? </span>
                        <span 
                            className="login-register-link ml-1"
                            onClick={() => {
                                if (onSuccess) onSuccess();
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
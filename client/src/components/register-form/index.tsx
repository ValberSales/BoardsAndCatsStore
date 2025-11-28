import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";

import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";
import { useToast } from "@/context/ToastContext"; // <--- 1. Importação do Hook

// Importação do CSS extraído
import "./RegisterForm.css";

interface IUserRegisterForm extends IUserRegister {
    confirmPassword?: string;
}

export function RegisterForm() {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<IUserRegisterForm>({
        mode: "onChange",
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
            displayName: "",
            phone: "",
            cpf: ""
        },
    });

    const { signup } = AuthService;
    const { showToast } = useToast(); // <--- 2. Uso do Hook Global
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // Removido: const toast = useRef<Toast>(null);

    const passwordValue = watch("password") || "";
    
    // Definição das regras de senha
    const passwordRules = [
        { label: "Mínimo 6 caracteres", valid: passwordValue.length >= 6 },
        { label: "Letra Maiúscula", valid: /[A-Z]/.test(passwordValue) },
        { label: "Letra Minúscula", valid: /[a-z]/.test(passwordValue) },
        { label: "Número", valid: /\d/.test(passwordValue) },
    ];

    // Helper para renderizar cada item da lista de regras usando classes CSS
    const renderRuleItem = (rule: { label: string; valid: boolean }, index: number) => {
        return (
            <li 
                key={index}
                className={classNames("password-rule-item", { "rule-valid": rule.valid })}
            >
                <i className={classNames("pi password-rule-icon", {
                    "pi-check-circle": rule.valid,
                    "pi-times-circle": !rule.valid
                })}></i>
                <span>{rule.label}</span>
            </li>
        );
    };

    const getFormErrorMessage = (name: keyof IUserRegisterForm) => {
        return (
            <small className="error-message-placeholder">
                {errors[name]?.message || '\u00A0'}
            </small>
        );
    };

    const onSubmit = async (data: IUserRegisterForm) => {
        setLoading(true);
        try {
            const payload: IUserRegister = {
                username: data.username,
                password: data.password,
                displayName: data.displayName,
                cpf: data.cpf.replace(/\D/g, ""),
                phone: data.phone
            };

            const response = await signup(payload);

            if (response.status === 200 || response.status === 201) {
                showToast({
                    severity: "success",
                    summary: "Bem-vindo!",
                    detail: "Cadastro realizado com sucesso.",
                    life: 2000,
                });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                showToast({
                    severity: "error",
                    summary: "Erro",
                    detail: response.message || "Verifique os dados.",
                    life: 4000,
                });
            }
        } catch (err) {
            showToast({ severity: "error", summary: "Erro", detail: "Falha na conexão.", life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            
            <div className="register-header">
                <div className="register-title">Criar Conta</div>
                <span className="text-600 font-medium line-height-3">Já faz parte da comunidade? </span>
                <Link to="/login" className="font-medium no-underline ml-2 text-primary cursor-pointer">
                    Fazer Login
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid flex flex-column gap-2">
                
                {/* Nome */}
                <div>
                    <label htmlFor="displayName" className="input-label">Nome Completo</label>
                    <Controller
                        name="displayName"
                        control={control}
                        rules={{ required: "Nome é obrigatório", minLength: { value: 4, message: "Mínimo 4 caracteres" } }}
                        render={({ field }) => (
                            <InputText id="displayName" {...field} className={classNames({ "p-invalid": errors.displayName })} placeholder="Seu nome completo" />
                        )}
                    />
                    {getFormErrorMessage('displayName')}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="username" className="input-label">E-mail</label>
                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: "E-mail é obrigatório", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "E-mail inválido" } }}
                        render={({ field }) => (
                            <InputText id="username" {...field} className={classNames({ "p-invalid": errors.username })} placeholder="seu@email.com" />
                        )}
                    />
                    {getFormErrorMessage('username')}
                </div>

                {/* Grid CPF e Telefone */}
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6 mb-0">
                        <label htmlFor="cpf" className="input-label">CPF</label>
                        <Controller
                            name="cpf"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <InputMask id="cpf" mask="999.999.999-99" value={field.value} onChange={(e) => field.onChange(e.value)} className={classNames({ "p-invalid": errors.cpf })} placeholder="000.000.000-00" />
                            )}
                        />
                        {getFormErrorMessage('cpf')}
                    </div>
                    <div className="field col-12 md:col-6 mb-0">
                        <label htmlFor="phone" className="input-label">Telefone</label>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <InputMask id="phone" mask="(99) 99999-9999" value={field.value} onChange={(e) => field.onChange(e.value)} className={classNames({ "p-invalid": errors.phone })} placeholder="(99) 99999-9999" />
                            )}
                        />
                        {getFormErrorMessage('phone')}
                    </div>
                </div>

                <Divider className="my-2" />

                {/* Grid Senhas */}
                <div className="formgrid grid mb-0">
                    <div className="field col-12 md:col-6 mb-0">
                        <label htmlFor="password" className="input-label">Senha</label>
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <Password 
                                    id="password" 
                                    {...field} 
                                    toggleMask 
                                    feedback={false} 
                                    className={classNames({ "p-invalid": errors.password })} 
                                    placeholder="Senha segura" 
                                />
                            )}
                        />
                        {getFormErrorMessage('password')}
                    </div>
                    <div className="field col-12 md:col-6 mb-0">
                        <label htmlFor="confirmPassword" className="input-label">Confirmar</label>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            rules={{ required: "Obrigatório", validate: (val) => watch('password') === val || "Não conferem" }}
                            render={({ field }) => (
                                <Password 
                                    id="confirmPassword" 
                                    {...field} 
                                    toggleMask 
                                    feedback={false} 
                                    className={classNames({ "p-invalid": errors.confirmPassword })} 
                                    placeholder="Repita a senha" 
                                />
                            )}
                        />
                        {getFormErrorMessage('confirmPassword')}
                    </div>
                </div>

                {/* Box de Regras de Senha */}
                <div className="flex flex-column align-items-center justify-content-center w-full mt-1 mb-2">
                    <ul className="list-none m-0 password-rules-box">
                        {passwordRules.map(renderRuleItem)}
                    </ul>
                </div>

                <Button 
                    type="submit" 
                    label="Criar Minha Conta" 
                    icon="pi pi-user-plus" 
                    loading={loading || isSubmitting} 
                    className="w-full py-3 font-bold text-lg mt-2" 
                    disabled={!passwordRules.every(r => r.valid) || loading} 
                />
            </form>
        </>
    );
}
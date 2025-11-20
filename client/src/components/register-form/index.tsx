import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";

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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const passwordValue = watch("password") || "";
    const passwordRules = [
        { label: "Mínimo 6 caracteres", valid: passwordValue.length >= 6 },
        { label: "Letra Maiúscula", valid: /[A-Z]/.test(passwordValue) },
        { label: "Letra Minúscula", valid: /[a-z]/.test(passwordValue) },
        { label: "Número", valid: /\d/.test(passwordValue) },
    ];

    const renderRuleItem = (rule: { label: string; valid: boolean }, index: number) => {
        const color = rule.valid ? '#22c55e' : '#ef4444';
        return (
            <li key={index}
                className="flex align-items-center gap-2 text-sm transition-colors duration-300"
                style={{ color: color, fontWeight: rule.valid ? 'bold' : 'normal' }}
            >
                <i className={classNames("pi", {
                    "pi-check-circle": rule.valid,
                    "pi-times-circle": !rule.valid
                })} style={{ fontSize: '0.9rem', color: color }}></i>
                <span>{rule.label}</span>
            </li>
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
                toast.current?.show({
                    severity: "success",
                    summary: "Bem-vindo!",
                    detail: "Cadastro realizado com sucesso.",
                    life: 2000,
                });
                setTimeout(() => navigate("/login"), 2000);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: response.message || "Verifique os dados.",
                    life: 4000,
                });
            }
        } catch (err) {
            toast.current?.show({ severity: "error", summary: "Erro", detail: "Falha na conexão.", life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            
            <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">Criar Conta</div>
                <span className="text-600 font-medium line-height-3">Já faz parte da comunidade? </span>
                <Link to="/login" className="font-medium no-underline ml-2 text-primary cursor-pointer">
                    Fazer Login
                </Link>
            </div>

            {/* ADICIONADO: 'p-fluid'
                Essa classe mágica do PrimeReact força todos os inputs internos 
                a ocuparem 100% da largura do container pai (a coluna do grid).
            */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid flex flex-column gap-3">
                
                {/* Nome */}
                <div>
                    <label htmlFor="displayName" className="block text-900 font-medium mb-2">Nome Completo</label>
                    <Controller
                        name="displayName"
                        control={control}
                        rules={{ required: "Nome é obrigatório", minLength: { value: 3, message: "Mínimo 3 caracteres" } }}
                        render={({ field }) => (
                            <InputText id="displayName" {...field} className={classNames({ "p-invalid": errors.displayName })} placeholder="Seu nome completo" />
                        )}
                    />
                    {errors.displayName && <small className="p-error block mt-1">{errors.displayName.message}</small>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="username" className="block text-900 font-medium mb-2">E-mail</label>
                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: "E-mail é obrigatório", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "E-mail inválido" } }}
                        render={({ field }) => (
                            <InputText id="username" {...field} className={classNames({ "p-invalid": errors.username })} placeholder="seu@email.com" />
                        )}
                    />
                    {errors.username && <small className="p-error block mt-1">{errors.username.message}</small>}
                </div>

                {/* Grid CPF e Telefone */}
                <div className="formgrid grid">
                    <div className="field col-12 md:col-6 mb-0">
                        <label htmlFor="cpf" className="block text-900 font-medium mb-2">CPF</label>
                        <Controller
                            name="cpf"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <InputMask id="cpf" mask="999.999.999-99" value={field.value} onChange={(e) => field.onChange(e.value)} className={classNames({ "p-invalid": errors.cpf })} placeholder="000.000.000-00" />
                            )}
                        />
                        {errors.cpf && <small className="p-error block mt-1">{errors.cpf.message}</small>}
                    </div>
                    <div className="field col-12 md:col-6 mb-0">
                        <label htmlFor="phone" className="block text-900 font-medium mb-2">Telefone</label>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{ required: "Obrigatório" }}
                            render={({ field }) => (
                                <InputMask id="phone" mask="(99) 99999-9999" value={field.value} onChange={(e) => field.onChange(e.value)} className={classNames({ "p-invalid": errors.phone })} placeholder="(99) 99999-9999" />
                            )}
                        />
                        {errors.phone && <small className="p-error block mt-1">{errors.phone.message}</small>}
                    </div>
                </div>

                <Divider className="my-2" />

                {/* Grid Senhas */}
                <div className="formgrid grid mb-0">
                    <div className="field col-12 md:col-6 mb-0">
                        <label htmlFor="password" className="block text-900 font-medium mb-2">Senha</label>
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
                                    // Com p-fluid, o 'w-full' aqui se torna redundante mas seguro manter
                                    className={classNames({ "p-invalid": errors.password })} 
                                    placeholder="Senha segura" 
                                />
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-6 mb-0">
                        <label htmlFor="confirmPassword" className="block text-900 font-medium mb-2">Confirmar</label>
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
                    </div>
                </div>

                {(errors.password || errors.confirmPassword) && (
                    <div className="text-center mb-2">
                        {errors.password && <small className="p-error block">{errors.password.message}</small>}
                        {errors.confirmPassword && <small className="p-error block">{errors.confirmPassword.message}</small>}
                    </div>
                )}

                <div className="flex flex-column align-items-center justify-content-center w-full mt-1 mb-2">
                    <div className="surface-ground border-round px-5 py-3">
                        <ul className="list-none p-0 m-0 flex flex-column gap-2">
                            {passwordRules.map(renderRuleItem)}
                        </ul>
                    </div>
                </div>

                <Button type="submit" label="Criar Minha Conta" icon="pi pi-user-plus" loading={loading || isSubmitting} className="w-full py-3 font-bold text-lg" disabled={!passwordRules.every(r => r.valid) || loading} />
            </form>
        </>
    );
}
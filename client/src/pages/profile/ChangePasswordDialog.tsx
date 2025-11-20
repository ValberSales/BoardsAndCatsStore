import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import UserService from "@/services/user-service";
import type { IUserPasswordUpdate } from "@/commons/types";
import { classNames } from "primereact/utils";

interface ChangePasswordDialogProps {
    visible: boolean;
    onHide: () => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ visible, onHide }) => {
    const toast = useRef<Toast>(null);
    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<IUserPasswordUpdate>({
        defaultValues: { currentPassword: "", newPassword: "" }
    });

    const onSubmit = async (data: IUserPasswordUpdate) => {
        const response = await UserService.changePassword(data);
        if (response.success) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Senha alterada com sucesso!' });
            reset();
            setTimeout(onHide, 1000);
        } else {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Senha atual incorreta ou erro no servidor.' });
        }
    };

    return (
        <Dialog header="Alterar Senha" visible={visible} style={{ width: '400px' }} onHide={onHide}>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3 mt-2">
                <div className="flex flex-column gap-2">
                    <label htmlFor="currentPassword">Senha Atual</label>
                    <Controller
                        name="currentPassword"
                        control={control}
                        rules={{ required: "Obrigatório" }}
                        render={({ field }) => (
                            <Password id="currentPassword" {...field} feedback={false} toggleMask className={classNames({ 'p-invalid': errors.currentPassword })} inputClassName="w-full" />
                        )}
                    />
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="newPassword">Nova Senha</label>
                    <Controller
                        name="newPassword"
                        control={control}
                        rules={{ required: "Obrigatório", minLength: { value: 6, message: "Mínimo 6 caracteres" } }}
                        render={({ field }) => (
                            <Password id="newPassword" {...field} toggleMask className={classNames({ 'p-invalid': errors.newPassword })} inputClassName="w-full" />
                        )}
                    />
                    {errors.newPassword && <small className="p-error">{errors.newPassword.message}</small>}
                </div>
                <div className="flex justify-content-end gap-2 mt-4">
                    <Button label="Cancelar" type="button" icon="pi pi-times" severity="secondary" onClick={onHide} />
                    <Button label="Salvar" type="submit" icon="pi pi-check" loading={isSubmitting} />
                </div>
            </form>
        </Dialog>
    );
};
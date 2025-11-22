import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import type { IAddress } from "@/commons/types";

// Importa o CSS externo
import "./AddressForm.css";

interface AddressFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: IAddress) => void;
    addressToEdit?: IAddress | null;
    loading?: boolean;
}

export const AddressForm = ({ visible, onHide, onSave, addressToEdit, loading }: AddressFormProps) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<IAddress>();

    useEffect(() => {
        if (visible) {
            if (addressToEdit) {
                reset(addressToEdit);
            } else {
                reset({ street: '', city: '', state: '', zip: '', complement: '' });
            }
        }
    }, [visible, addressToEdit, reset]);

    const submitForm = (data: IAddress) => {
        onSave({ ...data, id: addressToEdit?.id });
    };

    const dialogFooter = (
        <div className="address-dialog-footer">
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                outlined 
                onClick={onHide} 
                className="p-button-text btn-cancel" 
            />
            <Button 
                label="Salvar" 
                icon="pi pi-check" 
                onClick={handleSubmit(submitForm)} 
                loading={loading} 
                autoFocus 
                className="btn-save"
            />
        </div>
    );

    return (
        <Dialog 
            visible={visible} 
            className="address-dialog p-fluid" 
            header={addressToEdit ? "Editar Endereço" : "Novo Endereço"} 
            modal 
            footer={dialogFooter} 
            onHide={onHide}
        >
            <div className="field mb-3">
                <label htmlFor="street" className="address-label">Rua / Logradouro</label>
                <Controller
                    name="street"
                    control={control}
                    rules={{ required: "Rua é obrigatória", minLength: { value: 4, message: "Mínimo 4 caracteres" } }}
                    render={({ field }) => (
                        <InputText 
                            id="street" 
                            {...field} 
                            className={classNames("address-input", { 'p-invalid': errors.street })} 
                            autoFocus 
                        />
                    )}
                />
                {errors.street && <small className="error-msg">{errors.street.message}</small>}
            </div>

            <div className="address-form-grid mb-3">
                <div className="field mb-0">
                    <label htmlFor="zip" className="address-label">CEP</label>
                    <Controller
                        name="zip"
                        control={control}
                        rules={{ required: "CEP é obrigatório" }}
                        render={({ field }) => (
                            <InputMask 
                                id="zip" 
                                mask="99999-999" 
                                {...field} 
                                className={classNames("address-input", { 'p-invalid': errors.zip })} 
                            />
                        )}
                    />
                    {errors.zip && <small className="error-msg">{errors.zip.message}</small>}
                </div>
                <div className="field mb-0">
                    <label htmlFor="state" className="address-label">Estado (UF)</label>
                    <Controller
                        name="state"
                        control={control}
                        rules={{ required: "Estado é obrigatório", minLength: { value: 2, message: "Mínimo 2 letras" } }}
                        render={({ field }) => (
                            <InputText 
                                id="state" 
                                maxLength={2} 
                                {...field} 
                                className={classNames("address-input", { 'p-invalid': errors.state })} 
                            />
                        )}
                    />
                    {errors.state && <small className="error-msg">{errors.state.message}</small>}
                </div>
            </div>

            <div className="field mb-3">
                <label htmlFor="city" className="address-label">Cidade</label>
                <Controller
                    name="city"
                    control={control}
                    rules={{ required: "Cidade é obrigatória", minLength: { value: 4, message: "Mínimo 4 caracteres" } }}
                    render={({ field }) => (
                        <InputText 
                            id="city" 
                            {...field} 
                            className={classNames("address-input", { 'p-invalid': errors.city })} 
                        />
                    )}
                />
                {errors.city && <small className="error-msg">{errors.city.message}</small>}
            </div>

            <div className="field">
                <label htmlFor="complement" className="address-label">Complemento</label>
                <Controller
                    name="complement"
                    control={control}
                    render={({ field }) => (
                        <InputText 
                            id="complement" 
                            {...field} 
                            className="address-input"
                        />
                    )}
                />
            </div>
        </Dialog>
    );
};
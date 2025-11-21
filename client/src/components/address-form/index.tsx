import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import type { IAddress } from "@/commons/types";

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
        <div>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={onHide} className="p-button-text" />
            <Button label="Salvar" icon="pi pi-check" onClick={handleSubmit(submitForm)} loading={loading} autoFocus />
        </div>
    );

    return (
        <Dialog 
            visible={visible} 
            style={{ width: '450px' }} 
            header={addressToEdit ? "Editar Endereço" : "Novo Endereço"} 
            modal 
            className="p-fluid" 
            footer={dialogFooter} 
            onHide={onHide}
        >
            <div className="field">
                <label htmlFor="street">Rua / Logradouro</label>
                <Controller
                    name="street"
                    control={control}
                    rules={{ required: "Rua é obrigatória", minLength: { value: 4, message: "Mínimo 4 caracteres" } }}
                    render={({ field }) => (
                        <InputText id="street" {...field} className={classNames({ 'p-invalid': errors.street })} autoFocus />
                    )}
                />
                {errors.street && <small className="p-error">{errors.street.message}</small>}
            </div>

            <div className="formgrid grid">
                <div className="field col">
                    <label htmlFor="zip">CEP</label>
                    <Controller
                        name="zip"
                        control={control}
                        rules={{ required: "CEP é obrigatório" }}
                        render={({ field }) => (
                            <InputMask id="zip" mask="99999-999" {...field} className={classNames({ 'p-invalid': errors.zip })} />
                        )}
                    />
                    {errors.zip && <small className="p-error">{errors.zip.message}</small>}
                </div>
                <div className="field col">
                    <label htmlFor="state">Estado (UF)</label>
                    <Controller
                        name="state"
                        control={control}
                        rules={{ required: "Estado é obrigatório", minLength: { value: 2, message: "Mínimo 2 letras" } }}
                        render={({ field }) => (
                            <InputText id="state" maxLength={2} {...field} className={classNames({ 'p-invalid': errors.state })} />
                        )}
                    />
                    {errors.state && <small className="p-error">{errors.state.message}</small>}
                </div>
            </div>

            <div className="field">
                <label htmlFor="city">Cidade</label>
                <Controller
                    name="city"
                    control={control}
                    rules={{ required: "Cidade é obrigatória", minLength: { value: 4, message: "Mínimo 4 caracteres" } }}
                    render={({ field }) => (
                        <InputText id="city" {...field} className={classNames({ 'p-invalid': errors.city })} />
                    )}
                />
                {errors.city && <small className="p-error">{errors.city.message}</small>}
            </div>

            <div className="field">
                <label htmlFor="complement">Complemento</label>
                <Controller
                    name="complement"
                    control={control}
                    render={({ field }) => (
                        <InputText id="complement" {...field} />
                    )}
                />
            </div>
        </Dialog>
    );
};
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import type { IPaymentMethod } from "@/commons/types";

interface PaymentMethodFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: IPaymentMethod) => void;
    paymentToEdit?: IPaymentMethod | null;
    loading?: boolean;
}

export const PaymentMethodForm = ({ visible, onHide, onSave, paymentToEdit, loading }: PaymentMethodFormProps) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<IPaymentMethod>();

    // Opções para o Dropdown (pode expandir conforme sua regra de negócio)
    const typeOptions = [
        { label: 'Cartão de Crédito', value: 'CREDIT_CARD' },
        { label: 'Cartão de Débito', value: 'DEBIT_CARD' }
    ];

    useEffect(() => {
        if (visible) {
            if (paymentToEdit) {
                reset(paymentToEdit);
            } else {
                reset({ type: '', description: '' });
            }
        }
    }, [visible, paymentToEdit, reset]);

    const submitForm = (data: IPaymentMethod) => {
        onSave({ ...data, id: paymentToEdit?.id });
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
            header={paymentToEdit ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"} 
            modal 
            className="p-fluid" 
            footer={dialogFooter} 
            onHide={onHide}
        >
            <div className="field">
                <label htmlFor="type">Tipo de Pagamento</label>
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: "O tipo é obrigatório" }}
                    render={({ field }) => (
                        <Dropdown 
                            id="type" 
                            value={field.value} 
                            onChange={(e) => field.onChange(e.value)} 
                            options={typeOptions} 
                            optionLabel="label" 
                            placeholder="Selecione o tipo"
                            className={classNames({ 'p-invalid': errors.type })}
                        />
                    )}
                />
                {errors.type && <small className="p-error">{errors.type.message}</small>}
            </div>

            <div className="field">
                <label htmlFor="description">Descrição / Apelido</label>
                <Controller
                    name="description"
                    control={control}
                    rules={{ 
                        required: "Descrição é obrigatória", 
                        minLength: { value: 4, message: "Mínimo 4 caracteres" } 
                    }}
                    render={({ field }) => (
                        <InputText 
                            id="description" 
                            {...field} 
                            placeholder="Ex: Meu Nubank, Chave PIX Principal"
                            className={classNames({ 'p-invalid': errors.description })} 
                            autoFocus
                        />
                    )}
                />
                {errors.description && <small className="p-error">{errors.description.message}</small>}
            </div>
        </Dialog>
    );
};
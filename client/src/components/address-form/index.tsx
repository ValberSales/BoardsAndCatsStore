import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import type { IAddress } from "@/commons/types";
import axios from "axios";

import "./AddressForm.css";

interface AddressFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: IAddress) => void;
    addressToEdit?: IAddress | null;
    loading?: boolean;
}

export const AddressForm = ({ visible, onHide, onSave, addressToEdit, loading }: AddressFormProps) => {
    const { control, handleSubmit, reset, setValue, setFocus, setError, clearErrors, formState: { errors } } = useForm<IAddress>();
    
    const [loadingCep, setLoadingCep] = useState(false);

    useEffect(() => {
        if (visible) {
            if (addressToEdit) {
                reset(addressToEdit);
            } else {
                // Inicializa com string vazia para evitar warning de uncontrolled component
                reset({ street: '', number: '', neighborhood: '', city: '', state: '', zip: '', complement: '' } as IAddress);
            }
        }
    }, [visible, addressToEdit, reset]);

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            return;
        }

        setLoadingCep(true);
        clearErrors("zip");

        try {
            const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

            if (data.erro) {
                setError("zip", { type: "manual", message: "CEP não encontrado." });
                return;
            }

            setValue('street', data.logradouro);
            setValue('neighborhood', data.bairro);
            setValue('city', data.localidade);
            setValue('state', data.uf);
            
            // Foca no campo Número após carregar os dados
            setFocus('number');

        } catch (error) {
            console.error("Erro ao buscar CEP", error);
            setError("zip", { type: "manual", message: "Erro ao conectar com ViaCEP." });
        } finally {
            setLoadingCep(false);
        }
    };

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
                loading={loading || loadingCep} 
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
            <div className="address-form-grid mb-3">
                <div className="field mb-0">
                    <label htmlFor="zip" className="address-label">CEP</label>
                    <Controller
                        name="zip"
                        control={control}
                        rules={{ required: "CEP é obrigatório" }}
                        render={({ field }) => (
                            <span className="p-input-icon-right w-full">
                                <InputMask 
                                    id="zip" 
                                    mask="99999-999" 
                                    {...field} 
                                    onBlur={(e) => {
                                        field.onBlur();
                                        handleCepBlur(e);
                                    }}
                                    className={classNames("address-input w-full", { 'p-invalid': errors.zip })} 
                                    autoFocus
                                />
                                {loadingCep && <i className="pi pi-spin pi-spinner text-primary" />}
                            </span>
                        )}
                    />
                    {errors.zip && <small className="error-msg">{errors.zip.message}</small>}
                </div>
                <div className="field mb-0">
                    <label htmlFor="state" className="address-label">Estado</label>
                    <Controller
                        name="state"
                        control={control}
                        rules={{ required: "UF obrigatória" }}
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
                    rules={{ required: "Cidade é obrigatória" }}
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

            <div className="field mb-3">
                <label htmlFor="neighborhood" className="address-label">Bairro</label>
                <Controller
                    name="neighborhood"
                    control={control}
                    rules={{ required: "Bairro é obrigatório" }}
                    render={({ field }) => (
                        <InputText 
                            id="neighborhood" 
                            {...field} 
                            className={classNames("address-input", { 'p-invalid': errors.neighborhood })} 
                        />
                    )}
                />
                {errors.neighborhood && <small className="error-msg">{errors.neighborhood.message}</small>}
            </div>

            {/* LINHA DA RUA E NÚMERO */}
            <div className="formgrid grid mb-3">
                {/* Campo Rua (9 colunas - 75% do espaço) */}
                <div className="field col-12 md:col-9 mb-0">
                    <label htmlFor="street" className="address-label">Rua / Logradouro</label>
                    <Controller
                        name="street"
                        control={control}
                        rules={{ required: "Rua é obrigatória" }}
                        render={({ field }) => (
                            <InputText 
                                id="street" 
                                {...field} 
                                className={classNames("address-input", { 'p-invalid': errors.street })} 
                            />
                        )}
                    />
                    {errors.street && <small className="error-msg">{errors.street.message}</small>}
                </div>

                {/* Campo Número (3 colunas - 25% do espaço, ou 1/3 da rua) */}
                <div className="field col-12 md:col-3 mb-0">
                    <label htmlFor="number" className="address-label">Número</label>
                    <Controller
                        name="number"
                        control={control}
                        rules={{ required: "Obrigatório" }}
                        render={({ field }) => (
                            <InputText 
                                id="number" 
                                {...field} 
                                className={classNames("address-input", { 'p-invalid': errors.number })} 
                            />
                        )}
                    />
                    {errors.number && <small className="error-msg">{errors.number.message}</small>}
                </div>
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
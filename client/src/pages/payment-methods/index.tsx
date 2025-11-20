import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import PaymentMethodService from "@/services/payment-method-service";
import type { IPaymentMethod } from "@/commons/types";

export const PaymentMethodsPage = () => {
    const [methods, setMethods] = useState<IPaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        PaymentMethodService.getMyMethods().then((res) => {
            if (res.success) setMethods(res.data as IPaymentMethod[]);
            setLoading(false);
        });
    }, []);

    return (
        <div style={{ paddingTop: '70px' }}>
            <div className="container mx-auto px-4 my-5">
                <h1 className="text-3xl font-bold mb-4">Minhas Formas de Pagamento</h1>
                <div className="card shadow-2">
                    <DataTable value={methods} loading={loading} emptyMessage="Nenhuma forma de pagamento cadastrada.">
                        <Column field="description" header="Descrição" />
                        <Column field="type" header="Tipo" />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};
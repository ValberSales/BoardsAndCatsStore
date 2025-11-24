import { api } from "@/lib/axios";
import type { IResponse } from "@/commons/types";

const validate = async (code: string): Promise<IResponse> => {
    try {
        // Chamada para o backend. Espera-se que retorne { code: "ABC", percentage: 10 }
        const response = await api.get(`/coupons/validate/${code}`);
        return { 
            status: 200, 
            success: true, 
            data: response.data 
        };
    } catch (err: any) {
        return { 
            status: err.response?.status || 400, 
            success: false, 
            message: err.response?.data?.message || "Cupom inválido ou expirado." 
        };
    }
};

const CouponService = { validate };
export default CouponService;
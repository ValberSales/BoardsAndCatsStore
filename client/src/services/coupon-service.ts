import { api } from "@/lib/axios";
import type { IResponse } from "@/types/api";

const validate = async (code: string): Promise<IResponse> => {
    try {
      
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
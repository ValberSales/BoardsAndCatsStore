import { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";
import type { ReactNode } from "react";

// Define o formato da mensagem do Toast do PrimeReact
interface ToastMessage {
    severity: "success" | "info" | "warn" | "error";
    summary: string;
    detail: string;
    life?: number;
}

interface ToastContextType {
    showToast: (message: ToastMessage) => void;
}

const ToastContext = createContext({} as ToastContextType);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const toast = useRef<Toast>(null);

    const showToast = (message: ToastMessage) => {
        toast.current?.show(message);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {/* Um único componente Toast para toda a aplicação */}
            <Toast ref={toast} position="top-right" />
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast deve ser usado dentro de um ToastProvider");
    }
    return context;
};
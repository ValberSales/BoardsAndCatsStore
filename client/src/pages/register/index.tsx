import { RegisterForm } from "@/components/register-form";
import { API_BASE_URL } from "@/lib/axios";

export const RegisterPage = () => {
  return (

    <div className="flex flex-column md:flex-row w-full flex-grow-1 surface-ground overflow-hidden align-items-stretch">
      
      {/* LADO ESQUERDO */}
      <div className="w-full md:w-6 flex align-items-center justify-content-center surface-section relative z-2 shadow-8 p-4">
        <div className="w-full" style={{ maxWidth: '40rem' }}>
            <RegisterForm />
        </div>
      </div>

      {/* LADO DIREITO */}
      <div 
        className="hidden md:block md:w-6 flex-grow-1 bg-no-repeat bg-cover bg-center relative"
        style={{ backgroundImage: `url('${API_BASE_URL}/images/cadastro.webp')` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black-alpha-10"></div>
      </div>
    </div>
  );
};
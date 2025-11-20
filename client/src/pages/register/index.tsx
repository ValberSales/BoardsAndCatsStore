import { RegisterForm } from "@/components/register-form";
import { API_BASE_URL } from "@/lib/axios";

export const RegisterPage = () => {
  return (
    // 'flex-grow-1': Faz este container ocupar todo o espaço disponível no <main> do Layout
    // 'align-items-stretch': Garante que a imagem e o form tenham a mesma altura
    <div className="flex flex-column md:flex-row w-full flex-grow-1 surface-ground overflow-hidden align-items-stretch">
      
      {/* LADO ESQUERDO - FORMULÁRIO */}
      <div className="w-full md:w-6 flex align-items-center justify-content-center surface-section relative z-2 shadow-8 p-4">
        <div className="w-full" style={{ maxWidth: '40rem' }}>
            <RegisterForm />
        </div>
      </div>

      {/* LADO DIREITO - IMAGEM */}
      {/* Sem margem branca: flex-grow-1 garante que preencha o resto da largura/altura */}
      <div 
        className="hidden md:block md:w-6 flex-grow-1 bg-no-repeat bg-cover bg-center relative"
        style={{ 
            backgroundImage: `url('${API_BASE_URL}/images/cadastro.webp')`,
            // Removemos minHeight fixa para deixar o flexbox controlar a altura exata
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black-alpha-10"></div>
      </div>
    </div>
  );
};
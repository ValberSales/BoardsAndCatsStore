import { LoginForm } from "@/components/login-form";
import { useLocation, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Recupera a página de origem se existir
  const from = location.state?.from?.pathname || "/";

  const handleSuccess = () => {
    // Redireciona de volta para onde o usuário estava
    navigate(from, { replace: true });
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen surface-ground">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <div className="text-center mb-5">
          <div className="text-900 text-3xl font-medium mb-3">Bem-vindo de volta</div>
          <span className="text-600 font-medium line-height-3">Não tem uma conta?</span>
          <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" onClick={() => navigate('/register')}>
            Crie agora!
          </a>
        </div>

        <LoginForm onSuccess={handleSuccess} showRegisterLink={false} />
      </div>
    </div>
  );
};
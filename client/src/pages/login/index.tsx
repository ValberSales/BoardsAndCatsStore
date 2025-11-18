import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { LoginForm } from "@/components/login-form";

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 70px)', paddingTop: '70px' }}>
      <Card title="Login" className="w-full max-w-20rem shadow-2">
        {/* Reutilizando o componente de login */}
        <LoginForm 
            onSuccess={() => {
                // Ao logar na página dedicada, redirecionamos para a home
                navigate("/");
            }}
            showRegisterLink={true}
        />
      </Card>
    </div>
  );
};
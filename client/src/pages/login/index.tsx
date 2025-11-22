import { LoginForm } from "@/components/login-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import "./Login.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  // Cabeçalho customizado para o Card
  const header = (
      <div className="login-header">
          <div className="login-title">Bem-vindo de volta</div>
          <span className="login-subtitle">Não tem uma conta?</span>
          <a className="login-link" onClick={() => navigate('/register')}>
            Crie agora!
          </a>
      </div>
  );

  return (
    <div className="login-page-container">
      <Card className="login-card" header={header}>
        <div className="login-content">
            <LoginForm onSuccess={handleSuccess} showRegisterLink={false} />
        </div>
      </Card>
    </div>
  );
};
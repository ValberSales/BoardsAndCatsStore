import { Link, useLocation } from "react-router-dom"; // 1. Adicione useLocation
import { API_BASE_URL } from "@/lib/axios";
import { classNames } from "primereact/utils"; // Opcional: ajuda a combinar classes condicionalmente
import "./Footer.css"; 

export const Footer = () => {
    const location = useLocation();

    const noMarginRoutes = ['/register', '/login'];
    
    const shouldHaveMargin = !noMarginRoutes.includes(location.pathname);

    return (
        <footer>
    
            <div className={`footer-main pt-6 pb-4 ${shouldHaveMargin ? 'mt-6' : ''}`}>
                <div className="container mx-auto px-4">
                    <div className="grid">
                        
                        {/* Coluna 1: Institucional */}
                        <div className="col-12 md:col-4">
                            <h4 className="font-bold text-xl mb-3">Institucional</h4>
                            <ul className="list-none p-0 m-0">
                                <li className="mb-2">
                                    <Link to="/about" className="hover:underline">Quem somos</Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/location" className="hover:underline">Onde estamos</Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/contact" className="hover:underline">Fale conosco</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Coluna 2: Minha Conta */}
                        <div className="col-12 md:col-4">
                            <h4 className="font-bold text-xl mb-3">Minha conta</h4>
                            <ul className="list-none p-0 m-0">
                                <li className="mb-2">
                                    <Link to="/profile" className="hover:underline">Meu cadastro</Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/orders" className="hover:underline">Meus pedidos</Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/payment-methods" className="hover:underline">Minhas formas de pagamento</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Coluna 3: Redes Sociais */}
                        <div className="col-12 md:col-4">
                            <h4 className="font-bold text-xl mb-3">Redes sociais</h4>
                            <div className="flex gap-3 mb-4">
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                    <i className="pi pi-instagram" style={{ fontSize: '1.5rem' }}></i>
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                    <i className="pi pi-twitter" style={{ fontSize: '1.5rem' }}></i>
                                </a>
                                <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                    <i className="pi pi-whatsapp" style={{ fontSize: '1.5rem' }}></i>
                                </a>
                            </div>
                            <div>
                                <img 
                                    className="bg-white p-1 border-round-md" 
                                    src={`${API_BASE_URL}/images/cards.jpg`} 
                                    alt="Formas de Pagamento"
                                    style={{ maxWidth: '60%', height: 'auto' }}
                                />     
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-copyright py-4 text-center">
                <div className="container mx-auto px-4">
                    <p className="m-0 mb-1 font-semibold">Copyright - Boards and Cats 2024</p>
                    <p className="m-0 text-sm opacity-70">CNPJ: 36.550.886/0001-94</p>
                </div>
            </div>
        </footer>
    );
};
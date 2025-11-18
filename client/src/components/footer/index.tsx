import { API_BASE_URL } from "@/lib/axios";
import "./Footer.css"; // 1. Importa o CSS

export const Footer = () => {
    return (
        <footer>
            {/* 2. Parte Principal: Classe .footer-main */}
            <div className="footer-main pt-6 pb-4 mt-6">
                <div className="container mx-auto px-4">
                    <div className="grid">
                        
                        {/* Coluna 1: Institucional */}
                        <div className="col-12 md:col-4">
                            <h4 className="font-bold text-xl mb-3">Institucional</h4>
                            <ul className="list-none p-0 m-0">
                                <li className="mb-2">
                                    <a href="#">Quem somos</a>
                                </li>
                                <li className="mb-2">
                                    <a href="#">Onde estamos</a>
                                </li>
                                <li className="mb-2">
                                    <a href="#">Fale conosco</a>
                                </li>
                            </ul>
                        </div>

                        {/* Coluna 2: Minha Conta */}
                        <div className="col-12 md:col-4">
                            <h4 className="font-bold text-xl mb-3">Minha conta</h4>
                            <ul className="list-none p-0 m-0">
                                <li className="mb-2">
                                    <a href="#">Meu cadastro</a>
                                </li>
                                <li className="mb-2">
                                    <a href="#">Meus pedidos</a>
                                </li>
                                <li className="mb-2">
                                    <a href="#">Minhas formas de pagamento</a>
                                </li>
                            </ul>
                        </div>

                        {/* Coluna 3: Redes Sociais */}
                        <div className="col-12 md:col-4">
                            <h4 className="font-bold text-xl mb-3">Redes sociais</h4>
                            
                            <div className="flex gap-3 mb-4">
                                <a href="https://www.instagram.com" target="_blank" title="Instagram">
                                    <i className="pi pi-instagram" style={{ fontSize: '1.5rem' }}></i>
                                </a>
                                <a href="https://twitter.com" target="_blank" title="X">
                                    <i className="pi pi-twitter" style={{ fontSize: '1.5rem' }}></i>
                                </a>
                                <a href="https://wa.me" target="_blank" title="WhatsApp">
                                    <i className="pi pi-whatsapp" style={{ fontSize: '1.5rem' }}></i>
                                </a>
                            </div>
                            
                            <div>
                                <img 
                                    className="bg-white" 
                                    src={`${API_BASE_URL}/images/cards.webp`} 
                                    alt="Formas de Pagamento"
                                    style={{ maxWidth: '60%', height: 'auto', borderRadius: '8px' }}
                                />     
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Parte Inferior: Classe .footer-copyright */}
            <div className="footer-copyright py-4 text-center">
                <div className="container mx-auto px-4">
                    <p className="m-0 mb-1 font-semibold">Copyright - Boards and Cats 2025</p>
                    <p className="m-0 text-sm opacity-70">CNPJ: 36.550.886/0001-94</p>
                </div>
            </div>
        </footer>
    );
};
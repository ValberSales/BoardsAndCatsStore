import { Card } from 'primereact/card';
import { API_BASE_URL } from "@/lib/axios";
import "./About.css";

export const AboutPage = () => {
    return (
        <div style={{ paddingTop: '70px' }} className="fadein animation-duration-500">
            <div className="container mx-auto px-4 my-6" style={{ maxWidth: '1000px' }}>
                
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold mb-2">Quem Somos</h1>
                    <p className="text-xl text-600">A sua loja especializada em diversão analógica (e felina).</p>
                </div>

                <div className="grid align-items-center">
                    <div className="col-12 md:col-6 p-4">
                        <h2 className="text-2xl font-bold mb-4 text-primary">Nossa História</h2>
                        <p className="line-height-3 text-lg mb-4">
                            A <strong>Boards and Cats</strong> nasceu de uma combinação inusitada, mas perfeita: a paixão por jogos de tabuleiro modernos e o amor incondicional por gatos.
                        </p>
                        <p className="line-height-3 text-lg mb-4">
                            Fundada em Pato Branco, nossa missão é desconectar as pessoas das telas e reconectá-las ao redor de uma mesa. Acreditamos que não há nada melhor do que rolar dados, comprar cartas e dar boas risadas com amigos e família.
                        </p>
                        <p className="line-height-3 text-lg">
                            Tudo isso, claro, sob a supervisão atenta dos nossos "gerentes" felinos, que garantem que cada caixa enviada tenha o selo de qualidade (e talvez um pouco de pelo) da nossa equipe.
                        </p>
                    </div>
                    
                    <div className="col-12 md:col-6 flex justify-content-center p-4">
                        <img 
                            src={`${API_BASE_URL}/images/Logonova.png`} 
                            alt="Boards and Cats Logo" 
                            className="shadow-2 logo-full w-full md"
                            style={{ maxHeight: '600px', objectFit: 'contain', backgroundColor: '#fff' }}
                        />
                    </div>
                </div>

                <div className="grid mt-6">
                    <div className="col-12 md:col-4">
                        <Card className="h-full text-center surface-card shadow-1 hover:shadow-3 transition-duration-200">
                            <i className="pi pi-heart text-4xl text-primary mb-3"></i>
                            <h3 className="text-xl font-bold mb-2">Paixão</h3>
                            <p className="m-0">Selecionamos cada jogo do nosso catálogo como se fosse para nossa própria coleção.</p>
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card className="h-full text-center surface-card shadow-1 hover:shadow-3 transition-duration-200">
                            <i className="pi pi-users text-4xl text-primary mb-3"></i>
                            <h3 className="text-xl font-bold mb-2">Comunidade</h3>
                            <p className="m-0">Mais do que vender jogos, queremos criar um ponto de encontro para entusiastas em Pato Branco.</p>
                        </Card>
                    </div>
                    <div className="col-12 md:col-4">
                        <Card className="h-full text-center surface-card shadow-1 hover:shadow-3 transition-duration-200">
                            <i className="pi pi-star text-4xl text-primary mb-3"></i>
                            <h3 className="text-xl font-bold mb-2">Excelência</h3>
                            <p className="m-0">Atendimento rápido e envios protegidos (contra impactos e gatos curiosos).</p>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
};
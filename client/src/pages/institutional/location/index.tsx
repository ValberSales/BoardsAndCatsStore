import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import "./Location.css";

export const LocationPage = () => {
    const address = "Rua Aimoré, 983 - Centro, Pato Branco - PR, 85501-296";
    
    // URL corrigida para busca no Google Maps
    const handleOpenMaps = () => {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(mapsUrl, '_blank');
    };

    return (
        <div className="location-page fadein animation-duration-500">
            <div className="container mx-auto px-4 location-container">
                
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold mb-2">Onde Estamos</h1>
                    <p className="text-xl text-600">Venha jogar uma partida conosco!</p>
                </div>

                <div className="grid">
                    {/* Informações de Contato */}
                    <div className="col-12 md:col-5 mb-4">
                        <Card title="Boards & Cats (Sede)" className="shadow-2 location-info-card">
                            <div className="flex flex-column gap-4 mt-2">
                                <div className="flex align-items-start gap-3">
                                    <i className="pi pi-map-marker contact-icon"></i>
                                    <div>
                                        <h4 className="m-0 text-lg">Endereço</h4>
                                        <p className="m-0 text-600 line-height-3 mt-1">
                                            Rua Aimoré, 983<br/>
                                            Centro<br/>
                                            Pato Branco - PR<br/>
                                            CEP: 85501-296
                                        </p>
                                    </div>
                                </div>

                                <div className="flex align-items-start gap-3">
                                    <i className="pi pi-clock contact-icon"></i>
                                    <div>
                                        <h4 className="m-0 text-lg">Horário de Atendimento</h4>
                                        <p className="m-0 text-600 line-height-3 mt-1">
                                            Segunda a Sexta: 09:00 - 18:00<br/>
                                            Sábado: 09:00 - 13:00<br/>
                                            Domingo: Fechado
                                        </p>
                                    </div>
                                </div>

                                <div className="flex align-items-start gap-3">
                                    <i className="pi pi-envelope contact-icon"></i>
                                    <div>
                                        <h4 className="m-0 text-lg">Contato</h4>
                                        <p className="m-0 text-600 mt-1">pepper.pbco@gmail.com</p>
                                        <p className="m-0 text-600">(46) 99999-8888</p>
                                    </div>
                                </div>

                                <Button 
                                    label="Abrir no Google Maps" 
                                    icon="pi pi-external-link" 
                                    outlined 
                                    className="w-full mt-2"
                                    onClick={handleOpenMaps}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Mapa */}
                    <div className="col-12 md:col-7 mb-4">
                        <div className="shadow-2 location-map-wrapper">
                            
                            {/* Placeholder (aparece enquanto carrega ou se falhar) */}
                            <div className="text-center p-4">
                                <i className="pi pi-map text-6xl text-gray-400 mb-3"></i>
                                <p className="text-gray-600 font-semibold">Carregando Mapa...</p>
                                <p className="text-sm text-gray-500">Rua Aimoré, 983 - Pato Branco</p>
                            </div>
                            
                            {/* Iframe Real */}
                             <iframe 
                                className="location-map-iframe"
                                loading="lazy" 
                                allowFullScreen 
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                title="Mapa da Loja"
                            ></iframe> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
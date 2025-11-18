import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const toast = useRef<Toast>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simula envio
        setTimeout(() => {
            setLoading(false);
            toast.current?.show({
                severity: 'success',
                summary: 'Mensagem Enviada',
                detail: 'Recebemos seu contato! Responderemos em breve.',
                life: 3000
            });
            // Resetar form (opcional)
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div style={{ paddingTop: '70px' }} className="fadein animation-duration-500">
            <Toast ref={toast} />
            <div className="container mx-auto px-4 my-6" style={{ maxWidth: '800px' }}>
                
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold mb-2">Fale Conosco</h1>
                    <p className="text-xl text-600">Dúvidas, sugestões ou reclamações? Mande um oi!</p>
                </div>

                <Card className="shadow-2">
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="field mb-4">
                            <label htmlFor="name" className="font-bold mb-2 block">Nome Completo</label>
                            <InputText id="name" required placeholder="Ex: Valber Sales" />
                        </div>

                        <div className="field mb-4">
                            <label htmlFor="email" className="font-bold mb-2 block">E-mail</label>
                            <InputText id="email" type="email" required placeholder="seu@email.com" />
                        </div>

                        <div className="field mb-4">
                            <label htmlFor="subject" className="font-bold mb-2 block">Assunto</label>
                            <InputText id="subject" required placeholder="Ex: Dúvida sobre o jogo Catan" />
                        </div>

                        <div className="field mb-4">
                            <label htmlFor="message" className="font-bold mb-2 block">Mensagem</label>
                            <InputTextarea id="message" rows={5} required placeholder="Escreva sua mensagem aqui..." autoResize />
                        </div>

                        <div className="flex justify-content-end">
                            <Button 
                                type="submit" 
                                label="Enviar Mensagem" 
                                icon="pi pi-send" 
                                loading={loading} 
                                className="w-full md:w-auto"
                            />
                        </div>
                    </form>
                </Card>

                <div className="mt-6 text-center text-600">
                    <p>Também atendemos pelo WhatsApp:</p>
                    <Button 
                        label="(46) 99999-8888" 
                        icon="pi pi-whatsapp" 
                        severity="success" 
                        text 
                        onClick={() => window.open('https://wa.me/5546999998888', '_blank')}
                    />
                </div>

            </div>
        </div>
    );
};
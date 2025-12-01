import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

export const ProfileNavigation = () => {
    
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const items = [
        { id: 'personal-data', icon: 'pi pi-user', label: 'Dados Pessoais' },
        { id: 'addresses', icon: 'pi pi-map-marker', label: 'Endereços' },
        { id: 'payments', icon: 'pi pi-credit-card', label: 'Pagamentos' },
        { id: 'security', icon: 'pi pi-lock', label: 'Segurança' }
    ];

    return (
        <>
            <Tooltip target=".nav-btn" position="right" />
            
            <div className="profile-nav-wrapper fadeinleft animation-duration-500">
                <div className="profile-nav-card">
                    {items.map((item) => (
                        <Button 
                            key={item.id}
                            icon={item.icon} 
                            rounded 
                            text 
                            severity="secondary"
                            aria-label={item.label}
                            className="nav-btn"
                            data-pr-tooltip={item.label}
                            onClick={() => scrollToSection(item.id)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};
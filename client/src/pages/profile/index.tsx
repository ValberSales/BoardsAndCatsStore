import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from "primereact/toast"; 

import { ProfileForm } from "@/components/profile-form";
import { AddressList } from "@/components/address-list";
import { PaymentMethodList } from "@/components/payment-method-list";
import { AccountSecurity } from "@/components/account-security"; 
import { ProfileNavigation } from "@/components/profile-navigation";

import "./Profile.css";

export const ProfilePage = () => {
    return (
        <div className="profile-container surface-ground pb-8"> 
            <ConfirmDialog />
            <Toast /> 

            <div className="profile-layout-flex">
                
                {/* TRILHO DO MENU */}
                <div className="profile-nav-rail">
                    <ProfileNavigation />
                </div>

                {/* WRAPPER DO CONTEÚDO PRINCIPAL */}
                <div className="profile-content-wrapper">
                    
                    <div className="flex flex-column gap-2 mb-5">
                        <h1 className="text-4xl font-bold text-900 m-0">Minha Conta</h1>
                        <span className="text-lg text-gray-600">Gerencie todas as suas informações pessoais.</span>
                    </div>

                    <div className="grid profile-grid">
                        
                        {/* COLUNA CENTRAL */}
                        <div className="col-12 lg:col-8 center-column">
                            <div className="flex flex-column gap-2">
                                <section id="personal-data" className="profile-section">
                                    <ProfileForm />
                                </section>

                                <section id="addresses" className="profile-section">
                                    <AddressList />
                                </section>

                                <section id="payments" className="profile-section">
                                    <PaymentMethodList />
                                </section>
                            </div>
                        </div>

                        {/* COLUNA DIREITA (Segurança) */}
                        <div className="col-12 lg:col-4 right-column">
                            <div className="security-column-wrapper">
                                <div id="security" className="security-card-sticky">
                                    <AccountSecurity />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
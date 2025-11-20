import { Carousel } from 'primereact/carousel';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/axios';

// Importa o CSS customizado
import './BannerCarousel.css';

interface Banner {
    id: number;
    productId: number;
    image: string;
    alt: string;
}

export const BannerCarousel = () => {
    const navigate = useNavigate();

    const banners: Banner[] = [
        { id: 1, productId: 3, image: 'bannerpandemic.png', alt: 'Pandemic - Salve o mundo' },
        { id: 2, productId: 9, image: 'bannerdistilled.png', alt: 'Distilled - Mestre da Destilação' },
        { id: 3, productId: 1, image: 'bannerterra.png', alt: 'Terra Mystica - Estratégia Pura' },
        { id: 4, productId: 5, image: 'bannergloom.png', alt: 'Gloomhaven - Aventura Épica' }
    ];

    const itemTemplate = (banner: Banner) => {
        return (
            <div 
                className="banner-wrapper cursor-pointer" 
                onClick={() => navigate(`/products/${banner.productId}`)}
            >
                <img 
                    src={`${API_BASE_URL}/images/banners/${banner.image}`} 
                    alt={banner.alt} 
                    className="banner-image"
                />
            </div>
        );
    };

    return (
        <div className="banner-carousel mb-5">
            <Carousel 
                value={banners} 
                numVisible={1} 
                numScroll={1} 
                circular 
                autoplayInterval={5000} 
                itemTemplate={itemTemplate}
                showIndicators={true}
                showNavigators={true}
            />
        </div>
    );
};
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

import ProductService from "@/services/product-service";
import type { IProduct } from "@/commons/types";
import { ProductGallery } from "@/components/product-gallery";

import "./ProductDetail.css";

export const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadProduct(Number(id));
        }
    }, [id]);

    const loadProduct = async (productId: number) => {
        setLoading(true);
        try {
            const response = await ProductService.findById(productId);
            if (response.status === 200 && response.data) {
                setProduct(response.data);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Produto não encontrado' });
                setTimeout(() => navigate("/"), 2000);
            }
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha de conexão' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        toast.current?.show({ severity: 'success', summary: 'Adicionado', detail: 'Produto no carrinho!' });
    };

    if (loading) {
        return <div className="flex justify-content-center align-items-center h-screen"><ProgressSpinner /></div>;
    }

    if (!product) return null;

    const formattedPrice = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="container">
            <Toast ref={toast} />
            
            <div className="product-detail-container">
                
                {/* ESQUERDA: GALERIA (Visível apenas no Desktop) */}
                <div className="detail-left-col desktop-only">
                    <div className="gallery-wrapper-desktop h-full">
                        <ProductGallery product={product} />
                    </div>
                </div>

                {/* DIREITA: DETALHES (Sempre visível) */}
                <div className="detail-right-col">
                    <div className="product-info-card">
                        
                        {/* Cabeçalho: Categoria (Sem Rating) */}
                        <div className="flex justify-content-between align-items-center mb-3">
                            <span className="text-500 font-medium uppercase text-sm tracking-wider">
                                {product.category?.name || 'Geral'}
                            </span>
                            {/* Rating foi removido daqui */}
                        </div>

                        <h1 className="font-bold text-3xl mb-2 mt-0 text-900">{product.name}</h1>
                        
                        <div className="flex align-items-center gap-3 mb-4">
                            <span className="text-4xl font-bold text-primary">{formattedPrice}</span>
                            {product.promo && <Tag value="OFERTA" severity="danger" rounded></Tag>}
                        </div>

                        {/* Ações */}
                        <div className="flex flex-column gap-3 mb-5">
                            <Button 
                                label="Adicionar ao Carrinho" 
                                icon="pi pi-shopping-cart" 
                                size="large"
                                className="w-full font-bold"
                                onClick={handleAddToCart}
                            />
                            <Button 
                                label="Adicionar à Lista de Desejos" 
                                icon="pi pi-heart" 
                                severity="secondary" 
                                outlined 
                                className="w-full" 
                            />
                        </div>

                        <Divider />

                        {/* --- GALERIA MOBILE (Inserida Aqui) --- */}
                        <div className="mobile-only mb-5" style={{ height: '400px' }}>
                            <ProductGallery product={product} />
                        </div>

                        {/* Ficha Técnica */}
                        <div className="flex flex-column gap-3">
                            <h3 className="font-medium text-lg m-0 text-900">Detalhes do Item</h3>
                            <ul className="list-none p-0 m-0">
                                {[
                                    { label: 'Editora', value: product.editor },
                                    { label: 'Jogadores', value: product.players },
                                    { label: 'Idade', value: product.idadeRecomendada },
                                    { label: 'Duração', value: product.duracao }
                                ].map((item, i) => (
                                    <li key={i} className="flex justify-content-between py-2 border-bottom-1 surface-border">
                                        <span className="text-600">{item.label}:</span>
                                        <span className="text-900 font-medium">{item.value || '-'}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-medium text-lg mb-2 text-900">Descrição</h3>
                            <p className="text-700 line-height-3 m-0" style={{ whiteSpace: 'pre-line' }}>
                                {product.description}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
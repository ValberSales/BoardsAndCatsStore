import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/axios";
import type { IProduct } from "@/types/product";
import { classNames } from "primereact/utils";

import "./ProductGallery.css";

interface ProductGalleryProps {
    product: IProduct;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ product }) => {
    const [selectedImage, setSelectedImage] = useState<string>("");

    useEffect(() => {
        if (product && product.imageUrl) {
            setSelectedImage(product.imageUrl);
        }
    }, [product]);

    const allImages = [
        product.imageUrl, 
        ...(product.otherImages || [])
    ].filter(img => img);

    return (
        <div className="product-gallery-container">
            
            {/* 1. IMAGEM PRINCIPAL */}
            <div className="gallery-main-image-container">
                {selectedImage ? (
                    <img 
                        src={`${API_BASE_URL}${selectedImage}`} 
                        alt={product.name} 
                        className="gallery-main-image"
                    />
                ) : (
                    <i className="pi pi-image text-600 text-5xl"></i>
                )}
            </div>

            {/* 2. MINI GALERIA */}
            <div className="gallery-thumbnails-container">
                {allImages.map((img, index) => {
                    const isSelected = selectedImage === img;
                    
                    return (
                        <div 
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={classNames("gallery-thumbnail", { "selected": isSelected })}
                        >
                            <img 
                                src={`${API_BASE_URL}${img}`} 
                                alt={`Thumbnail ${index}`}
                                className="gallery-thumbnail-image"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
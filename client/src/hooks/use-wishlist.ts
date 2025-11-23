import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import WishlistService from '@/services/wishlist-service';
import type { IProduct } from '@/commons/types';

export function useWishlist(product: IProduct | null) {
    const navigate = useNavigate();
    const { authenticated } = useContext(AuthContext);
    const { showToast } = useToast();
    
    const [inWishlist, setInWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Verifica status inicial ao carregar ou mudar o produto/auth
    useEffect(() => {
        let mounted = true;

        if (authenticated && product?.id) {
            WishlistService.check(product.id).then((status) => {
                if (mounted) setInWishlist(status);
            });
        } else {
            setInWishlist(false);
        }

        return () => { mounted = false; };
    }, [authenticated, product?.id]);

    const toggleWishlist = async (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        if (!authenticated) {
            // Opcional: mostrar aviso antes de redirecionar ou apenas redirecionar
            showToast({
                severity: 'info',
                summary: 'Login necessário',
                detail: 'Faça login para adicionar aos favoritos.',
                life: 3000
            });
            navigate('/login');
            return;
        }

        if (!product?.id) return;

        setWishlistLoading(true);
        try {
            const response = await WishlistService.toggle(product.id);
            if (response.success) {
                const isAdded = response.data === true;
                setInWishlist(isAdded);
                
                showToast({
                    severity: isAdded ? 'success' : 'info',
                    summary: isAdded ? 'Favoritado' : 'Removido',
                    detail: isAdded 
                        ? 'Produto adicionado à Lista de Desejos!' 
                        : 'Produto removido da Lista de Desejos.',
                    life: 2000
                });
            }
        } catch (error) {
            console.error(error);
            showToast({ 
                severity: 'error', 
                summary: 'Erro', 
                detail: 'Erro ao atualizar lista de desejos.' 
            });
        } finally {
            setWishlistLoading(false);
        }
    };

    return {
        inWishlist,
        toggleWishlist,
        wishlistLoading
    };
}
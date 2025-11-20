import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import { API_BASE_URL } from "@/lib/axios";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Galleria } from 'primereact/galleria';
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BreadCrumb } from 'primereact/breadcrumb';
import type { MenuItem } from "primereact/menuitem";
import { Tag } from "primereact/tag"; 

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const toast = useRef<Toast>(null);
  
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [breadcrumbItems, setBreadcrumbItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    setLoading(true);
    try {
      const response = await ProductService.findById(productId);
      if (response.status === 200 && response.data) {
        const fetchedProduct = response.data as IProduct;
        setProduct(fetchedProduct);
        
        const allImages = [
          fetchedProduct.imageUrl, 
          ...(fetchedProduct.otherImages || []) 
        ];
        setImages(allImages.map(imgUrl => `${API_BASE_URL}${imgUrl}`));

        // Monta a tabela de detalhes
        const details = [];
        if (fetchedProduct.editor) details.push({ label: 'Editor', value: fetchedProduct.editor });
        if (fetchedProduct.mechanics) details.push({ label: 'Mecânicas', value: fetchedProduct.mechanics });
        if (fetchedProduct.players) details.push({ label: 'Quantidade de Jogadores', value: fetchedProduct.players });
        if (fetchedProduct.duracao) details.push({ label: 'Duração', value: fetchedProduct.duracao });
        if (fetchedProduct.idadeRecomendada) details.push({ label: 'Idade Recomendada', value: fetchedProduct.idadeRecomendada });
        setProductDetails(details);

        // ##### CORREÇÃO AQUI #####
        setBreadcrumbItems([
          { 
            label: fetchedProduct.category.name, 
            // Corrigido para plural: /categories/
            command: () => navigate(`/categories/${fetchedProduct.category.id}`) 
          },
          { 
            label: fetchedProduct.name,
            // O último item geralmente não tem comando (é a página atual)
            className: 'font-bold' 
          }
        ]);
        // ##### FIM DA CORREÇÃO #####
        
      } else {
        toast.current?.show({ severity: "error", summary: "Erro", detail: "Produto não encontrado.", life: 3000 });
      }
    } catch (error) {
      toast.current?.show({ severity: "error", summary: "Erro", detail: "Falha ao carregar o produto.", life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const itemTemplate = (item: string) => {
    return <img src={item} alt={product?.name} style={{ width: '100%', display: 'block' }} />;
  }
  const thumbnailTemplate = (item: string) => {
    return <img src={item} alt="Thumbnail" style={{ width: '80px', display: 'block' }} className="p-2 border-1 surface-border border-round" />;
  }

  if (loading) {
    return <div className="flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 70px)', paddingTop: '70px' }}><ProgressSpinner /></div>;
  }

  if (!product) {
    return <div style={{ paddingTop: '70px' }}><p className="text-center p-4 text-2xl">Produto não encontrado.</p></div>;
  }

  return (
    <div>
      <Toast ref={toast} />
      
      <div className="container mx-auto px-4 my-5" style={{ maxWidth: '1200px' }}>
        
        {/* Breadcrumb */}
        <BreadCrumb 
          model={breadcrumbItems} 
          home={{ label: 'Início', command: () => navigate('/') }} 
          className="mb-4 border-none pl-0" // border-none remove a borda padrão do componente
        />

        <div className="grid">
            
          {/* Galeria */}
          <div className="col-12 md:col-6 flex flex-column align-items-center">
            <Galleria 
              value={images} 
              item={itemTemplate} 
              thumbnail={thumbnailTemplate}
              thumbnailsPosition="bottom"
              circular 
              showItemNavigators
              showThumbnails
              style={{ maxWidth: '640px' }} 
            />
          </div>

          {/* Detalhes */}
          <div className="col-12 md:col-6 md:pl-5">
            {product.promo && <Tag severity="danger" value="PROMO" className="mb-2"></Tag>}
            
            <h1 className="text-4xl font-bold">{product.name}</h1>
            
            <h5 className="text-xl my-3">
              <strong>Preço: </strong>
              <span>{formatCurrency(product.price)}</span>
            </h5>
            
            <p className="text-lg line-height-3">
              <strong>Descrição: </strong>
              <span>{product.description}</span>
            </p>
            
            <Button 
              label="Adicionar ao Carrinho" 
              icon="pi pi-shopping-cart"
              className="w-full p-button-lg my-4"
              onClick={() => console.log("Adicionar ao carrinho:", product.id)}
            />
            
            <div className="mt-4">
              <h4 className="text-xl font-semibold">Calcular Frete</h4>
              <div className="p-inputgroup w-full"> 
                <InputText placeholder="Digite seu CEP" />
                <Button label="Calcular" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="mt-5">
          <h2 className="text-3xl font-bold">Detalhes do Produto</h2>
          <div className="card"> 
            {productDetails.length > 0 ? (
              <DataTable value={productDetails} className="p-datatable-sm" showHeaders={false}>
                  <Column field="label" style={{ width: '30%', fontWeight: 'bold' }} />
                  <Column field="value" />
              </DataTable>
            ) : (
              <p>Nenhum detalhe adicional para este produto.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
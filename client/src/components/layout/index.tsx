import { Outlet } from "react-router-dom";
import TopMenu from "@/components/top-menu";
import { Footer } from "@/components/footer"; // 1. Importe o Footer

export function Layout() {
  return (
    // Usando flex column min-h-screen para garantir que o footer
    // fique no final da página mesmo se o conteúdo for pequeno (Sticky Footer)
    <div className="flex flex-column min-h-screen">
      <TopMenu />
      
      {/* O flex-grow-1 faz o conteúdo principal empurrar o footer para baixo */}
      <main className="flex-grow-1">
        <Outlet />
      </main>
      
      {/* 2. Adicione o Footer aqui */}
      <Footer />
    </div>
  );
}
import { Outlet } from "react-router-dom";
import TopMenu from "@/components/top-menu";

export function Layout() {
  return (
    <>
      <TopMenu />
      <main>
        <Outlet /> {/* Renderiza as rotas filhas aqui */ }
      </main>
    </>
  );
}
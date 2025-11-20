import { Outlet } from "react-router-dom";
import TopMenu from "@/components/top-menu";
import { Footer } from "@/components/footer";

export function Layout() {
  return (
    <div className="flex flex-column min-h-screen">
      <TopMenu />

      <main className="flex-grow-1 flex flex-column" style={{ paddingTop: '70px' }}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebars from "../components/Sidebars";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <section className="main flex flex-col min-h-screen bg-[#f9fafb] transition-all duration-300 relative">
      {/* HEADER */}
      <Header toggleSidebar={toggleSidebar} />

      {/* OVERLAY — aparece apenas quando a sidebar está aberta em telas pequenas */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* MAIN AREA */}
      <div className="flex flex-1 transition-all duration-300 relative z-40">
        {/* SIDEBAR */}
        <Sidebars
          isOpen={isSidebarOpen}
          onForceOpen={openSidebar}
          onClose={closeSidebar}
        />

        {/* PAGE CONTENT */}
        <div
          className={`flex-1 p-6 overflow-y-auto transition-all duration-300
          ${isSidebarOpen ? "md:ml-[250px]" : "md:ml-[70px]"}`}
        >
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Layout;

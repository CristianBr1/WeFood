import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebars from "../components/Sidebars";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const openSidebar = () => setIsSidebarOpen(true);

  return (
    <section className="main flex flex-col min-h-screen bg-[#f9fafb] transition-all duration-300">
      {/* HEADER */}
      <Header toggleSidebar={toggleSidebar} />

      {/* MAIN AREA */}
      <div className="flex flex-1 transition-all duration-300">
        {/* SIDEBAR */}
        <Sidebars
          isOpen={isSidebarOpen}
          onForceOpen={openSidebar}
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

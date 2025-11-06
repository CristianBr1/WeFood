import { memo, useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaRegImage, FaAngleDown } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { FiUsers } from "react-icons/fi";
import { RiProductHuntLine, RiStackFill } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { Collapse } from "react-collapse";
import Button from "@mui/material/Button";
import logo from "../assets/logo.png";

const Sidebars = ({ isOpen, onForceOpen, onClose }) => {
  const [subMenuIndex, setSubMenuIndex] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubMenuClick = (index) => {
    if (!isOpen) onForceOpen();
    setSubMenuIndex(subMenuIndex === index ? null : index);
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
    if (!isOpen) onForceOpen();
  };

  const handleClick = () => {
    if (!isOpen) onForceOpen();
  };

  // 👉 Fecha sidebar ao clicar fora (somente em telas pequenas)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        window.innerWidth < 768 && // só aplica em telas pequenas
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose?.(); // chama a função pra fechar a sidebar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const menuItems = [
    { icon: <RxDashboard />, label: "Dashboard", path: "/dashboard" },
    {
      icon: <FaRegImage />,
      label: "Banners da Home",
      subItems: [
        { label: "Lista de Banners", path: "/banners" },
        { label: "Adicionar Banners", path: "/banners/add" },
      ],
    },
    {
      icon: <TbCategory />,
      label: "Categorias",
      subItems: [
        { label: "Lista de Categorias", path: "/categorias" },
        { label: "Adicionar Categorias", path: "/categorias/add" },
      ],
    },
    {
      icon: <RiProductHuntLine />,
      label: "Produtos",
      subItems: [
        { label: "Lista de Produtos", path: "/produtos" },
        { label: "Adicionar Produtos", path: "/produtos/add" },
      ],
    },
    { icon: <FiUsers />, label: "Usuários", path: "/usuarios" },
    { icon: <IoBagCheckOutline />, label: "Pedidos", path: "/pedidos" },
    { icon: <RiStackFill />, label: "Logo", path: "/logotipo" },
    { icon: <IoMdLogOut />, label: "Sair", action: handleLogout },
  ];

  return (
    <aside
      ref={sidebarRef}
      className={`cursor-pointer fixed top-0 left-0 h-full bg-[#f1f1f1] border-r border-[rgba(0,0,0,0.1)] shadow-md 
        transition-all duration-300 z-40 flex flex-col items-start
        ${isOpen ? "w-[250px]" : "w-[70px]"}
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      onClick={handleClick}
    >
      {/* LOGO */}
      <div className="p-4 flex flex-col items-start gap-4 mt-[60px] w-full">
        <div
          className="w-full flex justify-around items-center mb-1 cursor-pointer"
          onClick={handleLogoClick}
        >
          <div
            className={`overflow-hidden rounded-full transition-all duration-300 ${
              isOpen ? "w-[120px] h-[120px]" : "w-[50px] h-[50px]"
            }`}
          >
            <img src={logo} alt="WeFood" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* MENU */}
        {menuItems.map((item, index) => (
          <div key={index} className="w-full">
            {item.subItems ? (
              <>
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  isOpen={isOpen}
                  extraIcon={
                    <FaAngleDown
                      className={`transition-transform duration-300 ${
                        subMenuIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  }
                  onClick={() => handleSubMenuClick(index)}
                />
                <Collapse isOpened={subMenuIndex === index && isOpen}>
                  <div className="w-full">
                    {item.subItems.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.path}
                        onClick={() => {
                          if (window.innerWidth < 768) onClose?.(); // fecha em telas pequenas
                        }}
                      >
                        <Button
                          className={`justify-start! text-[13px]! font-medium! w-full! pl-9! normal-case! ${
                            location.pathname === sub.path
                              ? "bg-blue-100! text-gray-900!"
                              : "text-[rgba(0,0,0,0.7)]! hover:bg-blue-100!"
                          }`}
                        >
                          <span className="block w-[5px] h-[5px] mr-2 rounded-full bg-[rgba(0,0,0,0.2)]"></span>
                          {sub.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </Collapse>
              </>
            ) : item.action ? (
              <div
                onClick={() => {
                  if (window.innerWidth < 768) onClose?.();
                  item.action();
                }}
              >
                <SidebarItem icon={item.icon} label={item.label} isOpen={isOpen} />
              </div>
            ) : (
              <Link
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) onClose?.();
                }}
              >
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  isOpen={isOpen}
                  active={location.pathname === item.path}
                />
              </Link>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, isOpen, extraIcon, onClick, active }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between gap-3 text-[15px] font-medium cursor-pointer 
      transition-all duration-200 w-full rounded-md p-2
      ${
        active
          ? "bg-blue-100 text-gray-600"
          : "text-gray-700 hover:bg-blue-100 hover:text-gray-950"
      }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-[18px]">{icon}</span>
      {isOpen && <span className="whitespace-nowrap">{label}</span>}
    </div>
    {isOpen && extraIcon && <span className="text-[14px]">{extraIcon}</span>}
  </div>
);

export default memo(Sidebars);

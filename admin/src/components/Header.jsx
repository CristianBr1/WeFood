import { memo, useState, useContext } from "react";
import Button from "@mui/material/Button";
import { RiMenu2Line } from "react-icons/ri";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { FaRegBell } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = ({ toggleSidebar }) => {
  const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorMyAcc);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const handleClickMyAcc = (event) => setAnchorMyAcc(event.currentTarget);
  const handleCloseMyAcc = () => setAnchorMyAcc(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="
        w-full 
        h-auto 
        py-2 
        pl-4 
        pr-7 
        shadow-md 
        flex 
        items-center 
        justify-between 
        bg-white
        border-b 
        border-[rgba(0,0,0,0.1)]
        z-50
      "
    >
      <Button
        onClick={toggleSidebar}
        className="w-10! h-10! rounded-full! min-w-10! text-[rgba(0,0,0,0.8)]!"
      >
        <RiMenu2Line className="text-[22px]" />
      </Button>

      <div className="flex items-center gap-5">
        <IconButton aria-label="notifications">
          <StyledBadge badgeContent={4} color="secondary">
            <FaRegBell />
          </StyledBadge>
        </IconButton>

        <div className="relative">
          <div
            className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer"
            onClick={handleClickMyAcc}
          >
            <img
              className="w-full h-full object-cover"
              src={
                user?.avatar ||
                "https://marketplace.canva.com/gJly0/MAGDkMgJly0/1/tl/canva-user-profile-icon-vector.-avatar-or-person-icon.-profile-picture%2C-portrait-symbol.-MAGDkMgJly0.png"
              }
              alt={user?.name || "Usuário"}
            />
          </div>

          <Menu
            anchorEl={anchorMyAcc}
            id="account-menu"
            open={openMyAcc}
            onClose={handleCloseMyAcc}
            onClick={handleCloseMyAcc}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem className="bg-white">
              <div className="flex items-center gap-3">
                <img
                  className="rounded-full w-[35px] h-[35px] object-cover"
                  src={
                    user?.avatar ||
                    "https://marketplace.canva.com/gJly0/MAGDkMgJly0/1/tl/canva-user-profile-icon-vector.-avatar-or-person-icon.-profile-picture%2C-portrait-symbol.-MAGDkMgJly0.png"
                  }
                  alt={user?.name || "Usuário"}
                />
                <div>
                  <h3 className="text-[15px] font-medium leading-5">
                    {user?.name || "Usuário"}
                  </h3>
                  <p className="text-[12px] font-normal opacity-70">
                    {user?.email || "-"}
                  </p>
                </div>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => navigate("/minha-conta")}
              className="flex items-center gap-3"
            >
              <FaRegUser className="text-[16px]" /> <span>Minha Conta</span>
            </MenuItem>
            <MenuItem className="flex items-center gap-3"></MenuItem>
            <MenuItem
              className="flex items-center gap-3 cursor-pointer"
              onClick={handleLogout}
            >
              <IoMdLogOut className="text-[18px]" /> <span>Sair</span>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);

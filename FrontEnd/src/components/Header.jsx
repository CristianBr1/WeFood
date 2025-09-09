import SearchItem from "./SearchItem";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { ShoppingCart, Heart } from "lucide-react";
import { Tooltip } from "@mui/material";
import Navbar from "./Navbar";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  return (
    <header>
      <Navbar />
      <div className="py-4 border-gray-200 border-b-[1px]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-1/4 max-md:hidden"></div>

          <div className="pr-5 pl-5 w-full md:w-1/2">
            <SearchItem />
          </div>

          <div className="pl-7 pr-4 w-full md:w-1/4 flex items-center justify-center gap-3">
            <Link
              to="/entrar"
              className="cosmic-button link transition text-sm md:text-base"
            >
              Entrar
            </Link>
            <Link
              to="/cadastrar"
              className="cosmic-button text-sm md:text-base"
            >
              Cadastrar
            </Link>

            <Tooltip title="Favoritos">
              <IconButton aria-label="favoritos" size="small">
                <StyledBadge badgeContent={4} color="secondary">
                  <Heart />
                </StyledBadge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Carrinho">
              <IconButton aria-label="carrinho" size="small">
                <StyledBadge badgeContent={4} color="secondary">
                  <ShoppingCart />
                </StyledBadge>
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

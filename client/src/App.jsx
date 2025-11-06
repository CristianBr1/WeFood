import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import CartProvider from "./context/CartProvider";
import ThemeProvider from "./context/ThemeProvider";
import SearchProvider from "./context/SearchProvider";
import AddressProvider from "./context/AddressProvider";
import Routes from "./routes/Routes";

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <SearchProvider>
            <AddressProvider>
              <Routes />
            </AddressProvider>
          </SearchProvider>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;

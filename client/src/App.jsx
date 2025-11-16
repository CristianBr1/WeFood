import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import CartProvider from "./context/CartProvider";
import ThemeProvider from "./context/ThemeProvider";
import SearchProvider from "./context/SearchProvider";
import AddressProvider from "./context/AddressProvider";
import Routes from "./routes/Routes";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
  </GoogleOAuthProvider>
);

export default App;

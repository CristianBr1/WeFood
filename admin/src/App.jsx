import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./context/AuthProvider";
import Routes from "./routes/Routes";
import ThemeProvider from "./context/ThemeProvider.jsx";
import { useEffect } from "react";
import { testConnection } from "./testConnection";

const App = () => {
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <Routes />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;

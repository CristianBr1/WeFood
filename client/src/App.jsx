import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./context/AuthProvider";
import Routes from "./routes/Routes";
import ThemeProvider from "./context/ThemeProvider.jsx";

const App = () => (
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

export default App;

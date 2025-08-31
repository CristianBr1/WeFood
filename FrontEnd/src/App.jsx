import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./context/AuthProvider";
import Routes from "./routes/Routes";

const App = () => (
  <div>
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  </div>
);

export default App;

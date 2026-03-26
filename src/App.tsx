/**
 * App root.
 *
 * Provider order (outer → inner):
 *  BrowserRouter  — must wrap AuthProvider because AuthProvider uses useNavigate
 *  AuthProvider   — provides auth state + actions to the whole tree
 *  AppRoutes      — renders the actual route tree
 */

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoaderProvider } from "./context/LoaderContext";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LoaderProvider>
          <div className="min-h-screen bg-gray-100">
            <AppRoutes />
          </div>
        </LoaderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

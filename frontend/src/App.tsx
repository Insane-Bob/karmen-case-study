import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Dashboard from "./pages/Dashboard.tsx";
import DemandeDetail from "./pages/DemandeDetail";
import Demandes from "./pages/Demandes.tsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/demandes" element={<Demandes />} />
        <Route path="/demandes/:id" element={<DemandeDetail />} />
      </Route>
    </Routes>
  );
}

export default App;

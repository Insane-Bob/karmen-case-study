import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Dashboard from "./pages/Dashboard.tsx";
import FinancingApplications from "./pages/FinancingApplications.tsx";
import FinancingApplicationsDetails from "./pages/FinancingApplicationsDetails";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/financing-applications"
          element={<FinancingApplications />}
        />
        <Route
          path="/financing-applications/:id"
          element={<FinancingApplicationsDetails />}
        />
      </Route>
    </Routes>
  );
}

export default App;

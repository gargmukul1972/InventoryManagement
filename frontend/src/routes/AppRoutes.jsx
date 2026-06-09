import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </MainLayout>
  );
}

export default AppRoutes;
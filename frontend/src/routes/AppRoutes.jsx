import {
  BrowserRouter,
  Routes,
  Route
}
from "react-router-dom";

import Dashboard from
"../pages/Dashboard";

import Products from
"../pages/Products";

import MainLayout from
"../layouts/MainLayout";

function AppRoutes() {

  return (
    <BrowserRouter>

      <MainLayout>

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

        </Routes>

      </MainLayout>

    </BrowserRouter>
  );
}

export default AppRoutes;
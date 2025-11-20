import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PurchaseOrdersPage from './pages/purchase-orders';
import DealsManagement from './pages/deals-management';
import IntelligentMatching from './pages/intelligent-matching';
import SuppliersManagement from './pages/suppliers-management';
import GlobalSearch from './pages/global-search';
import ClientsManagement from './pages/clients-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<ClientsManagement />} />
        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
        <Route path="/deals-management" element={<DealsManagement />} />
        <Route path="/intelligent-matching" element={<IntelligentMatching />} />
        <Route path="/suppliers-management" element={<SuppliersManagement />} />
        <Route path="/global-search" element={<GlobalSearch />} />
        <Route path="/clients-management" element={<ClientsManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter> js
  );
};

export default Routes;

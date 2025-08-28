
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductCatalog from "./pages/ProductCatalog";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import Inventory from "./pages/Inventory";
import GRN from "./pages/GRN";
import Sales from "./pages/Sales";
import PriceList from "./pages/PriceList";
import Targets from "./pages/Targets";
import Discounts from "./pages/Discounts";
import WarrantyRegistration from "./pages/WarrantyRegistration";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import FetchData from "./fetchdata";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <FetchData />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="catalog" element={<ProductCatalog />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="grn" element={<GRN />} />
            <Route path="sales" element={<Sales />} />
            <Route path="price-list" element={<PriceList />} />
            <Route path="targets" element={<Targets />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="warranty" element={<WarrantyRegistration />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

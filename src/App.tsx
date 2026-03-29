import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PageLayout } from "./components/layout/PageLayout";
import { HomePage } from "./pages/HomePage";
import { NotFound } from "./pages/NotFound";
import { CartDrawer } from "./components/cart/CartDrawer";
import { BookingModal } from "./components/supper-club/BookingModal";
import { HireModal } from "./components/hire/HireModal";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminGuard } from "./components/admin/AdminGuard";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminEvents } from "./pages/admin/AdminEvents";
import { AdminBookings } from "./pages/admin/AdminBookings";
import { AdminCatering } from "./pages/admin/AdminCatering";
import { AdminHire } from "./pages/admin/AdminHire";
import { AdminHampers } from "./pages/admin/AdminHampers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route element={<PageLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="catering" element={<AdminCatering />} />
            <Route path="hire" element={<AdminHire />} />
            <Route path="hampers" element={<AdminHampers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <CartDrawer />
        <BookingModal />
        <HireModal />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

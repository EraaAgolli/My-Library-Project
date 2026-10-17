import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar          from "./pages/Navbar";
import Footer          from "./pages/Footer";
import Home        from "./pages/Home";
import BookDetailsPage from "./pages/BookDetailsPage";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import ProtectedRoute  from "./api/ProtectedRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import AdminDashboard  from "./pages/AdminDashboard";
import UserDashboard   from "./pages/UserDashboard";
import LibraryServices from "./pages/LibraryService";
import AboutUs         from "./pages/AboutUsPage";
import { WishlistProvider } from "./context/WishlistContext";
import WishlistPage    from "./pages/WishlistPage";
import { CartProvider } from "./context/CartContext";
import CartPage        from "./pages/Cart";
import BookShop        from "./pages/BookShop";
import ContactPage     from "./pages/ContactPage";
import CheckoutPage from "./pages/CheckoutPage";

function AppRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/"               element={<Home />} />
      <Route path="/book-shop"      element={<BookShop />} />
      <Route path="/books/:id"      element={<BookDetailsPage />} />
      <Route path="/about"          element={<AboutUs />} />
      <Route path="/libraryservice" element={<LibraryServices />} />
      <Route path="/contact"        element={<ContactPage />} />
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />
      <Route path="/wishlist"       element={<WishlistPage />} />
      <Route path="/cart"           element={<CartPage />} />
      <Route path="/checkout"       element={<CheckoutPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role === "ADMIN" ? <AdminDashboard /> : <UserDashboard />}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
            <main>
              <AppRoutes />
            </main>
            <Footer />
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import HomePage from './pages/Home/Page'
import CategoriesPage from './pages/Categories/Page'
import ProductDetailPage from './pages/Product/Page'
import FlashSalePage from './pages/FlashSale/Page'
import CartPage from './pages/Cart/Page'
import CheckoutPage from './pages/Checkout/Page'
import WalletPage from './pages/Account/Wallet'
import OrdersPage from './pages/Account/Orders'
import SellerPage from './pages/Seller/Page'
import HelpPage from './pages/Help/Page'
import NotFoundPage from './pages/NotFound/Page'
import SignUpPage from './pages/SignUp/Page'
import LoginPage from './pages/Login/Page'
import LogoutPage from './pages/Logout/Page'
import Test from './test/Page'
import AddProductForm from './pages/Seller/AddProduct'
import ProductEdit from './pages/Seller/ProductEdit'
import SearchPage from './pages/Search/Page';

import { ImageKitProvider } from '@imagekit/react'


// simple token check
const isAuthenticated = () => Boolean(localStorage.getItem('token'))

function PublicOnlyRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/" replace /> : children
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export default function App() {
  console.log('🔥 App render')

  return (
    <BrowserRouter>
      <Navbar />
      <ImageKitProvider urlEndpoint="https://ik.imagekit.io/wc6bpahhv">
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/flash-sale" element={<FlashSalePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/add-product" element={<AddProductForm />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/search" element={<SearchPage />} /> {/* <--- ADD THIS ROUTE */}
        <Route path="/test" element={<Test />} />
        <Route path="/edit-product/:productId" element={<ProductEdit />} />


        {/* Guest‐only */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignUpPage />
            </PublicOnlyRoute>
          }
        />

        {/* Authenticated‐only */}
        <Route
          path="/account/wallet"
          element={
            <PrivateRoute>
              <WalletPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/account/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/logout"
          element={
              <LogoutPage />
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </ImageKitProvider>
      <Footer />
    </BrowserRouter>
  )
}





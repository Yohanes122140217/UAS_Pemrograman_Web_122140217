import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/Home/Page';
import CategoriesPage from './pages/Categories/Page';
import ProductPage from './pages/Product/Page';
import FlashSalePage from './pages/FlashSale/Page';
import CartPage from './pages/Cart/Page';
import CheckoutPage from './pages/Checkout/Page';
import WalletPage from './pages/Account/Wallet';
import OrdersPage from './pages/Account/Orders';
import SellerPage from './pages/Seller/Page';
import HelpPage from './pages/Help/Page';
import NotFoundPage from './pages/NotFound/Page';
import Page from './test/Page';
import SignUpPage from './pages/SignUp/page';
import LoginPage from './pages/Login/Page';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />                   {/* Home */}  
        <Route path="/categories" element={<CategoriesPage />} />   {/* Categories */}  
        <Route path="/product/:id" element={<ProductPage />} />     {/* Dynamic product */}  
        <Route path="/flash-sale" element={<FlashSalePage />} />    {/* Flash Sale */} 
        <Route path="/cart" element={<CartPage />} />               {/* Cart */}
        <Route path="/checkout" element={<CheckoutPage />} />       {/* Checkout */}  
        <Route path="/account/wallet" element={<WalletPage />} />   {/* Wallet */}  
        <Route path="/account/orders" element={<OrdersPage />} />   {/* Orders */}  
        <Route path="/seller" element={<SellerPage />} />           {/* Seller Dashboard */}  
        <Route path="/help" element={<HelpPage />} />               {/* Help Center */}
        <Route path="/signup" element={<SignUpPage />} />           {/* Sign Up */} 
        <Route path="/login" element={<LoginPage />} />           {/* Login */} 
        <Route path="*" element={<NotFoundPage />} />               {/* 404 */}  
        <Route path="/test" element={<Page />} />                  {/* Test Page */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;








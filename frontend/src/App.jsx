import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import PricingPage from './pages/PricingPage';
import InsightPage from './pages/InsightPage';
import InsightDetailPage from './pages/InsightDetailPage';
import BoardPage from './pages/BoardPage';
import BoardDetailPage from './pages/BoardDetailPage';
import PostWritePage from './pages/PostWritePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';
import './App.css';

// Layout component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminPage && <Navbar />}
      <main className={isAdminPage ? 'admin-main-content' : 'main-content'}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/pricing" element={<PricingPage />} />
            <Route path="/insights" element={<InsightPage />} />
            <Route path="/insights/:slug" element={<InsightDetailPage />} />
              <Route path="/community" element={<BoardPage />} />
              <Route path="/community/:id" element={<BoardDetailPage />} />
              <Route path="/community/write" element={<PostWritePage />} />
              <Route path="/community/edit/:id" element={<PostWritePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/fail" element={<PaymentFailPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
            </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

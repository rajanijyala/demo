import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen text-slate-100">
          <Navbar />
          <AppRoutes />
          <Footer />
        </div>
        <Toaster position="top-right" toastOptions={{ className: 'bg-slate-900 text-white border border-slate-800' }} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

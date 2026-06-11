import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateInterview from './pages/CreateInterview';
import Interview from './pages/Interview';
import VoiceInterview from './pages/VoiceInterview';
import Interviews from './pages/Interviews';
import Resume from './pages/Resume';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import useAuthStore from './stores/authStore';

function App() {
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) fetchProfile();
    else useAuthStore.setState({ loading: false });
  }, [fetchProfile]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-interview" element={<CreateInterview />} />
            <Route path="/interview/:id" element={<Interview />} />
            <Route path="/voice-interview/:id" element={<VoiceInterview />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
      <Toaster position="top-right" toastOptions={{ className: '!bg-slate-900 !text-white !border !border-slate-800' }} />
    </BrowserRouter>
  );
}

export default App;

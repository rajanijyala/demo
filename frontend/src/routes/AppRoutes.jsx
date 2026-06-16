import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyRegisterOtp from '../pages/VerifyRegisterOtp';
import VerifyLoginOtp from '../pages/VerifyLoginOtp';
import Dashboard from '../pages/Dashboard';
import InterviewConfig from '../pages/InterviewConfig';
import ResumeInterview from '../pages/ResumeInterview';
import InterviewSession from '../pages/InterviewSession';
import Results from '../pages/Results';
import FeedbackReport from '../pages/FeedbackReport';
import PracticePlan from '../pages/PracticePlan';
import AnalyticsDashboard from '../pages/AnalyticsDashboard';
import QuestionBank from '../pages/QuestionBank';
import Notifications from '../pages/Notifications';
import AdminConsole from '../pages/AdminConsole';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/home" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/verify-register-otp" element={<VerifyRegisterOtp />} />
    <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/interview/configure" element={<InterviewConfig />} />
      <Route path="/interview/resume" element={<ResumeInterview />} />
      <Route path="/interview/session/:id" element={<InterviewSession />} />
      <Route path="/results/:id" element={<Results />} />
      <Route path="/feedback/:id" element={<FeedbackReport />} />
      <Route path="/practice-plan/:id" element={<PracticePlan />} />
      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route path="/questions" element={<QuestionBank />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/admin" element={<AdminConsole />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;

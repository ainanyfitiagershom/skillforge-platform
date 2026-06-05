import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NewTestPage } from '@/pages/NewTestPage';
import { ReviewQuestionsPage } from '@/pages/ReviewQuestionsPage';
import { CandidateWelcomePage } from '@/pages/CandidateWelcomePage';
import { CandidatePassationPage } from '@/pages/CandidatePassationPage';
import { CandidateDonePage } from '@/pages/CandidateDonePage';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Routes publiques recruteur */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes publiques candidat (lien unique) */}
      <Route path="/candidate/passation/:token" element={<CandidateWelcomePage />} />
      <Route path="/candidate/passation/:token/run" element={<CandidatePassationPage />} />
      <Route path="/candidate/passation/:token/done" element={<CandidateDonePage />} />

      {/* Espace recruteur protégé */}
      <Route
        element={
          <ProtectedRoute roles={['RECRUTEUR', 'ADMIN']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/new-test" element={<NewTestPage />} />
        <Route path="/review" element={<ReviewQuestionsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

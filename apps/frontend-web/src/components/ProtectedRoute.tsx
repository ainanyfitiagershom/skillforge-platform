import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleFromAccessToken, loadTokens } from '@/lib/api';

type Props = {
  children: ReactNode;
  roles?: string[];
};

export function ProtectedRoute({ children, roles }: Props) {
  const tokens = loadTokens();
  if (!tokens) return <Navigate to="/login" replace />;

  const role = getRoleFromAccessToken(tokens.accessToken);
  if (roles && (!role || !roles.includes(role))) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
